import { SectionWrapper, KickerBadge, HeadlineHighlight } from "./ui";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export function Testimonials() {
  const { t } = useI18n();

  const items = [
    {
      role: t("testimonials-concurso-role"),
      context: t("testimonials-concurso-context"),
      quote: t("testimonials-concurso-quote"),
      changes: [
        t("testimonials-concurso-change1"),
        t("testimonials-concurso-change2"),
        t("testimonials-concurso-change3"),
      ],
    },
    {
      role: t("testimonials-certificacao-role"),
      context: t("testimonials-certificacao-context"),
      quote: t("testimonials-certificacao-quote"),
      changes: [
        t("testimonials-certificacao-change1"),
        t("testimonials-certificacao-change2"),
        t("testimonials-certificacao-change3"),
      ],
    },
    {
      role: t("testimonials-faculdade-role"),
      context: t("testimonials-faculdade-context"),
      quote: t("testimonials-faculdade-quote"),
      changes: [
        t("testimonials-faculdade-change1"),
        t("testimonials-faculdade-change2"),
        t("testimonials-faculdade-change3"),
      ],
    },
  ];

  return (
    <SectionWrapper id="depoimentos" variant="tint">
      <div className="text-center mb-8">
        <KickerBadge className="mb-3">{t("testimonials-kicker")}</KickerBadge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          {t("testimonials-headline")}
          <HeadlineHighlight>{t("testimonials-headline-highlight")}</HeadlineHighlight>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
          {t("testimonials-subheadline")}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card
            key={it.role}
            className="border-2 shadow-lg hover:shadow-xl transition-all"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {it.role}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {it.context}
                </span>
              </div>
              <p className="text-sm text-foreground font-semibold leading-relaxed">
                "{it.quote}"
              </p>
              <p className="mt-4 text-xs font-extrabold text-foreground">
                {t("testimonials-what-changed")}
              </p>
              <ul className="mt-2 space-y-2">
                {it.changes.map((c) => (
                  <li key={c} className="text-sm text-muted-foreground font-medium">
                    • {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center font-semibold">
        {t("testimonials-disclaimer")}
      </p>
    </SectionWrapper>
  );
}
