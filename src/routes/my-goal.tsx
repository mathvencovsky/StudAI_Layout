import { createFileRoute } from "@tanstack/react-router";
import { GoalsPageIntegrated } from "@/components/goal/goals-page-integrated";

export const Route = createFileRoute("/my-goal")({
  component: GoalsPageIntegrated,
  loader: () => ({ crumb: "My Goal" }),
});
