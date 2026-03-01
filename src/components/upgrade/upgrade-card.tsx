import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

interface UpgradeCardProps {
  variant?: "default" | "compact";
  className?: string;
}

export function UpgradeCard({
  variant = "default",
  className = "",
}: UpgradeCardProps) {
  const { t } = useTranslation();

  if (variant === "compact") {
    return (
      <Card
        className={`bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 ${className}`}
      >
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{t("upgrade-title")}</p>
              <p className="text-xs text-muted-foreground">
                {t("upgrade-subtitle-compact")}
              </p>
            </div>
            <Link to="/my-plan">
              <Button size="sm" className="shrink-0">
                <Sparkles className="w-3 h-3 mr-1" />
                {t("upgrade-cta")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 overflow-hidden flex flex-col h-full ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            {t("upgrade-title")}
          </CardTitle>
          <Badge className="bg-primary/20 text-primary border-primary/30">
            {t("upgrade-badge")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col flex-1">
        <p className="text-sm text-muted-foreground">
          {t("upgrade-description")}
        </p>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{t("upgrade-feature-1")}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{t("upgrade-feature-2")}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{t("upgrade-feature-3")}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{t("upgrade-feature-4")}</span>
          </div>
        </div>

        <Link to="/my-plan" className="mt-auto">
          <Button className="w-full group">
            <Sparkles className="w-4 h-4 mr-2" />
            {t("upgrade-cta-full")}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
