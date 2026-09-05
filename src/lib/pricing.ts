import { getProductById } from "@/lib/products";
import type { CartLine, CheckoutItemInput, ValidatedOrder } from "@/types";

/** Flat shipping estimate — server-authoritative (never trust client totals). */
const SHIPPING_CENTS = 0;
const FREE_SHIPPING_THRESHOLD_CENTS = 0;

/**
 * Recalculate order totals exclusively from the server-side product catalog.
 * Client may only send product IDs + quantities — never prices.
 */
export function validateAndPriceOrder(
  items: CheckoutItemInput[],
): ValidatedOrder {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }

  const lines: CartLine[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    if (!item?.productId || typeof item.quantity !== "number") {
      throw new Error("Invalid cart item.");
    }

    const quantity = Math.floor(item.quantity);
    if (quantity < 1 || quantity > 99) {
      throw new Error("Invalid quantity.");
    }

    if (seen.has(item.productId)) {
      throw new Error("Duplicate product in cart payload.");
    }
    seen.add(item.productId);

    const product = getProductById(item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }

    lines.push({
      product,
      quantity,
      lineTotalCents: product.priceCents * quantity,
    });
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const shippingCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? SHIPPING_CENTS : SHIPPING_CENTS;

  return {
    items: lines,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}
