import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "PiggyPower products are hand-built to order. Review build times, signature delivery, and international shipping.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-bold text-ink">Shipping Policy</h1>
      <p className="mt-4 text-ash leading-relaxed">
        PiggyPower products are hand-built to order and assembled in small batches.
        Please review the information below before placing an order.
      </p>
      <p className="mt-4 text-ash leading-relaxed">
        For orders outside the mainland United States, including Hawaii, Alaska,
        and international destinations, please{" "}
        <Link href="/contact" className="text-blue underline">
          contact us
        </Link>{" "}
        before ordering so we can provide a custom shipping quote.
      </p>

      <section className="mt-10 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-ink">Processing and Build Time</h2>
          <p className="mt-2 text-sm leading-relaxed text-ash">
            All PiggyPower units are custom-built and thoroughly tested prior to
            shipment. We aim to ship orders within approximately 30 days. However,
            depending on production backlog, parts availability, and testing
            requirements, fulfillment may take up to 6–8 weeks. Once an order has
            entered production, it cannot be canceled.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">Signature Required</h2>
          <p className="mt-2 text-sm leading-relaxed text-ash">
            Signature confirmation is required for delivery on all orders. This is
            done to protect both the customer and PiggyPower and to prevent loss,
            theft, or delivery disputes.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">Documentation and Testing</h2>
          <p className="mt-2 text-sm leading-relaxed text-ash">
            Every PiggyPower unit is tested prior to shipment. Operational video
            documentation is recorded for each unit and associated with its serial
            number.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">Damaged or Lost Shipments</h2>
          <p className="mt-2 text-sm leading-relaxed text-ash">
            If a package arrives damaged, the customer must notify PiggyPower within
            48 hours of delivery and provide clear photographic evidence of the
            damage, including the original packaging.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">International Shipping</h2>
          <p className="mt-2 text-sm leading-relaxed text-ash">
            Customers outside the United States may contact PiggyPower for a custom
            shipping quote. Customers are responsible for all customs duties, taxes,
            import fees, and compliance with local regulations.
          </p>
        </div>
      </section>
    </div>
  );
}
