import { createFileRoute } from "@tanstack/react-router";
import { ResourcesPage } from "@/components/public/resources-page";

export const Route = createFileRoute("/resources")({
  component: ResourcesPage,
});
