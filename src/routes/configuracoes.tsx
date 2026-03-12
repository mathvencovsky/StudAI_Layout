import { createFileRoute } from "@tanstack/react-router";
import Configuracoes from "@/components/settings/configuracoes-page-integrated";

export const Route = createFileRoute("/configuracoes")({
  component: RouteComponent,
  loader: () => ({ crumb: "Configurações" }),
});

function RouteComponent() {
  return <Configuracoes />;
}
