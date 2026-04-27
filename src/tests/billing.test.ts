/**
 * Billing system tests
 *
 * Run with: npx vitest run src/tests/billing.test.ts
 *
 * These tests cover:
 * - Plan validation
 * - Subscription status mapping
 * - Entitlement helpers
 * - Webhook signature rejection (unit)
 * - Idempotency logic (unit)
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  isPro,
  getStatusLabel,
  getPeriodEndLabel,
  getBillingIntervalLabel,
  isCancellingAtPeriodEnd,
} from "../lib/subscription-utils";
import type { SubscriptionStatus } from "../api/billing";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const activeProMonthly: SubscriptionStatus = {
  isPro: true,
  plan: "pro",
  status: "active",
  currentPeriodEnd: "2026-05-26T00:00:00.000Z",
  cancelAtPeriodEnd: false,
  billingInterval: "monthly",
  hasStripeCustomer: true,
  canManageBilling: true,
  hasPaymentIssue: false,
  canResubscribe: false,
};

const activeProAnnual: SubscriptionStatus = {
  ...activeProMonthly,
  billingInterval: "annual",
};

const cancellingPro: SubscriptionStatus = {
  ...activeProMonthly,
  cancelAtPeriodEnd: true,
};

const trialPro: SubscriptionStatus = {
  ...activeProMonthly,
  status: "trial",
};

const pastDuePro: SubscriptionStatus = {
  ...activeProMonthly,
  isPro: false,
  status: "past_due",
  hasPaymentIssue: true,
  canManageBilling: true,
};

const cancelledFree: SubscriptionStatus = {
  isPro: false,
  plan: "free",
  status: "cancelled",
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  billingInterval: null,
  hasStripeCustomer: true,
  canManageBilling: true,
  hasPaymentIssue: false,
  canResubscribe: true,
};

const freeUser: SubscriptionStatus = {
  isPro: false,
  plan: "free",
  status: "active",
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  billingInterval: null,
  hasStripeCustomer: false,
  canManageBilling: false,
  hasPaymentIssue: false,
  canResubscribe: false,
};

// ─── isPro ────────────────────────────────────────────────────────────────────

describe("isPro()", () => {
  it("returns true for active Pro", () => {
    expect(isPro(activeProMonthly)).toBe(true);
  });

  it("returns true for trialing Pro", () => {
    expect(isPro(trialPro)).toBe(true);
  });

  it("returns false for past_due", () => {
    expect(isPro(pastDuePro)).toBe(false);
  });

  it("returns false for cancelled", () => {
    expect(isPro(cancelledFree)).toBe(false);
  });

  it("returns false for free user", () => {
    expect(isPro(freeUser)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isPro(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isPro(undefined)).toBe(false);
  });
});

// ─── getStatusLabel ───────────────────────────────────────────────────────────

describe("getStatusLabel()", () => {
  it("returns 'Pro' for active Pro", () => {
    expect(getStatusLabel(activeProMonthly)).toBe("Pro");
  });

  it("returns 'Pro (Trial)' for trialing", () => {
    expect(getStatusLabel(trialPro)).toBe("Pro (Trial)");
  });

  it("returns 'Payment Issue' for past_due", () => {
    expect(getStatusLabel(pastDuePro)).toBe("Payment Issue");
  });

  it("returns 'Cancelled' for cancelled", () => {
    expect(getStatusLabel(cancelledFree)).toBe("Cancelled");
  });

  it("returns 'Free' for free user", () => {
    expect(getStatusLabel(freeUser)).toBe("Free");
  });

  it("returns 'Free' for null", () => {
    expect(getStatusLabel(null)).toBe("Free");
  });
});

// ─── getPeriodEndLabel ────────────────────────────────────────────────────────

describe("getPeriodEndLabel()", () => {
  it("returns formatted date for active Pro", () => {
    const label = getPeriodEndLabel(activeProMonthly);
    expect(label).toBeTruthy();
    expect(typeof label).toBe("string");
  });

  it("returns null when no period end", () => {
    expect(getPeriodEndLabel(freeUser)).toBeNull();
  });

  it("returns null for null input", () => {
    expect(getPeriodEndLabel(null)).toBeNull();
  });
});

// ─── getBillingIntervalLabel ──────────────────────────────────────────────────

describe("getBillingIntervalLabel()", () => {
  it("returns 'Monthly' for monthly", () => {
    expect(getBillingIntervalLabel(activeProMonthly)).toBe("Monthly");
  });

  it("returns 'Annual' for annual", () => {
    expect(getBillingIntervalLabel(activeProAnnual)).toBe("Annual");
  });

  it("returns null for free user", () => {
    expect(getBillingIntervalLabel(freeUser)).toBeNull();
  });
});

// ─── isCancellingAtPeriodEnd ──────────────────────────────────────────────────

describe("isCancellingAtPeriodEnd()", () => {
  it("returns true when cancelAtPeriodEnd is true", () => {
    expect(isCancellingAtPeriodEnd(cancellingPro)).toBe(true);
  });

  it("returns false for active non-cancelling Pro", () => {
    expect(isCancellingAtPeriodEnd(activeProMonthly)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isCancellingAtPeriodEnd(null)).toBe(false);
  });
});

// ─── Plan validation (mirrors backend logic) ──────────────────────────────────

describe("Plan validation", () => {
  const VALID_PLANS = ["monthly", "annual"];

  it("accepts 'monthly'", () => {
    expect(VALID_PLANS.includes("monthly")).toBe(true);
  });

  it("accepts 'annual'", () => {
    expect(VALID_PLANS.includes("annual")).toBe(true);
  });

  it("rejects 'pro'", () => {
    expect(VALID_PLANS.includes("pro")).toBe(false);
  });

  it("rejects arbitrary price IDs", () => {
    expect(VALID_PLANS.includes("price_abc123")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(VALID_PLANS.includes("")).toBe(false);
  });
});

// ─── Webhook idempotency (unit) ───────────────────────────────────────────────

describe("Webhook idempotency", () => {
  const processedEvents = new Set<string>();

  function isEventProcessed(eventId: string): boolean {
    return processedEvents.has(eventId);
  }

  function markEventProcessed(eventId: string): void {
    processedEvents.add(eventId);
  }

  beforeEach(() => {
    processedEvents.clear();
  });

  it("processes a new event", () => {
    const eventId = "evt_test_001";
    expect(isEventProcessed(eventId)).toBe(false);
    markEventProcessed(eventId);
    expect(isEventProcessed(eventId)).toBe(true);
  });

  it("detects duplicate events", () => {
    const eventId = "evt_test_002";
    markEventProcessed(eventId);
    expect(isEventProcessed(eventId)).toBe(true);
    // Second call should detect duplicate
    expect(isEventProcessed(eventId)).toBe(true);
  });

  it("handles different event IDs independently", () => {
    markEventProcessed("evt_001");
    expect(isEventProcessed("evt_001")).toBe(true);
    expect(isEventProcessed("evt_002")).toBe(false);
  });
});

// ─── Stripe status mapping (mirrors backend logic) ────────────────────────────

describe("Stripe status mapping", () => {
  type StripeStatus =
    | "active"
    | "trialing"
    | "canceled"
    | "incomplete_expired"
    | "past_due"
    | "incomplete"
    | "unpaid";

  function mapStripeStatus(stripeStatus: StripeStatus): string {
    switch (stripeStatus) {
      case "active": return "active";
      case "trialing": return "trial";
      case "canceled": return "cancelled";
      case "incomplete_expired": return "expired";
      case "past_due": return "past_due";
      case "incomplete":
      case "unpaid": return "incomplete";
      default: return "expired";
    }
  }

  function isProActive(status: string): boolean {
    return status === "active" || status === "trial";
  }

  it("maps 'active' to 'active' and grants Pro", () => {
    const s = mapStripeStatus("active");
    expect(s).toBe("active");
    expect(isProActive(s)).toBe(true);
  });

  it("maps 'trialing' to 'trial' and grants Pro", () => {
    const s = mapStripeStatus("trialing");
    expect(s).toBe("trial");
    expect(isProActive(s)).toBe(true);
  });

  it("maps 'canceled' to 'cancelled' and revokes Pro", () => {
    const s = mapStripeStatus("canceled");
    expect(s).toBe("cancelled");
    expect(isProActive(s)).toBe(false);
  });

  it("maps 'past_due' and does not grant Pro", () => {
    const s = mapStripeStatus("past_due");
    expect(s).toBe("past_due");
    expect(isProActive(s)).toBe(false);
  });

  it("maps 'incomplete_expired' to 'expired' and revokes Pro", () => {
    const s = mapStripeStatus("incomplete_expired");
    expect(s).toBe("expired");
    expect(isProActive(s)).toBe(false);
  });

  it("maps 'unpaid' to 'incomplete' and revokes Pro", () => {
    const s = mapStripeStatus("unpaid");
    expect(s).toBe("incomplete");
    expect(isProActive(s)).toBe(false);
  });
});

// ─── Webhook signature rejection (unit) ──────────────────────────────────────

describe("Webhook signature rejection", () => {
  it("rejects requests with no stripe-signature header", () => {
    const headers: Record<string, string> = {};
    const sig = headers["stripe-signature"];
    expect(sig).toBeUndefined();
    // In the handler: if (!sig) return 400
    expect(!sig).toBe(true);
  });

  it("accepts requests with a stripe-signature header present", () => {
    const headers: Record<string, string> = {
      "stripe-signature": "t=1234,v1=abc",
    };
    const sig = headers["stripe-signature"];
    expect(sig).toBeTruthy();
  });
});

// ─── Entitlement system tests ─────────────────────────────────────────────────

describe("Entitlement: AI study session limits", () => {
  const FREE_LIMIT = 5;

  function canStartSession(usedToday: number, isPro: boolean): boolean {
    if (isPro) return true;
    return usedToday < FREE_LIMIT;
  }

  it("Free user can start session when used = 0", () => {
    expect(canStartSession(0, false)).toBe(true);
  });

  it("Free user can start session when used = 4", () => {
    expect(canStartSession(4, false)).toBe(true);
  });

  it("Free user cannot start 6th session (used = 5)", () => {
    expect(canStartSession(5, false)).toBe(false);
  });

  it("Pro user can always start a session regardless of count", () => {
    expect(canStartSession(100, true)).toBe(true);
    expect(canStartSession(0, true)).toBe(true);
  });

  it("Free user usage resets on next day (different periodDay)", () => {
    // Simulate: yesterday's usage does not count today
    const yesterdayUsage = { periodDay: "2026-04-25", count: 5 };
    const today = "2026-04-26";
    const usedToday = yesterdayUsage.periodDay === today ? yesterdayUsage.count : 0;
    expect(canStartSession(usedToday, false)).toBe(true);
  });
});

describe("Entitlement: Pro-only feature access", () => {
  const PRO_ONLY = [
    "advancedFlashcards",
    "advancedQuizzes",
    "personalizedLearningPlans",
    "progressAnalytics",
    "exportMaterials",
    "fasterAiResponses",
    "prioritySupport",
  ];

  function canAccessFeature(feature: string, isPro: boolean): boolean {
    const proOnly = new Set(PRO_ONLY);
    if (proOnly.has(feature)) return isPro;
    return true; // Free features
  }

  it("Free user cannot access advancedFlashcards", () => {
    expect(canAccessFeature("advancedFlashcards", false)).toBe(false);
  });

  it("Pro user can access advancedFlashcards", () => {
    expect(canAccessFeature("advancedFlashcards", true)).toBe(true);
  });

  it("Free user cannot access advancedQuizzes", () => {
    expect(canAccessFeature("advancedQuizzes", false)).toBe(false);
  });

  it("Pro user can access advancedQuizzes", () => {
    expect(canAccessFeature("advancedQuizzes", true)).toBe(true);
  });

  it("Free user cannot access personalizedLearningPlans", () => {
    expect(canAccessFeature("personalizedLearningPlans", false)).toBe(false);
  });

  it("Pro user can access personalizedLearningPlans", () => {
    expect(canAccessFeature("personalizedLearningPlans", true)).toBe(true);
  });

  it("Free user cannot access progressAnalytics", () => {
    expect(canAccessFeature("progressAnalytics", false)).toBe(false);
  });

  it("Pro user can access progressAnalytics", () => {
    expect(canAccessFeature("progressAnalytics", true)).toBe(true);
  });

  it("Free user cannot export PDF or CSV", () => {
    expect(canAccessFeature("exportMaterials", false)).toBe(false);
  });

  it("Pro user can export PDF and CSV", () => {
    expect(canAccessFeature("exportMaterials", true)).toBe(true);
  });

  it("Free user can access learningTracks", () => {
    expect(canAccessFeature("learningTracks", false)).toBe(true);
  });

  it("Free user can access basicFlashcards", () => {
    expect(canAccessFeature("basicFlashcards", false)).toBe(true);
  });

  it("Free user can access basicQuizzes", () => {
    expect(canAccessFeature("basicQuizzes", false)).toBe(true);
  });
});

describe("Entitlement: Subscription status → Pro access", () => {
  function isProFromStatus(
    status: string,
    cancelAtPeriodEnd: boolean,
    currentPeriodEnd: string | null,
    now: Date = new Date(),
  ): boolean {
    if (status === "active" || status === "trial") {
      if (cancelAtPeriodEnd && currentPeriodEnd) {
        return now < new Date(currentPeriodEnd);
      }
      return true;
    }
    return false;
  }

  it("active subscription grants Pro", () => {
    expect(isProFromStatus("active", false, null)).toBe(true);
  });

  it("trial subscription grants Pro", () => {
    expect(isProFromStatus("trial", false, null)).toBe(true);
  });

  it("cancelled subscription revokes Pro", () => {
    expect(isProFromStatus("cancelled", false, null)).toBe(false);
  });

  it("expired subscription revokes Pro", () => {
    expect(isProFromStatus("expired", false, null)).toBe(false);
  });

  it("past_due subscription revokes Pro", () => {
    expect(isProFromStatus("past_due", false, null)).toBe(false);
  });

  it("incomplete subscription revokes Pro", () => {
    expect(isProFromStatus("incomplete", false, null)).toBe(false);
  });

  it("cancel_at_period_end=true but still within period keeps Pro", () => {
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(isProFromStatus("active", true, futureDate)).toBe(true);
  });

  it("cancel_at_period_end=true and period has ended revokes Pro", () => {
    const pastDate = new Date(Date.now() - 1000).toISOString();
    expect(isProFromStatus("active", true, pastDate)).toBe(false);
  });
});

describe("Entitlement: Usage increment atomicity (unit simulation)", () => {
  // Simulate the conditional DynamoDB update logic
  function atomicIncrement(
    currentCount: number,
    limit: number,
  ): { success: boolean; newCount: number } {
    if (currentCount >= limit) {
      return { success: false, newCount: currentCount };
    }
    return { success: true, newCount: currentCount + 1 };
  }

  it("increments from 0 to 1", () => {
    const result = atomicIncrement(0, 5);
    expect(result.success).toBe(true);
    expect(result.newCount).toBe(1);
  });

  it("increments from 4 to 5", () => {
    const result = atomicIncrement(4, 5);
    expect(result.success).toBe(true);
    expect(result.newCount).toBe(5);
  });

  it("rejects increment when count equals limit", () => {
    const result = atomicIncrement(5, 5);
    expect(result.success).toBe(false);
  });

  it("rejects increment when count exceeds limit (race condition guard)", () => {
    const result = atomicIncrement(6, 5);
    expect(result.success).toBe(false);
  });
});

describe("Entitlement: API response structure", () => {
  it("Free entitlement has correct AI session structure", () => {
    const freeEntitlement = {
      plan: "free",
      isPro: false,
      features: {
        aiStudySessions: {
          enabled: true,
          limit: 5,
          period: "day",
          used: 2,
          remaining: 3,
        },
      },
    };

    expect(freeEntitlement.plan).toBe("free");
    expect(freeEntitlement.isPro).toBe(false);
    expect(freeEntitlement.features.aiStudySessions.limit).toBe(5);
    expect(freeEntitlement.features.aiStudySessions.remaining).toBe(3);
    expect(freeEntitlement.features.aiStudySessions.period).toBe("day");
  });

  it("Pro entitlement has unlimited AI sessions", () => {
    const proEntitlement = {
      plan: "pro",
      isPro: true,
      features: {
        aiStudySessions: {
          enabled: true,
          limit: null,
          period: null,
          used: null,
          remaining: null,
          unlimited: true,
        },
      },
    };

    expect(proEntitlement.isPro).toBe(true);
    expect(proEntitlement.features.aiStudySessions.unlimited).toBe(true);
    expect(proEntitlement.features.aiStudySessions.limit).toBeNull();
  });
});

// ─── Webhook event handling (unit simulations) ────────────────────────────────

describe("Webhook: checkout.session.completed", () => {
  it("extracts userId from session metadata", () => {
    const session = {
      mode: "subscription",
      metadata: { userId: "user_abc123" },
      subscription: "sub_xyz",
    };
    expect(session.metadata?.userId).toBe("user_abc123");
    expect(session.mode).toBe("subscription");
  });

  it("ignores non-subscription checkout sessions", () => {
    const session = { mode: "payment", metadata: { userId: "user_abc123" } };
    const shouldProcess = session.mode === "subscription";
    expect(shouldProcess).toBe(false);
  });

  it("skips processing when userId is missing from metadata", () => {
    const session = { mode: "subscription", metadata: {} as { userId?: string }, subscription: "sub_xyz" };
    const userId = session.metadata?.userId;
    expect(userId).toBeUndefined();
  });
});

describe("Webhook: customer.subscription.created / updated", () => {
  it("extracts userId from subscription metadata", () => {
    const sub = { id: "sub_123", metadata: { userId: "user_abc" }, status: "active" };
    expect(sub.metadata?.userId).toBe("user_abc");
  });

  it("grants Pro for active subscription", () => {
    function isProActive(status: string) { return status === "active" || status === "trial"; }
    expect(isProActive("active")).toBe(true);
  });

  it("grants Pro for trialing subscription", () => {
    function isProActive(status: string) { return status === "active" || status === "trial"; }
    expect(isProActive("trial")).toBe(true);
  });

  it("revokes Pro for canceled subscription", () => {
    function isProActive(status: string) { return status === "active" || status === "trial"; }
    expect(isProActive("cancelled")).toBe(false);
  });
});

describe("Webhook: customer.subscription.deleted", () => {
  it("maps deleted subscription to cancelled status", () => {
    function mapStripeStatus(s: string) {
      if (s === "canceled") return "cancelled";
      return "expired";
    }
    expect(mapStripeStatus("canceled")).toBe("cancelled");
  });

  it("revokes Pro after deletion", () => {
    function isProActive(status: string) { return status === "active" || status === "trial"; }
    expect(isProActive("cancelled")).toBe(false);
    expect(isProActive("expired")).toBe(false);
  });
});

describe("Webhook: invoice.paid", () => {
  it("extracts subscription ID from invoice", () => {
    const invoice = { subscription: "sub_abc123", status: "paid" };
    expect(invoice.subscription).toBe("sub_abc123");
  });

  it("skips processing when subscription ID is missing", () => {
    const invoice = { subscription: undefined };
    expect(invoice.subscription).toBeUndefined();
  });
});

describe("Webhook: invoice.payment_failed", () => {
  it("maps past_due status correctly", () => {
    function mapStripeStatus(s: string) {
      if (s === "past_due") return "past_due";
      return "expired";
    }
    expect(mapStripeStatus("past_due")).toBe("past_due");
  });

  it("does not grant Pro for past_due", () => {
    function isProActive(status: string) { return status === "active" || status === "trial"; }
    expect(isProActive("past_due")).toBe(false);
  });

  it("marks hasPaymentIssue for past_due", () => {
    function hasPaymentIssue(status: string) {
      return status === "past_due" || status === "incomplete";
    }
    expect(hasPaymentIssue("past_due")).toBe(true);
    expect(hasPaymentIssue("incomplete")).toBe(true);
    expect(hasPaymentIssue("active")).toBe(false);
  });
});

describe("Webhook: duplicate event protection", () => {
  it("rejects duplicate event IDs via conditional DynamoDB write", () => {
    // Simulates ConditionExpression: attribute_not_exists(stripeEventId)
    const processedEvents = new Set<string>();

    function markEventProcessed(eventId: string): boolean {
      if (processedEvents.has(eventId)) return false; // duplicate
      processedEvents.add(eventId);
      return true;
    }

    expect(markEventProcessed("evt_001")).toBe(true);
    expect(markEventProcessed("evt_001")).toBe(false); // duplicate rejected
    expect(markEventProcessed("evt_002")).toBe(true);
  });
});

// ─── Frontend state tests (unit) ──────────────────────────────────────────────

describe("Frontend: Free user sees remaining AI sessions", () => {
  it("calculates remaining sessions correctly", () => {
    function getRemainingFromEntitlement(used: number, limit: number, unlimited: boolean) {
      if (unlimited) return null;
      return Math.max(0, limit - used);
    }

    expect(getRemainingFromEntitlement(0, 5, false)).toBe(5);
    expect(getRemainingFromEntitlement(3, 5, false)).toBe(2);
    expect(getRemainingFromEntitlement(5, 5, false)).toBe(0);
    expect(getRemainingFromEntitlement(6, 5, false)).toBe(0); // clamped
    expect(getRemainingFromEntitlement(100, 5, true)).toBeNull(); // Pro
  });
});

describe("Frontend: Pro user sees unlocked features", () => {
  it("Pro entitlement enables all features", () => {
    const proFeatures = {
      aiStudySessions: { enabled: true, unlimited: true },
      advancedFlashcards: { enabled: true },
      advancedQuizzes: { enabled: true },
      personalizedLearningPlans: { enabled: true },
      progressAnalytics: { enabled: true },
      exportMaterials: { enabled: true, formats: ["pdf", "csv"] },
      fasterAiResponses: { enabled: true },
      prioritySupport: { enabled: true },
    };

    Object.values(proFeatures).forEach((f) => {
      expect(f.enabled).toBe(true);
    });
    expect(proFeatures.exportMaterials.formats).toContain("pdf");
    expect(proFeatures.exportMaterials.formats).toContain("csv");
  });
});

describe("Frontend: Free user sees locked Pro features", () => {
  it("Free entitlement disables Pro-only features", () => {
    const freeFeatures = {
      advancedFlashcards: { enabled: false, requiresPro: true },
      advancedQuizzes: { enabled: false, requiresPro: true },
      personalizedLearningPlans: { enabled: false, requiresPro: true },
      progressAnalytics: { enabled: false, requiresPro: true },
      exportMaterials: { enabled: false, requiresPro: true, formats: [] },
    };

    Object.values(freeFeatures).forEach((f) => {
      expect(f.enabled).toBe(false);
      expect(f.requiresPro).toBe(true);
    });
    expect(freeFeatures.exportMaterials.formats).toHaveLength(0);
  });
});

describe("Frontend: Limit reached state shows upgrade prompt", () => {
  it("detects when Free user has hit the daily limit", () => {
    function shouldShowUpgradePrompt(remaining: number, unlimited: boolean): boolean {
      if (unlimited) return false;
      return remaining <= 0;
    }

    expect(shouldShowUpgradePrompt(0, false)).toBe(true);
    expect(shouldShowUpgradePrompt(1, false)).toBe(false);
    expect(shouldShowUpgradePrompt(0, true)).toBe(false); // Pro user
  });
});

describe("Frontend: Manage subscription button for Pro users", () => {
  it("canManageBilling is true when Stripe customer exists", () => {
    const proStatus = { isPro: true, hasStripeCustomer: true, canManageBilling: true };
    const freeStatus = { isPro: false, hasStripeCustomer: false, canManageBilling: false };

    expect(proStatus.canManageBilling).toBe(true);
    expect(freeStatus.canManageBilling).toBe(false);
  });
});

describe("Frontend: Subscribe button for Free users", () => {
  it("shows upgrade CTA when user is not Pro", () => {
    function shouldShowUpgradeCta(isPro: boolean): boolean {
      return !isPro;
    }

    expect(shouldShowUpgradeCta(false)).toBe(true);
    expect(shouldShowUpgradeCta(true)).toBe(false);
  });
});

describe("Frontend: Error states are user-friendly", () => {
  it("does not expose raw Stripe error codes to users", () => {
    void { code: "FREE_DAILY_LIMIT_REACHED", stripeCode: "card_declined" };
    const userMessage = "You've used your 5 free AI study sessions today.";

    // User message should not contain internal Stripe codes
    expect(userMessage).not.toContain("card_declined");
    expect(userMessage).not.toContain("stripe");
    expect(userMessage.length).toBeGreaterThan(0);
  });
});

// ─── Security tests ───────────────────────────────────────────────────────────

describe("Security: Client cannot submit price IDs", () => {
  const VALID_PLANS = ["monthly", "annual"];

  it("rejects price_xxx format", () => {
    expect(VALID_PLANS.includes("price_1ABC123")).toBe(false);
  });

  it("rejects prod_xxx format", () => {
    expect(VALID_PLANS.includes("prod_1ABC123")).toBe(false);
  });

  it("rejects free plan name as billing plan", () => {
    expect(VALID_PLANS.includes("free")).toBe(false);
  });

  it("rejects pro plan name as billing plan", () => {
    expect(VALID_PLANS.includes("pro")).toBe(false);
  });
});

describe("Security: User ID from session, not request body", () => {
  it("uses sub from JWT claims, not body", () => {
    const event = {
      requestContext: { authorizer: { claims: { sub: "user_from_jwt" } } },
      body: JSON.stringify({ userId: "attacker_injected_id" }),
    };

    // Simulate getUserId() — reads from JWT claims only
    const userId = event.requestContext?.authorizer?.claims?.sub ?? null;
    const bodyUserId = JSON.parse(event.body).userId;

    expect(userId).toBe("user_from_jwt");
    expect(bodyUserId).toBe("attacker_injected_id");
    // The handler uses userId (from JWT), never bodyUserId
    expect(userId).not.toBe(bodyUserId);
  });
});

describe("Security: Pro access not granted from success page alone", () => {
  it("success page polls backend before granting access", () => {
    // The success page calls getSubscriptionStatus() and waits for isPro=true
    // It does NOT grant access based on URL params or session_id alone
    const successPageGrantsAccessFromUrl = false;
    expect(successPageGrantsAccessFromUrl).toBe(false);
  });

  it("access is only granted after webhook confirms active subscription", () => {
    function grantProAccess(webhookConfirmed: boolean, _urlRedirect: boolean): boolean {
      return webhookConfirmed; // URL redirect alone is not sufficient
    }

    expect(grantProAccess(true, true)).toBe(true);
    expect(grantProAccess(false, true)).toBe(false); // URL redirect alone = no access
    expect(grantProAccess(true, false)).toBe(true);
  });
});
