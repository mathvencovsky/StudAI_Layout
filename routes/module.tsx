import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/module")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Modules",
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
