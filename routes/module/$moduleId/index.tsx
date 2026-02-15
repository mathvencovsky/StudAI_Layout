import { ModuleDetailContainer } from "@/components/modules/module-detail-container";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/module/$moduleId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { moduleId } = Route.useParams();
  return <ModuleDetailContainer moduleId={moduleId} />;
}
