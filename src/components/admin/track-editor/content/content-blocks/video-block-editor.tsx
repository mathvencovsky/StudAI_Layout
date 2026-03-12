import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import { Video, Search, Play, RefreshCw } from 'lucide-react';
import type { ContentBlock, VideoContent } from '@/types/admin-track';

interface VideoBlockEditorProps {
  block: ContentBlock;
}

export function VideoBlockEditor({ block }: VideoBlockEditorProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const updateContentBlock = useAdminTrackStore((state) => state.updateContentBlock);
  
  const videoContent = block.content as VideoContent;
  const hasVideo = videoContent.videoId !== '';

  const handleUpdate = (updates: Partial<VideoContent>) => {
    updateContentBlock(block.id, {
      content: { ...videoContent, ...updates },
      isComplete: Boolean((videoContent.videoId || updates.videoId)),
    });
  };

  if (!hasVideo) {
    return (
      <div className="text-center py-8">
        <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">Selecione um vídeo</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Escolha um vídeo da biblioteca para adicionar a esta aula
        </p>
        <Button onClick={() => setShowLibrary(true)}>
          <Search className="h-4 w-4 mr-2" />
          Abrir Biblioteca de Vídeos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {videoContent.videoThumbnail ? (
          <img
            src={videoContent.videoThumbnail}
            alt={videoContent.videoTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Video className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button size="lg" variant="secondary" className="rounded-full">
            <Play className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {Math.floor(videoContent.videoDuration / 60)}:{String(videoContent.videoDuration % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Video Info */}
      <div>
        <h4 className="font-medium mb-1">{videoContent.videoTitle}</h4>
        <p className="text-sm text-muted-foreground">
          ID: {videoContent.videoId} • {videoContent.videoDuration} segundos
        </p>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">Configurações Avançadas</h4>
          <span className="text-xs text-muted-foreground">(Opcional)</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start-time">Início (segundos)</Label>
            <Input
              id="start-time"
              type="number"
              min="0"
              max={videoContent.videoDuration}
              value={videoContent.startTime || 0}
              onChange={(e) => handleUpdate({ startTime: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">Fim (segundos)</Label>
            <Input
              id="end-time"
              type="number"
              min={videoContent.startTime || 0}
              max={videoContent.videoDuration}
              value={videoContent.endTime || videoContent.videoDuration}
              onChange={(e) => handleUpdate({ endTime: parseInt(e.target.value) || videoContent.videoDuration })}
              placeholder={String(videoContent.videoDuration)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructor-notes">Notas do Instrutor</Label>
          <Textarea
            id="instructor-notes"
            value={videoContent.instructorNotes || ''}
            onChange={(e) => handleUpdate({ instructorNotes: e.target.value })}
            placeholder="Observações sobre este vídeo..."
            rows={3}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" size="sm">
          <Play className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowLibrary(true)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Trocar Vídeo
        </Button>
      </div>

      {/* TODO: Video Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Biblioteca de Vídeos</h2>
            <p className="text-muted-foreground mb-4">
              Funcionalidade de biblioteca de vídeos será implementada aqui
            </p>
            <Button onClick={() => setShowLibrary(false)}>Fechar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
