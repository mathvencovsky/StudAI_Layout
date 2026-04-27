# StudAI — Security Deployment Notes

## AppSync API Key

### What it is

The AppSync API key (`api_key` in `amplify_outputs.json`) is a **public client
credential**. It is intentionally included in the client-side JavaScript bundle
because the Amplify client library needs it to make unauthenticated or
pre-authentication requests (e.g., loading public content before sign-in).

**It is NOT a secret.** It does not grant access to private user data.

### Why private data is still protected

All private data models in `amplify/data/resource.ts` use owner-based or
group-based authorization:

- `allow.owner()` — only the record's owner (authenticated Cognito user) can
  read or write their own data. AppSync enforces this at the resolver level
  regardless of which auth mode was used to make the request.
- `allow.group("Admin")` — only users in the Admin Cognito group can access
  admin-only operations.
- `allow.authenticated()` — only authenticated users (valid Cognito JWT) can
  read shared catalog data.

The API key only grants access to operations explicitly configured with
`allow.apiKey()`. No such rule exists in this schema. Therefore, even if
someone uses the API key directly, they cannot read any user's private data.

### Required manual step before every deployment

The API key that was present in the git history (`da2-rh2ux…cnse` — rotated, do not use)
**must be rotated** before any public deployment:

1. Go to **AWS AppSync Console** → select the StudAI API → **Settings** →
   **API Keys**.
2. Delete the existing key.
3. Create a new key with an appropriate expiry (max 365 days).
4. Run `npx ampx generate outputs` (or `npx ampx sandbox` for local dev) to
   regenerate `amplify_outputs.json` with the new key.
5. Rebuild the frontend: `npm run build`.
6. Deploy the new build.

The old key will stop working as soon as it is deleted from the AppSync console.

### Why `amplify_outputs.json` is gitignored

`amplify_outputs.json` is generated at deploy time by the Amplify CLI. It
contains environment-specific values (API endpoints, User Pool IDs, API keys)
that change between environments (dev, staging, prod). Committing it would:

- Expose the API key in git history (even though it is a public credential,
  rotation becomes harder once it is in history).
- Cause merge conflicts between environments.
- Risk accidentally deploying dev credentials to production.

The file is excluded via `.gitignore`. CI/CD pipelines should generate it
during the build step using `npx ampx generate outputs`.

---

## JWT Verification in Chat Handler

The chat conversation Lambda (`amplify/data/chat/handler.ts`) verifies the
Cognito JWT signature using the JWKS endpoint before trusting any claims.

Required environment variables (injected by `amplify/backend.ts`):

| Variable | Description |
|---|---|
| `COGNITO_USER_POOL_ID` | Cognito User Pool ID (e.g. `us-east-1_nJ5zFKNVU`) |
| `COGNITO_REGION` | AWS region of the User Pool (e.g. `us-east-1`) |
| `USER_USAGE_TABLE` | DynamoDB table for AI session usage tracking |
| `SUBSCRIPTIONS_TABLE` | DynamoDB table for subscription status |

These are injected automatically by `amplify/backend.ts` at deploy time.

---

## Stripe Secrets

Stripe secrets are stored as **Amplify secrets** (AWS Secrets Manager), not
as environment variables or in source code:

```bash
npx ampx secret set STRIPE_SECRET_KEY
npx ampx secret set STRIPE_WEBHOOK_SECRET
npx ampx secret set STRIPE_PRICE_PRO_MONTHLY
npx ampx secret set STRIPE_PRICE_PRO_ANNUAL
```

They are never committed to git and never appear in the client bundle.

---

## Pre-Launch Checklist

- [ ] AppSync API key rotated (delete old, create new, rebuild)
- [ ] `amplify_outputs.json` removed from git tracking
- [ ] Stripe secrets set via `npx ampx secret set`
- [ ] `APP_URL` set to production domain
- [ ] `COGNITO_USER_POOL_ID` and `COGNITO_REGION` injected into chat handler
- [ ] Stripe webhook endpoint registered in Stripe Dashboard
- [ ] Production build tested end-to-end in Stripe test mode before going live
