import { createFileRoute } from "@tanstack/react-router";
import { AiDisclaimerPage } from "@/components/public/ai-disclaimer-page";

export const Route = createFileRoute("/ai-disclaimer")({
  component: AiDisclaimerPage,
});
