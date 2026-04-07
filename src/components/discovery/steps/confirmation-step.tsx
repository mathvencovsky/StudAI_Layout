import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { BookOpen, ExternalLink } from "lucide-react";
import { type DiscoveryFormValues } from "../schema";
import { LEARNING_STYLE_OPTIONS, GOAL_OPTIONS } from "../constants";
import { INTEREST_TRANSLATION_KEYS, INTEREST_ICONS } from "@/components/learning-preferences/constants";
import { useTracks } from "@/hooks/track/use-tracks";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/** Confirmation step — summary + recommended tracks based on interests */
export const ConfirmationStep = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<DiscoveryFormValues>();

  const context = useWatch({ control, name: "context" });
  const interests = useWatch({ control, name: "interests" });
  const learningStyles = useWatch({ control, name: "learningStyles" });
  const hoursPerWeek = useWatch({ control, name: "hoursPerWeek" });
  const experienceLevel = useWatch({ control, name: "experienceLevel" });
  const minutesPerDay = useWatch({ control, name: "minutesPerDay" });

  // Find the goal option that matches the context
  const goalOption = GOAL_OPTIONS.find((g) => g.context === context);

  // Load tracks and filter by interests
  const { data: allTracks, isLoading: tracksLoading } = useTracks();
  const recommendedTracks = allTracks?.slice(0, 4) ?? []; // Show up to 4 tracks

  const styleLabels = learningStyles
    .map((id) => {
      const option = LEARNING_STYLE_OPTIONS.find((s) => s.id === id);
      return option ? `${option.icon} ${t(option.translationKey)}` : id;
    })
    .join(", ");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-xl font-semibold">{t("discovery-confirmation-title")}</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {t("discovery-confirmation-description")}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        {goalOption && (
          <div className="rounded-xl border bg-card p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("discovery-confirmation-section-context")}
            </p>
            <p className="text-sm font-medium">
              {goalOption.icon} {t(goalOption.titleKey as any, goalOption.titleKey)}
            </p>
          </div>
        )}

        {experienceLevel && (
          <div className="rounded-xl border bg-card p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("discovery-experience-level")}
            </p>
            <p className="text-sm font-medium capitalize">
              {t(`discovery-experience-${experienceLevel}`)}
            </p>
          </div>
        )}

        {hoursPerWeek && (
          <div className="rounded-xl border bg-card p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("discovery-hours-per-week")}
            </p>
            <p className="text-sm font-medium">{hoursPerWeek}h / semana</p>
          </div>
        )}

        {minutesPerDay && (
          <div className="rounded-xl border bg-card p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("learning-preferences-minutes-title")}
            </p>
            <p className="text-sm font-medium">{minutesPerDay} min / dia</p>
          </div>
        )}
      </div>

      {/* Interests */}
      {interests.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("discovery-confirmation-section-interests")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {interests.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs gap-1">
                <span>{INTEREST_ICONS[cat]}</span>
                {t(INTEREST_TRANSLATION_KEYS[cat])}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Learning style */}
      {styleLabels && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("discovery-confirmation-section-learning-style")}
          </p>
          <p className="text-sm">{styleLabels}</p>
        </div>
      )}

      {/* Recommended tracks */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Trilhas recomendadas para você</p>
        </div>

        {tracksLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : recommendedTracks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma trilha disponível ainda. Você poderá explorar trilhas após salvar.
          </p>
        ) : (
          <div className="space-y-2">
            {recommendedTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-3 rounded-xl border bg-card hover:border-primary/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  {track.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {track.description}
                    </p>
                  )}
                </div>
                <Link
                  to="/track/$trackId"
                  params={{ trackId: track.id }}
                  className="ml-3 flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Você poderá explorar mais trilhas após salvar suas preferências.
        </p>
      </div>
    </div>
  );
};
