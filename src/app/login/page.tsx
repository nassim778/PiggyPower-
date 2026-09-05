"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  AuthDivider,
  formatAuthError,
  GoogleSignInButton,
} from "@/components/auth/GoogleSignInButton";

function LoginForm() {
  const { login, loginWithGoogle, configured, loading: authLoading, user, role } =
    useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    const dest = next || (role === "admin" ? "/admin" : "/account");
    router.replace(dest);
  }, [authLoading, user, role, next, router]);

  function goAfterAuth(loggedInRole: "customer" | "admin") {
    const dest = next || (loggedInRole === "admin" ? "/admin" : "/account");
    router.push(dest);
    router.refresh();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const loggedInRole = await login(email.trim(), password);
      goAfterAuth(loggedInRole);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
        setError("Invalid email or password.");
      } else if (msg.includes("auth/user-not-found")) {
        setError("No account found with that email.");
      } else if (msg.includes("auth/too-many-requests")) {
        setError("Too many attempts. Try again later.");
      } else {
        setError(formatAuthError(err, "Login failed."));
      }
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setBusy(true);
    try {
      const loggedInRole = await loginWithGoogle();
      goAfterAuth(loggedInRole);
    } catch (err) {
      setError(formatAuthError(err, "Google sign-in failed."));
    } finally {
      setBusy(false);
    }
  }

  if (!configured) {
    return (
      <p className="text-sm text-ash">
        Sign-in is not configured yet. Add Firebase web keys to the environment.
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <GoogleSignInButton onClick={() => void onGoogle()} disabled={busy} />
      <AuthDivider />
      <form onSubmit={onSubmit} className="space-y-4">
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
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-rule bg-bloom px-3 py-2.5 text-ink outline-none focus:border-blue"
          />
        </div>
        {error && (
          <p className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-sm text-ash">
          New here?{" "}
          <Link href="/register" className="font-semibold text-blue hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Sign in</h1>
        <p className="mt-2 text-ash">Access your PiggyPower account</p>
      </div>
      <Suspense fallback={<p className="text-center text-sm text-ash">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
