import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export interface ContentCompletionButtonProps {
  contentId: string;
  moduleId: string;
  isCompleted: boolean;
  isLoading?: boolean;
  onToggle: (isCompleted: boolean) => void;
}

/**
 * Button component for marking content as completed or incomplete.
 * Displays different labels and styling based on completion state.
 */
export const ContentCompletionButton = ({
  isCompleted,
  isLoading = false,
  onToggle,
}: ContentCompletionButtonProps) => {
  const { t } = useTranslation();

  const handleClick = () => {
    onToggle(!isCompleted);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={isCompleted ? "default" : "outline"}
      className="gap-2"
    >
      {isCompleted && <Check className="h-4 w-4" />}
      {isCompleted ? t("mark-as-incomplete") : t("mark-as-complete")}
    </Button>
  );
};
