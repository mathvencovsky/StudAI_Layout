import { LandingPage } from "@/components/landing/landing-page";
import { HomePage } from "@/components/home/home-page";
import { useAuth } from "@/hooks/use-auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const indexSearchSchema = z.object({
  redirect: z.string().optional(),
  perfil: z.enum(["concurso", "certificacao", "faculdade"]).optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: indexSearchSchema,
  component: Index,
});

function Index() {
  const { isAuthenticated, loading } = useAuth();
  
  // Show nothing while checking auth status
  if (loading) {
    return null;
  }
  
  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
