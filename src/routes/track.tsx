import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/track")({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: "Tracks",
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
