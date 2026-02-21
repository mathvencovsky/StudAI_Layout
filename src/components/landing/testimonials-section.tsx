import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    {
      key: "concurso",
      quote: t("testimonials-concurso-quote"),
      role: t("testimonials-concurso-role"),
      context: t("testimonials-concurso-context"),
    },
    {
      key: "certificacao",
      quote: t("testimonials-certificacao-quote"),
      role: t("testimonials-certificacao-role"),
      context: t("testimonials-certificacao-context"),
    },
    {
      key: "faculdade",
      quote: t("testimonials-faculdade-quote"),
      role: t("testimonials-faculdade-role"),
      context: t("testimonials-faculdade-context"),
    },
  ];

  return (
    <section id="depoimentos" className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="secondary">{t("testimonials-kicker")}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("testimonials-headline")}
            <span className="text-primary">{t("testimonials-headline-highlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("testimonials-subheadline")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.key}>
              <CardContent className="pt-6">
                <p className="text-sm mb-4 italic">"{testimonial.quote}"</p>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.context}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {t("testimonials-disclaimer")}
        </p>
      </div>
    </section>
  );
}
