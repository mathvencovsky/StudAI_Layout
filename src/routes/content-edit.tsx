import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/content-edit")({
  component: RouteComponent,
  loader: async () => {
    return {
      crumb: "Content Edit",
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
