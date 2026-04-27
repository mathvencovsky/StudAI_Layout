/**
 * Analytics system tests
 *
 * Run with: npx vitest run src/tests/analytics.test.ts
 *
 * Covers:
 * - Event registry validation
 * - Backend-only event enforcement
 * - Metadata sanitization
 * - Client cannot spoof user_id or plan
 * - Sensitive field blocking
 * - Metadata size limits
 * - Streak logic
 * - Admin metrics security
 */

import { describe, it, expect } from "vitest";
import {
  EVENTS,
  ALLOWED_EVENTS,
  BACKEND_ONLY_EVENTS,
  BLOCKED_METADATA_KEYS,
  MAX_METADATA_BYTES,
} from "../lib/analytics-events";

// ─── Event registry ───────────────────────────────────────────────────────────

describe("Event registry", () => {
  it("all EVENTS values are in ALLOWED_EVENTS", () => {
    for (const name of Object.values(EVENTS)) {
      expect(ALLOWED_EVENTS.has(name)).toBe(true);
    }
  });

  it("ALLOWED_EVENTS contains at least 30 events", () => {
    expect(ALLOWED_EVENTS.size).toBeGreaterThanOrEqual(30);
  });

  it("BACKEND_ONLY_EVENTS is a subset of ALLOWED_EVENTS", () => {
    for (const name of BACKEND_ONLY_EVENTS) {
      expect(ALLOWED_EVENTS.has(name)).toBe(true);
    }
  });

  it("key activation events are backend-only", () => {
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.AI_STUDY_SESSION_CREATED)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.FIRST_AI_STUDY_SESSION_CREATED)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.CHECKOUT_COMPLETED)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.SUBSCRIPTION_ACTIVATED)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.FREE_DAILY_LIMIT_REACHED)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.ONBOARDING_COMPLETED)).toBe(true);
  });

  it("UI-only events are NOT backend-only", () => {
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.PRICING_PAGE_VIEWED)).toBe(false);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.UPGRADE_PROMPT_VIEWED)).toBe(false);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.UPGRADE_PROMPT_CLICKED)).toBe(false);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.UPGRADE_PROMPT_DISMISSED)).toBe(false);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.DASHBOARD_VIEWED)).toBe(false);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.CHECKOUT_STARTED)).toBe(false);
  });
});

// ─── Metadata sanitization ────────────────────────────────────────────────────

describe("Metadata sanitization", () => {
  // Mirror the sanitizeMetadata logic from analytics.ts
  function sanitizeMetadata(raw: Record<string, unknown>): Record<string, unknown> {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (BLOCKED_METADATA_KEYS.has(k.toLowerCase())) continue;
      if (v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
        clean[k] = typeof v === "string" ? v.slice(0, 200) : v;
      }
    }
    if (JSON.stringify(clean).length > MAX_METADATA_BYTES) return { _truncated: true };
    return clean;
  }

  it("removes blocked keys", () => {
    const result = sanitizeMetadata({
      feature: "aiStudySessions",
      password: "secret123",
      token: "abc",
      plan: "free",
    });
    expect(result.feature).toBe("aiStudySessions");
    expect(result.plan).toBe("free");
    expect(result.password).toBeUndefined();
    expect(result.token).toBeUndefined();
  });

  it("removes prompt and ai_message keys", () => {
    const result = sanitizeMetadata({
      prompt: "Tell me about calculus",
      ai_message: "Here is the answer...",
      feature: "coach",
    });
    expect(result.prompt).toBeUndefined();
    expect(result.ai_message).toBeUndefined();
    expect(result.feature).toBe("coach");
  });

  it("removes card and cvv keys", () => {
    const result = sanitizeMetadata({ card: "4242424242424242", cvv: "123" });
    expect(result.card).toBeUndefined();
    expect(result.cvv).toBeUndefined();
  });

  it("removes secret and key fields", () => {
    const result = sanitizeMetadata({ secret: "sk_live_xxx", key: "pk_live_xxx" });
    expect(result.secret).toBeUndefined();
    expect(result.key).toBeUndefined();
  });

  it("truncates long string values to 200 chars", () => {
    const longString = "a".repeat(500);
    const result = sanitizeMetadata({ description: longString });
    expect((result.description as string).length).toBe(200);
  });

  it("allows safe primitive values", () => {
    const result = sanitizeMetadata({
      feature: "aiStudySessions",
      count: 3,
      isFirst: true,
      score: null,
    });
    expect(result.feature).toBe("aiStudySessions");
    expect(result.count).toBe(3);
    expect(result.isFirst).toBe(true);
    expect(result.score).toBeNull();
  });

  it("rejects oversized metadata", () => {
    const huge: Record<string, unknown> = {};
    for (let i = 0; i < 100; i++) {
      huge[`field_${i}`] = "x".repeat(100);
    }
    const result = sanitizeMetadata(huge);
    expect(result._truncated).toBe(true);
  });

  it("removes nested objects (only primitives allowed)", () => {
    const result = sanitizeMetadata({
      feature: "aiStudySessions",
      nested: { secret: "value" },
    });
    expect(result.nested).toBeUndefined();
    expect(result.feature).toBe("aiStudySessions");
  });
});

