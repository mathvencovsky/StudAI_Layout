import { ContentDetailContainer } from "@/components/content/content-detail-container";
import { getContentQueryOptions } from "@/hooks/content/use-get-content";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/module/$moduleId/content/$contentId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    return {
      crumb: (
        await context.queryClient.ensureQueryData(
          getContentQueryOptions(params.contentId)
        )
      )?.title,
    };
  },
});

function RouteComponent() {
  const { contentId, moduleId } = Route.useParams();

  return (
    <div className="container mx-auto py-8 px-4">
      <ContentDetailContainer contentId={contentId} moduleId={moduleId} />
    </div>
  );
}
