import { NextResponse } from "next/server";
import { saveContactMessage } from "@/lib/orders";
import { isFirebaseConfigured } from "@/lib/firebase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Contact storage is not configured yet (Firebase)." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const message = body.message?.trim() ?? "";
    const phone = body.phone?.trim();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: "Message too long." }, { status: 400 });
    }

    await saveContactMessage({ firstName, lastName, email, phone, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
