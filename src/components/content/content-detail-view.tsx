import { isYouTubeUrl } from "@/lib/youtube-utils";
import { YouTubeEmbed } from "./youtube-embed";
import { ExternalLink } from "./external-link";
import { ContentHeader } from "./content-metadata";
import { ContentNavigationButtons } from "./content-navigation-buttons";
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
 * Displays content details with embedded media or external link.
 * Includes navigation buttons when viewing content within a module context.
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
      <ContentHeader
        content={content}
        moduleId={moduleId}
        isCompleted={isCompleted}
        isLoading={isLoading}
        onToggleCompletion={onToggleCompletion}
      />
      {isYouTube ? (
        <YouTubeEmbed url={content.link} />
      ) : (
        <ExternalLink url={content.link} />
      )}
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
