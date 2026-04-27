/**
 * StudAI Analytics Event Registry
 *
 * Single source of truth for all analytics event names.
 * Use these constants everywhere — never raw strings.
 *
 * Naming convention: snake_case, verb_noun or noun_verb
 *
 * Source legend:
 *   [BE] = backend-authoritative — written by Lambda, not trusted from client
 *   [FE] = frontend — UI interactions only
 *   [WH] = webhook — written by Stripe webhook handler
 */

// ─── Authentication & Onboarding ─────────────────────────────────────────────
export const EVENTS = {
  // [BE] Fired after Cognito confirms new user registration
  USER_SIGNED_UP: "user_signed_up",
  // [FE] Fired on successful login
  USER_LOGGED_IN: "user_logged_in",
  // [FE] Fired when onboarding/discovery form is first shown
  ONBOARDING_STARTED: "onboarding_started",
  // [BE] Fired when LearningPreference is saved for the first time
  ONBOARDING_COMPLETED: "onboarding_completed",
  // [FE] Fired when user selects a study goal in onboarding
  STUDY_GOAL_SELECTED: "study_goal_selected",
  // [FE] Fired when user selects a subject/interest in onboarding
  STUDY_SUBJECT_SELECTED: "study_subject_selected",
  // [FE] Fired when user selects education level in onboarding
  EDUCATION_LEVEL_SELECTED: "education_level_selected",

  // ─── Activation ────────────────────────────────────────────────────────────
  // [BE] Fired on first-ever AI study session creation
  FIRST_AI_STUDY_SESSION_CREATED: "first_ai_study_session_created",
  // [BE] Fired on every AI study session creation
  AI_STUDY_SESSION_CREATED: "ai_study_session_created",
  // [BE] Fired on first quiz attempt
  FIRST_QUIZ_COMPLETED: "first_quiz_completed",
  // [BE] Fired on every quiz completion
  QUIZ_COMPLETED: "quiz_completed",
  // [BE] Fired when user starts their first learning track
  FIRST_LEARNING_TRACK_STARTED: "first_learning_track_started",
  // [BE] Fired when user starts any learning track
  LEARNING_TRACK_STARTED: "learning_track_started",

  // ─── Free usage & upgrade triggers ────────────────────────────────────────
  // [BE] Fired when Free user hits the 5 AI session daily limit
  FREE_DAILY_LIMIT_REACHED: "free_daily_limit_reached",
  // [FE] Fired when Free user clicks a Pro-only feature
  PRO_FEATURE_CLICKED: "pro_feature_clicked",
  // [FE] Fired when upgrade modal/prompt is shown
  UPGRADE_PROMPT_VIEWED: "upgrade_prompt_viewed",
  // [FE] Fired when user clicks "Upgrade to Pro" in any prompt
  UPGRADE_PROMPT_CLICKED: "upgrade_prompt_clicked",
  // [FE] Fired when user dismisses upgrade prompt
  UPGRADE_PROMPT_DISMISSED: "upgrade_prompt_dismissed",
  // [FE] Fired when pricing page is viewed
  PRICING_PAGE_VIEWED: "pricing_page_viewed",
  // [FE] Fired when checkout session is initiated
  CHECKOUT_STARTED: "checkout_started",
  // [WH] Fired when checkout.session.completed webhook is received
  CHECKOUT_COMPLETED: "checkout_completed",
  // [FE] Fired when user lands on billing/cancel page
  CHECKOUT_CANCELED: "checkout_canceled",

  // ─── Pro feature interest ──────────────────────────────────────────────────
  // [FE] Fired when Free user clicks advanced flashcards
  ADVANCED_FLASHCARDS_CLICKED: "advanced_flashcards_clicked",
  // [FE] Fired when Free user clicks advanced quizzes
  ADVANCED_QUIZZES_CLICKED: "advanced_quizzes_clicked",
  // [FE] Fired when Free user clicks personalized learning plan
  PERSONALIZED_LEARNING_PLAN_CLICKED: "personalized_learning_plan_clicked",
  // [FE] Fired when Free user clicks advanced analytics
  ADVANCED_ANALYTICS_CLICKED: "advanced_analytics_clicked",
  // [FE] Fired when Free user clicks export
  EXPORT_CLICKED: "export_clicked",
  // [FE] Fired when Free user clicks priority support
  PRIORITY_SUPPORT_CLICKED: "priority_support_clicked",

  // ─── Subscription lifecycle ────────────────────────────────────────────────
  // [WH] Fired when subscription becomes active/trial
  SUBSCRIPTION_ACTIVATED: "subscription_activated",
  // [WH] Fired on invoice.paid for renewal
  SUBSCRIPTION_RENEWED: "subscription_renewed",
  // [WH] Fired when subscription is canceled
  SUBSCRIPTION_CANCELED: "subscription_canceled",
  // [WH] Fired when cancel_at_period_end is set
  SUBSCRIPTION_CANCEL_AT_PERIOD_END: "subscription_cancel_at_period_end",
  // [WH] Fired when canceled subscription is reactivated
  SUBSCRIPTION_REACTIVATED: "subscription_reactivated",
  // [WH] Fired on invoice.payment_failed
  SUBSCRIPTION_PAYMENT_FAILED: "subscription_payment_failed",
  // [WH] Fired when payment recovers after failure
  SUBSCRIPTION_PAYMENT_RECOVERED: "subscription_payment_recovered",
  // [FE] Fired when user opens Stripe Customer Portal
  CUSTOMER_PORTAL_OPENED: "customer_portal_opened",

  // ─── Retention ────────────────────────────────────────────────────────────
  // [BE] Fired when user returns on day 1 after signup
  USER_RETURNED_DAY_1: "user_returned_day_1",
  // [BE] Fired when user returns on day 7 after signup
  USER_RETURNED_DAY_7: "user_returned_day_7",
  // [BE] Fired when user returns on day 30 after signup
  USER_RETURNED_DAY_30: "user_returned_day_30",
  // [BE] Fired when user completes their daily study goal
  DAILY_STUDY_COMPLETED: "daily_study_completed",
  // [BE] Fired when streak starts (first day)
  STUDY_STREAK_STARTED: "study_streak_started",
  // [BE] Fired when streak continues (consecutive day)
  STUDY_STREAK_CONTINUED: "study_streak_continued",
  // [BE] Fired when streak breaks (missed a day)
  STUDY_STREAK_BROKEN: "study_streak_broken",

  // ─── Dashboard ────────────────────────────────────────────────────────────
  // [FE] Fired when authenticated dashboard is viewed
  DASHBOARD_VIEWED: "dashboard_viewed",
  // [FE] Fired when user clicks a suggested action on dashboard
  SUGGESTED_ACTION_CLICKED: "suggested_action_clicked",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/**
 * Allowed event names set — used for validation.
 * Any event not in this set is rejected.
 */
export const ALLOWED_EVENTS = new Set<string>(Object.values(EVENTS));

/**
 * Events that are backend-authoritative.
 * The frontend should NOT write these directly — they must come from the Lambda.
 * If the client sends one of these, it is rejected.
 */
export const BACKEND_ONLY_EVENTS = new Set<string>([
  EVENTS.USER_SIGNED_UP,
  EVENTS.ONBOARDING_COMPLETED,
  EVENTS.FIRST_AI_STUDY_SESSION_CREATED,
  EVENTS.AI_STUDY_SESSION_CREATED,
  EVENTS.FIRST_QUIZ_COMPLETED,
  EVENTS.QUIZ_COMPLETED,
  EVENTS.FIRST_LEARNING_TRACK_STARTED,
  EVENTS.LEARNING_TRACK_STARTED,
  EVENTS.FREE_DAILY_LIMIT_REACHED,
  EVENTS.CHECKOUT_COMPLETED,
  EVENTS.SUBSCRIPTION_ACTIVATED,
  EVENTS.SUBSCRIPTION_RENEWED,
  EVENTS.SUBSCRIPTION_CANCELED,
  EVENTS.SUBSCRIPTION_CANCEL_AT_PERIOD_END,
  EVENTS.SUBSCRIPTION_REACTIVATED,
  EVENTS.SUBSCRIPTION_PAYMENT_FAILED,
  EVENTS.SUBSCRIPTION_PAYMENT_RECOVERED,
  EVENTS.USER_RETURNED_DAY_1,
  EVENTS.USER_RETURNED_DAY_7,
  EVENTS.USER_RETURNED_DAY_30,
  EVENTS.DAILY_STUDY_COMPLETED,
  EVENTS.STUDY_STREAK_STARTED,
  EVENTS.STUDY_STREAK_CONTINUED,
  EVENTS.STUDY_STREAK_BROKEN,
]);

/** Metadata keys that must never be stored */
export const BLOCKED_METADATA_KEYS = new Set([
  "password",
  "token",
  "secret",
  "key",
  "card",
  "cvv",
  "ssn",
  "stripe_secret",
  "authorization",
  "prompt",
  "ai_message",
  "message_content",
]);

/** Max metadata size in bytes */
export const MAX_METADATA_BYTES = 2048;
