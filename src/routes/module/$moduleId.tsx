import { getModuleQueryOptions } from "@/hooks/modules/use-module";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/module/$moduleId")({
  component: RouteComponent,
  loader: async ({ params: { moduleId }, context }) => {
    return {
      crumb: (
        await context.queryClient.ensureQueryData(
          getModuleQueryOptions(moduleId)
        )
      )?.title,
    };
  },
});

/**
 * This component is only used to render the breadcrumb.
 *
 * See index.tsx file inside the folder with this file name
 */
function RouteComponent() {
  return <Outlet />;
}
