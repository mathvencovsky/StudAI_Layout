import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface FiltersFormValues {
  type: "all" | "video" | "article" | "quiz" | "assignment" | "lab";
  status: "all" | "not_started" | "in_progress" | "completed";
}

export interface FiltersBarProps {
  initial: Partial<FiltersFormValues>;
  onChange: (values: Partial<FiltersFormValues>) => void;
}

export const FiltersBar = ({ initial, onChange }: FiltersBarProps) => {
  const { t } = useTranslation();
  const { control, setValue } = useForm<FiltersFormValues>({
    defaultValues: initial,
    mode: "onChange",
  });

  const watched = useWatch({ control });
  React.useEffect(() => onChange(watched), [watched, onChange]);

  return (
    <div className="grid grid-cols-2 gap-3 md:w-fit">
      <div className="space-y-1">
        <Label htmlFor="type">{t("type")}</Label>
        <Select
          value={watched.type}
          onValueChange={(v) =>
            setValue("type", v as FiltersFormValues["type"])
          }
        >
          <SelectTrigger id="type" className="w-40">
            <SelectValue placeholder={t("all-types")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="video">{t("video")}</SelectItem>
            <SelectItem value="article">{t("article")}</SelectItem>
            <SelectItem value="quiz">{t("quiz")}</SelectItem>
            <SelectItem value="assignment">{t("assignment")}</SelectItem>
            <SelectItem value="lab">{t("lab")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="status">{t("status-filter")}</Label>
        <Select
          value={watched.status}
          onValueChange={(v) =>
            setValue("status", v as FiltersFormValues["status"])
          }
        >
          <SelectTrigger id="status" className="w-48">
            <SelectValue placeholder={t("all-status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="not_started">{t("not-started")}</SelectItem>
            <SelectItem value="in_progress">{t("in-progress")}</SelectItem>
            <SelectItem value="completed">{t("completed")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
