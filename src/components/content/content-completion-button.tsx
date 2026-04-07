import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useCelebration } from "@/hooks/use-celebration";

export interface ContentCompletionButtonProps {
  contentId: string;
  moduleId: string;
  isCompleted: boolean;
  isLoading?: boolean;
  onToggle: (isCompleted: boolean) => void;
}

export const ContentCompletionButton = ({
  isCompleted,
  isLoading = false,
  onToggle,
}: ContentCompletionButtonProps) => {
  const { t } = useTranslation();
  const { celebrate } = useCelebration();

  const handleClick = () => {
    const newState = !isCompleted;
    onToggle(newState);
    if (newState) celebrate(); // 🎉 confetti when marking complete
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
