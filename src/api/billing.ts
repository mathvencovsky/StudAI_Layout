/**
 * Billing API — client-side calls to the Stripe billing Lambda.
 *
 * The base URL is read from VITE_BILLING_API_URL (set in .env).
 * Falls back to a relative path for local dev with a proxy.
 */

import { fetchAuthSession } from "aws-amplify/auth";

const BILLING_API_URL =
  (import.meta.env.VITE_BILLING_API_URL as string | undefined) ?? "/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error("Not authenticated");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function billingFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BILLING_API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `HTTP ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type BillingPlan = "monthly" | "annual";

export interface SubscriptionStatus {
  isPro: boolean;
  plan: "free" | "pro";
  status:
    | "active"
    | "cancelled"
    | "expired"
    | "trial"
    | "past_due"
    | "incomplete";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  billingInterval: "monthly" | "annual" | null;
  hasStripeCustomer: boolean;
  canManageBilling: boolean;
  hasPaymentIssue: boolean;
  canResubscribe: boolean;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Create a Stripe Checkout Session and return the redirect URL.
 * Never passes price IDs from the client — only the plan name.
 */
export async function createCheckoutSession(
  plan: BillingPlan,
  email?: string,
): Promise<string> {
  const data = await billingFetch<{ url: string }>(
    "/billing/create-checkout-session",
    {
      method: "POST",
      body: JSON.stringify({ plan, email }),
    },
  );
  return data.url;
}

/**
 * Create a Stripe Customer Portal session and return the redirect URL.
 */
export async function createPortalSession(): Promise<string> {
  const data = await billingFetch<{ url: string }>(
    "/billing/create-portal-session",
    { method: "POST" },
  );
  return data.url;
}

/**
 * Fetch the current user's subscription status from the local DB.
 * Does NOT call Stripe on every request.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  return billingFetch<SubscriptionStatus>("/billing/subscription", {
    method: "GET",
  });
}
