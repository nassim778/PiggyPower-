import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase";
import { requireAdmin } from "@/lib/auth-server";
import { getDb } from "@/lib/firebase";

export async function GET(req: Request) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Firebase is not configured." },
        { status: 503 },
      );
    }

    await requireAdmin(req.headers.get("authorization"));

    const snap = await getDb()
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const orders = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        status: d.status ?? "unknown",
        provider: d.provider ?? null,
        providerRef: d.providerRef ?? null,
        customerEmail: d.customerEmail ?? null,
        totalCents: d.totalCents ?? 0,
        subtotalCents: d.subtotalCents ?? 0,
        shippingCents: d.shippingCents ?? 0,
        currency: d.currency ?? "usd",
        items: d.items ?? [],
        createdAt: d.createdAt?.toDate?.()?.toISOString?.() ?? d.createdAt ?? null,
        paidAt: d.paidAt?.toDate?.()?.toISOString?.() ?? d.paidAt ?? null,
      };
    });

    return NextResponse.json({ orders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message.includes("Admin") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
