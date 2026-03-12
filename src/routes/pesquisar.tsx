import { createFileRoute } from "@tanstack/react-router";
import { PesquisarPage } from "@/components/search/pesquisar-page";

export const Route = createFileRoute("/pesquisar")({
  component: PesquisarPage,
});
