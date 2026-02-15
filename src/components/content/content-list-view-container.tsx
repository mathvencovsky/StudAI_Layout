import React, { useRef } from "react";
import { ContentPreviewCard } from "./content-preview-card";
import { useExtractMetadata } from "@/hooks/metadata/use-extract-metadata";
import type { Content } from "@/model/content";
import useIsOnScreen from "@/hooks/use-is-on-screen";

interface ContentPreviewCardContainerProps {
  item: Content;
  onEdit: (id: string) => void;
}

/**
 * Container component that manages metadata fetching for a single content item.
 * Handles loading and error states, passing data to ContentPreviewCard.
 */
export const ContentPreviewCardContainer: React.FC<
  ContentPreviewCardContainerProps
> = ({ item, onEdit }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isOnScreen = useIsOnScreen(ref);

  const { data: metadata, isLoading } = useExtractMetadata(
    item.link,
    isOnScreen
  );

  return (
    <ContentPreviewCard
      ref={ref}
      item={item}
      metadata={metadata || undefined}
      isLoading={isLoading}
      onEdit={onEdit}
    />
  );
};
