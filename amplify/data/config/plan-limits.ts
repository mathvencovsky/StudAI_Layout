/**
 * StudAI Plan Limits Configuration
 * 
 * Defines quotas and rate limits for Free vs Pro plans.
 * These limits are enforced SERVER-SIDE in middleware.
 */

export type PlanType = "free" | "pro";
export type FeatureType =
  | "course_builder"
  | "coach"
  | "recommendations"
  | "content_generation";

export interface PlanLimits {
  // Course Builder
  courseDraftsPerWeek: number;
  coursePublishPerMonth: number;

  // Coach IA
  coachMessagesPerDay: number;
  coachTokensPerDay: number;

  // Recommendations
  recommendationsPerDay: number;

  // Content Generation
  contentGenerationsPerDay: number;

  // Web Search (Pro only)
  webSearchEnabled: boolean;

  // General
  maxTokensPerRequest: number;
  requestsPerMinute: number;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    // Course Builder
    courseDraftsPerWeek: 2,
    coursePublishPerMonth: 1,

    // Coach IA
    coachMessagesPerDay: 10,
    coachTokensPerDay: 50000, // ~50k tokens input + output

    // Recommendations
    recommendationsPerDay: 5,

    // Content Generation
    contentGenerationsPerDay: 3,

    // Web Search
    webSearchEnabled: false,

    // General
    maxTokensPerRequest: 4000,
    requestsPerMinute: 5,
  },

  pro: {
    // Course Builder
    courseDraftsPerWeek: 50, // Fair use
    coursePublishPerMonth: 20,

    // Coach IA
    coachMessagesPerDay: 200, // Fair use
    coachTokensPerDay: 1000000, // ~1M tokens

    // Recommendations
    recommendationsPerDay: 100, // Fair use

    // Content Generation
    contentGenerationsPerDay: 50,

    // Web Search
    webSearchEnabled: true,

    // General
    maxTokensPerRequest: 16000,
    requestsPerMinute: 30,
  },
};

/**
 * Get plan limits for a specific plan
 */
export function getPlanLimits(plan: PlanType): PlanLimits {
  return PLAN_LIMITS[plan];
}

/**
 * Check if a feature is available for a plan
 */
export function isFeatureAvailable(
  plan: PlanType,
  feature: FeatureType
): boolean {
  const limits = getPlanLimits(plan);

  switch (feature) {
    case "course_builder":
      return limits.courseDraftsPerWeek > 0;
    case "coach":
      return limits.coachMessagesPerDay > 0;
    case "recommendations":
      return limits.recommendationsPerDay > 0;
    case "content_generation":
      return limits.contentGenerationsPerDay > 0;
    default:
      return false;
  }
}

/**
 * Get daily limit for a specific feature
 */
export function getDailyLimit(plan: PlanType, feature: FeatureType): number {
  const limits = getPlanLimits(plan);

  switch (feature) {
    case "coach":
      return limits.coachMessagesPerDay;
    case "recommendations":
      return limits.recommendationsPerDay;
    case "content_generation":
      return limits.contentGenerationsPerDay;
    case "course_builder":
      return Math.floor(limits.courseDraftsPerWeek / 7); // Daily average
    default:
      return 0;
  }
}

/**
 * Error codes for plan limit violations
 */
export const PLAN_LIMIT_ERRORS = {
  LIMIT_REACHED: "PLAN_LIMIT_REACHED",
  FEATURE_NOT_AVAILABLE: "FEATURE_NOT_AVAILABLE",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  INVALID_PLAN: "INVALID_PLAN",
} as const;

export type PlanLimitErrorCode =
  (typeof PLAN_LIMIT_ERRORS)[keyof typeof PLAN_LIMIT_ERRORS];

/**
 * Error response structure for plan limit violations
 */
export interface PlanLimitError {
  code: PlanLimitErrorCode;
  message: string;
  feature: FeatureType;
  currentPlan: PlanType;
  limit: number;
  used: number;
  resetAt: string; // ISO timestamp
  upgradeCta: boolean;
}

/**
 * Create a plan limit error response
 */
export function createPlanLimitError(
  code: PlanLimitErrorCode,
  feature: FeatureType,
  plan: PlanType,
  used: number,
  resetAt: Date
): PlanLimitError {
  const limit = getDailyLimit(plan, feature);

  const messages: Record<PlanLimitErrorCode, string> = {
    PLAN_LIMIT_REACHED: `Você atingiu o limite de ${limit} requisições por dia para ${feature}. Faça upgrade para Pro!`,
    FEATURE_NOT_AVAILABLE: `Este recurso não está disponível no plano ${plan}. Faça upgrade para Pro!`,
    RATE_LIMIT_EXCEEDED: `Muitas requisições. Aguarde alguns minutos e tente novamente.`,
    INVALID_PLAN: `Plano inválido. Entre em contato com o suporte.`,
  };

  return {
    code,
    message: messages[code],
    feature,
    currentPlan: plan,
    limit,
    used,
    resetAt: resetAt.toISOString(),
    upgradeCta: code !== "RATE_LIMIT_EXCEEDED",
  };
}

/**
 * Calculate reset time (next day at midnight UTC)
 */
export function getResetTime(): Date {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow;
}

/**
 * Get period day string (YYYY-MM-DD)
 */
export function getPeriodDay(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}
