import { getTrackQueryOptions } from "@/hooks/track/use-track";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/track/$trackId")({
  component: RouteComponent,
  loader: async ({ params: { trackId }, context }) => {
    return {
      crumb: (
        await context.queryClient.ensureQueryData(getTrackQueryOptions(trackId))
      )?.title,
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
