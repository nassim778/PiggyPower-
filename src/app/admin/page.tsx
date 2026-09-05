"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  DollarSign,
  MessageSquare,
  Package,
  RefreshCw,
  ShoppingCart,
  Users,
  TrendingUp,
  Percent,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  ProviderBars,
  RevenueAreaChart,
  StatusDonut,
  TopProductsBars,
} from "@/components/admin/AdminCharts";
import clsx from "clsx";

type Tab = "overview" | "orders" | "messages";

interface Stats {
  ordersTotal: number;
  ordersPaid: number;
  ordersPending: number;
  ordersOther?: number;
  revenueCents: number;
  avgOrderCents?: number;
  conversionRate?: number;
  messages: number;
  users: number;
  stripePaid?: number;
  paypalPaid?: number;
}

interface Charts {
  revenueByDay: { label: string; revenueCents: number; orders: number; date: string }[];
  ordersByStatus: { name: string; value: number; key: string }[];
  paymentsByProvider: { name: string; value: number; key: string }[];
  topProducts: { name: string; qty: number; revenueCents: number }[];
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

interface RecentOrder {
  id: string;
  status: string;
  provider: string | null;
  customerEmail: string | null;
  totalCents: number;
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

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof DollarSign;
}) {
  return (
    <div className="border border-rule bg-bloom p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ash">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{value}</p>
          {hint && <p className="mt-1 text-xs text-ash">{hint}</p>}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-mist text-blue">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("border border-rule bg-bloom p-5", className)}>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-ash">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export default function AdminPage() {
  const { user, role, loading, getIdToken, logout, configured } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [charts, setCharts] = useState<Charts | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
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
        setCharts(data.charts);
        setRecentOrders(data.recentOrders || []);
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
    <div className="min-h-full bg-mist/40">
      <div className="border-b border-rule bg-bloom">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-8 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue">
              Operations
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
              Admin dashboard
            </h1>
            <p className="mt-1 text-sm text-ash">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void load()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg border border-rule px-4 py-2 text-sm text-ink hover:border-blue hover:text-blue disabled:opacity-50"
            >
              <RefreshCw className={clsx("h-4 w-4", busy && "animate-spin")} />
              Refresh
            </button>
            <Link
              href="/shop"
              className="rounded-lg border border-rule px-4 py-2 text-sm text-ink hover:border-blue hover:text-blue"
            >
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
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap gap-2 border-b border-rule pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-lg px-4 py-2 text-sm text-ash hover:bg-bloom hover:text-ink"
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
            {error}
          </p>
        )}

        {busy && !stats && tab === "overview" && !error && (
          <p className="mt-8 text-sm text-ash">Loading dashboard…</p>
        )}

        {tab === "overview" && stats && charts && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Revenue"
                value={formatMoney(stats.revenueCents)}
                hint="Paid orders only"
                icon={DollarSign}
              />
              <StatCard
                label="Paid orders"
                value={String(stats.ordersPaid)}
                hint={`${stats.ordersPending} pending`}
                icon={ShoppingCart}
              />
              <StatCard
                label="Avg. order"
                value={formatMoney(stats.avgOrderCents || 0)}
                hint={`${stats.conversionRate ?? 0}% paid rate`}
                icon={TrendingUp}
              />
              <StatCard
                label="Customers"
                value={String(stats.users)}
                hint={`${stats.messages} messages`}
                icon={Users}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Panel
                title="Revenue (14 days)"
                subtitle="Paid order totals by day"
                className="lg:col-span-2"
              >
                <RevenueAreaChart data={charts.revenueByDay} />
              </Panel>
              <Panel title="Order status" subtitle="All-time mix">
                <StatusDonut data={charts.ordersByStatus} />
              </Panel>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Payment providers" subtitle="Paid checkouts">
                <ProviderBars data={charts.paymentsByProvider} />
              </Panel>
              <Panel title="Top products" subtitle="By paid revenue">
                <TopProductsBars data={charts.topProducts} />
              </Panel>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Total orders"
                value={String(stats.ordersTotal)}
                icon={Package}
              />
              <StatCard
                label="Messages"
                value={String(stats.messages)}
                icon={MessageSquare}
              />
              <StatCard
                label="Paid rate"
                value={`${stats.conversionRate ?? 0}%`}
                icon={Percent}
              />
            </div>

            <Panel title="Recent orders" subtitle="Latest activity">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-rule text-xs uppercase tracking-wide text-ash">
                      <th className="pb-3 pr-4 font-semibold">Status</th>
                      <th className="pb-3 pr-4 font-semibold">Customer</th>
                      <th className="pb-3 pr-4 font-semibold">Total</th>
                      <th className="pb-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-ash">
                          No orders yet.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((o) => (
                        <tr key={o.id} className="border-b border-rule/70">
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
                              <p className="mt-0.5 text-xs capitalize text-ash">
                                {o.provider}
                              </p>
                            )}
                          </td>
                          <td className="py-3 pr-4 text-ink">
                            {o.customerEmail || "—"}
                          </td>
                          <td className="py-3 pr-4 font-medium text-ink">
                            {formatMoney(o.totalCents)}
                          </td>
                          <td className="py-3 text-ash">{formatDate(o.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {tab === "orders" && (
          <div className="mt-6 overflow-x-auto border border-rule bg-bloom p-4 sm:p-5">
            {busy && <p className="mb-4 text-sm text-ash">Loading…</p>}
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
                          <p className="mt-0.5 text-xs capitalize text-ash">
                            {o.provider}
                          </p>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-ink">
                        {o.customerEmail || "—"}
                      </td>
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
            {busy && <p className="text-sm text-ash">Loading…</p>}
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
    </div>
  );
}
