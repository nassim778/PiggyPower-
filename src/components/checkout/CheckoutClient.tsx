"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useCartStore } from "@/lib/cart-store";
import { formatMoney, getProductById } from "@/lib/products";
import { useRouter } from "next/navigation";
import clsx from "clsx";

type Method = "stripe" | "paypal";

function StripeForm({
  onSuccess,
  email,
}: {
  onSuccess: () => void;
  email: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Payment form error.");
      setBusy(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        receipt_email: email || undefined,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message ?? "Payment failed.");
      setBusy(false);
      return;
    }

    const paymentIntentId = result.paymentIntent?.id;
    if (paymentIntentId) {
      try {
        await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId,
            customerEmail: email || undefined,
          }),
        });
      } catch {
        // Payment already succeeded; storage failure shouldn't block thank-you
      }
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
          wallets: { applePay: "auto", googlePay: "auto" },
        }}
      />
      {error && (
        <p className="border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
          {error}
        </p>
      )}
      <button type="submit" disabled={!stripe || busy} className="btn-primary w-full">
        {busy ? "Processing…" : "Pay with Card / Wallet"}
      </button>
      <p className="text-xs text-ash">
        Supports credit cards, Google Pay, and Apple Pay via Stripe
      </p>
    </form>
  );
}

export function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const [method, setMethod] = useState<Method>("stripe");
  const [email, setEmail] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          return { product, quantity: item.quantity };
        })
        .filter(Boolean) as {
        product: NonNullable<ReturnType<typeof getProductById>>;
        quantity: number;
      }[],
    [items],
  );

  const displaySubtotal = lines.reduce(
    (s, l) => s + l.product.priceCents * l.quantity,
    0,
  );

  const payload = useMemo(
    () => ({
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    }),
    [items],
  );

  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (pk) setStripePromise(loadStripe(pk));
    const pp = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (pp) setPaypalClientId(pp);
  }, []);

  useEffect(() => {
    if (items.length === 0 || method !== "stripe") return;

    let cancelled = false;
    async function createIntent() {
      setLoadingIntent(true);
      setError(null);
      setClientSecret(null);
      try {
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, customerEmail: email || undefined }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create payment.");
        if (!cancelled) {
          setClientSecret(data.clientSecret);
          setServerTotal(data.amount);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Stripe setup failed.");
        }
      } finally {
        if (!cancelled) setLoadingIntent(false);
      }
    }

    const t = setTimeout(createIntent, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [items, method, payload, email]);

  const onPaid = () => {
    clear();
    router.push("/checkout/success");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:py-20">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Cart empty</h1>
        <p className="mt-3 text-ash">Add products before checking out.</p>
        <a href="/shop" className="btn-primary mt-8 inline-flex w-full sm:w-auto">
          Browse Shop
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-[1fr_360px]">
      <aside className="order-1 h-fit rounded-xl border border-rule bg-mist p-4 sm:p-5 lg:order-2 lg:sticky lg:top-24">
        <h2 className="text-sm font-semibold text-ink">Order Summary</h2>
        <ul className="mt-4 space-y-3">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex justify-between gap-3 text-sm">
              <span className="min-w-0 break-words text-ink">
                {quantity}× {product.shortName}
              </span>
              <span className="shrink-0 tabular-nums text-ash">
                {formatMoney(product.priceCents * quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-rule pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-ash">Subtotal</span>
            <span className="font-semibold tabular-nums text-ink">{formatMoney(displaySubtotal)}</span>
          </div>
          {serverTotal !== null && (
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-blue">Charged total</span>
              <span className="font-semibold tabular-nums text-blue">{formatMoney(serverTotal)}</span>
            </div>
          )}
        </div>
      </aside>

      <div className="order-2 min-w-0 lg:order-1">
        <h1 className="text-2xl font-bold text-ink sm:text-4xl">Checkout</h1>
        <p className="mt-2 max-w-xl text-sm text-ash">
          Order totals are calculated on the server from the product catalog.
          Client-submitted prices are ignored.
        </p>

        <label className="mt-6 block text-sm sm:mt-8">
          <span className="text-ash">Email (receipt)</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 h-11 w-full rounded border border-rule px-3 outline-none focus:border-blue"
            placeholder="you@example.com"
          />
        </label>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:mt-8 sm:grid-cols-2">
          {(["stripe", "paypal"] as Method[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={clsx(
                "min-h-11 border px-3 py-3 text-sm font-medium transition",
                method === m
                  ? "border-blue bg-blue/10 text-blue"
                  : "border-rule text-ash hover:border-ink",
              )}
            >
              {m === "stripe" ? "Card / Apple / Google Pay" : "PayPal"}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-rule bg-bloom p-4 sm:p-5">
          {error && (
            <p className="mb-4 break-words border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {error}
              {(error.includes("not configured") || error.includes("credentials")) && (
                <span className="mt-1 block text-xs">
                  Add keys to <code className="text-blue">.env.local</code> — see README.
                </span>
              )}
            </p>
          )}

          {method === "stripe" && (
            <>
              {loadingIntent && (
                <p className="text-sm text-ash">Creating secure payment…</p>
              )}
              {clientSecret && stripePromise && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#1e63b6",
                        borderRadius: "8px",
                      },
                    },
                  }}
                >
                  <StripeForm onSuccess={onPaid} email={email} />
                </Elements>
              )}
            </>
          )}

          {method === "paypal" && (
            <>
              {!paypalClientId ? (
                <p className="text-sm text-ash">
                  Set <code className="text-blue">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> to
                  enable PayPal.
                </p>
              ) : (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical", color: "gold", shape: "rect", height: 48 }}
                    createOrder={async () => {
                      setError(null);
                      const res = await fetch("/api/paypal/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          ...payload,
                          customerEmail: email || undefined,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || "PayPal order failed");
                      setServerTotal(data.amount);
                      return data.orderId as string;
                    }}
                    onApprove={async (data) => {
                      const res = await fetch("/api/paypal/capture-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          orderId: data.orderID,
                          customerEmail: email || undefined,
                        }),
                      });
                      const result = await res.json();
                      if (!res.ok) {
                        setError(result.error || "Capture failed");
                        return;
                      }
                      onPaid();
                    }}
                    onError={() => {
                      setError("PayPal checkout error. Check credentials and try again.");
                    }}
                  />
                </PayPalScriptProvider>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
