import { useTranslation } from "react-i18next";

/**
 * Problem/solution section explaining the study challenges StudAI addresses.
 */
export function NewProblemSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-background py-12 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative w-full max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-destructive/10 border border-destructive/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-destructive rounded-full" />
              <span className="text-sm font-medium text-destructive">{t("problem-badge-problem")}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t("problem-headline")}
            </h2>

            <div className="space-y-4 text-lg text-muted-foreground">
              <p>{t("problem-desc1")}</p>
              <p>{t("problem-desc2")}</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-gradient-to-br from-primary/5 to-purple-50 border border-primary/20 rounded-2xl p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-background border border-primary/20 rounded-full mb-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">{t("problem-badge-solution")}</span>
              </div>

              <h3 className="text-3xl font-bold text-foreground mb-4">
                {t("problem-solution-title")}
              </h3>

              <p className="text-lg text-foreground/80 mb-6">
                {t("problem-solution-desc")}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/70 to-primary border-2 border-background flex items-center justify-center text-primary-foreground text-sm font-bold">
                      ✓
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">{t("problem-thousands-of-students")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
