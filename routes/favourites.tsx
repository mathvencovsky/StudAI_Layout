import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/favourites")({
  component: RouteComponent,
  loader: () => ({ crumb: "Favourites" }),
});

function RouteComponent() {
  return <Outlet />;
}
