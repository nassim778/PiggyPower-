# Deploy PiggyPower (Vercel + Firebase)

The storefront runs on **Vercel**. **Firebase** handles Auth, Firestore (orders, messages, users).

## 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project**
2. Enable **Authentication** → **Sign-in method**:
   - **Email/Password** → Enable
   - **Google** → Enable → choose a support email → Save
3. Under **Authentication → Settings → Authorized domains**, keep `localhost` and add:
   - `piggypower.vercel.app`
   - your custom domain (when you have one)
4. Enable **Firestore Database** (start in production mode, pick a region)
5. Open **Project settings → Service accounts → Generate new private key**
6. From the downloaded JSON, map:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
7. Add a **Web app** and copy the config into `NEXT_PUBLIC_FIREBASE_*` vars

### Google sign-in notes

- Firebase uses Google’s built-in OAuth for your project — no separate Google Cloud client ID is required for the default web setup.
- If Google sign-in shows **unauthorized-domain**, add that host under Authorized domains.
- Admin via Google: put that Gmail in `ADMIN_EMAILS`, then sign in with Google.

### Firestore collections (auto-created on first write)

| Collection | Purpose |
|------------|---------|
| `contact_messages` | Contact form submissions |
| `orders` | Pending / paid checkout records |
| `users` | Customer / admin profiles (`role`) |

Keep client Firestore locked down — this app reads/writes sensitive data via Admin SDK APIs:

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

### Admin access

In Firestore → `users` → pick the user → set field **`role`** to:

- `admin` — can open `/admin`
- `customer` — normal shopper

That’s it. The app reads this field and does **not** overwrite it on login.

After you change it, click back into the site (or refresh) and the new role applies.

## 2. Deploy to Vercel

### Option A — Dashboard (easiest)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo
3. Framework: **Next.js** (auto)
4. Add env vars (Production + Preview):

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_FIREBASE_*` | Web app config from Firebase |
| `FIREBASE_PROJECT_ID` | From service account JSON |
| `FIREBASE_CLIENT_EMAIL` | From service account JSON |
| `FIREBASE_PRIVATE_KEY` | Full private key (include `-----BEGIN…-----`; Vercel accepts `\n`) |
| `ADMIN_EMAILS` | Your admin email(s), comma-separated |
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
# add env vars, then:
vercel --prod
```

## 3. Local testing

```bash
cp .env.example .env.local
# fill Firebase + ADMIN_EMAILS + Stripe/PayPal
npm run dev
```

Open:

- `/login` / `/register` — customer accounts
- `/account` — customer profile
- `/admin` — admin dashboard (ADMIN_EMAILS only)

## 4. Verify after deploy

1. Enable Email/Password in Firebase Auth
2. Register a user → appears in Firebase Auth + Firestore `users`
3. Add that email to `ADMIN_EMAILS` → redeploy / restart → `/admin` works
4. `/contact` → Firestore `contact_messages`
5. Checkout → Firestore `orders`

## Architecture

```
Browser  →  Vercel (Next.js)
              ├─ Firebase Auth (client) + /api/auth/sync
              ├─ /api/admin/*                 → Admin-only (Bearer ID token)
              ├─ /api/contact                 → Firestore contact_messages
              ├─ /api/stripe/create-payment-intent → Stripe + orders (pending)
              ├─ /api/orders/confirm          → Stripe verify + orders (paid)
              ├─ /api/paypal/create-order     → PayPal + orders (pending)
              └─ /api/paypal/capture-order    → PayPal + orders (paid)
```

Secrets stay on the server. Only Stripe/PayPal **publishable** client IDs and Firebase web config are public.
