import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createContent } from "@/api/content";
import { extractYouTubeMetadata } from "@/api/youtube";
import { getYouTubeVideoId } from "@/api/metadata/youtube";
import { CONTENT_TYPES, CONTENT_LEVELS, type ContentType, type ContentLevel } from "@/model/content";

/**
 * Modal for bulk importing content by pasting a list of URLs.
 * Fetches YouTube metadata automatically for each link before creating.
 */
export const ContentBulkImportModal: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState<string[]>([""]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddLink = () => setLinks((prev) => [...prev, ""]);

  const handleRemoveLink = (index: number) =>
    setLinks((prev) => prev.filter((_, i) => i !== index));

  const handleLinkChange = (index: number, value: string) =>
    setLinks((prev) => prev.map((l, i) => (i === index ? value : l)));

  const handleCreate = async () => {
    const validLinks = links.map((l) => l.trim()).filter(Boolean);
    if (validLinks.length === 0) return;

    setIsCreating(true);
    setError(null);

    try {
      for (const link of validLinks) {
        try {
          const videoId = getYouTubeVideoId(link);
          const metadata = videoId ? await extractYouTubeMetadata(link, videoId) : null;

          const normalizedType = "youtube_video";
          const parsedType = CONTENT_TYPES.includes(normalizedType as ContentType)
            ? (normalizedType as ContentType)
            : "article";
          const parsedLevel: ContentLevel = CONTENT_LEVELS.includes("beginner" as ContentLevel)
            ? "beginner"
            : CONTENT_LEVELS[0];

          const rawPublishedAt = metadata?.publishedAt;
          const publishedAt =
            rawPublishedAt && !isNaN(Date.parse(rawPublishedAt))
              ? new Date(rawPublishedAt).toISOString()
              : undefined;

          await createContent({
            type: videoId ? parsedType : "article",
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

          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          console.error("Failed to import link", link, err);
        }
      }

      setOpen(false);
      setLinks([""]);
    } catch (err) {
      console.error("Bulk import failed", err);
      setError(t("bulk-import-error"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!isCreating) {
      setOpen(value);
      if (!value) {
        setLinks([""]);
        setError(null);
      }
    }
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        {t("bulk-import-links")}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("bulk-import-links")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-80 overflow-y-auto py-1">
            {links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder={t("bulk-import-link-placeholder")}
                  disabled={isCreating}
                />
                {links.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLink(index)}
                    disabled={isCreating}
                    aria-label={t("remove")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddLink}
            disabled={isCreating}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("bulk-import-add-link")}
          </Button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isCreating}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isCreating || links.every((l) => !l.trim())}
            >
              {isCreating ? t("uploading") : t("create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
