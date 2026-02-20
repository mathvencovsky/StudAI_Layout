import { type Schema } from "../../amplify/data/resource";

export type Subscription = Schema["Subscription"]["type"];
export type SubscriptionIdentifier = Schema["Subscription"]["identifier"];
export type SubscriptionCreateInput = Schema["Subscription"]["createType"];
export type SubscriptionUpdateInput = Schema["Subscription"]["updateType"];
export type SubscriptionDeleteInput = Schema["Subscription"]["deleteType"];
export type SubscriptionPlan = NonNullable<Subscription["plan"]>;
export type SubscriptionStatus = NonNullable<Subscription["status"]>;

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = ["free", "pro"];
export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  "active",
  "cancelled",
  "expired",
  "trial",
];
