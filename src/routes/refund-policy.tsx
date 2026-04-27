import { createFileRoute } from "@tanstack/react-router";
import { RefundPolicyPage } from "@/components/public/refund-policy-page";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicyPage,
});
