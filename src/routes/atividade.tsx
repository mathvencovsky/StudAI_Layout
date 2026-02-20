import { createFileRoute } from "@tanstack/react-router";
import { AtividadePage } from "@/components/activity/atividade-page";

export const Route = createFileRoute("/atividade")({
  component: AtividadePage,
});
