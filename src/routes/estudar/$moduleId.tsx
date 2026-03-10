import { createFileRoute } from "@tanstack/react-router";
import { LearningDemo } from "@/components/learning/demo/learning-demo";
import { LearningPageWrapper } from "@/components/learning/layout/learning-page-wrapper";

export const Route = createFileRoute("/estudar/$moduleId")({
  component: LearningModulePage,
  loader: ({ params }) => {
    return {
      crumb: "Estudar",
      moduleId: params.moduleId,
    };
  },
});

function LearningModulePage() {
  const { moduleId } = Route.useLoaderData();
  
  return (
    <LearningPageWrapper>
      <LearningDemo initialView="module" moduleId={moduleId} />
    </LearningPageWrapper>
  );
}
