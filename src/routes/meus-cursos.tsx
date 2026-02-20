import { createFileRoute } from "@tanstack/react-router";
import { MeusCursosPage } from "@/components/course-builder/meus-cursos-page";

export const Route = createFileRoute("/meus-cursos")({
  component: MeusCursosPage,
});
