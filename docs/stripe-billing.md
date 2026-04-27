# StudAI Pro — Stripe Billing Integration

## Overview

StudAI Pro uses Stripe Billing for subscription management. The integration uses:

- **Stripe Checkout** for subscription purchase (no custom card collection)
- **Stripe Customer Portal** for subscription management, cancellation, and invoice history
- **Stripe Webhooks** for reliable, server-side subscription state updates
- **AWS Lambda** (via Amplify Functions) for all backend billing logic
- **DynamoDB** for local subscription state (fast reads, no Stripe call on every request)

---

## Environment Variables

### Required Amplify Secrets (set via `amplify secret set`)

| Secret | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `STRIPE_PRICE_PRO_MONTHLY` | Stripe Price ID for the monthly Pro plan |
| `STRIPE_PRICE_PRO_ANNUAL` | Stripe Price ID for the annual Pro plan |

### Frontend `.env` Variables

```env
# URL of the deployed billing Lambda (API Gateway endpoint)
VITE_BILLING_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod

# App base URL (used for Stripe redirect URLs)
APP_URL=https://your-app-domain.com
```

---

## Stripe Setup

### 1. Create Products and Prices

In the Stripe Dashboard (or via CLI):

```bash
# Create the Pro product
stripe products create --name="StudAI Pro"

# Create monthly price
stripe prices create \
  --product=prod_xxx \
  --unit-amount=1900 \
  --currency=usd \
  --recurring[interval]=month

# Create annual price
stripe prices create \
  --product=prod_xxx \
  --unit-amount=15600 \
  --currency=usd \
  --recurring[interval]=year
```

Copy the resulting Price IDs (`price_xxx`) and set them as Amplify secrets.

### 2. Configure the Customer Portal

In the Stripe Dashboard → Billing → Customer Portal:
- Enable "Cancel subscriptions"
- Enable "Update payment methods"
- Enable "View invoices"
- Set the return URL to `https://your-app.com/settings?tab=billing`

### 3. Set Amplify Secrets

```bash
npx ampx secret set STRIPE_SECRET_KEY
npx ampx secret set STRIPE_WEBHOOK_SECRET
npx ampx secret set STRIPE_PRICE_PRO_MONTHLY
npx ampx secret set STRIPE_PRICE_PRO_ANNUAL
```

---

## Webhook Setup

### Local Development (Stripe CLI)

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to your local Lambda (via SAM or Amplify sandbox)
stripe listen --forward-to http://localhost:3001/stripe/webhook

# The CLI will print a webhook signing secret — set it as STRIPE_WEBHOOK_SECRET
```

### Production

1. In the Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-api-gateway-url/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`
4. Copy the signing secret and set it as `STRIPE_WEBHOOK_SECRET`

---

## Architecture

```
Browser
  │
  ├── GET /billing/subscription      → Lambda → DynamoDB (fast, no Stripe call)
  ├── POST /billing/create-checkout-session → Lambda → Stripe Checkout Session
  ├── POST /billing/create-portal-session  → Lambda → Stripe Portal Session
  │
Stripe
  │
  └── POST /stripe/webhook           → Lambda → verify sig → DynamoDB upsert
```

### Security

- Stripe secret key is **never** sent to the browser
- Client only sends `plan: "monthly" | "annual"` — Price IDs are resolved server-side
- Webhook signature is verified with `stripe.webhooks.constructEvent()` before any processing
- Pro access is **only** granted after Stripe confirms an active/trialing subscription via webhook
- The success page polls the backend to confirm status — it does not grant access from the URL alone
- Duplicate webhooks are handled via a `StripeEvents` DynamoDB table (idempotency key = `event.id`)

---

## Database Schema

### `Subscriptions` table (DynamoDB)

