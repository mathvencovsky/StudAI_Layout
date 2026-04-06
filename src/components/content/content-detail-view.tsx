import { isYouTubeUrl } from "@/lib/youtube-utils";
import { YouTubeEmbed } from "./youtube-embed";
import { ExternalLink } from "./external-link";
import { ContentHeader } from "./content-metadata";
import { ContentDetailTabs } from "./content-detail-tabs";
import { ContentNavigationButtons } from "./content-navigation-buttons";
import { AiStudyAssistant } from "./ai-study-assistant";
import type { Content } from "@/model/content";

export interface ContentDetailViewProps {
  content: Content;
  moduleId?: string;
  isCompleted?: boolean;
  isLoading?: boolean;
  onToggleCompletion?: (isCompleted: boolean) => void;
  currentPosition?: number;
  totalItems?: number;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  onCompleteModule?: () => void;
  isNavigating?: boolean;
}

/**
 * Displays content details with embedded media, AI assistant inline, and navigation.
 */
export const ContentDetailView = ({
  content,
  moduleId,
  isCompleted = false,
  isLoading = false,
  onToggleCompletion,
  currentPosition,
  totalItems,
  onNavigatePrevious,
  onNavigateNext,
  onCompleteModule,
  isNavigating = false,
}: ContentDetailViewProps) => {
  const isYouTube = isYouTubeUrl(content.link);

  return (
    <div className="space-y-6">
      {/* Media */}
      {isYouTube ? (
        <YouTubeEmbed url={content.link} />
      ) : (
        <ExternalLink url={content.link} />
      )}

      {/* Title + completion */}
      <ContentHeader
        content={content}
        moduleId={moduleId}
        isCompleted={isCompleted}
        isLoading={isLoading}
        onToggleCompletion={onToggleCompletion}
      />

      {/* AI Assistant — always visible, inline below the video */}
      <AiStudyAssistant content={content} inline />

      {/* Description / transcript / summary tabs */}
      <ContentDetailTabs
        description={content.description}
        aiTranscript={content.aiTranscript}
        aiSummary={content.aiSummary}
      />

      {/* Module navigation */}
      {moduleId &&
        currentPosition !== undefined &&
        totalItems !== undefined &&
        onNavigatePrevious &&
        onNavigateNext && (
          <div className="pt-4 border-t">
            <ContentNavigationButtons
              currentPosition={currentPosition}
              totalItems={totalItems}
              onPrevious={onNavigatePrevious}
              onNext={onNavigateNext}
              onCompleteModule={onCompleteModule}
              isLoading={isNavigating}
            />
          </div>
        )}
    </div>
  );
};
