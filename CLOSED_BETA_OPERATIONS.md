# StudAI — Closed Beta Operations

> Status: READY for first 10–20 beta users.
> This document is the operational guide for the closed beta period. It does not replace CLOSED_BETA_RELEASE_CHECKLIST.md — that covers pre-launch readiness. This covers what to do once real users are inside.

---

## PHASE 1 — Beta Launch Goals

The closed beta exists to validate these flows with real users before expanding:

1. Onboarding — user signs up, completes DiscoveryPage, LearningPreference is saved.
2. First AI study session — user creates a session, AI responds, usage counter increments.
3. Free usage limit — 5th session is blocked, upgrade prompt is shown, no bypass is possible.
4. Pro upgrade flow — upgrade prompt is visible, pricing page loads, checkout starts.
5. Stripe checkout and webhook — checkout completes, webhook fires, DynamoDB updates, isPro = true.
6. Support and feedback flows — user can submit feedback and support tickets end-to-end.
7. Retention signals — user returns the next day, streak increments, day-2 return is tracked.

Beta is not considered successful until at least one real user has completed onboarding, created an AI session, and at least one Stripe test or real subscription path has been verified post-deployment.

---

## PHASE 2 — Beta User Size

- Start with 10–20 users only.
- Do not expand to 50–100 users until all Go/No-Go expansion criteria below are met.
- Invite users manually via Cognito Console or a controlled invite link.
- Add each beta user to the `Ai` Cognito group after signup.

---

## PHASE 3 — Daily Monitoring Checklist

Run this checklist every day during the beta period.

### Signups and Onboarding
- [ ] New signups today (check Cognito User Pool or `user_signed_up` analytics events)
- [ ] Onboarding started (`onboarding_started` events)
- [ ] Onboarding completed (`onboarding_completed` events in DynamoDB AnalyticsEvents)
- [ ] Onboarding drop-off rate (started minus completed)

### AI Study Sessions
- [ ] First AI study session created (`ai_study_session_created` with `isFirstSession: true`)
- [ ] Total AI sessions today
- [ ] AI session failures (Lambda errors, Bedrock errors, AppSync errors)
- [ ] Free daily limit reached events (`free_limit_reached`)
- [ ] Unusual Bedrock usage or cost spikes (check AWS Cost Explorer and CloudWatch)

### Upgrade and Billing
- [ ] Upgrade prompts viewed (`upgrade_prompt_viewed`)
- [ ] Checkout started (`checkout_started`)
- [ ] Checkout completed (`checkout_completed`)
- [ ] Webhook delivery failures (check Stripe Dashboard → Developers → Webhooks → recent deliveries)
- [ ] Pro access unlocked after webhook (`subscription_activated` in DynamoDB AnalyticsEvents)
- [ ] Payment failures (`invoice.payment_failed` webhook events, `hasPaymentIssue = true` in Subscriptions table)

### Support and Feedback
- [ ] Support tickets submitted
- [ ] Feedback submissions received
- [ ] Any feedback flagging confusion, errors, or blockers

### Infrastructure
- [ ] CloudWatch errors in `stripe-billing` Lambda log group
- [ ] AppSync errors (check CloudWatch → AppSync → Errors)
- [ ] Lambda errors (check CloudWatch → Lambda → Error metric for all functions)
- [ ] DynamoDB throttling or errors

---

## PHASE 4 — Go / No-Go Expansion Criteria

StudAI can expand from 10–20 users to 50–100 users only if ALL of the following are true:

- [ ] Signup and login work reliably — no auth failures reported
- [ ] Onboarding completion rate is acceptable (target: >70% of signups)
- [ ] AI chat works without cost or security issues
- [ ] No user data leaks observed (no cross-user data access, no PII in logs)
- [ ] Stripe checkout completes successfully for at least one user
- [ ] Webhook updates subscription state in DynamoDB correctly
- [ ] Pro access unlocks correctly after webhook (isPro = true)
- [ ] Free users cannot bypass the 5-session daily limit
- [ ] Support and feedback flows work end-to-end
- [ ] No critical bugs remain open (see severity definitions in Phase 5)

Do not expand if any critical or unresolved high-severity issue is open.

---

## PHASE 5 — Stop-the-Beta Criteria

Pause the beta immediately and do not invite new users if any of the following occur:

