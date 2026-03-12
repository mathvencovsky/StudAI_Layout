import { createFileRoute } from "@tanstack/react-router";
import { QuizSessionPage } from "@/components/quiz/quiz-session-page";

export const Route = createFileRoute("/quiz/$quizId")({
  component: RouteComponent,
  loader: () => ({ crumb: "Quiz" }),
});

function RouteComponent() {
  const { quizId } = Route.useParams();
  return <QuizSessionPage quizId={quizId} />;
}
