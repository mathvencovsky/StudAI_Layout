import { Link } from "@tanstack/react-router";
import { Shield, FileText, Mail, CheckCircle2 } from "lucide-react";
import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const SUPPORT_EMAIL = "support@studai.app";

export function TrustSection() {
  const { t } = useTranslation();

  const bullets = [t("trust-bullet1"), t("trust-bullet2"), t("trust-bullet3")];

  const cards = [
    { title: t("trust-card1-title"), desc: t("trust-card1-desc") },
    { title: t("trust-card2-title"), desc: t("trust-card2-desc") },
    { title: t("trust-card3-title"), desc: t("trust-card3-desc") },
    { title: t("trust-card4-title"), desc: t("trust-card4-desc") },
  ];

  return (
    <SectionWrapper variant="plain">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <KickerBadge className="mb-3">{t("trust-kicker")}</KickerBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("trust-headline")}
            <HeadlineHighlight variant="primary">
              {t("trust-headline-highlight")}
            </HeadlineHighlight>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl leading-relaxed">
            {t("trust-subheadline")}
          </p>

          <div className="mt-5 space-y-2">
            {bullets.map((b) => (
              <div
                key={b}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="border-2 font-bold">
              <Link to="/privacy">
                <FileText className="h-4 w-4 mr-2" />
                {t("trust-privacy-policy")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-2 font-bold">
              <Link to="/terms">
                <Shield className="h-4 w-4 mr-2" />
                {t("trust-terms-of-use")}
              </Link>
            </Button>
            <Button
              asChild
              className="font-bold bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
            >
              <a href={`mailto:${SUPPORT_EMAIL}`}>
                <Mail className="h-4 w-4 mr-2" />
                {t("trust-talk-to-support")}
              </a>
            </Button>
          </div>

          <div className="mt-6 p-4 rounded-xl border-2 bg-muted/30">
            <p className="text-xs font-extrabold text-foreground">
              {t("trust-summary30s")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("trust-quick-questions")} • {t("trust-how-to-delete")} •{" "}
              {t("trust-how-to-report")}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {cards.map((c) => (
            <Card
              key={c.title}
              className="border-2 hover:border-primary/40 transition-all shadow-lg"
            >
              <CardContent className="p-5">
                <h3 className="font-extrabold text-foreground">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {c.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
