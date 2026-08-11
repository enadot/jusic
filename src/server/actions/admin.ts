"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { submissions, SUBMISSION_STATUSES } from "../db/schema";
import { getAuth, requireAdmin, SIGN_IN_PATH } from "../auth";

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

export async function signOut(): Promise<void> {
  try {
    await getAuth().signOut();
  } catch (error) {
    console.error("[signOut]", error);
  }
  redirect(SIGN_IN_PATH);
}
