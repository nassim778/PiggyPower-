import { FieldValue } from "firebase-admin/firestore";
import { getDb, isFirebaseConfigured, orderDocId } from "@/lib/firebase";
import type { ValidatedOrder } from "@/types";

export type OrderProvider = "stripe" | "paypal";

export interface OrderItemRecord {
  productId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export function orderItemsFromValidated(order: ValidatedOrder): OrderItemRecord[] {
  return order.items.map((l) => ({
    productId: l.product.id,
    name: l.product.shortName,
    quantity: l.quantity,
    unitPriceCents: l.product.priceCents,
    lineTotalCents: l.lineTotalCents,
  }));
}

export async function createPendingOrder(input: {
  provider: OrderProvider;
  providerRef: string;
  customerEmail?: string;
  order: ValidatedOrder;
}) {
  if (!isFirebaseConfigured()) {
    return { id: null as string | null, skipped: true as const };
  }

  const db = getDb();
  const id = orderDocId(input.provider, input.providerRef);
  const ref = db.collection("orders").doc(id);

  await ref.set(
    {
      status: "pending",
      provider: input.provider,
      providerRef: input.providerRef,
      customerEmail: input.customerEmail || null,
      currency: "usd",
      subtotalCents: input.order.subtotalCents,
      shippingCents: input.order.shippingCents,
      totalCents: input.order.totalCents,
      items: orderItemsFromValidated(input.order),
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { id, skipped: false as const };
}

export async function markOrderPaid(input: {
  provider: OrderProvider;
  providerRef: string;
  rawPayload?: unknown;
  customerEmail?: string;
  order?: ValidatedOrder;
}) {
  if (!isFirebaseConfigured()) {
    return { ok: true, skipped: true as const, id: null as string | null };
  }

  const db = getDb();
  const id = orderDocId(input.provider, input.providerRef);
  const ref = db.collection("orders").doc(id);
  const existing = await ref.get();

  const base: Record<string, unknown> = {
    status: "paid",
    provider: input.provider,
    providerRef: input.providerRef,
    paidAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    rawProviderPayload: input.rawPayload ?? null,
  };

  if (input.customerEmail) base.customerEmail = input.customerEmail;
  if (input.order) {
    base.subtotalCents = input.order.subtotalCents;
    base.shippingCents = input.order.shippingCents;
    base.totalCents = input.order.totalCents;
    base.items = orderItemsFromValidated(input.order);
    base.currency = "usd";
  }

  if (existing.exists) {
    await ref.set(base, { merge: true });
  } else {
    await ref.set({
      ...base,
      customerEmail: input.customerEmail || null,
      currency: "usd",
      subtotalCents: input.order?.subtotalCents ?? 0,
      shippingCents: input.order?.shippingCents ?? 0,
      totalCents: input.order?.totalCents ?? 0,
      items: input.order ? orderItemsFromValidated(input.order) : [],
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  return { ok: true, skipped: false as const, id };
}

export async function saveContactMessage(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  const db = getDb();
  await db.collection("contact_messages").add({
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    message: input.message.trim(),
    createdAt: FieldValue.serverTimestamp(),
  });
}
