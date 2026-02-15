import { PasswordResetPage } from "@/components/auth/pages/password-reset-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PasswordResetPage />;
}
