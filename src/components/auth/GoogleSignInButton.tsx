"use client";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export function GoogleSignInButton({
  onClick,
  disabled,
  label = "Continue with Google",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-rule bg-bloom px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-blue hover:bg-mist disabled:opacity-60"
    >
      <svg aria-hidden className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {label}
    </button>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-rule" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wide">
        <span className="bg-paper px-3 text-ash">or</span>
      </div>
    </div>
  );
}

export function formatAuthError(err: unknown, fallback = "Something went wrong."): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("auth/popup-closed-by-user") || msg.includes("auth/cancelled-popup-request")) {
    return "Google sign-in was cancelled.";
  }
  if (msg.includes("auth/popup-blocked")) {
    return "Popup was blocked. Allow popups for this site and try again.";
  }
  if (msg.includes("auth/unauthorized-domain")) {
    return "This domain is not authorized in Firebase. Add it under Authentication → Settings → Authorized domains.";
  }
  if (msg.includes("auth/operation-not-allowed")) {
    return "Google sign-in is not enabled yet in Firebase Authentication.";
  }
  if (msg.includes("auth/account-exists-with-different-credential")) {
    return "An account already exists with this email using a different sign-in method.";
  }
  return (
    msg.replace("Firebase: ", "").replace(/\(auth\/[^)]+\)\.?/g, "").trim() || fallback
  );
}
