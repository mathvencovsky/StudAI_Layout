import { type Schema } from "../../amplify/data/resource";

export type Subscription = Schema["UserSubscription"]["type"];
export type SubscriptionIdentifier = Schema["UserSubscription"]["identifier"];
export type SubscriptionCreateInput = Schema["UserSubscription"]["createType"];
export type SubscriptionUpdateInput = Schema["UserSubscription"]["updateType"];
export type SubscriptionDeleteInput = Schema["UserSubscription"]["deleteType"];
export type SubscriptionPlan = NonNullable<Subscription["plan"]>;
export type SubscriptionStatus = NonNullable<Subscription["status"]>;

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = ["free", "pro"];
export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  "active",
  "cancelled",
  "expired",
  "trial",
];
