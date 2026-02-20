import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductSection() {
  const { t } = useTranslation();

  const features = [
    { key: "feature1", title: t("product.feature1.title"), desc: t("product.feature1.desc") },
    { key: "feature2", title: t("product.feature2.title"), desc: t("product.feature2.desc") },
    { key: "feature3", title: t("product.feature3.title"), desc: t("product.feature3.desc") },
    { key: "feature4", title: t("product.feature4.title"), desc: t("product.feature4.desc") },
    { key: "feature5", title: t("product.feature5.title"), desc: t("product.feature5.desc") },
    { key: "feature6", title: t("product.feature6.title"), desc: t("product.feature6.desc") },
  ];

  return (
    <section id="produto" className="container py-16 md:py-24">
      <div className="text-center space-y-3 mb-12">
        <Badge variant="secondary">{t("product.kicker")}</Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          {t("product.headline")}
          <span className="text-primary">{t("product.headlineHighlight")}</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.key}>
            <CardHeader>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
