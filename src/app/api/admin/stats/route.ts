import { NextResponse } from "next/server";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { requireAdmin } from "@/lib/auth-server";

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
    let revenueCents = 0;

    for (const doc of ordersSnap.docs) {
      const d = doc.data();
      if (d.status === "paid") {
        paid += 1;
        revenueCents += Number(d.totalCents) || 0;
      } else if (d.status === "pending") {
        pending += 1;
      }
    }

    return NextResponse.json({
      stats: {
        ordersTotal: ordersSnap.size,
        ordersPaid: paid,
        ordersPending: pending,
        revenueCents,
        messages: messagesSnap.size,
        users: usersSnap.size,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message.includes("Admin") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
