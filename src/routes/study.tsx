import { createFileRoute } from "@tanstack/react-router";
import { StudyPage } from "@/components/study/study-page";

export const Route = createFileRoute("/study")({
  component: StudyPage,
  loader: () => {
    return {
      crumb: "Study",
    };
  },
});
