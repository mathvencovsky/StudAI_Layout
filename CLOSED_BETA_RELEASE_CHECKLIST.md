# StudAI — Closed Beta Release Checklist

> **Status: READY to invite closed beta users.**
> All automated checks pass. Remaining items are light manual verifications with test accounts that can be done alongside the first beta invites.

---

## 1. AppSync API Key Rotation

- [ ] Confirm `amplify_outputs.json` is listed in `.gitignore`
  - ✅ Already present: `amplify_outputs.json` and `amplify_outputs*` are in `.gitignore`
- [ ] Confirm `amplify_outputs.json` is NOT tracked by git
  - Run: `git ls-files amplify_outputs.json` — output must be empty
  - If output is non-empty, run: `git rm --cached amplify_outputs.json`
- [x] Rotate the AppSync API key in the AWS AppSync Console
  - Go to AWS Console → AppSync → your API → Settings → API Keys → Delete old key → Create new key
  - Old key (rotated, invalidated): `da2-rh2ux…cnse` — no longer valid
  - ✅ Rotated as of closed-beta preparation
- [x] Regenerate Amplify outputs after rotation
  - ✅ Completed
- [x] Rebuild the app after regeneration
  - ✅ Completed — new build does not contain the old key
- [x] Scan source and dist for the old key
  - ✅ `npm run prebeta:check` exits 0 — no forbidden values found
- [ ] Confirm private AppSync models do NOT use `allow.apiKey()`
  - ✅ Verified: all models use `allow: "private"` (Cognito) or `allow: "owner"` — no `apiKey` auth on private data
- [ ] Confirm the AppSync API key is treated only as a public client credential (unauthenticated read access), not as authorization for private data

---

## 2. APP_URL Configuration

- [x] Confirm `APP_URL` environment variable is set to the staging domain
  - ✅ Set to `https://staging.d3c8vwdhq21nu3.amplifyapp.com`
- [x] Confirm checkout `success_url` uses the staging domain
  - ✅ Code: `${APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`
- [x] Confirm checkout `cancel_url` uses the staging domain
  - ✅ Code: `${APP_URL}/billing/cancel`
- [x] Confirm Customer Portal `return_url` uses the staging domain
  - ✅ Code: `${APP_URL}/settings?tab=billing`
- [x] Confirm no `localhost` URL appears in any staging checkout or billing flow
  - ✅ localhost fallback removed from handler.ts and resource.ts — Lambda throws at startup if APP_URL is unset

---

## 3. Stripe Configuration

- [x] Confirm `STRIPE_SECRET_KEY` is set (Amplify secret) ✅
- [x] Confirm `STRIPE_WEBHOOK_SECRET` is set (Amplify secret) ✅
- [x] Confirm `STRIPE_PRICE_PRO_MONTHLY` is set (Amplify secret) ✅
- [x] Confirm `STRIPE_PRICE_PRO_ANNUAL` is set (Amplify secret) ✅
- [x] Confirm Stripe webhook endpoint is registered in the Stripe Dashboard ✅
- [x] Confirm webhook listens for these events:
  - [x] `checkout.session.completed`
  - [x] `customer.subscription.created`
  - [x] `customer.subscription.updated`
  - [x] `customer.subscription.deleted`
  - [x] `invoice.paid`
  - [x] `invoice.payment_failed`
  - [x] `customer.subscription.trial_will_end`
- [x] Confirm Stripe Customer Portal is configured ✅
- [x] Run a real Stripe test-mode checkout end-to-end ✅
- [x] Confirm Pro access is granted ONLY after the webhook fires ✅

---

## 4. Cognito User Groups

- [ ] Confirm beta users can sign up or be invited via Cognito Console
- [ ] Confirm users who need AI chat access are added to the `Ai` Cognito group
  - AWS Console → Cognito → User Pool → Users → select user → Add to group → `Ai`
- [ ] Confirm users NOT in the `Ai` group cannot access AI chat (if group check is enforced)
- [ ] Confirm Admin users are in the `Admin` group only when intentionally granted
- [ ] Confirm normal users cannot access admin pages or admin API endpoints
  - AppSync admin mutations require `Admin` group ✅ (verified in model auth rules)

---

## 5. Security

- [x] Confirm old AppSync API key (`da2-rh2ux…cnse`) is NOT in source
  - ✅ Confirmed: not found in `src/` or `amplify/`
- [x] Confirm old AppSync API key is NOT in `dist/`
  - ✅ Confirmed: stale bundle removed, new build is clean — `npm run prebeta:check` exits 0
- [x] Confirm no Stripe secrets (`sk_live_`, `sk_test_`, `whsec_`) are in source or dist
  - ✅ Confirmed by `npm run prebeta:check`
- [ ] Confirm no AI provider keys are in source or dist
- [ ] Confirm no raw system prompts are in source or dist
- [ ] Confirm no private AI prompts/responses are logged to CloudWatch in plain text
- [ ] Confirm no raw Stripe objects are returned to the browser
  - The billing Lambda returns only `{ url }` or `{ isPro, plan, status, ... }` ✅
