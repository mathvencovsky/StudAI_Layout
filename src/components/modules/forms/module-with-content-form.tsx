import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, List, Code, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toggle } from "@/components/ui/toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchPlaylistData, getYouTubePlaylistId } from "@/api/youtube";

export interface ModuleWithContentFormValues {
  title: string;
  description: string;
  links: string[];
}

export interface ModuleWithContentFormProps {
  isSubmitting: boolean;
  onSubmit: (values: ModuleWithContentFormValues) => void;
  onCancel: () => void;
  errorMessage?: string;
  successMessage?: string;
}

/**
 * Form for creating a module with content from YouTube links.
 * Supports both a list of inputs and a JSON textarea input mode.
 */
export const ModuleWithContentForm: React.FC<ModuleWithContentFormProps> = ({
  isSubmitting,
  onSubmit,
  onCancel,
  errorMessage,
  successMessage,
}) => {
  const { t } = useTranslation();
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ModuleWithContentFormValues>({
    defaultValues: { title: "", description: "", links: [""] },
    mode: "onChange",
  });

  const links = useWatch({ control, name: "links" });

  const addLink = () => setValue("links", [...links, ""]);

  const removeLink = (index: number) =>
    setValue("links", links.filter((_, i) => i !== index));

  const handleImportPlaylist = async () => {
    const playlistId = getYouTubePlaylistId(playlistUrl) ?? playlistUrl.trim();
    if (!playlistId) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const data = await fetchPlaylistData(playlistId);
      if (data.videoUrls.length === 0) throw new Error("empty");
      setValue("links", data.videoUrls);
      if (data.title) setValue("title", data.title);
      if (data.description) setValue("description", data.description);
      setPlaylistDialogOpen(false);
      setPlaylistUrl("");
    } catch {
      setImportError(t("import-from-playlist-error"));
    } finally {
      setIsImporting(false);
    }
  };

  const handleToggleMode = () => {
    if (!isJsonMode) {
      const currentLinks = getValues("links").filter(Boolean);
      setJsonText(JSON.stringify(currentLinks.length ? currentLinks : [], null, 2));
      setJsonError(null);
    } else {
      try {
        const parsed = JSON.parse(jsonText);
        if (Array.isArray(parsed)) {
          setValue("links", parsed.length ? parsed : [""]);
          setJsonError(null);
        } else {
          setJsonError(t("module-with-content-json-invalid"));
          return;
        }
      } catch {
        setJsonError(t("module-with-content-json-invalid"));
        return;
      }
    }
    setIsJsonMode((prev) => !prev);
  };

  const handleFormSubmit = (values: ModuleWithContentFormValues) => {
    if (isJsonMode) {
      try {
        const parsed = JSON.parse(jsonText);
        if (!Array.isArray(parsed)) {
          setJsonError(t("module-with-content-json-invalid"));
          return;
        }
        setJsonError(null);
        onSubmit({ ...values, links: parsed });
      } catch {
        setJsonError(t("module-with-content-json-invalid"));
      }
      return;
    }
    onSubmit(values);
  };

  const requiredRule = { required: t("this-field-is-required") };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" aria-busy={isSubmitting}>
      <div>
        <Label htmlFor="title">{t("module-title")}</Label>
        <Input
          id="title"
          placeholder={t("enter-module-title")}
          {...register("title", {
            ...requiredRule,
            minLength: { value: 3, message: t("title-min-length") },
          })}
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">{t("module-description")}</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder={t("describe-module-coverage")}
          {...register("description", {
            ...requiredRule,
            minLength: { value: 10, message: t("validation-description-min") },
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{t("module-with-content-links-label")}</Label>
          <div className="flex items-center gap-2">
            <Dialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" disabled={isSubmitting}>
                  <ListVideo className="h-4 w-4 mr-1" />
                  {t("import-from-playlist")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("import-from-playlist-title")}</DialogTitle>
                  <DialogDescription>{t("import-from-playlist-description")}</DialogDescription>
                </DialogHeader>
                <Input
                  placeholder={t("import-from-playlist-placeholder")}
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  disabled={isImporting}
                />
                {importError && <p className="text-sm text-red-600">{importError}</p>}
                <DialogFooter>
                  <Button type="button" onClick={handleImportPlaylist} disabled={isImporting || !playlistUrl.trim()}>
                    {isImporting ? t("import-from-playlist-importing") : t("import-from-playlist")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Toggle
              pressed={isJsonMode}
              onPressedChange={handleToggleMode}
              size="sm"
              aria-label={t("module-with-content-toggle-json")}
            >
              {isJsonMode ? <List className="h-4 w-4 mr-1" /> : <Code className="h-4 w-4 mr-1" />}
              {isJsonMode ? t("module-with-content-mode-list") : t("module-with-content-mode-json")}
            </Toggle>
          </div>
        </div>

        {isJsonMode ? (
          <>
            <Textarea
              rows={8}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder={'["https://youtube.com/...", "https://youtube.com/..."]'}
              disabled={isSubmitting}
              className="font-mono text-sm"
            />
            {jsonError && <p className="text-sm text-red-600">{jsonError}</p>}
          </>
        ) : (
          <>
            {links.map((_, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={t("bulk-import-link-placeholder")}
                  disabled={isSubmitting}
                  {...register(`links.${index}`)}
                />
                {links.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLink(index)}
                    disabled={isSubmitting}
                    aria-label={t("remove")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLink}
              disabled={isSubmitting}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("bulk-import-add-link")}
            </Button>
          </>
        )}
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>{t("couldnt-save-module")}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert>
          <AlertTitle>{t("module-created")}</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("loading") : t("create-module")}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
};
