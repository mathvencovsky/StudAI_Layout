import { createFileRoute } from "@tanstack/react-router";
import { SecurityPage } from "@/components/public/security-page";

export const Route = createFileRoute("/security")({
  component: SecurityPage,
});
