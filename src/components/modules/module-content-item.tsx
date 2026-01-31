import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { useExtractMetadata } from "@/hooks/metadata/use-extract-metadata";
import { useNavigate } from "@tanstack/react-router";
import { formatDuration } from "@/lib/duration-utils";
import type { ModuleContentWithContentType } from "@/api/module-content";
import type { UserContentProgress } from "@/model/user-content-progress";
import useIsOnScreen from "@/hooks/use-is-on-screen";
import { useRef } from "react";

export interface ModuleContentItemProps {
  moduleContent: ModuleContentWithContentType;
  progress: UserContentProgress | undefined;
  hasStarted: boolean;
  moduleId: string;
  onToggleCompletion: (
    contentId: string,
    isCompleted: boolean,
  ) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Displays individual module content item in a list format with checkbox, image, title, description, and view button.
 * Shows completion checkbox only if user has started the module.
 */
export const ModuleContentItem = ({
  moduleContent,
  progress,
  hasStarted,
  moduleId,
  onToggleCompletion,
  isLoading = false,
}: ModuleContentItemProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useIsOnScreen(containerRef);
  const { data: metadata, isLoading: isMetadataLoading } = useExtractMetadata(
    moduleContent.content.link ?? "",
    isOnScreen,
  );

  const handleCheckboxChange = async (checked: boolean) => {
    await onToggleCompletion(moduleContent.contentId, checked);
  };

  const handleItemClick = () => {
    navigate({
      to: "/module/$moduleId/content/$contentId",
      params: { contentId: moduleContent.contentId, moduleId },
    });
  };

  const truncateDescription = (text: string | undefined, lines: number) => {
    if (!text) return "";
    const lineArray = text.split("\n").slice(0, lines);
    return lineArray.join("\n");
  };

  const displayTitle =
    metadata?.title || moduleContent.content.title || t("untitled");
  const displayDescription =
    metadata?.description ||
    moduleContent.content.description ||
    t("no-description-available");
  const displayImage = moduleContent.content.thumbnailUrl ?? metadata?.image;

  return (
    <div
      ref={containerRef}
      onClick={handleItemClick}
      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
    >
      {hasStarted && (
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={progress?.isCompleted || false}
            onCheckedChange={handleCheckboxChange}
            disabled={isLoading}
          />
        </div>
      )}

      <div className="flex-shrink-0">
        {isMetadataLoading ? (
          <Skeleton className="w-20 h-20 rounded-md" />
        ) : displayImage ? (
          <img
            src={displayImage}
            alt={displayTitle}
            className="w-20 h-20 object-contain rounded-md bg-muted"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
            <span className="text-xs text-muted-foreground">
              {t("no-image")}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {isMetadataLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm line-clamp-1">
                {displayTitle}
              </h3>
              {moduleContent.content.durationInSeconds && (
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatDuration(moduleContent.content.durationInSeconds)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-wrap">
              {truncateDescription(displayDescription, 3)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
