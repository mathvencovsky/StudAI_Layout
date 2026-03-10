import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/admin-page";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <>
      <Outlet />
    </>
  );
}
