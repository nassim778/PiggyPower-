# Deploy PiggyPower (Vercel + Firebase)

The storefront runs on **Vercel**. **Firebase Firestore** stores contact messages and orders.

## 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project**
2. Enable **Firestore Database** (start in production mode, pick a region)
3. Open **Project settings → Service accounts → Generate new private key**
4. From the downloaded JSON, map:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### Firestore collections (auto-created on first write)

| Collection | Purpose |
|------------|---------|
| `contact_messages` | Contact form submissions |
| `orders` | Pending / paid checkout records |

Optional security: keep writes server-only via the Admin SDK (this app never writes from the browser). In Firestore rules you can deny all client access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 2. Deploy to Vercel

### Option A — Dashboard (easiest)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo
3. Framework: **Next.js** (auto)
4. Add env vars (Production + Preview):

| Variable | Notes |
|----------|--------|
| `FIREBASE_PROJECT_ID` | From service account JSON |
| `FIREBASE_CLIENT_EMAIL` | From service account JSON |
| `FIREBASE_PRIVATE_KEY` | Full private key (include `-----BEGIN…-----`; Vercel accepts `\n`) |
| `STRIPE_SECRET_KEY` | `sk_test_…` or `sk_live_…` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` or `pk_live_…` |
| `PAYPAL_CLIENT_ID` | PayPal REST app ID |
| `PAYPAL_CLIENT_SECRET` | PayPal secret |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Same client ID (public) |
| `PAYPAL_MODE` | `sandbox` or `live` |

5. Deploy

### Option B — CLI

```bash
npm i -g vercel
vercel login
vercel
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY
# …Stripe / PayPal
vercel --prod
```

## 3. Local testing

```bash
cp .env.example .env.local
# fill Firebase + Stripe/PayPal
npm run dev
```

## 4. Verify after deploy

1. `/contact` → submit → check Firestore `contact_messages`
2. Stripe test card `4242 4242 4242 4242` → check `orders` with `status: paid`
3. PayPal sandbox → same `orders` collection

## Architecture

```
Browser  →  Vercel (Next.js)
              ├─ /api/contact                 → Firestore contact_messages
              ├─ /api/stripe/create-payment-intent → Stripe + orders (pending)
              ├─ /api/orders/confirm          → Stripe verify + orders (paid)
              ├─ /api/paypal/create-order     → PayPal + orders (pending)
              └─ /api/paypal/capture-order    → PayPal + orders (paid)
```

Secrets stay on the server. Only Stripe/PayPal **publishable** client IDs are public.
