import { createFileRoute } from "@tanstack/react-router";
import { CheckoutSuccessPage } from "@/components/billing/checkout-success-page";

export const Route = createFileRoute("/billing/success")({
  component: CheckoutSuccessPage,
});
