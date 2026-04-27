/**
 * Subscription entitlement utilities.
 *
 * Server-side entitlement checks should call the billing API directly.
 * These helpers are for UI-layer decisions only.
 */

import type { SubscriptionStatus } from "@/api/billing";

/** Returns true if the subscription grants Pro access */
export function isPro(status: SubscriptionStatus | null | undefined): boolean {
  return status?.isPro === true;
}

/** Returns a human-readable status label */
export function getStatusLabel(status: SubscriptionStatus | null | undefined): string {
  if (!status) return "Free";
  if (status.isPro && status.status === "trial") return "Pro (Trial)";
  if (status.isPro) return "Pro";
  if (status.hasPaymentIssue) return "Payment Issue";
  if (status.status === "cancelled") return "Cancelled";
  return "Free";
}

/** Returns the renewal/expiry date as a formatted string */
export function getPeriodEndLabel(
  status: SubscriptionStatus | null | undefined,
): string | null {
  if (!status?.currentPeriodEnd) return null;
  return new Date(status.currentPeriodEnd).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Returns the billing interval label */
export function getBillingIntervalLabel(
  status: SubscriptionStatus | null | undefined,
): string | null {
  if (!status?.billingInterval) return null;
  return status.billingInterval === "annual" ? "Annual" : "Monthly";
}

/** Returns true if the subscription is set to cancel at period end */
export function isCancellingAtPeriodEnd(
  status: SubscriptionStatus | null | undefined,
): boolean {
  return status?.cancelAtPeriodEnd === true;
}
