import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure PiggyPower checkout with Stripe and PayPal.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
