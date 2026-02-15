import { ContentEdit } from "@/components/content/content-edit";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/content/$contentId/edit")({
  component: RouteComponent,
  loader: () => ({ crumb: "Edit" }),
});

function RouteComponent() {
  const { contentId } = Route.useParams();
  const navigate = useNavigate();
  return (
    <ContentEdit
      id={contentId}
      onCancel={() => navigate({ to: "/content" })}
      onSuccess={() => navigate({ to: "/content" })}
    />
  );
}
