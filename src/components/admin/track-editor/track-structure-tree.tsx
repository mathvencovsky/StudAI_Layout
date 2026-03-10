import { useState } from 'react';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  FileText,
  MoreVertical,
  Plus,
  CheckCircle2,
  AlertCircle,
  Circle,
  Video,
  FileEdit,
  CheckSquare,
  Dumbbell,
  Paperclip,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminModule, AdminLesson } from '@/types/admin-track';

interface TrackStructureTreeProps {
  searchQuery: string;
}

export function TrackStructureTree({ searchQuery }: TrackStructureTreeProps) {
  const currentTrack = useAdminTrackStore((state) => state.currentTrack);
  const selectedModuleId = useAdminTrackStore((state) => state.selectedModuleId);
  const selectedLessonId = useAdminTrackStore((state) => state.selectedLessonId);
  const selectModule = useAdminTrackStore((state) => state.selectModule);
  const selectLesson = useAdminTrackStore((state) => state.selectLesson);

  if (!currentTrack) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">Nenhuma trilha carregada</p>
      </div>
    );
  }

  if (currentTrack.modules.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm font-medium">Comece sua trilha</p>
        <p className="text-xs mt-1">
          Adicione o primeiro módulo para começar
        </p>
      </div>
    );
  }

  const filteredModules = searchQuery
    ? currentTrack.modules.filter(
        (module) =>
          module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.lessons.some((lesson) =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : currentTrack.modules;

  return (
    <div className="space-y-1">
      {filteredModules.map((module) => (
        <ModuleTreeItem
          key={module.id}
          module={module}
          isSelected={selectedModuleId === module.id}
          selectedLessonId={selectedLessonId}
          onSelectModule={selectModule}
          onSelectLesson={selectLesson}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}

interface ModuleTreeItemProps {
  module: AdminModule;
  isSelected: boolean;
  selectedLessonId: string | null;
  onSelectModule: (moduleId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  searchQuery: string;
}

function ModuleTreeItem({
  module,
  isSelected,
  selectedLessonId,
  onSelectModule,
  onSelectLesson,
  searchQuery,
}: ModuleTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(isSelected || searchQuery.length > 0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(module.title);
  
  const updateModule = useAdminTrackStore((state) => state.updateModule);
  const deleteModule = useAdminTrackStore((state) => state.deleteModule);
  const duplicateModule = useAdminTrackStore((state) => state.duplicateModule);
  const addLesson = useAdminTrackStore((state) => state.addLesson);

  const handleTitleSave = () => {
    if (titleValue.trim() && titleValue !== module.title) {
      updateModule(module.id, { title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleAddLesson = () => {
    addLesson(module.id, {
      moduleId: module.id,
      title: 'Nova Aula',
      description: '',
      estimatedMinutes: 0,
      order: module.lessons.length,
      contentBlocks: [],
      status: 'draft',
      isComplete: false,
    });
    setIsExpanded(true);
  };

  const getStatusIcon = () => {
    if (module.isComplete) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    if (module.lessons.length === 0) {
      return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const completedLessons = module.lessons.filter((l) => l.isComplete).length;
  const progressPercentage =
    module.lessons.length > 0 ? (completedLessons / module.lessons.length) * 100 : 0;

  return (
    <div className="space-y-1">
      {/* Module Item */}
      <div
        className={cn(
          'group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer transition-colors',
          isSelected && 'bg-accent'
        )}
      >
        {/* Drag Handle */}
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

        {/* Expand/Collapse */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        {/* Icon */}
        <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />

        {/* Title */}
        <div className="flex-1 min-w-0" onClick={() => onSelectModule(module.id)}>
          {isEditingTitle ? (
            <Input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave();
                if (e.key === 'Escape') {
                  setTitleValue(module.title);
                  setIsEditingTitle(false);
                }
              }}
              className="h-6 text-sm"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium truncate"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
              >
                {module.title}
              </span>
              {getStatusIcon()}
            </div>
          )}
        </div>

        {/* Progress & Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-xs text-muted-foreground">
            {completedLessons}/{module.lessons.length}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => duplicateModule(module.id)}>
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddLesson}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Aula
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteModule(module.id)}
                className="text-destructive"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Progress Bar */}
      {isExpanded && module.lessons.length > 0 && (
        <div className="ml-10 mr-2 mb-1">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Lessons */}
      {isExpanded && (
        <div className="ml-6 space-y-1">
          {module.lessons.map((lesson) => (
            <LessonTreeItem
              key={lesson.id}
              lesson={lesson}
              isSelected={selectedLessonId === lesson.id}
              onSelect={onSelectLesson}
            />
          ))}

          {module.lessons.length === 0 && (
            <div className="ml-6 py-2 text-xs text-muted-foreground">
              Nenhuma aula ainda
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="ml-6 h-7 text-xs"
            onClick={handleAddLesson}
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Aula
          </Button>
        </div>
      )}
    </div>
  );
}

interface LessonTreeItemProps {
  lesson: AdminLesson;
  isSelected: boolean;
  onSelect: (lessonId: string) => void;
}

function LessonTreeItem({ lesson, isSelected, onSelect }: LessonTreeItemProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(lesson.title);
  
  const updateLesson = useAdminTrackStore((state) => state.updateLesson);
  const deleteLesson = useAdminTrackStore((state) => state.deleteLesson);
  const duplicateLesson = useAdminTrackStore((state) => state.duplicateLesson);

  const handleTitleSave = () => {
    if (titleValue.trim() && titleValue !== lesson.title) {
      updateLesson(lesson.id, { title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  const getStatusIcon = () => {
    if (lesson.isComplete) {
      return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    }
    if (lesson.contentBlocks.length === 0) {
      return <Circle className="h-3 w-3 text-muted-foreground" />;
    }
    return <AlertCircle className="h-3 w-3 text-yellow-500" />;
  };

  const getContentIcons = () => {
    const icons = [];
    const hasVideo = lesson.contentBlocks.some((b) => b.type === 'video');
    const hasText = lesson.contentBlocks.some((b) => b.type === 'text');
    const hasQuiz = lesson.contentBlocks.some((b) => b.type === 'quiz');
    const hasExercise = lesson.contentBlocks.some((b) => b.type === 'exercise');
    const hasResources = lesson.contentBlocks.some((b) => b.type === 'resources');

    if (hasVideo) icons.push(<Video key="video" className="h-3 w-3" />);
    if (hasText) icons.push(<FileEdit key="text" className="h-3 w-3" />);
    if (hasQuiz) icons.push(<CheckSquare key="quiz" className="h-3 w-3" />);
    if (hasExercise) icons.push(<Dumbbell key="exercise" className="h-3 w-3" />);
    if (hasResources) icons.push(<Paperclip key="resources" className="h-3 w-3" />);

    return icons;
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer transition-colors',
        isSelected && 'bg-accent'
      )}
      onClick={() => onSelect(lesson.id)}
    >
      {/* Drag Handle */}
      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

      {/* Icon */}
      <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />

      {/* Title */}
      <div className="flex-1 min-w-0">
        {isEditingTitle ? (
          <Input
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSave();
              if (e.key === 'Escape') {
                setTitleValue(lesson.title);
                setIsEditingTitle(false);
              }
            }}
            className="h-6 text-sm"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex items-center gap-2">
            <span
              className="text-sm truncate"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
            >
              {lesson.title}
            </span>
            {getStatusIcon()}
          </div>
        )}
      </div>

      {/* Content Icons & Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 text-muted-foreground">
          {getContentIcons()}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicateLesson(lesson.id)}>
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteLesson(lesson.id)}
              className="text-destructive"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
