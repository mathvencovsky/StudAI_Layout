import type { ContentBlock } from '@/types/admin-track';
import { VideoBlockEditor } from './video-block-editor';
import { TextBlockEditor } from './text-block-editor';
import { QuizBlockEditor } from './quiz-block-editor';
import { ExerciseBlockEditor } from './exercise-block-editor';
import { ResourcesBlockEditor } from './resources-block-editor';

interface ContentBlockEditorProps {
  block: ContentBlock;
}

export function ContentBlockEditor({ block }: ContentBlockEditorProps) {
  switch (block.type) {
    case 'video':
      return <VideoBlockEditor block={block} />;
    case 'text':
      return <TextBlockEditor block={block} />;
    case 'quiz':
      return <QuizBlockEditor block={block} />;
    case 'exercise':
      return <ExerciseBlockEditor block={block} />;
    case 'resources':
      return <ResourcesBlockEditor block={block} />;
    default:
      return <div>Tipo de bloco desconhecido</div>;
  }
}
