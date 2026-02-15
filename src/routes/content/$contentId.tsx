import { getContentQueryOptions } from "@/hooks/content/use-get-content";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

const contentDetailSearchSchema = z.object({
  moduleId: z.string().optional(),
});

export const Route = createFileRoute("/content/$contentId")({
  validateSearch: contentDetailSearchSchema,
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
  return <Outlet />;
}