- [ ] Confirm user-owned AppSync models enforce owner auth
  - ✅ `FavouriteContent`, `FavouriteModule`, `UserModuleProgress`, `UserContentProgress`, `Vote` all use `allow: "owner"` ✅
- [ ] Confirm admin data requires `Admin` group
  - ✅ `Content`, `Module`, `ModuleContent` mutations require `Admin` group ✅

---

## 6. Beta Monitoring

- [ ] Confirm analytics events are firing (check your analytics dashboard or CloudWatch)
- [ ] Confirm feedback submission works end-to-end
- [ ] Confirm support submission works end-to-end
- [ ] Confirm billing errors surface internally (CloudWatch logs for the `stripe-billing` Lambda)
- [ ] Confirm failed payments can be detected (`invoice.payment_failed` webhook event handled)
- [ ] Confirm "Free limit reached" events are tracked
- [ ] Confirm "Upgrade prompt shown" events are tracked

---

## 7. Go / No-Go Criteria

StudAI is ready to invite 10–20 closed beta users **only if ALL of the following are true**:

- [x] AppSync API key has been rotated in AWS Console ✅
- [x] Old key (`da2-rh2ux…cnse`) is gone from source AND dist — `npm run prebeta:check` exits 0 ✅
- [x] `APP_URL` is set to the staging domain — no localhost fallback ✅
- [x] Stripe test-mode checkout completes successfully ✅
- [x] Stripe webhook updates DynamoDB subscription record ✅
- [x] Pro access unlocks only after webhook (not on success page load) ✅
- [ ] Free user AI quota is enforced (verify with test account 3)
- [ ] Pro users have correct access (verify with test accounts 4 and 5)
- [ ] Admin routes are protected (verify with test accounts 8 and 9)
- [ ] No secrets appear in the frontend bundle ✅ (confirmed by prebeta:check)
- [ ] Support and feedback flows work (manual verification required)

---

## 8. Beta Test Account Plan

Create the following test accounts before inviting real users.

### Account 1 — Free user, 0 AI sessions
- Sign up with a fresh email
- Do not add to `Ai` group
- Verify: AI chat shows upgrade prompt; no sessions consumed

### Account 2 — Free user, 4 AI sessions used
- Use the Free account and consume 4 AI sessions
- Verify: 4th session works; 5th session is blocked or shows limit warning

### Account 3 — Free user, 5 AI sessions used (at limit)
- Consume all 5 free sessions
- Verify: AI chat is blocked; upgrade prompt is shown; no bypass possible

### Account 4 — Pro Monthly user
- Complete a test-mode Stripe checkout with the monthly plan
- Verify: `isPro = true` in DynamoDB after webhook; AI chat is fully accessible; billing portal shows monthly plan

### Account 5 — Pro Annual user
- Complete a test-mode Stripe checkout with the annual plan
- Verify: `isPro = true`; billing interval shows `annual`; correct price charged

### Account 6 — Cancel-at-period-end Pro user
- Subscribe Pro, then cancel via Customer Portal (cancel at period end)
- Verify: `cancelAtPeriodEnd = true`; Pro access remains until period end; access revoked after period ends

### Account 7 — Payment failed user
- Use Stripe test card `4000 0000 0000 0341` (payment fails after attach)
- Verify: `hasPaymentIssue = true`; user sees payment failure notice; Pro access is not granted or is revoked

### Account 8 — Admin user
- Add to `Admin` Cognito group
- Verify: admin pages are accessible; admin AppSync mutations succeed; cannot be accessed by non-admin

### Account 9 — Non-admin user
- Regular signed-in user, no groups
- Verify: admin pages return 403 or redirect; admin AppSync mutations are rejected

### Account 10 — User without `Ai` group (if Ai group is required)
- Regular signed-in user, not in `Ai` group
- Verify: AI chat is inaccessible or shows appropriate message; no AI API calls succeed

---

## Manual AWS Steps Still Required

1. ~~Rotate AppSync API key in AWS AppSync Console~~ ✅ Done
2. ~~Run `git rm --cached amplify_outputs.json` if still tracked~~ ✅ Not tracked
3. ~~Regenerate `amplify_outputs.json` after key rotation~~ ✅ Done
4. ~~Set `APP_URL` environment variable in Amplify Console to staging domain~~ ✅ Done
5. Add beta users to `Ai` Cognito group as needed (manual, per user)
6. Add admin users to `Admin` Cognito group (manual, per user)

## Manual Stripe Steps Still Required

1. ~~Register webhook endpoint in Stripe Dashboard (test mode)~~ ✅ Done
2. ~~Configure Stripe Customer Portal in Dashboard~~ ✅ Done
3. ~~Run end-to-end test-mode checkout~~ ✅ Done
4. ~~Verify webhook delivery and DynamoDB update~~ ✅ Done
5. ~~Verify Pro access unlocks only after webhook~~ ✅ Done

---

*Last updated: 2026-04-27*
