import { Crown, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useMyAiWaitlist } from "@/hooks/ai-waitlist/use-my-ai-waitlist";
import { useCreateAiWaitlist } from "@/hooks/ai-waitlist/use-create-ai-waitlist";

export interface UpgradeGateProps {
  description?: string;
  features?: string[];
}

/**
 * Displays an upgrade prompt with a waitlist CTA.
 */
export const UpgradeGate = ({ description, features }: UpgradeGateProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: waitlistEntry } = useMyAiWaitlist();
  const { mutate: joinWaitlist, isPending: isJoining } = useCreateAiWaitlist();

  const isOnWaitlist = !!waitlistEntry;

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-sm shadow-xl">
        <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold">{t("upgrade-title")}</h2>
            <p className="text-sm text-muted-foreground">
              {description ?? t("upgrade-description")}
            </p>
          </div>
          {features && features.length > 0 && (
            <ul className="w-full text-left space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
          {isOnWaitlist ? (
            <p className="text-sm text-success">
              {t("ai-chat-waitlist-already-joined")}
            </p>
          ) : (
            <Button
              className="w-full"
              onClick={() => joinWaitlist()}
              disabled={isJoining}
            >
              {isJoining ? t("ai-chat-waitlist-joining") : t("ai-chat-waitlist-join")}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => navigate({ to: "/my-plan" })}
          >
            {t("upgrade-cta-full")}
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
