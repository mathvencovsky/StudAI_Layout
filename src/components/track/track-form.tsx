import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCreateTrack } from "@/hooks/track/use-create-track";
import { useUpdateTrack } from "@/hooks/track/use-update-track";
import { TrackFlowEditor } from "@/components/track/track-flow-editor";
import { type TrackCategory } from "@/model/track";
import { INTEREST_OPTIONS, INTEREST_TRANSLATION_KEYS } from "@/components/learning-preferences/constants";

type ParentMap = Record<string, string>;

type FormValues = {
  title: string;
  description: string;
  categories: TrackCategory[];
};

export interface TrackFormProps {
  mode: "create" | "edit";
  trackId?: string;
  initialData?: {
    title: string;
    description: string;
    rootModuleId: string;
    parentByModuleId: ParentMap;
    categories?: TrackCategory[];
  };
}

/**
 * Form for creating or editing tracks with React Flow editor
 */
export const TrackForm = ({ mode, trackId, initialData }: TrackFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createTrackMutation = useCreateTrack();
  const updateTrackMutation = useUpdateTrack();

  const [rootModuleId, setRootModuleId] = useState(
    initialData?.rootModuleId ?? ""
  );
  const [parentByModuleId, setParentByModuleId] = useState<ParentMap>(
    initialData?.parentByModuleId ?? {}
  );
  const [hasCycle, setHasCycle] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      categories: initialData?.categories ?? [],
    },
  });

  const selectedCategories = useWatch({ control, name: "categories" });

  const handleFlowChange = useCallback(
    (
      newRootModuleId: string,
      newParentByModuleId: ParentMap,
      newHasCycle: boolean
    ) => {
      setRootModuleId(newRootModuleId);
      setParentByModuleId(newParentByModuleId);
      setHasCycle(newHasCycle);
    },
    []
  );

  const isPending =
    createTrackMutation.isPending || updateTrackMutation.isPending;
  const canSubmit = rootModuleId && !hasCycle && !isPending;

  const onSubmit = (values: FormValues) => {
    if (!canSubmit) return;

    if (mode === "create") {
      createTrackMutation.mutate(
        {
          title: values.title,
          description: values.description,
          rootModuleId,
          parentByModuleId,
          positionByModuleId: {},
          categories: values.categories,
        },
        {
          onSuccess: (track) => {
            navigate({ to: "/track/$trackId", params: { trackId: track.id } });
          },
        }
      );
    } else if (mode === "edit" && trackId) {
      updateTrackMutation.mutate(
        {
          id: trackId,
          title: values.title,
          description: values.description,
          rootModuleId,
          parentByModuleId,
          positionByModuleId: {},
          categories: values.categories,
        },
        {
          onSuccess: () => {
            navigate({ to: "/track/$trackId", params: { trackId } });
          },
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4 w-full max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="title">{t("title")}</Label>
          <Input
            id="title"
            {...register("title", { required: t("title-required") })}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t("description")}</Label>
          <Textarea
            id="description"
            {...register("description", { required: t("description-required") })}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("track-categories-label")}</Label>
          <ToggleGroup
            type="multiple"
            value={selectedCategories}
            onValueChange={(value) => setValue("categories", value as TrackCategory[])}
            className="flex flex-wrap gap-2 justify-start"
            spacing={4}
          >
            {INTEREST_OPTIONS.map((category) => (
              <ToggleGroupItem key={category} value={category} variant="outline">
                {t(INTEREST_TRANSLATION_KEYS[category])}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("track-structure")}</Label>
        <p className="text-sm text-muted-foreground">
          {t("track-structure-help")}
        </p>
        <TrackFlowEditor
          initialRootModuleId={initialData?.rootModuleId}
          initialParentByModuleId={initialData?.parentByModuleId}
          onChange={handleFlowChange}
        />
        {!rootModuleId && (
          <p className="text-sm text-red-600">{t("root-module-required")}</p>
        )}
        {hasCycle && (
          <p className="text-sm text-red-600">{t("cycle-detected")}</p>
        )}
      </div>

      <Button type="submit" disabled={!canSubmit}>
        {isPending
          ? t("loading")
          : mode === "create"
            ? t("create-track")
            : t("save-changes")}
      </Button>
    </form>
  );
};
