/**
 * UpgradeModal — shown when a Free user hits a limit or clicks a Pro-only feature.
 *
 * Usage:
 *   <UpgradeModal
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     feature="advancedFlashcards"
 *   />
 */

import { Crown, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { EVENTS } from "@/lib/analytics-events";

export type UpgradeFeature =
  | "aiStudySessions"
  | "advancedFlashcards"
  | "advancedQuizzes"
  | "personalizedLearningPlans"
  | "progressAnalytics"
  | "exportMaterials"
  | "fasterAiResponses"
  | "prioritySupport";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature?: UpgradeFeature;
  /** Override the default title */
  title?: string;
  /** Override the default description */
  description?: string;
}

const FEATURE_COPY: Record<
  UpgradeFeature,
  { title: string; description: string; benefit: string }
> = {
  aiStudySessions: {
    title: "Upgrade to StudAI Pro",
    description:
      "You've used your 5 free AI study sessions today. Upgrade to StudAI Pro for unlimited AI study sessions.",
    benefit: "Unlimited AI study sessions",
  },
  advancedFlashcards: {
    title: "Upgrade to StudAI Pro",
    description:
      "Advanced flashcards are included with StudAI Pro. Upgrade to unlock smarter study tools.",
    benefit: "Advanced flashcards with AI-enhanced spaced repetition",
  },
  advancedQuizzes: {
    title: "Upgrade to StudAI Pro",
    description:
      "Advanced quizzes with adaptive difficulty and detailed explanations are a Pro feature.",
    benefit: "Adaptive quizzes with AI-generated questions",
  },
  personalizedLearningPlans: {
    title: "Upgrade to StudAI Pro",
    description:
      "Personalized learning plans are available with StudAI Pro. Get a study plan tailored to your goals.",
    benefit: "AI-powered personalized learning plans",
  },
  progressAnalytics: {
    title: "Upgrade to StudAI Pro",
    description:
      "Detailed progress analytics, performance insights, and weak-area detection are Pro features.",
    benefit: "Advanced analytics and performance insights",
  },
  exportMaterials: {
    title: "Upgrade to StudAI Pro",
    description: "PDF and CSV exports are available with StudAI Pro.",
    benefit: "Export study materials as PDF and CSV",
  },
  fasterAiResponses: {
    title: "Upgrade to StudAI Pro",
    description:
      "Pro users get priority AI processing for faster, more detailed responses.",
    benefit: "Faster AI responses with priority processing",
  },
  prioritySupport: {
    title: "Upgrade to StudAI Pro",
    description:
      "Priority support is available to Pro subscribers. Get help faster when you need it.",
    benefit: "Priority support from our team",
  },
};

export function UpgradeModal({
  open,
  onClose,
  feature = "aiStudySessions",
  title,
  description,
}: UpgradeModalProps) {
  const navigate = useNavigate();
  const copy = FEATURE_COPY[feature];
  const { track } = useAnalytics();

  // Track when modal is shown
  useEffect(() => {
    if (open) {
      track(EVENTS.UPGRADE_PROMPT_VIEWED, { feature, trigger: "modal_shown" });
    }
  }, [open, feature, track]);

  if (!open) return null;

  const handleUpgrade = () => {
    track(EVENTS.UPGRADE_PROMPT_CLICKED, { feature });
    onClose();
    void navigate({ to: "/plans" });
  };

  const handleDismiss = () => {
    track(EVENTS.UPGRADE_PROMPT_DISMISSED, { feature });
    onClose();
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div
        className={cn(
          "relative w-full max-w-md rounded-2xl border bg-card shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Crown className="h-6 w-6 text-primary" />
          </div>

          {/* Title */}
          <h2
            id="upgrade-modal-title"
            className="text-xl font-bold text-foreground mb-2"
          >
            {title ?? copy.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4">
            {description ?? copy.description}
          </p>

          {/* Benefit highlight */}
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-medium text-primary">
              {copy.benefit}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={handleUpgrade}>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
            <Button variant="ghost" className="w-full" onClick={handleDismiss}>
              Maybe later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