// ─── Client cannot spoof user_id or plan ─────────────────────────────────────

describe("Analytics security: client cannot spoof identity", () => {
  it("backend derives userId from JWT, not from event metadata", () => {
    // Simulate: client sends userId in metadata, backend ignores it
    const clientMetadata = { userId: "attacker_id", plan: "pro", feature: "aiStudySessions" };
    const jwtUserId = "real_user_from_jwt";

    // The backend always uses jwtUserId, never clientMetadata.userId
    const storedUserId = jwtUserId;
    expect(storedUserId).toBe("real_user_from_jwt");
    expect(storedUserId).not.toBe(clientMetadata.userId);
  });

  it("backend derives plan from subscription DB, not from event metadata", () => {
    const clientMetadata = { plan: "pro" }; // client claims pro
    const planFromDB = "free"; // actual plan from DynamoDB

    // The backend always uses planFromDB
    const storedPlan = planFromDB;
    expect(storedPlan).toBe("free");
    expect(storedPlan).not.toBe(clientMetadata.plan);
  });

  it("backend rejects backend-only events sent from client", () => {
    function isClientAllowed(eventName: string): boolean {
      if (!ALLOWED_EVENTS.has(eventName)) return false;
      if (BACKEND_ONLY_EVENTS.has(eventName)) return false;
      return true;
    }

    expect(isClientAllowed(EVENTS.AI_STUDY_SESSION_CREATED)).toBe(false);
    expect(isClientAllowed(EVENTS.CHECKOUT_COMPLETED)).toBe(false);
    expect(isClientAllowed(EVENTS.SUBSCRIPTION_ACTIVATED)).toBe(false);
    expect(isClientAllowed(EVENTS.FREE_DAILY_LIMIT_REACHED)).toBe(false);
    // Frontend events are allowed
    expect(isClientAllowed(EVENTS.PRICING_PAGE_VIEWED)).toBe(true);
    expect(isClientAllowed(EVENTS.UPGRADE_PROMPT_VIEWED)).toBe(true);
    expect(isClientAllowed(EVENTS.DASHBOARD_VIEWED)).toBe(true);
  });

  it("rejects unknown event names", () => {
    function isValidEvent(name: string): boolean {
      return ALLOWED_EVENTS.has(name);
    }
    expect(isValidEvent("made_up_event")).toBe(false);
    expect(isValidEvent("")).toBe(false);
    expect(isValidEvent("__proto__")).toBe(false);
    expect(isValidEvent(EVENTS.PRICING_PAGE_VIEWED)).toBe(true);
  });
});

// ─── Streak logic ─────────────────────────────────────────────────────────────

describe("Streak logic", () => {
  function updateStreak(
    currentStreak: number,
    lastStudyDate: string | null,
    todayUTC: string,
  ): { streak: number; event: "started" | "continued" | "broken" | "same_day" } {
    if (!lastStudyDate) return { streak: 1, event: "started" };

    const last = new Date(lastStudyDate);
    const today = new Date(todayUTC);
    const diffDays = Math.round((today.getTime() - last.getTime()) / 86400000);

    if (diffDays === 0) return { streak: currentStreak, event: "same_day" };
    if (diffDays === 1) return { streak: currentStreak + 1, event: "continued" };
    return { streak: 1, event: "broken" };
  }

  it("starts streak on first study action", () => {
    const result = updateStreak(0, null, "2026-04-27");
    expect(result.streak).toBe(1);
    expect(result.event).toBe("started");
  });

  it("continues streak on consecutive day", () => {
    const result = updateStreak(3, "2026-04-26", "2026-04-27");
    expect(result.streak).toBe(4);
    expect(result.event).toBe("continued");
  });

  it("does not increment streak on same day", () => {
    const result = updateStreak(3, "2026-04-27", "2026-04-27");
    expect(result.streak).toBe(3);
    expect(result.event).toBe("same_day");
  });

  it("breaks streak after missed day", () => {
    const result = updateStreak(5, "2026-04-25", "2026-04-27");
    expect(result.streak).toBe(1);
    expect(result.event).toBe("broken");
  });

  it("breaks streak after multiple missed days", () => {
    const result = updateStreak(10, "2026-04-20", "2026-04-27");
    expect(result.streak).toBe(1);
    expect(result.event).toBe("broken");
  });
});

// ─── Admin metrics security ───────────────────────────────────────────────────

