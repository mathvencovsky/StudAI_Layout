import { createFileRoute } from "@tanstack/react-router";
import { LearningDemo } from "@/components/learning/demo/learning-demo";
import { LearningPageWrapper } from "@/components/learning/layout/learning-page-wrapper";

export const Route = createFileRoute("/estudar")({
  component: LearningStudyPage,
  loader: () => {
    return {
      crumb: "Estudar",
    };
  },
});

function LearningStudyPage() {
  return (
    <LearningPageWrapper>
      <LearningDemo />
    </LearningPageWrapper>
  );
}
