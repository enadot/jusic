"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { getDb } from "../db";
import { submissions, SUBMISSION_STATUSES } from "../db/schema";
import {
  adminEmails,
  getAuth,
  isAllowedAdmin,
  requireAdmin,
  RESET_PASSWORD_PATH,
  SIGN_IN_PATH,
} from "../auth";

function isStatus(value: unknown): value is (typeof SUBMISSION_STATUSES)[number] {
  return (
    typeof value === "string" &&
    (SUBMISSION_STATUSES as readonly string[]).includes(value)
  );
}

export async function setStatus(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = formData.get("status");
  if (!id || !isStatus(status)) return;

  await getDb()
    .update(submissions)
    .set({
      status,
      handledBy: admin.email,
      handledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(submissions.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
}

export async function saveNotes(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const notes = String(formData.get("adminNotes") ?? "").slice(0, 4000);

  await getDb()
    .update(submissions)
    .set({ adminNotes: notes || null, updatedAt: new Date() })
    .where(eq(submissions.id, id));

  revalidatePath(`/admin/submissions/${id}`);
}

export type SignInState = { error?: string };

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "נא למלא אימייל וסיסמה." };
  }

  try {
    const { error } = await getAuth().signIn.email({ email, password });
    if (error) {
      // Deliberately vague: never reveal whether the address exists.
      return { error: "האימייל או הסיסמה שגויים." };
    }
  } catch (caught) {
    console.error("[signIn]", caught);
    return { error: "ההתחברות נכשלה. נסו שוב." };
  }

  redirect("/admin");
}

export type SignUpState = {
  error?: string;
  /** Echoed back so a rejected form does not empty itself. Never the password. */
  values?: { name?: string; email?: string };
};

/**
 * Creates the account for a team member who is already on the allowlist.
 *
 * This exists because the Neon console cannot give a user a password — it
 * creates the user record without a credential account, so a user made there
 * has no way to sign in at all. Rather than depend on project email being
 * configured for a reset link, the person creates their own account here.
 *
 * The allowlist is checked *before* the account is created, so a stranger who
 * finds this page never gets a Neon Auth account at all. That is stricter than
 * /admin, where anyone may hold an account and is merely refused entry.
 */
export async function signUp(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  const values = { name, email };

  if (!name || !email) {
    return { error: "נא למלא שם וכתובת אימייל.", values };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `הסיסמה חייבת להכיל לפחות ${MIN_PASSWORD_LENGTH} תווים.`,
      values,
    };
  }
  if (password !== confirm) {
    return { error: "הסיסמאות אינן זהות.", values };
  }

  if (!isAllowedAdmin(email)) {
    // Same reply either way, but an empty allowlist is a misconfiguration
    // rather than a rejection, and whoever is setting this up needs to see it.
    if (adminEmails().length === 0) {
      console.error("[signUp] ADMIN_EMAILS is empty — nobody can register.");
    }
    return {
      error: "הכתובת הזו אינה מורשית לאזור הזה. פנו למנהל המערכת.",
      values,
    };
  }

  try {
    const { error } = await getAuth().signUp.email({ name, email, password });
    if (error) {
      console.error("[signUp]", error);
      return {
        error:
          "יצירת החשבון נכשלה. ייתכן שכבר קיים חשבון עם הכתובת הזו — נסו להתחבר או לאפס סיסמה.",
        values,
      };
    }
  } catch (caught) {
    console.error("[signUp]", caught);
    return { error: "יצירת החשבון נכשלה. נסו שוב.", values };
  }

  // Neon Auth signs the new account in, so this lands on the dashboard. If that
  // is ever turned off the redirect falls through to sign-in, where the
  // credentials just chosen work — never a dead end either way.
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  try {
    await getAuth().signOut();
  } catch (error) {
    console.error("[signOut]", error);
  }
  redirect(SIGN_IN_PATH);
}

/**
 * Absolute origin of the current request. The reset link Neon mails out has to
 * be absolute, and it has to point back at whichever host the admin actually
 * used — production, a Vercel preview or localhost — so this reads the request
 * rather than a build-time constant.
 */
async function requestOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (host) {
    const proto =
      headerList.get("x-forwarded-proto") ??
      (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://jusic.co";
}

export type ResetRequestState = { error?: string; sent?: boolean };

/**
 * Neon answers "Reset password isn't enabled" with a 400 when the project has
 * no sending address configured — the single most likely reason this fails, and
 * one no amount of retrying fixes. /admin is a staff tool, so it says which of
 * the two it is instead of hiding a configuration fault behind "try again".
 */
function resetErrorMessage(cause: unknown): string {
  const text =
    cause instanceof Error
      ? cause.message
      : typeof cause === "object" && cause !== null && "message" in cause
        ? String((cause as { message?: unknown }).message ?? "")
        : String(cause ?? "");

  if (/isn'?t enabled|not enabled/i.test(text)) {
    return "שליחת מיילים אינה מוגדרת בפרויקט ה־Neon, ולכן אי אפשר לשלוח קישור איפוס. אפשר ליצור חשבון עם סיסמה בעמוד יצירת החשבון, או להתחבר עם Google.";
  }
  return "שליחת הקישור נכשלה. נסו שוב.";
}

/**
 * Step one of "שכחתי סיסמה": ask Neon Auth to mail a reset link.
 *
 * The reply is deliberately identical whether or not the address has an
 * account — Neon Auth answers the same way for exactly that reason, and
 * surfacing anything sharper here would turn the form into an address oracle
 * for an internal tool.
 */
export async function requestPasswordReset(
  _prev: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "נא למלא כתובת אימייל." };

  try {
    const { error } = await getAuth().requestPasswordReset({
      email,
      redirectTo: `${await requestOrigin()}${RESET_PASSWORD_PATH}`,
    });
    if (error) {
      console.error("[requestPasswordReset]", error);
      return { error: resetErrorMessage(error) };
    }
  } catch (caught) {
    console.error("[requestPasswordReset]", caught);
    return { error: resetErrorMessage(caught) };
  }

  return { sent: true };
}

export type ResetState = { error?: string };

/**
 * Step two: the token from the emailed link plus the new password. The token
 * rides in a hidden field because the page it is rendered on received it as a
 * query parameter.
 */
export async function resetPassword(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { error: "הקישור אינו תקין. בקשו קישור חדש." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `הסיסמה חייבת להכיל לפחות ${MIN_PASSWORD_LENGTH} תווים.` };
  }
  if (password !== confirm) {
    return { error: "הסיסמאות אינן זהות." };
  }

  try {
    const { error } = await getAuth().resetPassword({
      newPassword: password,
      token,
    });
    if (error) {
      // Expired or already-used token is the common case here.
      return { error: "הקישור פג או כבר נוצל. בקשו קישור חדש." };
    }
  } catch (caught) {
    console.error("[resetPassword]", caught);
    return { error: "עדכון הסיסמה נכשל. נסו שוב." };
  }

  redirect(`${SIGN_IN_PATH}?reset=1`);
}