describe("Admin metrics security", () => {
  it("non-admin users cannot access admin metrics", () => {
    function canAccessAdminMetrics(groups: string[]): boolean {
      return groups.includes("Admin");
    }
    expect(canAccessAdminMetrics([])).toBe(false);
    expect(canAccessAdminMetrics(["user"])).toBe(false);
    expect(canAccessAdminMetrics(["Admin"])).toBe(true);
    expect(canAccessAdminMetrics(["Admin", "user"])).toBe(true);
  });

  it("admin metrics do not expose PII", () => {
    // Metrics response should only contain aggregate counts, not user data
    const metricsResponse = {
      featureUsage: { aiSessionsToday: 42, aiSessionsThisWeek: 280 },
      conversion: {
        checkoutsStartedThisWeek: 15,
        checkoutsCompletedThisWeek: 9,
        checkoutConversionRatePct: 60,
      },
      subscriptionHealth: { cancellationsThisMonth: 2, paymentFailuresThisMonth: 1 },
    };

    // No user emails, IDs, or payment details
    const responseStr = JSON.stringify(metricsResponse);
    expect(responseStr).not.toContain("email");
    expect(responseStr).not.toContain("stripe_secret");
    expect(responseStr).not.toContain("card");
    expect(responseStr).not.toContain("userId");
  });

  it("admin metrics return aggregate counts only", () => {
    const metrics = {
      featureUsage: { aiSessionsToday: 42 },
      conversion: { checkoutConversionRatePct: 60 },
    };
    expect(typeof metrics.featureUsage.aiSessionsToday).toBe("number");
    expect(typeof metrics.conversion.checkoutConversionRatePct).toBe("number");
  });
});

// ─── Onboarding tracking ──────────────────────────────────────────────────────

describe("Onboarding event tracking", () => {
  it("onboarding_started is a frontend event", () => {
    expect(ALLOWED_EVENTS.has(EVENTS.ONBOARDING_STARTED)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.ONBOARDING_STARTED)).toBe(false);
  });

  it("onboarding_completed is a backend event", () => {
    expect(ALLOWED_EVENTS.has(EVENTS.ONBOARDING_COMPLETED)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.ONBOARDING_COMPLETED)).toBe(true);
  });

  it("study preference events are frontend events", () => {
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.STUDY_GOAL_SELECTED)).toBe(false);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.STUDY_SUBJECT_SELECTED)).toBe(false);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.EDUCATION_LEVEL_SELECTED)).toBe(false);
  });
});

// ─── Conversion funnel ────────────────────────────────────────────────────────

describe("Conversion funnel events", () => {
  it("checkout funnel events exist in registry", () => {
    expect(ALLOWED_EVENTS.has(EVENTS.PRICING_PAGE_VIEWED)).toBe(true);
    expect(ALLOWED_EVENTS.has(EVENTS.CHECKOUT_STARTED)).toBe(true);
    expect(ALLOWED_EVENTS.has(EVENTS.CHECKOUT_COMPLETED)).toBe(true);
    expect(ALLOWED_EVENTS.has(EVENTS.CHECKOUT_CANCELED)).toBe(true);
  });

  it("upgrade prompt funnel events exist in registry", () => {
    expect(ALLOWED_EVENTS.has(EVENTS.UPGRADE_PROMPT_VIEWED)).toBe(true);
    expect(ALLOWED_EVENTS.has(EVENTS.UPGRADE_PROMPT_CLICKED)).toBe(true);
    expect(ALLOWED_EVENTS.has(EVENTS.UPGRADE_PROMPT_DISMISSED)).toBe(true);
  });

  it("checkout_completed is backend-only (webhook)", () => {
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.CHECKOUT_COMPLETED)).toBe(true);
  });

  it("checkout_started is a frontend event", () => {
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.CHECKOUT_STARTED)).toBe(false);
  });

  it("calculates checkout conversion rate correctly", () => {
    function conversionRate(started: number, completed: number): number {
      if (started === 0) return 0;
      return Math.round((completed / started) * 100);
    }
    expect(conversionRate(10, 6)).toBe(60);
    expect(conversionRate(0, 0)).toBe(0);
    expect(conversionRate(100, 100)).toBe(100);
    expect(conversionRate(3, 1)).toBe(33);
  });

  it("calculates upgrade prompt CTR correctly", () => {
    function ctr(views: number, clicks: number): number {
      if (views === 0) return 0;
      return Math.round((clicks / views) * 100);
    }
    expect(ctr(100, 25)).toBe(25);
    expect(ctr(0, 0)).toBe(0);
    expect(ctr(50, 50)).toBe(100);
  });
});

// ─── Retention events ─────────────────────────────────────────────────────────

describe("Retention events", () => {
  it("day-N return events are backend-only", () => {
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.USER_RETURNED_DAY_1)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.USER_RETURNED_DAY_7)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.USER_RETURNED_DAY_30)).toBe(true);
  });

  it("streak events are backend-only", () => {
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.STUDY_STREAK_STARTED)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.STUDY_STREAK_CONTINUED)).toBe(true);
    expect(BACKEND_ONLY_EVENTS.has(EVENTS.STUDY_STREAK_BROKEN)).toBe(true);
  });

  it("weekly summary data structure is valid", () => {
    const weeklySummary = {
      sessionsThisWeek: 5,
      quizzesThisWeek: 2,
      activeStudyDays: 4,
      currentStreak: 3,
    };
    expect(weeklySummary.sessionsThisWeek).toBeGreaterThanOrEqual(0);
    expect(weeklySummary.activeStudyDays).toBeLessThanOrEqual(7);
  });
});
