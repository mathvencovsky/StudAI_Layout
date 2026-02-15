import { RegistrationPage } from "@/components/auth/pages/registration-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegistrationPage />;
}
