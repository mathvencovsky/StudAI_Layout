import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ContentNavigationButtonsProps {
  currentPosition: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

/**
 * Displays Previous and Next navigation buttons with position indicator.
 * Buttons are conditionally rendered and disabled based on position within the module.
 */
export const ContentNavigationButtons = ({
  currentPosition,
  totalItems,
  onPrevious,
  onNext,
  isLoading = false,
}: ContentNavigationButtonsProps) => {
  const { t } = useTranslation();
  const canNavigatePrevious = currentPosition > 1;
  const canNavigateNext = currentPosition < totalItems;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        onClick={onPrevious}
        disabled={!canNavigatePrevious || isLoading}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("previous")}
      </Button>

      <div className="text-sm text-muted-foreground font-medium">
        {currentPosition} {t("of-completed")} {totalItems}
      </div>

      <Button
        onClick={onNext}
        disabled={!canNavigateNext || isLoading}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        {t("next")}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
