import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    { num: "1", title: t("how-it-works-step1-title"), desc: t("how-it-works-step1-desc") },
    { num: "2", title: t("how-it-works-step2-title"), desc: t("how-it-works-step2-desc") },
    { num: "3", title: t("how-it-works-step3-title"), desc: t("how-it-works-step3-desc") },
  ];

  return (
    <section id="como-funciona" className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="secondary">{t("how-it-works-kicker")}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("how-it-works-headline")}
            <span className="text-primary">{t("how-it-works-headline-highlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("how-it-works-subheadline")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Card key={step.num}>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  {step.num}
                </div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