| Field | Type | Description |
|---|---|---|
| `userId` | String (PK) | Cognito user ID |
| `stripeCustomerId` | String | Stripe customer ID |
| `stripeSubscriptionId` | String | Stripe subscription ID |
| `stripePriceId` | String | Active price ID |
| `plan` | String | `"pro"` |
| `billingInterval` | String | `"monthly"` or `"annual"` |
| `status` | String | `active`, `trial`, `cancelled`, `expired`, `past_due`, `incomplete` |
| `isPro` | Boolean | Derived from status — true for active/trial |
| `currentPeriodStart` | ISO String | |
| `currentPeriodEnd` | ISO String | |
| `cancelAtPeriodEnd` | Boolean | |
| `canceledAt` | ISO String | |
| `trialStart` | ISO String | |
| `trialEnd` | ISO String | |
| `updatedAt` | ISO String | |

### `StripeEvents` table (DynamoDB)

| Field | Type | Description |
|---|---|---|
| `stripeEventId` | String (PK) | Stripe event ID (idempotency key) |
| `type` | String | Event type |
| `processedAt` | ISO String | |
| `createdAt` | ISO String | |

---

## Local Testing

### Test Cards (Stripe test mode only)

> These are for development use only. Never display in production UI.

| Scenario | Card Number |
|---|---|
| Successful payment | `4242 4242 4242 4242` |
| Payment requires action | `4000 0025 0000 3155` |
| Payment declined | `4000 0000 0000 9995` |
| Insufficient funds | `4000 0000 0000 9995` |

Use any future expiry date, any 3-digit CVC, and any postal code.

### Running Tests

```bash
# Unit tests
npx vitest run src/tests/billing.test.ts

# All tests
npx vitest run
```

### Simulating Webhook Events

```bash
# Simulate a successful subscription
stripe trigger customer.subscription.created

# Simulate payment failure
stripe trigger invoice.payment_failed

# Simulate cancellation
stripe trigger customer.subscription.deleted
```

---

## Frontend Hooks

### `useSubscriptionStatus()`

Returns the current user's subscription status from the backend.

```tsx
import { useSubscriptionStatus } from "@/hooks/subscription/use-subscription-status";

function MyComponent() {
  const { data: status, isLoading } = useSubscriptionStatus();
  
  if (status?.isPro) {
    return <ProFeature />;
  }
  return <UpgradePrompt />;
}
```

### `useIsPro()`

Convenience hook — returns `true` if the user has active Pro access.

```tsx
import { useIsPro } from "@/hooks/subscription/use-subscription-status";

function ProGate({ children }: { children: React.ReactNode }) {
  const isPro = useIsPro();
  if (!isPro) return <UpgradeGate />;
  return <>{children}</>;
}
```

---

## Entitlement Helpers

```ts
import {
  isPro,
  getStatusLabel,
  getPeriodEndLabel,
  getBillingIntervalLabel,
  isCancellingAtPeriodEnd,
} from "@/lib/subscription-utils";
```

**Important:** Pro feature access must always be verified server-side. The frontend hooks are for UI rendering only — never use them as the sole gate for sensitive operations.

---

## Entitlement System

### How It Works

The entitlement system is centralized in `amplify/functions/stripe-billing/entitlements.ts`. All plan checks read from the authoritative DynamoDB `Subscriptions` table — the same table that Stripe webhooks write to.

**Never** use the AppSync `UserSubscription` model for plan enforcement. That model is a legacy artifact. The DynamoDB table is the source of truth.

### Key Functions

```ts
// Get the user's current plan ("free" | "pro")
getUserPlan(userId: string): Promise<Plan>

// Get the full entitlement object (plan, features, limits, usage)
getUserEntitlements(userId: string): Promise<Entitlements>

// Throw if user is not Pro
requirePro(userId: string, featureKey: string): Promise<void>

// Throw if usage limit is reached (or feature requires Pro)
assertUsageAllowed(userId: string, featureKey: string): Promise<void>

// Atomically increment usage counter (Free users only)
incrementUsage(userId: string, featureKey: string): Promise<number>
```

