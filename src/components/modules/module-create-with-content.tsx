import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ModuleWithContentForm,
  type ModuleWithContentFormValues,
} from "@/components/modules/forms/module-with-content-form";
import { createContent } from "@/api/content";
import { extractYouTubeMetadata } from "@/api/youtube";
import { getYouTubeVideoId } from "@/api/metadata/youtube";
import { useCreateModule } from "@/hooks/modules/use-create-module";
import { CONTENT_TYPES, type ContentLevel, type ContentType } from "@/model/content";

export interface ModuleCreateWithContentProps {
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Creates content items from YouTube links then creates a module with those content IDs.
 */
export const ModuleCreateWithContent: React.FC<ModuleCreateWithContentProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const createModule = useCreateModule();

  const handleSubmit = async (values: ModuleWithContentFormValues) => {
    const validLinks = values.links.map((l) => l.trim()).filter(Boolean);

    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      const contentIds: string[] = [];

      for (const link of validLinks) {
        try {
          const videoId = getYouTubeVideoId(link);
          const metadata = videoId ? await extractYouTubeMetadata(link, videoId) : null;

          const parsedType: ContentType = videoId && CONTENT_TYPES.includes("youtube_video" as ContentType)
            ? "youtube_video"
            : "article";
          const parsedLevel: ContentLevel = "beginner";

          const rawPublishedAt = metadata?.publishedAt;
          const publishedAt =
            rawPublishedAt && !isNaN(Date.parse(rawPublishedAt))
              ? new Date(rawPublishedAt).toISOString()
              : undefined;

          const content = await createContent({
            type: parsedType,
            category: "",
            level: parsedLevel,
            title: metadata?.title ?? link,
            description: metadata?.description ?? "",
            link,
            durationInSeconds: metadata?.durationInSeconds ?? 0,
            thumbnailUrl: metadata?.image,
            author: metadata?.author,
            publishedAt,
            language: metadata?.language,
          });

          contentIds.push(content.id);
        } catch (err) {
          console.error("Failed to create content for link", link, err);
        }
      }

      await new Promise<void>((resolve, reject) => {
        createModule.mutate(
          {
            title: values.title.trim(),
            description: values.description.trim(),
            contentIds,
          },
          { onSuccess: () => resolve(), onError: reject },
        );
      });

      onSuccess();
    } catch (err) {
      console.error("Failed to create module with content", err);
      setErrorMessage(t("couldnt-create-module"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModuleWithContentForm
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      errorMessage={errorMessage}
    />
  );
};
