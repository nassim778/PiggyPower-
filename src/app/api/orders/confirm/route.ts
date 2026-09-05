import { NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import { isFirebaseConfigured } from "@/lib/firebase";

export const runtime = "nodejs";

/**
 * Confirms a successful Stripe PaymentIntent and marks the Firestore order paid.
 * Client sends { paymentIntentId } after Elements confirmPayment succeeds.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      paymentIntentId?: string;
      customerEmail?: string;
    };

    if (!body.paymentIntentId || !/^pi_[A-Za-z0-9_]+$/.test(body.paymentIntentId)) {
      return NextResponse.json({ error: "Invalid paymentIntentId." }, { status: 400 });
    }

    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(body.paymentIntentId);

    if (intent.status !== "succeeded") {
      return NextResponse.json(
        { error: `Payment not succeeded (status: ${intent.status}).` },
        { status: 400 },
      );
    }

    if (!isFirebaseConfigured()) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        message: "Payment succeeded; Firebase not configured so order was not stored.",
      });
    }

    const result = await markOrderPaid({
      provider: "stripe",
      providerRef: intent.id,
      customerEmail: body.customerEmail || intent.receipt_email || undefined,
      rawPayload: {
        id: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        status: intent.status,
        metadata: intent.metadata,
      },
    });

    return NextResponse.json({ ok: true, orderId: result.id ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order confirm failed.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
