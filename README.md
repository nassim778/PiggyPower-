# PiggyPower E-Commerce

Replacement storefront for [officialpiggypower.com](https://www.officialpiggypower.com/) — same catalog, prices, and site pages (Home, Shop, How It Works, FAQ, Use Cases, About, Contact, Shipping), with a light coral/white look based on the live PiggyPower logo.

## Stack

- **Next.js 16** (App Router) — SSR/SSG for SEO + Server API routes
- **TypeScript** + **Tailwind CSS 4**
- **Zustand** — client cart (IDs + quantities only)
- **Stripe** — Payment Element (cards, Google Pay, Apple Pay)
- **PayPal** — JS SDK + server-side Orders API

## Security model (anti-tampering)

1. The browser cart stores **only** `productId` + `quantity`.
2. Payment endpoints accept that payload and **re-price** from `src/lib/products.ts` via `validateAndPriceOrder()`.
3. Stripe PaymentIntents and PayPal orders are created with the **server-calculated** amount.
4. Secret keys (`STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_SECRET`) never leave the server.

```
Client                    Server                         Processor
──────                    ──────                         ─────────
cart: [{id, qty}]  →  validateAndPriceOrder()
                   →  PaymentIntent / PayPal order  →  Stripe / PayPal
SDK UI confirms    ←  clientSecret / orderId
```

## Project structure

```
src/
  app/
    page.tsx                 Home
    shop/                    Catalog + product detail
    checkout/                Stripe + PayPal checkout
    how-it-works/
    api/
      stripe/create-payment-intent/
      paypal/create-order/
      paypal/capture-order/
      checkout/validate/
  components/                UI (layout, products, cart, checkout)
  lib/
    products.ts              Authoritative catalog & prices
    pricing.ts               Server order validation
    stripe.ts / paypal.ts    Server SDK helpers
    cart-store.ts            Client cart
```

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy the example file and fill in sandbox/test keys:

```bash
cp .env.example .env.local
```

| Variable | Where used | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | Server only | `sk_test_…` or `sk_live_…` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Browser | `pk_test_…` or `pk_live_…` |
| `PAYPAL_CLIENT_ID` | Server | REST app client ID |
| `PAYPAL_CLIENT_SECRET` | Server only | REST app secret |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Browser | Same client ID as above (public) |
| `PAYPAL_MODE` | Server | `sandbox` (default) or `live` |

**Stripe:** Dashboard → Developers → API keys. Enable Payment Element wallets for Google Pay / Apple Pay in your Stripe account settings (domain verification required for Apple Pay in production).

**PayPal:** Developer Dashboard → Apps & Credentials → create a REST app. Use Sandbox credentials for local testing.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
npm start
```

Deploy to **Vercel** (recommended). Use **Firebase Firestore** for contact messages and orders — see `DEPLOY.md`.

## Test cards / PayPal

- Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC
- PayPal: use sandbox buyer accounts from the PayPal Developer Dashboard

Without keys, the UI still runs; checkout endpoints return a clear configuration error.

## Catalog

Prices and SKUs in `src/lib/products.ts` are mapped from the live PiggyPower inventory (Cells 20–250, HeatBanks 600–2400, Ember kits, accessories, and field manuals). Update that file to change authoritative pricing.
