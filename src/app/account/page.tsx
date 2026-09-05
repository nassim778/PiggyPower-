"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AccountPage() {
  const { user, role, loading, logout, configured, refreshRole } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !user && configured) {
      router.replace("/login?next=/account");
    }
  }, [loading, user, configured, router]);

  if (loading || (!user && configured)) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-ash sm:px-6">
        Loading account…
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-ash sm:px-6">
        Accounts are not configured yet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-ink">My account</h1>
      <p className="mt-2 text-ash">Signed in as {user?.email}</p>

      <div className="mt-8 space-y-4 border border-rule bg-bloom p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ash">Name</p>
          <p className="mt-1 text-ink">{user?.displayName || "—"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ash">Email</p>
          <p className="mt-1 text-ink">{user?.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ash">Role</p>
          <p className="mt-1 capitalize text-ink">{role || "customer"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ash">
            User ID (Firestore doc id)
          </p>
          <p className="mt-1 break-all font-mono text-xs text-ash">{user?.uid}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/shop" className="btn-primary">
          Continue shopping
        </Link>
        {role === "admin" && (
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-lg border border-blue px-5 py-2.5 text-sm font-semibold text-blue transition hover:bg-blue/5"
          >
            Admin dashboard
          </Link>
        )}
        <button
          type="button"
          disabled={refreshing}
          onClick={async () => {
            setRefreshing(true);
            try {
              await refreshRole();
            } finally {
              setRefreshing(false);
            }
          }}
          className="inline-flex items-center justify-center rounded-lg border border-rule px-5 py-2.5 text-sm font-medium text-ink transition hover:border-blue hover:text-blue disabled:opacity-60"
        >
          {refreshing ? "Refreshing…" : "Refresh role"}
        </button>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="inline-flex items-center justify-center rounded-lg border border-rule px-5 py-2.5 text-sm font-medium text-ink transition hover:border-blue hover:text-blue"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
