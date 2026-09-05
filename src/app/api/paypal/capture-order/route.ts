import { NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/orders";
import { paypalCaptureOrder } from "@/lib/paypal";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderId?: string;
      customerEmail?: string;
    };

    if (!body.orderId || typeof body.orderId !== "string") {
      return NextResponse.json({ error: "Missing orderId." }, { status: 400 });
    }

    if (!/^[A-Z0-9_-]+$/i.test(body.orderId)) {
      return NextResponse.json({ error: "Invalid orderId." }, { status: 400 });
    }

    const capture = await paypalCaptureOrder(body.orderId);

    try {
      await markOrderPaid({
        provider: "paypal",
        providerRef: body.orderId,
        customerEmail: body.customerEmail,
        rawPayload: capture,
      });
    } catch (storeErr) {
      console.error("Failed to mark PayPal order paid:", storeErr);
    }

    return NextResponse.json({ capture });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PayPal capture failed.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
