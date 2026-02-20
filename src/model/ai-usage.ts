import { type Schema } from "../../amplify/data/resource";

export type AiUsage = Schema["AiUsage"]["type"];
export type AiUsageIdentifier = Schema["AiUsage"]["identifier"];
export type AiUsageCreateInput = Schema["AiUsage"]["createType"];
export type AiUsageUpdateInput = Schema["AiUsage"]["updateType"];
export type AiUsageDeleteInput = Schema["AiUsage"]["deleteType"];
export type AiPlan = NonNullable<AiUsage["plan"]>;
export type AiFeature = NonNullable<AiUsage["feature"]>;

export const AI_PLANS: AiPlan[] = ["free", "pro"];
export const AI_FEATURES: AiFeature[] = [
  "course_builder",
  "coach",
  "recommendations",
  "content_generation",
];
