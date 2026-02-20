import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/public/contact-page";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});
