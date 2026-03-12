import { createFileRoute } from "@tanstack/react-router";
import { QuizzesPage } from "@/components/quiz/quizzes-page";

export const Route = createFileRoute("/quizzes")({
  component: RouteComponent,
  loader: () => ({ crumb: "Quizzes" }),
});

function RouteComponent() {
  return <QuizzesPage />;
}
