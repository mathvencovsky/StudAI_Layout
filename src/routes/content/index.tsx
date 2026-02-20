import {
  ContentListWithTabs,
  type ContentListWithTabsProps,
} from "@/components/content/content-list-with-tabs";
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

  const onEdit: ContentListWithTabsProps["onEdit"] = useCallback(
    (contentId) => {
      navigate({ to: "/content/$contentId/edit", params: { contentId } });
    },
    [navigate]
  );

  return <ContentListWithTabs onCreateNew={onCreateNew} onEdit={onEdit} />;
}
