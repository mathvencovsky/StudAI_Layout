import { createFileRoute } from '@tanstack/react-router';
import { TrackEditorPage } from '@/components/admin/track-editor/track-editor-page';

export const Route = createFileRoute('/admin/track-editor')({
  component: TrackEditorRoute,
});

function TrackEditorRoute() {
  const searchParams = Route.useSearch() as { trackId?: string };
  
  return <TrackEditorPage trackId={searchParams.trackId} />;
}
