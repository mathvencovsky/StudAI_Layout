import { ReactNode } from 'react';
import { useAdminTrackStore } from '@/stores/admin-track-store';
import { TrackEditorHeader } from './track-editor-header';
import { TrackEditorSidebar } from './track-editor-sidebar';
import { TrackEditorPropertiesPanel } from './track-editor-properties-panel';
import { cn } from '@/lib/utils';

interface TrackEditorLayoutProps {
  children: ReactNode;
}

export function TrackEditorLayout({ children }: TrackEditorLayoutProps) {
  const isSidebarCollapsed = useAdminTrackStore((state) => state.isSidebarCollapsed);
  const isPropertiesPanelCollapsed = useAdminTrackStore(
    (state) => state.isPropertiesPanelCollapsed
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <TrackEditorHeader />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <TrackEditorSidebar />

        {/* Main Content Area */}
        <main
          className={cn(
            'flex-1 overflow-y-auto transition-all duration-300',
            isSidebarCollapsed ? 'ml-0' : 'ml-0',
            isPropertiesPanelCollapsed ? 'mr-0' : 'mr-0'
          )}
        >
          <div className="container mx-auto p-6 max-w-7xl">
            {children}
          </div>
        </main>

        {/* Properties Panel */}
        <TrackEditorPropertiesPanel />
      </div>
    </div>
  );
}
