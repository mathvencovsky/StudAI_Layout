import { defineFunction, secret } from "@aws-amplify/backend";

/**
 * Stripe Billing Lambda Function
 *
 * Exposes REST endpoints for Stripe Checkout, Customer Portal,
 * subscription status, and webhook handling.
 *
 * Environment variables required:
 * - STRIPE_SECRET_KEY        (Amplify secret)
 * - STRIPE_WEBHOOK_SECRET    (Amplify secret)
 * - STRIPE_PRICE_PRO_MONTHLY (Amplify secret)
 * - STRIPE_PRICE_PRO_ANNUAL  (Amplify secret)
 * - APP_URL                  (plain env var)
 * - SUBSCRIPTIONS_TABLE      (injected by backend.ts)
 * - STRIPE_EVENTS_TABLE      (injected by backend.ts)
 */
export const stripeBillingHandler = defineFunction({
  name: "stripe-billing",
  entry: "./handler.ts",
  environment: {
    STRIPE_SECRET_KEY: secret("STRIPE_SECRET_KEY"),
    STRIPE_WEBHOOK_SECRET: secret("STRIPE_WEBHOOK_SECRET"),
    STRIPE_PRICE_PRO_MONTHLY: secret("STRIPE_PRICE_PRO_MONTHLY"),
    STRIPE_PRICE_PRO_ANNUAL: secret("STRIPE_PRICE_PRO_ANNUAL"),
    APP_URL: process.env.APP_URL ?? (() => { throw new Error("APP_URL must be set — no localhost fallback permitted in deployed environments"); })(),
    // USER_USAGE_TABLE is injected by backend.ts after table creation
  },
  timeoutSeconds: 30,
  memoryMB: 256,
});
