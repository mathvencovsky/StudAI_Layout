import { createFileRoute } from "@tanstack/react-router";
import { AvaliacoesPage } from "@/components/assessments/avaliacoes-page";

export const Route = createFileRoute("/avaliacoes")({
  component: AvaliacoesPage,
});
