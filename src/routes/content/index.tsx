import {
  ContentList,
  type ContentListProps,
} from "@/components/content/content-list";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute("/content/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const onCreateNew = useCallback(() => {
    navigate({ to: "/content-create" });
  }, [navigate]);

  const onEdit: ContentListProps["onEdit"] = useCallback(
    (contentId) => {
      navigate({ to: "/content/$contentId/edit", params: { contentId } });
    },
    [navigate]
  );

  return <ContentList onCreateNew={onCreateNew} onEdit={onEdit} />;
}
