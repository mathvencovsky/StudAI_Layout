import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useCreateFeedback } from "@/hooks/feedback/use-create-feedback";
import { type FeedbackCreateInput } from "@/model/feedback";
import { FeedbackForm } from "./feedback-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackDialog = ({ isOpen, onClose }: FeedbackDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const createFeedbackMutation = useCreateFeedback();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { control, handleSubmit, reset, formState } = useForm<FeedbackCreateInput>({
    defaultValues: {
      rating: undefined,
      comment: "",
    },
  });

  const onSubmit = handleSubmit(async (data: FeedbackCreateInput) => {
    if (!user?.id) {
      setErrorMessage(t("must-be-logged-in"));
      return;
    }

    try {
      setErrorMessage("");
      const currentUrl = window.location.href;

      await createFeedbackMutation.mutateAsync({
        ...data,
        url: currentUrl,
      });

      setSuccessMessage(t("thank-you-feedback"));
      reset();

      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setErrorMessage(t("failed-save-feedback"));
    }
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setSuccessMessage("");
      setErrorMessage("");
    }
  }, [isOpen, reset]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{t("share-feedback-title")}</SheetTitle>
          <SheetDescription>{t("help-us-improve")}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {!successMessage && (
            <FeedbackForm
              control={control}
              onSubmit={onSubmit}
              isLoading={
                formState.isSubmitting || createFeedbackMutation.isPending
              }
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
