import { createFileRoute } from "@tanstack/react-router";
import { MyPlanPage } from "@/components/plan/my-plan-page";

export const Route = createFileRoute("/my-plan")({
  component: MyPlanPage,
});
