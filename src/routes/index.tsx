import { LoginPage } from "@/components/auth/pages/login-page";
import { HomePage } from "@/components/home/home-page";
import { useAuth } from "@/hooks/use-auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const indexSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: indexSearchSchema,
  component: Index,
});

function Index() {
  const { isAuthenticated } = useAuth();
  const { redirect } = Route.useSearch();
  return isAuthenticated ? <HomePage /> : <LoginPage redirect={redirect} />;
}
