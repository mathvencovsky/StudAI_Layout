import React, { useState } from "react";
import type { ExtractedMetadata } from "@/api/metadata";
import { truncateDescription, extractDomain } from "@/lib/metadata-utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

export interface ContentMetadataDisplayProps {
  metadata: ExtractedMetadata;
  descriptionMaxLines?: number;
}

/**
 * Presentational component that renders extracted preview metadata for a content item.
 * Displays title, description, image, and favicon with consistent styling.
 * Handles missing metadata fields gracefully with placeholder text.
 */
export const ContentMetadataDisplay: React.FC<ContentMetadataDisplayProps> = ({
  metadata,
  descriptionMaxLines = 2,
}) => {
  const [imageError, setImageError] = useState(false);
  const truncatedDescription = truncateDescription(
    metadata.description,
    descriptionMaxLines
  );
  const domain = extractDomain(metadata.url);

  return (
    <div className="flex flex-col gap-3">
      {/* Image */}
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted rounded-md overflow-hidden"
      >
        {metadata.image && !imageError ? (
          <img
            src={metadata.image}
            alt={metadata.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}
      </AspectRatio>

      {/* Title with Favicon */}
      <div className="flex items-start gap-2">
        {metadata.favicon && (
          <Avatar className="h-4 w-4 flex-shrink-0 mt-0.5">
            <AvatarImage src={metadata.favicon} alt="favicon" />
            <AvatarFallback className="text-[8px]">F</AvatarFallback>
          </Avatar>
        )}
        <h3 className="font-semibold text-sm line-clamp-2">
          {metadata.title || "Untitled"}
        </h3>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2">
        {truncatedDescription || "No description available"}
      </p>

      {/* Domain */}
      <Badge variant="secondary" className="w-fit text-[11px]">
        {domain || "Unknown source"}
      </Badge>
    </div>
  );
};
