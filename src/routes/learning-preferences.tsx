import { createFileRoute } from "@tanstack/react-router";
import { LearningPreferencesPage } from "@/components/learning-preferences/learning-preferences-page";

export const Route = createFileRoute("/learning-preferences")({
  component: LearningPreferencesPage,
  loader: () => ({ crumb: "Learning Preferences" }),
});
