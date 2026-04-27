/**
 * Entitlements API — client-side calls to the billing Lambda.
 *
 * The entitlements endpoint is the single source of truth for what the
 * current user can and cannot do. Never trust client-side plan state alone.
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

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BILLING_API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(
      (body as { error?: { message?: string } | string }).error
        ? typeof (body as { error: { message?: string } | string }).error === "string"
          ? (body as { error: string }).error
          : ((body as { error: { message?: string } }).error.message ?? `HTTP ${res.status}`)
        : `HTTP ${res.status}`,
    ) as Error & { status: number; code?: string; body?: unknown };
    (err as Error & { status: number; code?: string; body?: unknown }).status = res.status;
    (err as Error & { status: number; code?: string; body?: unknown }).code =
      typeof (body as { error?: { code?: string } }).error === "object"
        ? (body as { error: { code?: string } }).error?.code
        : undefined;
    (err as Error & { status: number; code?: string; body?: unknown }).body = body;
    throw err;
  }

  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Plan = "free" | "pro";

export interface FeatureAccess {
  enabled: boolean;
  requiresPro?: boolean;
  limit?: number | null;
  period?: string | null;
  used?: number | null;
  remaining?: number | null;
  unlimited?: boolean;
  formats?: string[];
}

export interface Entitlements {
  plan: Plan;
  isPro: boolean;
  features: {
    aiStudySessions: FeatureAccess;
    basicFlashcards: FeatureAccess;
    basicQuizzes: FeatureAccess;
    advancedFlashcards: FeatureAccess;
    advancedQuizzes: FeatureAccess;
    learningTracks: FeatureAccess;
    personalizedLearningPlans: FeatureAccess;
    progressAnalytics: FeatureAccess;
    exportMaterials: FeatureAccess;
    fasterAiResponses: FeatureAccess;
    prioritySupport: FeatureAccess;
  };
}

export type FeatureKey = keyof Entitlements["features"];

export interface EntitlementError {
  code: string;
  message: string;
  feature: string;
  limit?: number;
  period?: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Fetch the current user's full entitlement state.
 * Includes plan, feature flags, limits, usage, and remaining quota.
 */
export async function getEntitlements(): Promise<Entitlements> {
  return apiFetch<Entitlements>("/me/entitlements");
}

/**
 * Notify the server that an AI study session is starting.
 * The server atomically increments the usage counter and enforces the limit.
 * Returns { allowed: true, usageCount } on success.
 * Throws with .code = "FREE_DAILY_LIMIT_REACHED" if the limit is hit.
 */
export async function startAiSession(): Promise<{ allowed: boolean; usageCount: number }> {
  return apiFetch<{ allowed: boolean; usageCount: number }>("/me/ai-session/start", {
    method: "POST",
  });
}

/**
 * Check whether the current user can access a specific feature.
 * Returns { allowed: true } or throws with an EntitlementError.
 */
export async function checkFeatureAccess(feature: FeatureKey): Promise<{ allowed: boolean; feature: string }> {
  return apiFetch<{ allowed: boolean; feature: string }>("/me/entitlements/check", {
    method: "POST",
    body: JSON.stringify({ feature }),
  });
}
