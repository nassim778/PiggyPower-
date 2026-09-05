import { NextResponse } from "next/server";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { requireAdmin } from "@/lib/auth-server";

function toIso(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

function dayKey(iso: string | null, fallback = "unknown"): string {
  if (!iso) return fallback;
  return iso.slice(0, 10);
}

export async function GET(req: Request) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Firebase is not configured." },
        { status: 503 },
      );
    }

    await requireAdmin(req.headers.get("authorization"));
    const db = getDb();

    const [ordersSnap, messagesSnap, usersSnap] = await Promise.all([
      db.collection("orders").get(),
      db.collection("contact_messages").get(),
      db.collection("users").get(),
    ]);

    let paid = 0;
    let pending = 0;
    let other = 0;
    let revenueCents = 0;
    let stripePaid = 0;
    let paypalPaid = 0;

    const revenueByDayMap = new Map<string, number>();
    const ordersByDayMap = new Map<string, number>();
    const productMap = new Map<string, { name: string; qty: number; revenueCents: number }>();

    const now = new Date();
    const days: string[] = [];
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    for (const d of days) {
      revenueByDayMap.set(d, 0);
      ordersByDayMap.set(d, 0);
    }

    type RecentOrder = {
      id: string;
      status: string;
      provider: string | null;
      customerEmail: string | null;
      totalCents: number;
      createdAt: string | null;
    };
    const recentOrders: RecentOrder[] = [];

    for (const doc of ordersSnap.docs) {
      const d = doc.data();
      const status = String(d.status || "unknown");
      const total = Number(d.totalCents) || 0;
      const createdAt = toIso(d.createdAt) || toIso(d.paidAt);
      const provider = d.provider ? String(d.provider) : null;

      recentOrders.push({
        id: doc.id,
        status,
        provider,
        customerEmail: d.customerEmail ? String(d.customerEmail) : null,
        totalCents: total,
        createdAt,
      });

      if (status === "paid") {
        paid += 1;
        revenueCents += total;
        if (provider === "stripe") stripePaid += 1;
        else if (provider === "paypal") paypalPaid += 1;

        const key = dayKey(createdAt);
        if (revenueByDayMap.has(key)) {
          revenueByDayMap.set(key, (revenueByDayMap.get(key) || 0) + total);
          ordersByDayMap.set(key, (ordersByDayMap.get(key) || 0) + 1);
        }

        const items = Array.isArray(d.items) ? d.items : [];
        for (const item of items) {
          const name = String(item?.name || item?.productId || "Item");
          const qty = Number(item?.quantity) || 0;
          const line = Number(item?.lineTotalCents) || 0;
          const prev = productMap.get(name) || { name, qty: 0, revenueCents: 0 };
          prev.qty += qty;
          prev.revenueCents += line;
          productMap.set(name, prev);
        }
      } else if (status === "pending") {
        pending += 1;
      } else {
        other += 1;
      }
    }

    recentOrders.sort((a, b) => {
      const ta = a.createdAt ? Date.parse(a.createdAt) : 0;
      const tb = b.createdAt ? Date.parse(b.createdAt) : 0;
      return tb - ta;
    });

    const topProducts = [...productMap.values()]
      .sort((a, b) => b.revenueCents - a.revenueCents)
      .slice(0, 6);

    const revenueByDay = days.map((date) => ({
      date,
      label: new Date(date + "T12:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenueCents: revenueByDayMap.get(date) || 0,
      orders: ordersByDayMap.get(date) || 0,
    }));

    const avgOrderCents = paid > 0 ? Math.round(revenueCents / paid) : 0;
    const conversionRate =
      ordersSnap.size > 0 ? Math.round((paid / ordersSnap.size) * 1000) / 10 : 0;

    return NextResponse.json({
      stats: {
        ordersTotal: ordersSnap.size,
        ordersPaid: paid,
        ordersPending: pending,
        ordersOther: other,
        revenueCents,
        avgOrderCents,
        conversionRate,
        messages: messagesSnap.size,
        users: usersSnap.size,
        stripePaid,
        paypalPaid,
      },
      charts: {
        revenueByDay,
        ordersByStatus: [
          { name: "Paid", value: paid, key: "paid" },
          { name: "Pending", value: pending, key: "pending" },
          { name: "Other", value: other, key: "other" },
        ].filter((s) => s.value > 0),
        paymentsByProvider: [
          { name: "Stripe", value: stripePaid, key: "stripe" },
          { name: "PayPal", value: paypalPaid, key: "paypal" },
        ].filter((s) => s.value > 0),
        topProducts,
      },
      recentOrders: recentOrders.slice(0, 8),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message.includes("Admin") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
