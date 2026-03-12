import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import { TrackStructureTree } from './track-structure-tree';
import { Search, Plus, BarChart3, Copy, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TrackEditorSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const currentTrack = useAdminTrackStore((state) => state.currentTrack);
  const isSidebarCollapsed = useAdminTrackStore((state) => state.isSidebarCollapsed);
  const addModule = useAdminTrackStore((state) => state.addModule);

  const handleAddModule = () => {
    if (!currentTrack) return;
    
    addModule({
      trackId: currentTrack.id,
      title: 'Novo Módulo',
      description: '',
      objectives: [],
      estimatedMinutes: 0,
      order: currentTrack.modules.length,
      lessons: [],
      status: 'draft',
      isComplete: false,
    });
  };

  if (!currentTrack) {
    return null;
  }

  const completedModules = currentTrack.modules.filter((m) => m.isComplete).length;
  const totalModules = currentTrack.modules.length;
  const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  return (
    <aside
      className={cn(
        'w-80 border-r bg-muted/10 flex flex-col transition-all duration-300',
        isSidebarCollapsed && 'w-0 overflow-hidden'
      )}
    >
      {/* Track Info */}
      <div className="p-4 border-b space-y-3">
        <div>
          <h2 className="font-semibold text-lg truncate">{currentTrack.title}</h2>
          <p className="text-sm text-muted-foreground">
            {currentTrack.status === 'published' ? 'Publicado' : 'Rascunho'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {completedModules} de {totalModules} módulos completos
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar na estrutura..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Structure Tree */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Estrutura da Trilha</h3>
          </div>
          
          <TrackStructureTree searchQuery={searchQuery} />

          <Button
            onClick={handleAddModule}
            variant="outline"
            size="sm"
            className="w-full mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Módulo
          </Button>
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t space-y-2">
        <p className="text-xs font-medium text-muted-foreground mb-2">Ações Rápidas</p>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <BarChart3 className="h-4 w-4 mr-2" />
          Ver Estatísticas
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Copy className="h-4 w-4 mr-2" />
          Duplicar Trilha
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
    </aside>
  );
}
