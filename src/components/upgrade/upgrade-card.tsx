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

export function UpgradeCard({ variant = "default", className = "" }: UpgradeCardProps) {
  const { t } = useTranslation();

  if (variant === "compact") {
    return (
      <Card className={`bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">
                {t("upgrade.title", "Upgrade para Pro")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("upgrade.subtitle-compact", "Recursos ilimitados")}
              </p>
            </div>
            <Link to="/meu-plano">
              <Button size="sm" className="shrink-0">
                <Sparkles className="w-3 h-3 mr-1" />
                {t("upgrade.cta", "Upgrade")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            {t("upgrade.title", "Upgrade para Pro")}
          </CardTitle>
          <Badge className="bg-primary/20 text-primary border-primary/30">
            {t("upgrade.badge", "Premium")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("upgrade.description", "Desbloqueie todo o potencial do StudAI com recursos premium")}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{t("upgrade.feature-1", "IA ilimitada para criar trilhas personalizadas")}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{t("upgrade.feature-2", "Acesso a todos os conteúdos premium")}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{t("upgrade.feature-3", "Relatórios avançados e analytics")}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{t("upgrade.feature-4", "Suporte prioritário")}</span>
          </div>
        </div>

        <Link to="/meu-plano">
          <Button className="w-full group">
            <Sparkles className="w-4 h-4 mr-2" />
            {t("upgrade.cta-full", "Ver Planos e Preços")}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
