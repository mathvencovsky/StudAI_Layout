import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/public/privacy-page";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});
