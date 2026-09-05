import { NextResponse } from "next/server";
import { validateAndPriceOrder } from "@/lib/pricing";
import { createPendingOrder } from "@/lib/orders";
import { paypalCreateOrder } from "@/lib/paypal";
import type { CheckoutItemInput } from "@/types";

export const runtime = "nodejs";

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
    const description = order.items
      .map((l) => `${l.quantity}× ${l.product.shortName}`)
      .join(", ")
      .slice(0, 120);

    const paypalOrder = await paypalCreateOrder(order.totalCents, description);

    try {
      await createPendingOrder({
        provider: "paypal",
        providerRef: paypalOrder.id,
        customerEmail: body.customerEmail,
        order,
      });
    } catch (storeErr) {
      console.error("Failed to store pending PayPal order:", storeErr);
    }

    return NextResponse.json({
      orderId: paypalOrder.id,
      amount: order.totalCents,
      breakdown: {
        subtotalCents: order.subtotalCents,
        shippingCents: order.shippingCents,
        totalCents: order.totalCents,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PayPal order failed.";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
