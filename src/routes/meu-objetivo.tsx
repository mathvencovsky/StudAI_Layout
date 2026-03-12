import { createFileRoute } from "@tanstack/react-router";
import { MetasPageIntegrated } from "@/components/goal/metas-page-integrated";

export const Route = createFileRoute("/meu-objetivo")({
  component: MetasPageIntegrated,
  loader: () => ({ crumb: "Meu Objetivo" }),
});
