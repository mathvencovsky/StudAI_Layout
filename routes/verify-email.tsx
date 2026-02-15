import { VerifyEmailPage } from "@/components/auth/pages/verify-email-page";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const verifyEmailSearchSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: verifyEmailSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { email } = Route.useSearch();
  return <VerifyEmailPage email={email} />;
}
