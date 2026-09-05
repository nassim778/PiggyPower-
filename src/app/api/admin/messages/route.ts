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

    const snap = await getDb()
      .collection("contact_messages")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const messages = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        firstName: d.firstName ?? "",
        lastName: d.lastName ?? "",
        email: d.email ?? "",
        phone: d.phone ?? null,
        message: d.message ?? "",
        createdAt: d.createdAt?.toDate?.()?.toISOString?.() ?? d.createdAt ?? null,
      };
    });

    return NextResponse.json({ messages });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message.includes("Admin") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
