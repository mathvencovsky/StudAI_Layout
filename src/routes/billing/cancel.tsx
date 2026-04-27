import { createFileRoute } from "@tanstack/react-router";
import { CheckoutCancelPage } from "@/components/billing/checkout-cancel-page";

export const Route = createFileRoute("/billing/cancel")({
  component: CheckoutCancelPage,
});
