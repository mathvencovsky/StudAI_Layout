import { createFileRoute } from "@tanstack/react-router";
import { CriarTrilhaPage } from "@/components/tracks/criar-trilha-page";

export const Route = createFileRoute("/criar-trilha")({
  component: CriarTrilhaPage,
  loader: () => ({ crumb: "Criar Trilha com IA" }),
});
