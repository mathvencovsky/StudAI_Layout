import { useAdminTrackStore } from '@/stores/admin-track-store';
import { TrackOverview } from './content/track-overview';
import { ModuleEditor } from './content/module-editor';
import { LessonEditor } from './content/lesson-editor';

export function TrackEditorContent() {
  const currentTrack = useAdminTrackStore((state) => state.currentTrack);
  const selectedModuleId = useAdminTrackStore((state) => state.selectedModuleId);
  const selectedLessonId = useAdminTrackStore((state) => state.selectedLessonId);

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-medium">Nenhuma trilha carregada</p>
          <p className="text-sm text-muted-foreground mt-2">
            Selecione uma trilha para começar a editar
          </p>
        </div>
      </div>
    );
  }

  // Determinar qual view mostrar
  if (selectedLessonId) {
    let selectedLesson = null;
    for (const module of currentTrack.modules) {
      const lesson = module.lessons.find((l) => l.id === selectedLessonId);
      if (lesson) {
        selectedLesson = lesson;
        break;
      }
    }
    if (selectedLesson) {
      return <LessonEditor lesson={selectedLesson} />;
    }
  }

  if (selectedModuleId) {
    const selectedModule = currentTrack.modules.find((m) => m.id === selectedModuleId);
    if (selectedModule) {
      return <ModuleEditor module={selectedModule} />;
    }
  }

  // Default: Track Overview
  return <TrackOverview track={currentTrack} />;
}
