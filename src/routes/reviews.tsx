import { createFileRoute } from "@tanstack/react-router";
import { ReviewsPageIntegrated } from "@/components/review/reviews-page-integrated";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPageIntegrated,
  loader: () => ({ crumb: "Reviews" }),
});
