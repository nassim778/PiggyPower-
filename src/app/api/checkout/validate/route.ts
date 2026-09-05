import { NextResponse } from "next/server";
import { validateAndPriceOrder } from "@/lib/pricing";
import type { CheckoutItemInput } from "@/types";

export const runtime = "nodejs";

/** Preview server-priced totals without creating a payment. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: CheckoutItemInput[] };
    if (!body.items) {
      return NextResponse.json({ error: "Missing items." }, { status: 400 });
    }
    const order = validateAndPriceOrder(body.items);
    return NextResponse.json({
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
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Validation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
