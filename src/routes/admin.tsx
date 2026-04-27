import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/admin/admin-page";
import { RoleGuard } from "@/components/guards/role-guard";
import { AuthGuard } from "@/components/guards/auth-guard";

function AdminRoute() {
  return (
    <AuthGuard>
      <RoleGuard requiredRole="admin">
        <AdminPage />
      </RoleGuard>
    </AuthGuard>
  );
}

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});
