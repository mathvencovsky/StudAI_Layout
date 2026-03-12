import { createFileRoute } from "@tanstack/react-router";
import { LearningDemo } from "@/components/learning/demo/learning-demo";
import { LearningPageWrapper } from "@/components/learning/layout/learning-page-wrapper";

export const Route = createFileRoute("/estudar/$moduleId/$lessonId")({
  component: LearningLessonPage,
  loader: ({ params }) => {
    return {
      crumb: "Estudar",
      moduleId: params.moduleId,
      lessonId: params.lessonId,
    };
  },
});

function LearningLessonPage() {
  const { moduleId, lessonId } = Route.useLoaderData();
  
  return (
    <LearningPageWrapper>
      <LearningDemo 
        initialView="lesson" 
        moduleId={moduleId} 
        lessonId={lessonId} 
      />
    </LearningPageWrapper>
  );
}
