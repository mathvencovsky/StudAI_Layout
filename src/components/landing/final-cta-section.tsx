import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  const { t } = useTranslation();

  return (
    <section className="container py-16 md:py-24">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <Badge variant="secondary">{t("finalCta.kicker")}</Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          {t("finalCta.headline")}
          <span className="text-primary">{t("finalCta.headlineHighlight")}</span>
        </h2>
        <p className="text-lg text-muted-foreground">
          {t("finalCta.subheadline")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <a href="#planos">{t("common.startFree")}</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/support">{t("finalCta.talkToSupport")}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
