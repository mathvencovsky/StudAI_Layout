import { createFileRoute } from "@tanstack/react-router";
import { SalvosPage } from "@/components/saved/salvos-page";

export const Route = createFileRoute("/salvos")({
  component: SalvosPage,
});
