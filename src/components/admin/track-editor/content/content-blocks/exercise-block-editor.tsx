import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import type { ContentBlock, ExerciseContent } from '@/types/admin-track';

interface ExerciseBlockEditorProps {
  block: ContentBlock;
}

export function ExerciseBlockEditor({ block }: ExerciseBlockEditorProps) {
  const updateContentBlock = useAdminTrackStore((state) => state.updateContentBlock);
  
  const exerciseContent = block.content as ExerciseContent;

  const handleUpdate = (updates: Partial<ExerciseContent>) => {
    const newContent = { ...exerciseContent, ...updates };
    updateContentBlock(block.id, {
      content: newContent,
      isComplete: Boolean(newContent.title.trim() && newContent.description.trim()),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exercise-title">Título do Exercício *</Label>
        <Input
          id="exercise-title"
          value={exerciseContent.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Ex: Crie um componente React"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="exercise-description">Descrição *</Label>
        <Textarea
          id="exercise-description"
          value={exerciseContent.description}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          placeholder="Descreva o exercício..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="exercise-instructions">Instruções (uma por linha)</Label>
        <Textarea
          id="exercise-instructions"
          value={exerciseContent.instructions.join('\n')}
          onChange={(e) => handleUpdate({ instructions: e.target.value.split('\n').filter(Boolean) })}
          placeholder="1. Primeiro passo&#10;2. Segundo passo&#10;3. Terceiro passo"
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="exercise-minutes">Tempo Estimado (minutos)</Label>
        <Input
          id="exercise-minutes"
          type="number"
          min="0"
          value={exerciseContent.estimatedMinutes}
          onChange={(e) => handleUpdate({ estimatedMinutes: parseInt(e.target.value) || 0 })}
        />
      </div>
    </div>
  );
}
