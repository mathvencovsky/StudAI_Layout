import { useState } from "react";
import { ChevronDown, HelpCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * FAQ section with expandable questions and answers.
 */
export function NewFAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t("new-faq-q1"),
      answer: t("new-faq-a1")
    },
    {
      question: t("new-faq-q2"),
      answer: t("new-faq-a2")
    },
    {
      question: t("new-faq-q3"),
      answer: t("new-faq-a3")
    },
    {
      question: t("new-faq-q4"),
      answer: t("new-faq-a4")
    },
    {
      question: t("new-faq-q5"),
      answer: t("new-faq-a5")
    },
    {
      question: t("new-faq-q6"),
      answer: t("new-faq-a6")
    }
  ];

  return (
    <section id="faq" className="relative bg-background py-12">
      <div className="w-full max-w-4xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full mb-8 shadow-sm">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">{t("new-faq-badge")}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t("new-faq-headline")}
          </h2>
          <p className="text-2xl text-muted-foreground">
            {t("new-faq-subheadline")}
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
          <p className="text-xl text-foreground/80 mb-6">{t("new-faq-still-questions")}</p>
          <a
            href={`mailto:${t("new-faq-contact-email")}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold text-lg"
          >
            {t("new-faq-contact-email")}
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
