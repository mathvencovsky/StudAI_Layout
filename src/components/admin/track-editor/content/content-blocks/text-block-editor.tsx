import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import type { ContentBlock, TextContent, TextBlockType, CalloutType } from '@/types/admin-track';

interface TextBlockEditorProps {
  block: ContentBlock;
}

export function TextBlockEditor({ block }: TextBlockEditorProps) {
  const updateContentBlock = useAdminTrackStore((state) => state.updateContentBlock);
  
  const textContent = block.content as TextContent;

  const handleUpdate = (updates: Partial<TextContent>) => {
    updateContentBlock(block.id, {
      content: { ...textContent, ...updates },
      isComplete: Boolean((textContent.content || updates.content)?.trim()),
    });
  };

  const getCalloutIcon = (type?: CalloutType) => {
    switch (type) {
      case 'tip':
        return '💡';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✓';
      case 'info':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  return (
    <div className="space-y-4">
      {/* Type Selector */}
      <div className="space-y-2">
        <Label>Tipo de Bloco</Label>
        <Select
          value={textContent.type}
          onValueChange={(value: TextBlockType) => handleUpdate({ type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Texto Normal</SelectItem>
            <SelectItem value="callout">Callout (Destaque)</SelectItem>
            <SelectItem value="note">Nota (Observação)</SelectItem>
            <SelectItem value="highlight">Destaque</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Callout Type (if applicable) */}
      {textContent.type === 'callout' && (
        <div className="space-y-2">
          <Label>Tipo de Callout</Label>
          <Select
            value={textContent.calloutType || 'tip'}
            onValueChange={(value: CalloutType) => handleUpdate({ calloutType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tip">💡 Dica</SelectItem>
              <SelectItem value="warning">⚠️ Aviso</SelectItem>
              <SelectItem value="success">✓ Sucesso</SelectItem>
              <SelectItem value="info">ℹ️ Informação</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Content Editor */}
      <div className="space-y-2">
        <Label htmlFor="text-content">Conteúdo</Label>
        <div className="text-xs text-muted-foreground mb-2">
          Suporta Markdown básico: **negrito**, *itálico*, [link](url)
        </div>
        <Textarea
          id="text-content"
          value={textContent.content}
          onChange={(e) => handleUpdate({ content: e.target.value })}
          placeholder="Digite o conteúdo aqui..."
          rows={12}
          className="font-mono text-sm"
        />
      </div>

      {/* Preview */}
      {textContent.content && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div
            className={`p-4 rounded-lg border ${
              textContent.type === 'callout'
                ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                : textContent.type === 'note'
                ? 'bg-muted'
                : textContent.type === 'highlight'
                ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
                : ''
            }`}
          >
            {textContent.type === 'callout' && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getCalloutIcon(textContent.calloutType)}</span>
                <span className="font-medium">
                  {textContent.calloutType === 'tip' && 'Dica'}
                  {textContent.calloutType === 'warning' && 'Aviso'}
                  {textContent.calloutType === 'success' && 'Sucesso'}
                  {textContent.calloutType === 'info' && 'Informação'}
                </span>
              </div>
            )}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {textContent.content.split('\n').map((line, i) => (
                <p key={i}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
        <div>
          <span className="font-medium">Caracteres:</span> {textContent.content.length}
        </div>
        <div>
          <span className="font-medium">Palavras:</span>{' '}
          {textContent.content.trim().split(/\s+/).filter(Boolean).length}
        </div>
      </div>
    </div>
  );
}
