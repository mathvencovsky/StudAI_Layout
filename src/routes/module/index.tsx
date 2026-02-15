import { ModuleSearch } from "@/components/modules/module-search";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute("/module/")({
  component: ModulesPage,
});

function ModulesPage() {
  const navigate = useNavigate();
  const onCreateModule = useCallback(() => {
    navigate({ to: "/module-create" });
  }, [navigate]);

  const onEditModule = useCallback(
    (moduleId: string) => {
      // Use window.location with query parameter
      navigate({ to: "/module-edit/$moduleId", params: { moduleId } });
    },
    [navigate]
  );

  const { isAdmin: isAdminUser } = useIsAdminUser();
  return (
    <ModuleSearch
      onCreateModule={isAdminUser ? onCreateModule : undefined}
      onEditModule={isAdminUser ? onEditModule : undefined}
    />
  );
}
