import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/content")({
  component: RouteComponent,
  loader: () => ({ crumb: "Content" }),
});

function RouteComponent() {
  return <Outlet />;
}
