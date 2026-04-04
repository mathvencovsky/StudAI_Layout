import { useState } from "react";
import { ChevronDown, HelpCircle, Mail } from "lucide-react";
import { useCustomI18n as useI18n } from "@/i18n";

/**
 * FAQ section with expandable questions and answers.
 */
export function NewFAQSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t("newFaq.q1"),
      answer: t("newFaq.a1")
    },
    {
      question: t("newFaq.q2"),
      answer: t("newFaq.a2")
    },
    {
      question: t("newFaq.q3"),
      answer: t("newFaq.a3")
    },
    {
      question: t("newFaq.q4"),
      answer: t("newFaq.a4")
    },
    {
      question: t("newFaq.q5"),
      answer: t("newFaq.a5")
    },
    {
      question: t("newFaq.q6"),
      answer: t("newFaq.a6")
    }
  ];

  return (
    <section id="faq" className="relative bg-background py-12">
      <div className="w-full max-w-4xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full mb-8 shadow-sm">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">{t("newFaq.badge")}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t("newFaq.headline")}
          </h2>
          <p className="text-2xl text-muted-foreground">
            {t("newFaq.subheadline")}
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-5 mb-16">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-background border-2 border-border rounded-2xl hover:border-primary/20 hover:shadow-lg transition-all overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-start justify-between text-left p-8 hover:bg-muted/50 transition-colors"
              >
                <span className="text-xl font-semibold text-foreground pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-primary transition-transform flex-shrink-0 mt-1 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-8 pb-8 text-lg text-muted-foreground leading-relaxed border-t border-border pt-6">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center p-10 bg-primary/5 border border-primary/20 rounded-2xl">
          <Mail className="w-10 h-10 text-primary mx-auto mb-6" />
          <p className="text-xl text-foreground/80 mb-6">{t("newFaq.stillQuestions")}</p>
          <a
            href={`mailto:${t("newFaq.contactEmail")}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold text-lg"
          >
            {t("newFaq.contactEmail")}
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
