import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StarRating } from "./star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { FeedbackInput } from "@/model/feedback";

export interface FeedbackFormProps {
  control: Control<FeedbackInput>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const FeedbackForm = ({
  control,
  onSubmit,
  isLoading,
}: FeedbackFormProps) => {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("rating")}</label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          {t("comments-optional")}
        </label>
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <Textarea
              id="comment"
              placeholder={t("share-feedback")}
              {...field}
              value={field.value || ""}
              disabled={isLoading}
            />
          )}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? t("submitting") : t("submit-feedback")}
      </Button>
    </form>
  );
};
