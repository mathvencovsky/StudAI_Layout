# StudAI Analytics System

## Architecture

Events flow through two paths:

```
Frontend UI action
  └── trackClientEvent() → AppSync AnalyticsEvent model (owner-auth)

Backend action (Lambda)
  └── trackEvent() / trackSubscriptionEvent() → DynamoDB AnalyticsEvents table
```

The DynamoDB table is the authoritative store for business-critical events. AppSync stores frontend UI interaction events.

---

## Event Naming Conventions

- `snake_case` throughout
- Format: `noun_verb` or `verb_noun` (e.g. `user_signed_up`, `checkout_started`)
- All event names are defined in `src/lib/analytics-events.ts` — never use raw strings

---

## Event Registry

All events live in `src/lib/analytics-events.ts`:

```ts
import { EVENTS } from "@/lib/analytics-events";

// Use constants, never raw strings:
EVENTS.PRICING_PAGE_VIEWED       // ✓
"pricing_page_viewed"            // ✗
```

### Source labels

| Source | Meaning |
|---|---|
| `[BE]` | Backend-authoritative — written by Lambda only |
| `[FE]` | Frontend — UI interactions |
| `[WH]` | Webhook — written by Stripe webhook handler |

---

## How to Track Backend Events

In the Lambda (`amplify/functions/stripe-billing/`):

```ts
import { trackEvent, trackSubscriptionEvent } from "./analytics";
import { EVENTS } from "../../../src/lib/analytics-events";

// User action
await trackEvent(userId, EVENTS.AI_STUDY_SESSION_CREATED, {
  isFirstSession: true,
  usageCount: 1,
});

// Subscription lifecycle (from webhook)
await trackSubscriptionEvent(userId, EVENTS.SUBSCRIPTION_ACTIVATED, {
  billingInterval: "monthly",
  source: "stripe_webhook",
});
```

`trackEvent` automatically:
- Derives `plan` from DynamoDB (never trusts client)
- Sanitizes metadata
- Fails silently (never breaks the main flow)

---

## How to Track Frontend Events

```tsx
import { useAnalytics } from "@/hooks/use-analytics";
import { EVENTS } from "@/lib/analytics-events";

function MyComponent() {
  const { track } = useAnalytics();

  return (
    <button onClick={() => track(EVENTS.UPGRADE_PROMPT_CLICKED, { feature: "exportMaterials" })}>
      Upgrade
    </button>
  );
}
```

Or for one-off page views:

```tsx
import { useTrackEvent } from "@/hooks/use-analytics";

function PricingPage() {
  const trackView = useTrackEvent(EVENTS.PRICING_PAGE_VIEWED);
  useEffect(() => { trackView({ source: "navbar" }); }, []);
}
```

`useAnalytics` automatically:
- Includes the user's current plan
- Validates the event name against the registry
- Rejects backend-only events
- Fails silently

---

## Which Events Are Authoritative

Backend-only events (in `BACKEND_ONLY_EVENTS`) are the source of truth for:
- Activation metrics (first session, first quiz, etc.)
- Conversion (checkout completed, subscription activated)
- Usage limits (free limit reached)
- Retention (streak events, day-N returns)

If the client sends a backend-only event, it is silently rejected.

---

## Privacy Rules for Metadata

**Never include:**
- Raw AI prompts or message content
- Private study material
- Card numbers, CVV, or payment data
- Stripe secret keys or tokens
- Passwords or access tokens
- Full user email addresses

**Safe to include:**
- Feature names (`"aiStudySessions"`, `"exportMaterials"`)
- Plan (`"free"`, `"pro"`)
- Counts and numbers
- Boolean flags
- Short string labels

The `sanitizeMetadata()` function enforces these rules automatically. Blocked keys: `password`, `token`, `secret`, `key`, `card`, `cvv`, `ssn`, `stripe_secret`, `authorization`, `prompt`, `ai_message`, `message_content`.

Max metadata size: 2KB. Oversized metadata is replaced with `{ _truncated: true }`.

---

## Onboarding Data Model

Onboarding preferences are stored in the `LearningPreference` AppSync model (owner-auth). The `DiscoveryPage` component is shown when no `LearningPreference` exists for the user.

Key fields: `interests`, `minutesPerDay`, `days`, `formats`, `objectives`, `context`, `experienceLevel`.

Events tracked:
- `onboarding_started` — frontend, when `DiscoveryPage` is first shown
- `onboarding_completed` — backend, when `LearningPreference` is saved
- `study_goal_selected`, `study_subject_selected`, `education_level_selected` — frontend

---

## Retention / Streak Logic

Streaks are tracked in the `UserStudyStats` AppSync model:
- `currentStreak` — consecutive study days
- `longestStreak` — all-time best
- `lastStudyDate` — YYYY-MM-DD UTC
- `totalStudyDays`, `totalStudySessions`

A "meaningful study action" that counts toward streak:
- AI study session completed
- Quiz completed
- Learning track lesson completed

Streak update rules (UTC daily boundary):
- Same day → no change
- Next consecutive day → `currentStreak + 1`, fire `study_streak_continued`
- Gap of 2+ days → reset to 1, fire `study_streak_broken`
- First ever → set to 1, fire `study_streak_started`

---

## Admin Metrics Endpoints

`GET /api/admin/metrics/overview` — requires Admin Cognito group.

Returns aggregate counts only. No PII, no payment details.

```json
{
  "featureUsage": { "aiSessionsToday": 42, "aiSessionsThisWeek": 280 },
  "conversion": {
    "checkoutsStartedThisWeek": 15,
    "checkoutsCompletedThisWeek": 9,
    "checkoutConversionRatePct": 60,
    "upgradePromptsViewedThisWeek": 120,
    "upgradePromptsClickedThisWeek": 18,
    "upgradeClickThroughRatePct": 15,
    "freeLimitReachedThisWeek": 34
  },
  "subscriptionHealth": {
    "cancellationsThisMonth": 2,
    "paymentFailuresThisMonth": 1
  }
}
```

---

## How to Connect an External Analytics Provider

The system is designed for easy PostHog/Amplitude/Mixpanel/Segment integration.

**Option A — Replace AppSync writes with provider SDK:**

In `src/api/analytics.ts`, replace the `client.models.AnalyticsEvent.create()` call:

```ts
// Before (local AppSync)
await client.models.AnalyticsEvent.create({ eventName, ... });

// After (PostHog example)
posthog.capture(eventName, { ...metadata, plan, userId });
```

**Option B — Dual-write (local + external):**

```ts
await Promise.allSettled([
  client.models.AnalyticsEvent.create({ eventName, ... }),
  posthog.capture(eventName, metadata),
]);
```

**Option C — Backend forwarding:**

In `amplify/functions/stripe-billing/analytics.ts`, add a call to your provider's API after the DynamoDB write.

---

## How to Add Future Events Safely

1. Add the event name to `EVENTS` in `src/lib/analytics-events.ts`
2. If backend-authoritative, add it to `BACKEND_ONLY_EVENTS`
3. Call `trackEvent()` (backend) or `track()` (frontend) at the right moment
4. Add a test in `src/tests/analytics.test.ts`

---

## Running Tests

```bash
npx vitest run src/tests/analytics.test.ts
npx vitest run src/tests/billing.test.ts
```
