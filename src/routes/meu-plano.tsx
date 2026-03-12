import { createFileRoute } from "@tanstack/react-router";
import { MeuPlanoPage } from "@/components/plan/meu-plano-page";

export const Route = createFileRoute("/meu-plano")({
  component: MeuPlanoPage,
});
