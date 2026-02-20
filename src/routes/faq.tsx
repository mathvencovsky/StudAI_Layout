import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/components/public/faq-page";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});
