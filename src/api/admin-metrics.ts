/**
 * Admin Metrics API — client-side calls to the billing Lambda admin endpoints.
 * Requires Admin Cognito group. Returns aggregate data only — no PII.
 */

import { fetchAuthSession } from "aws-amplify/auth";

const BILLING_API_URL =
  (import.meta.env.VITE_BILLING_API_URL as string | undefined) ?? "/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error("Not authenticated");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function adminFetch<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BILLING_API_URL}${path}`, { headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface AdminMetricsOverview {
  generatedAt: string;
  periods: { today: string; week: string; month: string };
  featureUsage: {
    aiSessionsToday: number;
    aiSessionsThisWeek: number;
  };
  conversion: {
    checkoutsStartedThisWeek: number;
    checkoutsCompletedThisWeek: number;
    checkoutConversionRatePct: number;
    upgradePromptsViewedThisWeek: number;
    upgradePromptsClickedThisWeek: number;
    upgradeClickThroughRatePct: number;
    freeLimitReachedThisWeek: number;
  };
  subscriptionHealth: {
    cancellationsThisMonth: number;
    paymentFailuresThisMonth: number;
  };
}

export async function getAdminMetricsOverview(): Promise<AdminMetricsOverview> {
  return adminFetch<AdminMetricsOverview>("/admin/metrics/overview");
}
