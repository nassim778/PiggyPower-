"use client";

import { useState } from "react";

const field =
  "mt-1 h-11 w-full rounded border border-rule px-3 text-base outline-none focus:border-blue sm:text-sm";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <p className="mt-8 border border-rule bg-mist p-5 text-sm text-ash sm:mt-10 sm:p-6">
        Thanks — your message was sent. Please check your spam folder if you are
        waiting on a reply.
      </p>
    );
  }

  return (
    <form
      className="mt-8 space-y-4 sm:mt-10"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const form = e.currentTarget;
        const data = new FormData(form);
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName: data.get("firstName"),
              lastName: data.get("lastName"),
              email: data.get("email"),
              phone: data.get("phone") || undefined,
              message: data.get("message"),
            }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Failed to send.");
          setSent(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to send.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-ash">First name</span>
          <input required name="firstName" autoComplete="given-name" className={field} />
        </label>
        <label className="block text-sm">
          <span className="text-ash">Last name</span>
          <input required name="lastName" autoComplete="family-name" className={field} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-ash">Email</span>
        <input required type="email" name="email" inputMode="email" autoComplete="email" className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-ash">Phone</span>
        <input type="tel" name="phone" inputMode="tel" autoComplete="tel" className={field} />
      </label>
      <label className="block text-sm">
        <span className="text-ash">Your Inquiry</span>
        <textarea
          required
          name="message"
          rows={5}
          className="mt-1 w-full rounded border border-rule px-3 py-3 text-base outline-none focus:border-blue sm:text-sm"
        />
      </label>
      {error && (
        <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-primary w-full sm:w-auto">
        {busy ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
