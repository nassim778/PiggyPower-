"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  AuthDivider,
  formatAuthError,
  GoogleSignInButton,
} from "@/components/auth/GoogleSignInButton";

export default function RegisterPage() {
  const { register, loginWithGoogle, configured, loading: authLoading, user } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/account");
  }, [authLoading, user, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await register({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      router.push("/account");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      if (msg.includes("auth/email-already-in-use")) {
        setError("An account with this email already exists.");
      } else if (msg.includes("auth/weak-password")) {
        setError("Password should be at least 6 characters.");
      } else {
        setError(formatAuthError(err, "Could not create account."));
      }
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setBusy(true);
    try {
      const role = await loginWithGoogle();
      router.push(role === "admin" ? "/admin" : "/account");
      router.refresh();
    } catch (err) {
      setError(formatAuthError(err, "Google sign-in failed."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Create account</h1>
        <p className="mt-2 text-ash">Save your details for faster checkout</p>
      </div>

      {!configured ? (
        <p className="mx-auto max-w-md text-center text-sm text-ash">
          Sign-up is not configured yet. Add Firebase web keys to the environment.
        </p>
      ) : (
        <div className="mx-auto w-full max-w-md">
          <GoogleSignInButton onClick={() => void onGoogle()} disabled={busy} />
          <AuthDivider />
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-ink">
                  First name
                </label>
                <input
                  id="firstName"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-rule bg-bloom px-3 py-2.5 text-ink outline-none focus:border-blue"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-ink">
                  Last name
                </label>
                <input
                  id="lastName"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-rule bg-bloom px-3 py-2.5 text-ink outline-none focus:border-blue"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-rule bg-bloom px-3 py-2.5 text-ink outline-none focus:border-blue"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-rule bg-bloom px-3 py-2.5 text-ink outline-none focus:border-blue"
              />
              <p className="mt-1 text-xs text-ash">At least 6 characters</p>
            </div>
            {error && (
              <p className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? "Creating account…" : "Create account"}
            </button>
            <p className="text-center text-sm text-ash">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
