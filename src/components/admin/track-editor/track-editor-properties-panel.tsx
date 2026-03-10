import { useAdminTrackStore } from '@/stores/admin-track-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TrackLevel } from '@/types/admin-track';

export function TrackEditorPropertiesPanel() {
  const currentTrack = useAdminTrackStore((state) => state.currentTrack);
  const selectedModuleId = useAdminTrackStore((state) => state.selectedModuleId);
  const selectedLessonId = useAdminTrackStore((state) => state.selectedLessonId);
  const isPropertiesPanelCollapsed = useAdminTrackStore(
    (state) => state.isPropertiesPanelCollapsed
  );
  const updateTrack = useAdminTrackStore((state) => state.updateTrack);
  const updateModule = useAdminTrackStore((state) => state.updateModule);
  const updateLesson = useAdminTrackStore((state) => state.updateLesson);

  if (!currentTrack) {
    return null;
  }

  // Determinar qual item está selecionado
  let selectedModule = null;
  let selectedLesson = null;

  if (selectedModuleId) {
    selectedModule = currentTrack.modules.find((m) => m.id === selectedModuleId);
  }

  if (selectedLessonId) {
    for (const module of currentTrack.modules) {
      const lesson = module.lessons.find((l) => l.id === selectedLessonId);
      if (lesson) {
        selectedLesson = lesson;
        break;
      }
    }
  }

  // Renderizar propriedades baseado na seleção
  const renderProperties = () => {
    if (selectedLesson) {
      return <LessonProperties lesson={selectedLesson} onUpdate={updateLesson} />;
    }
    if (selectedModule) {
      return <ModuleProperties module={selectedModule} onUpdate={updateModule} />;
    }
    return <TrackProperties track={currentTrack} onUpdate={updateTrack} />;
  };

  return (
    <aside
      className={cn(
        'w-80 border-l bg-muted/10 flex flex-col transition-all duration-300',
        isPropertiesPanelCollapsed && 'w-0 overflow-hidden'
      )}
    >
      <div className="p-4 border-b">
        <h3 className="font-semibold">Propriedades</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">{renderProperties()}</div>
      </ScrollArea>
    </aside>
  );
}

function TrackProperties({
  track,
  onUpdate,
}: {
  track: any;
  onUpdate: (updates: any) => void;
}) {
  const handleTagAdd = (tag: string) => {
    if (tag && !track.tags.includes(tag)) {
      onUpdate({ tags: [...track.tags, tag] });
    }
  };

  const handleTagRemove = (tag: string) => {
    onUpdate({ tags: track.tags.filter((t: string) => t !== tag) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="track-title">Título *</Label>
        <Input
          id="track-title"
          value={track.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Nome da trilha"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="track-description">Descrição</Label>
        <Textarea
          id="track-description"
          value={track.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Descreva o conteúdo da trilha..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Nível</Label>
        <RadioGroup
          value={track.level}
          onValueChange={(value: TrackLevel) => onUpdate({ level: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner" className="font-normal cursor-pointer">
              Iniciante
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate" className="font-normal cursor-pointer">
              Intermediário
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced" className="font-normal cursor-pointer">
              Avançado
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="track-hours">Duração Estimada (horas)</Label>
        <Input
          id="track-hours"
          type="number"
          min="0"
          value={track.estimatedHours}
          onChange={(e) => onUpdate({ estimatedHours: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {track.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <button
                onClick={() => handleTagRemove(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Adicionar tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTagAdd(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              handleTagAdd(input.value);
              input.value = '';
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
        <div>
          <span className="font-medium">Criado em:</span>{' '}
          {format(track.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </div>
        <div>
          <span className="font-medium">Última edição:</span>{' '}
          {format(track.updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </div>
        <div>
          <span className="font-medium">Por:</span> {track.updatedBy}
        </div>
      </div>
    </div>
  );
}

function ModuleProperties({
  module,
  onUpdate,
}: {
  module: any;
  onUpdate: (moduleId: string, updates: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="module-title">Título *</Label>
        <Input
          id="module-title"
          value={module.title}
          onChange={(e) => onUpdate(module.id, { title: e.target.value })}
          placeholder="Nome do módulo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="module-description">Descrição</Label>
        <Textarea
          id="module-description"
          value={module.description}
          onChange={(e) => onUpdate(module.id, { description: e.target.value })}
          placeholder="Descreva o conteúdo do módulo..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="module-minutes">Duração Estimada (minutos)</Label>
        <Input
          id="module-minutes"
          type="number"
          min="0"
          value={module.estimatedMinutes}
          onChange={(e) =>
            onUpdate(module.id, { estimatedMinutes: parseInt(e.target.value) || 0 })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="module-order">Ordem</Label>
        <Input
          id="module-order"
          type="number"
          min="0"
          value={module.order + 1}
          onChange={(e) => onUpdate(module.id, { order: parseInt(e.target.value) - 1 || 0 })}
          disabled
        />
        <p className="text-xs text-muted-foreground">
          Use drag-and-drop na árvore para reordenar
        </p>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <div className="flex items-center gap-2">
          <Badge variant={module.isComplete ? 'default' : 'secondary'}>
            {module.isComplete ? 'Completo' : 'Incompleto'}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Aulas</Label>
        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-medium">{module.lessons.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Completas:</span>
            <span className="font-medium">
              {module.lessons.filter((l: any) => l.isComplete).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonProperties({
  lesson,
  onUpdate,
}: {
  lesson: any;
  onUpdate: (lessonId: string, updates: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="lesson-title">Título *</Label>
        <Input
          id="lesson-title"
          value={lesson.title}
          onChange={(e) => onUpdate(lesson.id, { title: e.target.value })}
          placeholder="Nome da aula"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lesson-description">Descrição</Label>
        <Textarea
          id="lesson-description"
          value={lesson.description}
          onChange={(e) => onUpdate(lesson.id, { description: e.target.value })}
          placeholder="Descreva o conteúdo da aula..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lesson-minutes">Duração Estimada (minutos)</Label>
        <Input
          id="lesson-minutes"
          type="number"
          min="0"
          value={lesson.estimatedMinutes}
          onChange={(e) =>
            onUpdate(lesson.id, { estimatedMinutes: parseInt(e.target.value) || 0 })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lesson-order">Ordem</Label>
        <Input
          id="lesson-order"
          type="number"
          min="0"
          value={lesson.order + 1}
          onChange={(e) => onUpdate(lesson.id, { order: parseInt(e.target.value) - 1 || 0 })}
          disabled
        />
        <p className="text-xs text-muted-foreground">
          Use drag-and-drop na árvore para reordenar
        </p>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <div className="flex items-center gap-2">
          <Badge variant={lesson.isComplete ? 'default' : 'secondary'}>
            {lesson.isComplete ? 'Completa' : 'Incompleta'}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Blocos de Conteúdo</Label>
        <div className="text-sm space-y-1">
          {lesson.contentBlocks.map((block: any) => (
            <div key={block.id} className="flex justify-between">
              <span className="text-muted-foreground capitalize">{block.type}:</span>
              <Badge variant="outline" className="text-xs">
                {block.type}
              </Badge>
            </div>
          ))}
          {lesson.contentBlocks.length === 0 && (
            <p className="text-muted-foreground">Nenhum bloco adicionado</p>
          )}
        </div>
      </div>
    </div>
  );
}