- User data leak — any user can read another user's data
- Payment or Stripe data exposure — raw Stripe objects, card data, or secrets reach the browser
- Unauthorized Pro access — Free users gain Pro features without paying
- Cross-user data access — AppSync owner-auth bypass or DynamoDB PK collision
- Bedrock/AI cost spike — unexpected cost increase without corresponding usage
- Webhook failures preventing Pro access — paying users cannot access Pro features
- Login or signup is broken — users cannot create accounts or sign in
- Checkout charges users but does not unlock Pro — money taken, no access granted

To pause: stop sending invite links, notify affected users, open a Critical issue (see template below).

---

## PHASE 6 — Beta Issue Tracker Template

Use this template for every bug found during beta. File issues in your tracker of choice (GitHub Issues, Linear, Notion, etc.).

```
Title: [short description]

Severity: critical | high | medium | low

Affected user: [user ID or anonymized label, e.g. "beta-user-03"]

Affected flow: onboarding | ai-session | free-limit | upgrade-prompt | checkout | webhook | pro-access | support | feedback | auth | admin | other

Steps to reproduce:
1.
2.
3.

Expected behavior:
[what should happen]

Actual behavior:
[what actually happened]

Screenshots / logs:
[attach or paste relevant CloudWatch log lines, AppSync errors, Stripe webhook delivery details]

Involves payment / privacy / security / data access: yes | no
[if yes, treat as Critical regardless of UX impact]

Recommended fix:
[brief suggestion if known]

Owner: [name or team]

Status: open | in-progress | resolved | wont-fix
```

### Severity Definitions

| Severity | Definition |
|---|---|
| Critical | Data leak, payment issue, auth bypass, Pro bypass, platform unusable |
| High | Broken onboarding, broken AI chat, broken checkout, broken support, repeated errors |
| Medium | Confusing UX, incorrect messaging, non-blocking feature issue |
| Low | Copy errors, styling issues, minor polish |

Critical issues must be resolved before any beta expansion. High issues must be resolved or have a clear workaround before expansion.

---

## PHASE 7 — Analytics and Metrics Queries

The following metrics must be answerable at any point during beta. Sources are listed for each.

### Admin API (requires Admin Cognito group)

`GET /api/admin/metrics/overview` returns aggregate counts. Use this as the primary daily dashboard.

Key fields to check:
- `featureUsage.aiSessionsToday`
- `featureUsage.aiSessionsThisWeek`
- `conversion.checkoutsStartedThisWeek`
- `conversion.checkoutsCompletedThisWeek`
- `conversion.checkoutConversionRatePct`
- `conversion.upgradePromptsViewedThisWeek`
- `conversion.upgradePromptsClickedThisWeek`
- `conversion.freeLimitReachedThisWeek`
- `subscriptionHealth.paymentFailuresThisMonth`
- `subscriptionHealth.cancellationsThisMonth`

### DynamoDB Queries (if admin API is insufficient)

Run these via AWS Console → DynamoDB → PartiQL editor or via the AWS CLI.

**How many users signed up?**
```sql
SELECT COUNT(*) FROM "AnalyticsEvents" WHERE eventName = 'user_signed_up'
```

**How many completed onboarding?**
```sql
SELECT COUNT(*) FROM "AnalyticsEvents" WHERE eventName = 'onboarding_completed'
```

**How many created their first AI study session?**
```sql
SELECT COUNT(*) FROM "AnalyticsEvents"
WHERE eventName = 'ai_study_session_created'
AND metadata.isFirstSession = true
```

**How many returned the next day? (day-2 retention)**
```sql
SELECT COUNT(DISTINCT userId) FROM "AnalyticsEvents"
WHERE eventName = 'study_streak_continued'
```

**How many hit the Free limit?**
```sql
SELECT COUNT(*) FROM "AnalyticsEvents" WHERE eventName = 'free_limit_reached'
```

**How many saw upgrade prompts?**
```sql
SELECT COUNT(*) FROM "AnalyticsEvents" WHERE eventName = 'upgrade_prompt_viewed'
```

**How many clicked upgrade prompts?**
```sql
SELECT COUNT(*) FROM "AnalyticsEvents" WHERE eventName = 'upgrade_prompt_clicked'
```

**How many started checkout?**
```sql
SELECT COUNT(*) FROM "AnalyticsEvents" WHERE eventName = 'checkout_started'
```

**How many completed checkout?**
```sql
SELECT COUNT(*) FROM "AnalyticsEvents" WHERE eventName = 'checkout_completed'
```

**How many became Pro?**
```sql
SELECT COUNT(*) FROM "Subscriptions" WHERE isPro = true
```

