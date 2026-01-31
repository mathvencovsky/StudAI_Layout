import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type CreateContentInput } from "@/api/content";
import {
  CONTENT_TYPES,
  CONTENT_LEVELS,
  type ContentType,
  type ContentLevel,
} from "@/model/content";
import { useFetchYouTubeMetadata } from "@/hooks/content/use-fetch-youtube-metadata";
import { getYouTubeVideoId } from "@/api/metadata/youtube";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";

export interface ContentFormProps {
  mode: "create" | "edit";
  defaultValues: Partial<CreateContentInput>;
  isSubmitting: boolean;
  onSubmit: (values: CreateContentInput) => void;
  onCancel: () => void;
  errorMessage?: string;
  successMessage?: string;
}

/**
 * Presentational form component that renders content creation/editing UI.
 * Handles form validation and user feedback.
 */
export const ContentForm: React.FC<ContentFormProps> = ({
  mode,
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
  errorMessage,
  successMessage,
}) => {
  const { t } = useTranslation();
  const isAdminUser = useIsAdminUser();
  const [autoFillError, setAutoFillError] = useState<string | null>(null);
  const fetchMetadataMutation = useFetchYouTubeMetadata();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<CreateContentInput>({
    defaultValues,
    mode: "onChange",
  });

  const typeValue = useWatch({ control, name: "type" });
  const levelValue = useWatch({ control, name: "level" });
  const linkValue = useWatch({ control, name: "link" });

  const isYouTubeLink = linkValue ? !!getYouTubeVideoId(linkValue) : false;

  const handleAutoFill = () => {
    if (!linkValue) return;
    setAutoFillError(null);
    fetchMetadataMutation.mutate(linkValue, {
      onSuccess: (metadata) => {
        console.log("metadata", metadata);
        if (!metadata) return;
        const options = { shouldDirty: true };
        setValue("type", "youtube_video", options);
        if (metadata.title) setValue("title", metadata.title, options);
        console.log("metadata.description", metadata.description);
        if (metadata.description)
          setValue("description", metadata.description, options);
        if (metadata.durationInSeconds)
          setValue("durationInSeconds", metadata.durationInSeconds, options);
        if (metadata.image) setValue("thumbnailUrl", metadata.image, options);
        if (metadata.author) setValue("author", metadata.author, options);
        if (metadata.publishedAt) {
          const formatted = metadata.publishedAt.slice(0, 16);
          setValue("publishedAt", formatted, options);
        }
        if (metadata.language) setValue("language", metadata.language, options);
      },
      onError: (error) => {
        console.error("Failed to fetch YouTube metadata:", error);
        setAutoFillError(t("auto-fill-failed"));
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit((vals) => onSubmit(vals))}
      className="space-y-4"
      aria-busy={isSubmitting}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">{t("type")}</Label>
          <Select
            value={typeValue || ""}
            onValueChange={(value) => {
              setValue("type", value as ContentType);
            }}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder={t("select-type")} />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">{t("category")}</Label>
          <Input id="category" {...register("category")} />
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="level">{t("level")}</Label>
          <Select
            value={levelValue || ""}
            onValueChange={(value) => {
              setValue("level", value as ContentLevel);
            }}
          >
            <SelectTrigger id="level">
              <SelectValue placeholder={t("select-level")} />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_LEVELS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.level && (
            <p className="text-sm text-red-600 mt-1">{errors.level.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="title">{t("title")}</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="durationInSeconds">{t("duration-seconds")}</Label>
          <Input
            id="durationInSeconds"
            type="number"
            placeholder={t("optional")}
            {...register("durationInSeconds", {
              valueAsNumber: true,
            })}
          />
          {errors.durationInSeconds && (
            <p className="text-sm text-red-600 mt-1">
              {errors.durationInSeconds.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="link">{t("link")}</Label>
        <div className="flex gap-2">
          <Input
            id="link"
            placeholder={t("anything-accepted")}
            className="flex-1"
            {...register("link")}
          />
          {isAdminUser && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAutoFill}
              disabled={!isYouTubeLink || fetchMetadataMutation.isPending}
            >
              {fetchMetadataMutation.isPending
                ? t("loading")
                : t("auto-fill-from-youtube")}
            </Button>
          )}
        </div>
        {errors.link && (
          <p className="text-sm text-red-600 mt-1">{errors.link.message}</p>
        )}
        {autoFillError && (
          <p className="text-sm text-red-600 mt-1">{autoFillError}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="thumbnailUrl">{t("content-thumbnail-url")}</Label>
          <Input
            id="thumbnailUrl"
            type="url"
            placeholder={t("optional")}
            {...register("thumbnailUrl")}
          />
          {errors.thumbnailUrl && (
            <p className="text-sm text-red-600 mt-1">
              {errors.thumbnailUrl.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="author">{t("content-author")}</Label>
          <Input
            id="author"
            placeholder={t("optional")}
            {...register("author")}
          />
          {errors.author && (
            <p className="text-sm text-red-600 mt-1">{errors.author.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="publishedAt">{t("content-published-at")}</Label>
          <Input
            id="publishedAt"
            type="datetime-local"
            placeholder={t("optional")}
            {...register("publishedAt")}
          />
          {errors.publishedAt && (
            <p className="text-sm text-red-600 mt-1">
              {errors.publishedAt.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="language">{t("content-language")}</Label>
          <Input
            id="language"
            placeholder={t("optional")}
            {...register("language")}
          />
          {errors.language && (
            <p className="text-sm text-red-600 mt-1">
              {errors.language.message}
            </p>
          )}
        </div>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>{t("couldnt-save")}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert>
          <AlertTitle>
            {mode === "create" ? t("content-created") : t("content-updated")}
          </AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {mode === "create" ? t("create") : t("save-changes-button")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
};
