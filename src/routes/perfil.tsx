import { createFileRoute } from '@tanstack/react-router'
import { PerfilPage } from "@/components/profile/perfil-page";

export const Route = createFileRoute('/perfil')({
  component: PerfilPage,
})