import { NextResponse } from "next/server";
import { validateAndPriceOrder } from "@/lib/pricing";
import { createPendingOrder } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import type { CheckoutItemInput } from "@/types";

export const runtime = "nodejs";

/**
 * Creates a Stripe PaymentIntent with a server-calculated amount.
 * Client sends only { items: [{ productId, quantity }] } — never prices.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items?: CheckoutItemInput[];
      customerEmail?: string;
    };

    if (!body.items) {
      return NextResponse.json({ error: "Missing items." }, { status: 400 });
    }

    const order = validateAndPriceOrder(body.items);
    const stripe = getStripe();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: body.customerEmail || undefined,
      metadata: {
        source: "piggypower-web",
        item_count: String(order.items.length),
        product_ids: order.items.map((l) => l.product.id).join(","),
        quantities: order.items.map((l) => String(l.quantity)).join(","),
        subtotal_cents: String(order.subtotalCents),
      },
      description: `PiggyPower order (${order.items.length} line${order.items.length === 1 ? "" : "s"})`,
    });

    try {
      await createPendingOrder({
        provider: "stripe",
        providerRef: paymentIntent.id,
        customerEmail: body.customerEmail,
        order,
      });
    } catch (storeErr) {
      console.error("Failed to store pending order:", storeErr);
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: order.totalCents,
      currency: "usd",
      breakdown: {
        subtotalCents: order.subtotalCents,
        shippingCents: order.shippingCents,
        totalCents: order.totalCents,
        items: order.items.map((l) => ({
          productId: l.product.id,
          name: l.product.shortName,
          quantity: l.quantity,
          unitPriceCents: l.product.priceCents,
          lineTotalCents: l.lineTotalCents,
        })),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment intent failed.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
