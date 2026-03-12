import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import {
  Plus,
  Video,
  FileEdit,
  CheckSquare,
  Dumbbell,
  Paperclip,
  GripVertical,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import type { AdminLesson, ContentBlockType } from '@/types/admin-track';
import { ContentBlockEditor } from './content-blocks/content-block-editor';

interface LessonEditorProps {
  lesson: AdminLesson;
}

export function LessonEditor({ lesson }: LessonEditorProps) {
  const addContentBlock = useAdminTrackStore((state) => state.addContentBlock);
  const deleteContentBlock = useAdminTrackStore((state) => state.deleteContentBlock);
  const selectedBlockId = useAdminTrackStore((state) => state.selectedBlockId);

  const handleAddBlock = (type: ContentBlockType) => {
    const defaultContent = getDefaultContent(type);
    
    addContentBlock(lesson.id, {
      lessonId: lesson.id,
      type,
      order: lesson.contentBlocks.length,
      content: defaultContent,
      isComplete: false,
    });
  };

  const getDefaultContent = (type: ContentBlockType): any => {
    switch (type) {
      case 'video':
        return {
          videoId: '',
          videoTitle: '',
          videoDuration: 0,
          videoThumbnail: '',
          videoUrl: '',
        };
      case 'text':
        return {
          type: 'text' as const,
          content: '',
        };
      case 'quiz':
        return {
          title: 'Novo Quiz',
          passingScore: 70,
          questions: [],
          showFeedbackImmediately: true,
          allowRetry: true,
        };
      case 'exercise':
        return {
          title: 'Novo Exercício',
          description: '',
          instructions: [],
          requiredResources: [],
          evaluationCriteria: [],
          estimatedMinutes: 0,
        };
      case 'resources':
        return {
          links: [],
          downloads: [],
          references: [],
        };
      default:
        return {};
    }
  };

  const getBlockIcon = (type: ContentBlockType) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'text':
        return <FileEdit className="h-4 w-4" />;
      case 'quiz':
        return <CheckSquare className="h-4 w-4" />;
      case 'exercise':
        return <Dumbbell className="h-4 w-4" />;
      case 'resources':
        return <Paperclip className="h-4 w-4" />;
    }
  };

  const getBlockLabel = (type: ContentBlockType) => {
    switch (type) {
      case 'video':
        return 'Vídeo';
      case 'text':
        return 'Texto';
      case 'quiz':
        return 'Quiz';
      case 'exercise':
        return 'Exercício';
      case 'resources':
        return 'Recursos';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <Badge variant={lesson.isComplete ? 'default' : 'secondary'}>
            {lesson.isComplete ? 'Completa' : 'Incompleta'}
          </Badge>
        </div>
        <p className="text-muted-foreground">{lesson.description || 'Sem descrição'}</p>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {lesson.contentBlocks.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <FileEdit className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Adicione conteúdo a esta aula</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Escolha o tipo de conteúdo que deseja adicionar
                </p>
                <AddContentMenu onAdd={handleAddBlock} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {lesson.contentBlocks.map((block, index) => (
              <Card
                key={block.id}
                className={selectedBlockId === block.id ? 'ring-2 ring-primary' : ''}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    
                    <div className="flex items-center gap-2">
                      {getBlockIcon(block.type)}
                      <CardTitle className="text-base">
                        Bloco {index + 1}: {getBlockLabel(block.type)}
                      </CardTitle>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                      <Badge variant={block.isComplete ? 'default' : 'secondary'} className="text-xs">
                        {block.isComplete ? 'Completo' : 'Incompleto'}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => deleteContentBlock(block.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ContentBlockEditor block={block} />
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center">
              <AddContentMenu onAdd={handleAddBlock} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AddContentMenu({ onAdd }: { onAdd: (type: ContentBlockType) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Conteúdo
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuItem onClick={() => onAdd('video')}>
          <Video className="h-4 w-4 mr-2" />
          <div>
            <div className="font-medium">Vídeo</div>
            <div className="text-xs text-muted-foreground">Da biblioteca</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('text')}>
          <FileEdit className="h-4 w-4 mr-2" />
          <div>
            <div className="font-medium">Texto</div>
            <div className="text-xs text-muted-foreground">Editor rico</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('quiz')}>
          <CheckSquare className="h-4 w-4 mr-2" />
          <div>
            <div className="font-medium">Quiz</div>
            <div className="text-xs text-muted-foreground">Questões e respostas</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('exercise')}>
          <Dumbbell className="h-4 w-4 mr-2" />
          <div>
            <div className="font-medium">Exercício</div>
            <div className="text-xs text-muted-foreground">Prática guiada</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('resources')}>
          <Paperclip className="h-4 w-4 mr-2" />
          <div>
            <div className="font-medium">Recursos</div>
            <div className="text-xs text-muted-foreground">Links e downloads</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
