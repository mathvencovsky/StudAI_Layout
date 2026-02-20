import { createFileRoute } from "@tanstack/react-router";
import { EstudarPage } from "@/components/study/estudar-page";

export const Route = createFileRoute("/estudar")({
  component: EstudarPage,
  loader: () => {
    return {
      crumb: "Estudar",
    };
  },
});
