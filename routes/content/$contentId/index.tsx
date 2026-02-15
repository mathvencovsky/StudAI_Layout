import { ContentDetailContainer } from "@/components/content/content-detail-container";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const contentDetailSearchSchema = z.object({
  moduleId: z.string().optional(),
});

export const Route = createFileRoute("/content/$contentId/")({
  validateSearch: contentDetailSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { contentId } = Route.useParams();
  const { moduleId } = Route.useSearch();

  return (
    <div className="container mx-auto py-8 px-4">
      <ContentDetailContainer contentId={contentId} moduleId={moduleId} />
    </div>
  );
}
