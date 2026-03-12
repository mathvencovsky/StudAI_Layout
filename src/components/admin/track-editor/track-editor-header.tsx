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
  ArrowLeft,
  Save,
  Eye,
  Rocket,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  Loader2,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function TrackEditorHeader() {
  const currentTrack = useAdminTrackStore((state) => state.currentTrack);
  const autosaveStatus = useAdminTrackStore((state) => state.autosaveStatus);
  const lastSavedAt = useAdminTrackStore((state) => state.lastSavedAt);
  const togglePreview = useAdminTrackStore((state) => state.togglePreview);

  const getAutosaveIcon = () => {
    switch (autosaveStatus) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'saved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getAutosaveText = () => {
    switch (autosaveStatus) {
      case 'saving':
        return 'Salvando...';
      case 'saved':
        return lastSavedAt
          ? `Salvo ${format(lastSavedAt, 'HH:mm', { locale: ptBR })}`
          : 'Salvo';
      case 'error':
        return 'Erro ao salvar';
      case 'offline':
        return 'Offline';
      default:
        return 'Não salvo';
    }
  };

  const handlePublish = () => {
    // TODO: Implementar validação e publicação
    console.log('Publicar trilha');
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Left: Back + Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Trilhas</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium truncate max-w-[300px]">
              {currentTrack.title || 'Nova Trilha'}
            </span>
          </div>

          <Badge variant={currentTrack.status === 'published' ? 'default' : 'secondary'}>
            {currentTrack.status === 'published' ? 'Publicado' : 'Rascunho'}
          </Badge>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Autosave Indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {getAutosaveIcon()}
            <span>{getAutosaveText()}</span>
          </div>

          {/* Preview Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={togglePreview}>
                Preview Inline
              </DropdownMenuItem>
              <DropdownMenuItem>
                Abrir em Nova Aba
              </DropdownMenuItem>
              <DropdownMenuItem>
                Compartilhar Preview
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Save className="h-4 w-4 mr-2" />
                Salvar Manualmente
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clock className="h-4 w-4 mr-2" />
                Histórico de Versões
              </DropdownMenuItem>
              <DropdownMenuItem>
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem>
                Ajuda
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Publish Button */}
          <Button onClick={handlePublish} size="sm">
            <Rocket className="h-4 w-4 mr-2" />
            Publicar
          </Button>
        </div>
      </div>
    </header>
  );
}
