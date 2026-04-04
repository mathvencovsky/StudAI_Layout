import { createFileRoute } from "@tanstack/react-router";
import { DiscoveryPage } from "@/components/discovery";

export const Route = createFileRoute("/learning-preferences")({
  component: DiscoveryPage,
  loader: () => ({ crumb: "Learning Preferences" }),
});