**How many submitted feedback?**
```sql
SELECT COUNT(*) FROM "AnalyticsEvents" WHERE eventName = 'feedback_submitted'
```

**How many support tickets were created?**
```sql
SELECT COUNT(*) FROM "AnalyticsEvents" WHERE eventName = 'support_ticket_created'
```

**How many AI errors occurred?**
Check CloudWatch → Lambda → your AI/Bedrock function → Error metric.
Or query:
```sql
SELECT COUNT(*) FROM "AnalyticsEvents" WHERE eventName = 'ai_session_error'
```

**How many billing/webhook errors occurred?**
Check Stripe Dashboard → Developers → Webhooks → failed deliveries.
Check CloudWatch → Lambda → stripe-billing → Error metric.

---

## PHASE 8 — Beta Feedback Prompts

These are the in-app or operational feedback questions to use during beta. Deliver via in-app modal, email, or a simple form — do not build a new feature for this.

### After Onboarding
- "Was it clear what to do next?"
- "What are you studying for?"
- "What almost stopped you from continuing?"

### After First AI Study Session
- "Was this study session useful?"
- "What would make this answer better?"
- "Did you trust the response?"

### After Upgrade Prompt (for users who did not upgrade)
- "What made you decide not to upgrade today?"
  - Too expensive
  - Not enough value yet
  - I need to try more first
  - I don't understand what Pro includes
  - Payment issue
  - Other

### Beta Exit Survey (send after 72 hours or at offboarding)
- "What was the most useful part of StudAI?"
- "What was confusing?"
- "Would you use this again tomorrow?"
- "Would you pay for Pro?"
- "What feature would make this a must-have?"

---

## PHASE 9 — First 72-Hour Monitoring Plan

### Hours 0–24: Watch Everything

- Monitor every signup and login attempt.
- Watch onboarding completion in real time (check `onboarding_completed` events).
- Watch first AI study session creation (`ai_study_session_created` with `isFirstSession: true`).
- Monitor CloudWatch for Lambda errors, AppSync errors, Bedrock errors.
- Monitor AWS Cost Explorer for unexpected Bedrock or Lambda cost spikes.
- Read every feedback submission and support ticket as it arrives.
- Check Stripe Dashboard for webhook delivery status after any checkout attempt.

### Hours 24–48: Watch Retention and Conversion

- Check whether users return (day-2 retention via `study_streak_continued` or repeat session events).
- Watch whether users create additional AI sessions beyond the first.
- Watch Free limit reached events — are users hitting the wall?
- Watch upgrade prompt interactions — are users seeing and clicking upgrade prompts?
- Fix only Critical and High severity issues during this window. Do not ship Medium/Low fixes yet.

### Hours 48–72: Review and Decide

- Review activation metrics: what % of signups completed onboarding and created a session?
- Review retention signals: what % returned on day 2?
- Review conversion interest: how many saw upgrade prompts, clicked, started checkout?
- Make one of three decisions:
  1. Continue with the same 10–20 user group and gather more signal.
  2. Invite 10–30 more users if activation and retention look healthy and no critical issues remain.
  3. Pause and fix blockers if critical/high issues are unresolved or metrics are poor.

---

## PHASE 10 — Final Beta Launch Packet Summary

| Item | Location |
|---|---|
| Pre-launch readiness checklist | `CLOSED_BETA_RELEASE_CHECKLIST.md` |
| Daily monitoring checklist | Phase 3 above |
| Stop-the-beta criteria | Phase 5 above |
| Expansion criteria (10–20 → 50–100) | Phase 4 above |
| Beta issue template | Phase 6 above |
| Metrics to monitor | Phase 7 above |
| Feedback questions | Phase 8 above |
| First 72-hour monitoring plan | Phase 9 above |

### Recommendation for Inviting the First 10–20 Users

Invite users only after confirming:
1. All ✅ items in `CLOSED_BETA_RELEASE_CHECKLIST.md` are complete.
2. At least one internal test account has completed onboarding, created an AI session, and verified the Free limit.
3. At least one Stripe test-mode checkout has completed and Pro access was confirmed via webhook.
4. CloudWatch log groups are accessible and you can query DynamoDB AnalyticsEvents.
5. You have a way to receive feedback (email, form, or in-app) before inviting anyone.

Do not mark the beta as successful until real users have completed onboarding, created AI sessions, and at least one Stripe subscription path has been verified post-deployment.

---

*Last updated: 2026-04-27*
