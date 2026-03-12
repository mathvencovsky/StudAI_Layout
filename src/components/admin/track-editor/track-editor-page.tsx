import { useEffect } from 'react';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import { TrackEditorLayout } from './track-editor-layout';
import { TrackEditorContent } from './track-editor-content';
import type { AdminTrack } from '@/types/admin-track';

interface TrackEditorPageProps {
  trackId?: string;
}

export function TrackEditorPage({ trackId }: TrackEditorPageProps) {
  const setCurrentTrack = useAdminTrackStore((state) => state.setCurrentTrack);
  const currentTrack = useAdminTrackStore((state) => state.currentTrack);

  useEffect(() => {
    // TODO: Carregar trilha do backend
    // Por enquanto, criar uma trilha mock
    if (!currentTrack) {
      const mockTrack: AdminTrack = {
        id: trackId || 'track-1',
        title: 'Fundamentos de React',
        slug: 'fundamentos-react',
        description: 'Aprenda os conceitos fundamentais do React do zero',
        objectives: [
          'Entender componentes e JSX',
          'Trabalhar com props e state',
          'Usar hooks do React',
        ],
        prerequisites: ['JavaScript básico', 'HTML e CSS'],
        level: 'beginner',
        estimatedHours: 8,
        coverImage: '',
        tags: ['React', 'JavaScript', 'Frontend'],
        categories: ['Desenvolvimento Web'],
        modules: [],
        status: 'draft',
        version: 1,
        createdAt: new Date(),
        createdBy: 'admin@studai.com',
        updatedAt: new Date(),
        updatedBy: 'admin@studai.com',
      };

      setCurrentTrack(mockTrack);
    }
  }, [trackId, currentTrack, setCurrentTrack]);

  return (
    <TrackEditorLayout>
      <TrackEditorContent />
    </TrackEditorLayout>
  );
}
