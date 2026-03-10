import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import type { ContentBlock, ResourcesContent } from '@/types/admin-track';

interface ResourcesBlockEditorProps {
  block: ContentBlock;
}

export function ResourcesBlockEditor({ block }: ResourcesBlockEditorProps) {
  const updateContentBlock = useAdminTrackStore((state) => state.updateContentBlock);
  
  const resourcesContent = block.content as ResourcesContent;

  const handleUpdate = (updates: Partial<ResourcesContent>) => {
    const newContent = { ...resourcesContent, ...updates };
    updateContentBlock(block.id, {
      content: newContent,
      isComplete: newContent.links.length > 0 || newContent.downloads.length > 0 || newContent.references.length > 0,
    });
  };

  const addLink = () => {
    handleUpdate({
      links: [...resourcesContent.links, { title: '', url: '', description: '' }],
    });
  };

  const updateLink = (index: number, updates: any) => {
    const newLinks = [...resourcesContent.links];
    newLinks[index] = { ...newLinks[index], ...updates };
    handleUpdate({ links: newLinks });
  };

  const deleteLink = (index: number) => {
    handleUpdate({
      links: resourcesContent.links.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Links Externos</h4>
          <Button onClick={addLink} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Link
          </Button>
        </div>

        {resourcesContent.links.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed rounded-lg">
            <LinkIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">Nenhum link adicionado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resourcesContent.links.map((link, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={link.title}
                      onChange={(e) => updateLink(index, { title: e.target.value })}
                      placeholder="Título do link"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(index, { url: e.target.value })}
                      placeholder="https://..."
                      type="url"
                    />
                    <Input
                      value={link.description || ''}
                      onChange={(e) => updateLink(index, { description: e.target.value })}
                      placeholder="Descrição (opcional)"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLink(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
