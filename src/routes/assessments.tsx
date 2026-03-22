import { createFileRoute } from "@tanstack/react-router";
import { AssessmentsPage } from "@/components/assessments/assessments-page";

export const Route = createFileRoute("/assessments")({
  component: AssessmentsPage,
});
