import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksPage } from "@/components/public/how-it-works-page";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
});
