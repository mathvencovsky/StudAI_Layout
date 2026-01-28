import type React from "react";
import { useTranslation } from "react-i18next";
import type { ExtractedMetadata } from "@/api/metadata";
import { ContentMetadataDisplay } from "./content-metadata-display";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { extractDomain } from "@/lib/metadata-utils";
import type { Content } from "@/model/content";

export interface ContentPreviewCardProps {
  item: Content;
  ref: React.Ref<HTMLDivElement>;
  metadata?: ExtractedMetadata;
  isLoading?: boolean;
  onEdit?: (id: string) => void;
}

/**
 * Card component that displays content with extracted preview metadata.
 * Shows loading state while metadata is being fetched and displays fallback
 * information when metadata extraction fails.
 */
export const ContentPreviewCard: React.FC<ContentPreviewCardProps> = ({
  item,
  metadata,
  isLoading = false,
  onEdit,
  ref,
}) => {
  const { t } = useTranslation();
  const domain = extractDomain(item.link);

  return (
    <Card className="flex flex-col h-full overflow-hidden" ref={ref}>
      {/* Loading State */}
      {isLoading ? (
        <CardContent className="pt-6 space-y-3">
          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-8 w-16" />
        </CardContent>
      ) : metadata ? (
        /* Metadata Display */
        <CardContent className="pt-6">
          <ContentMetadataDisplay metadata={metadata} descriptionMaxLines={2} />
        </CardContent>
      ) : (
        /* Fallback Information */
        <CardContent className="pt-6 space-y-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2">
              {item.title || t("untitled")}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.description || t("no-description-available")}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground font-medium">
              {t("link")}
            </p>
            <p className="text-[11px] text-muted-foreground break-words">
              {domain || t("unknown-source")}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium">{t("type")}:</span> {item.type}
            </p>
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium">{t("category")}:</span>{" "}
              {item.category}
            </p>
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium">{t("level")}:</span> {item.level}
            </p>
          </div>
        </CardContent>
      )}

      {/* Edit Button */}
      {onEdit && !isLoading && (
        <div className="px-6 pb-6 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item.id)}
            className="w-full"
          >
            {t("edit")}
          </Button>
        </div>
      )}
    </Card>
  );
};