### Pro Access Rules

A user is Pro if their subscription status is `active` or `trial`.

If `cancelAtPeriodEnd = true` but the subscription is still within `currentPeriodEnd`, Pro access is maintained until that date.

All other statuses (`cancelled`, `expired`, `past_due`, `incomplete`) result in Free access.

### Usage Tracking

AI study session usage is tracked in the `UserUsageLimits` DynamoDB table:

- PK: `userId` (String)
- SK: `featureKey` (String) — format: `ai_session#YYYY-MM-DD`
- `usageCount` — incremented atomically via conditional DynamoDB update
- `ttl` — auto-expires after 7 days (set this in DynamoDB TTL settings)

Usage resets automatically because each day gets a new SK (`ai_session#2026-04-27`). No cron job needed.

### How to Protect a New Pro Feature

1. Add the feature key to `PRO_ONLY_FEATURES` in `entitlements.ts`:
   ```ts
   const PRO_ONLY_FEATURES = new Set([
     "advancedFlashcards",
     "myNewFeature", // ← add here
   ]);
   ```

2. In the Lambda handler, call `assertUsageAllowed` before processing:
   ```ts
   await assertUsageAllowed(userId, "myNewFeature");
   ```

3. In the frontend, use `ProGate` to wrap the UI:
   ```tsx
   <ProGate feature="myNewFeature">
     <MyNewFeatureComponent />
   </ProGate>
   ```

4. Add the feature to the `Entitlements` type in `src/api/entitlements.ts` and the response in `getUserEntitlements`.

### Frontend Hooks

```tsx
// Full entitlement object
const { data } = useEntitlements();

// Single feature access
const access = useFeatureAccess("progressAnalytics");
if (!access.enabled) return <UpgradePrompt />;

// AI session usage
const { used, remaining, unlimited } = useAiSessionUsage();

// Start a session (checks + increments server-side)
const { mutateAsync: startSession } = useStartAiSession();

// Alias
const { data } = useSubscription(); // same as useEntitlements()
```

### GET /api/me/entitlements

Returns the full entitlement object. Safe to call from the frontend. Does not expose Stripe secrets or raw payment data.

Example response for a Free user who has used 2 sessions today:
```json
{
  "plan": "free",
  "isPro": false,
  "features": {
    "aiStudySessions": { "enabled": true, "limit": 5, "period": "day", "used": 2, "remaining": 3 },
    "basicFlashcards": { "enabled": true },
    "advancedFlashcards": { "enabled": false, "requiresPro": true },
    "progressAnalytics": { "enabled": false, "requiresPro": true }
  }
}
```

---

## Common Troubleshooting

### Pro access not activating after payment

1. Check that the Stripe webhook is configured and the endpoint URL is correct.
2. Verify `STRIPE_WEBHOOK_SECRET` matches the signing secret in the Stripe Dashboard.
3. Check Lambda logs for webhook processing errors.
4. Confirm `subscription.metadata.userId` is set — this is how the webhook maps to a user.

### "Unauthorized" on billing endpoints

The billing Lambda requires a Cognito JWT in the `Authorization: Bearer <token>` header. Ensure `fetchAuthSession()` returns a valid `idToken`.

### Usage not resetting

Usage resets automatically because the SK includes the date (`ai_session#YYYY-MM-DD`). If usage appears stuck, check that the server clock is UTC and that `todayUTC()` returns the correct date.

### Duplicate subscriptions

The `upsertSubscription` function uses `UpdateItemCommand` with the `userId` as the PK, so duplicate webhooks will overwrite the same record rather than create duplicates. The `StripeEvents` table provides additional idempotency via `ConditionExpression: attribute_not_exists(stripeEventId)`.

### SUBSCRIPTIONS_TABLE or USER_USAGE_TABLE not set

These are injected by `amplify/backend.ts` at deploy time. If running locally, set them manually in your Lambda environment or `.env` file.
