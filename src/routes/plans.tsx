import { createFileRoute } from "@tanstack/react-router";
import { PlansPage } from "@/components/public/plans-page";

export const Route = createFileRoute("/plans")({
  component: PlansPage,
});
