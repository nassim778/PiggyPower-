"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type Tab = "overview" | "orders" | "messages";

interface Stats {
  ordersTotal: number;
  ordersPaid: number;
  ordersPending: number;
  revenueCents: number;
  messages: number;
  users: number;
}

interface OrderRow {
  id: string;
  status: string;
  provider: string | null;
  customerEmail: string | null;
  totalCents: number;
  items: { name: string; quantity: number }[];
  createdAt: string | null;
}

interface MessageRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string | null;
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminPage() {
  const { user, role, loading, getIdToken, logout, configured } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!configured || !user) {
      router.replace("/login?next=/admin");
      return;
    }
    if (role && role !== "admin") {
      router.replace("/account");
    }
  }, [loading, user, role, configured, router]);

  const authedFetch = useCallback(
    async (url: string) => {
      const token = await getIdToken();
      if (!token) throw new Error("Not signed in");
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    },
    [getIdToken],
  );

  const load = useCallback(async () => {
    if (role !== "admin") return;
    setBusy(true);
    setError(null);
    try {
      if (tab === "overview") {
        const data = await authedFetch("/api/admin/stats");
        setStats(data.stats);
      } else if (tab === "orders") {
        const data = await authedFetch("/api/admin/orders");
        setOrders(data.orders);
      } else {
        const data = await authedFetch("/api/admin/messages");
        setMessages(data.messages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setBusy(false);
    }
  }, [tab, role, authedFetch]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || !user || role !== "admin") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-ash sm:px-6">
        Checking admin access…
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Orders" },
    { id: "messages", label: "Messages" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue">Admin</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-ash">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/shop" className="rounded-lg border border-rule px-4 py-2 text-sm text-ink hover:border-blue hover:text-blue">
            View shop
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="rounded-lg border border-rule px-4 py-2 text-sm text-ink hover:border-blue hover:text-blue"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-rule pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white"
                : "rounded-lg px-4 py-2 text-sm text-ash hover:bg-mist hover:text-ink"
            }
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void load()}
          className="ml-auto rounded-lg px-3 py-2 text-sm text-ash hover:text-blue"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
          {error}
        </p>
      )}

      {busy && !error && (
        <p className="mt-6 text-sm text-ash">Loading…</p>
      )}

      {tab === "overview" && stats && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Paid orders", value: String(stats.ordersPaid) },
            { label: "Pending orders", value: String(stats.ordersPending) },
            { label: "Revenue (paid)", value: formatMoney(stats.revenueCents) },
            { label: "Total orders", value: String(stats.ordersTotal) },
            { label: "Contact messages", value: String(stats.messages) },
            { label: "Registered users", value: String(stats.users) },
          ].map((card) => (
            <div key={card.label} className="border border-rule bg-bloom p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ash">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-ink">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-xs uppercase tracking-wide text-ash">
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">Customer</th>
                <th className="py-3 pr-4 font-semibold">Total</th>
                <th className="py-3 pr-4 font-semibold">Items</th>
                <th className="py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && !busy ? (
                <tr>
                  <td colSpan={5} className="py-8 text-ash">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-b border-rule/70 align-top">
                    <td className="py-3 pr-4">
                      <span
                        className={
                          o.status === "paid"
                            ? "font-semibold text-success-text"
                            : "text-warn-text"
                        }
                      >
                        {o.status}
                      </span>
                      {o.provider && (
                        <p className="mt-0.5 text-xs capitalize text-ash">{o.provider}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-ink">{o.customerEmail || "—"}</td>
                    <td className="py-3 pr-4 font-medium text-ink">
                      {formatMoney(o.totalCents)}
                    </td>
                    <td className="py-3 pr-4 text-ash">
                      {(o.items || [])
                        .map((i) => `${i.name} ×${i.quantity}`)
                        .join(", ") || "—"}
                    </td>
                    <td className="py-3 text-ash">{formatDate(o.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "messages" && (
        <div className="mt-6 space-y-4">
          {messages.length === 0 && !busy ? (
            <p className="text-ash">No contact messages yet.</p>
          ) : (
            messages.map((m) => (
              <article key={m.id} className="border border-rule bg-bloom p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-semibold text-ink">
                    {m.firstName} {m.lastName}
                  </h2>
                  <time className="text-xs text-ash">{formatDate(m.createdAt)}</time>
                </div>
                <p className="mt-1 text-sm text-blue">{m.email}</p>
                {m.phone && <p className="text-sm text-ash">{m.phone}</p>}
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {m.message}
                </p>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
