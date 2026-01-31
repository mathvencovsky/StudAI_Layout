import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ContentForm } from "@/components/content/forms/content-form";
import { useGetContent } from "@/hooks/content/use-get-content";
import { useUpdateContent } from "@/hooks/content/use-update-content";
import { useDeleteContent } from "@/hooks/content/use-delete-content";
import { type CreateContentInput } from "@/api/content";

export interface ContentEditProps {
  id: string;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Container component that manages content editing state and API calls.
 * Fetches existing content data and passes it to the presentational form component.
 */
export const ContentEdit: React.FC<ContentEditProps> = ({
  id,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState<string>("");
  const contentQuery = useGetContent(id);
  const updateMutation = useUpdateContent();
  const deleteMutation = useDeleteContent();

  const defaultValues: CreateContentInput | null = useMemo(() => {
    if (!contentQuery.data) return null;
    const content = contentQuery.data;
    return {
      type: content.type,
      category: content.category,
      level: content.level,
      title: content.title,
      description: content.description,
      link: content.link,
      durationInSeconds: content.durationInSeconds,
    };
  }, [contentQuery.data]);

  const handleSubmit = (values: CreateContentInput) => {
    updateMutation.mutate(
      { id, ...values },
      {
        onSuccess: () => {
          setFeedback("Your changes have been saved.");
          onSuccess();
        },
        onError: () => {
          setFeedback("We couldn't save your changes. Please try again.");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => onSuccess(),
        onError: () => {
          setFeedback(t("content-delete-error"));
        },
      }
    );
  };

  if (contentQuery.isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (contentQuery.isError || !defaultValues) {
    return (
      <p className="text-sm text-red-600">
        We couldn't load this item for editing.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <ContentForm
        mode="edit"
        defaultValues={defaultValues}
        isSubmitting={updateMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        errorMessage={
          updateMutation.isError
            ? "We couldn't save your changes. Please try again."
            : feedback || undefined
        }
        successMessage={
          updateMutation.isSuccess ? "Your changes have been saved." : undefined
        }
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending
              ? t("content-delete-deleting")
              : t("content-delete-button")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("content-delete-confirm-title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("content-delete-confirm-description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t("content-delete-button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
