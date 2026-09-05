import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-ink">Payment received</h1>
      <p className="mt-4 text-ash leading-relaxed">
        Thank you. Your PiggyPower order is confirmed. Built-to-order units ship
        in small batches — watch your email for updates. Please also check spam.
      </p>
      <Link href="/shop" className="btn-primary mt-10 inline-flex">
        Continue Shopping
      </Link>
    </div>
  );
}
