import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions about your order, products, or general use — contact PiggyPower.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="label-mono">Contact</p>
      <h1 className="mt-4 font-bold text-4xl tracking-tight">
        Questions or Comments?
      </h1>
      <p className="mt-4 text-ash leading-relaxed">
        For inquiries regarding your order, our products, or general use
        questions, please contact us below. Our team is committed to providing
        timely, attentive service at every step.
      </p>
      <p className="mt-2 text-sm font-medium text-blue">
        Please remember to check your spam folder!
      </p>
      <ContactForm />
    </div>
  );
}
