"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { FormError } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { authClient } from "@/lib/auth-client";

/**
 * Google sign-in. OAuth is a browser redirect, so this is the one part of the
 * dashboard's auth that cannot be a server action.
 *
 * Google only proves who the visitor is. The ADMIN_EMAILS allowlist still
 * decides what they may open, so a stranger who signs in with Google lands on
 * /admin/no-access exactly like a stranger who signs up with a password.
 */
const GOOGLE_ERROR = "ההתחברות עם Google נכשלה. נסו שוב.";

export function GoogleButton() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function signInWithGoogle() {
    setError(null);
    setPending(true);
    try {
      const { error: authError } = await authClient.signIn.social({
        provider: "google",
        /**
         * Absolute, not "/admin". The server that resolves this string is Neon
         * Auth's, on a different origin — a relative path there is ambiguous at
         * best and resolves against their host at worst. An absolute URL on our
         * origin is the only unambiguous instruction.
         *
         * Neon must also trust this origin for the redirect to be honoured, so
         * the deployment URL belongs in the project's allowed callback URLs.
         */
        callbackURL: `${window.location.origin}/admin`,
      });
      // On success the SDK navigates away, so reaching here means it did not.
      if (authError) {
        setError(GOOGLE_ERROR);
        setPending(false);
      }
    } catch {
      setError(GOOGLE_ERROR);
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? <FormError>{error}</FormError> : null}
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={pending}
        className={buttonClass({ variant: "outline", size: "lg", block: true })}
      >
        <Icon name="google" size={18} />
        <span>
          {pending ? "מעביר ל־" : "התחברות עם "}
          <bdi>Google</bdi>
          {pending ? "…" : ""}
        </span>
      </button>
    </div>
  );
}
