import { createFileRoute } from "@tanstack/react-router";
import { SupportPage } from "@/components/public/support-page";

export const Route = createFileRoute("/support")({
  component: SupportPage,
});
