import { useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Testimonials carousel section with user success stories.
 */
export function NewTestimonials() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote: t("new-testimonials-testimonial1-quote"),
      author: t("new-testimonials-testimonial1-author"),
      role: t("new-testimonials-testimonial1-role"),
      rating: 5,
      highlight: t("new-testimonials-testimonial1-highlight")
    },
    {
      quote: t("new-testimonials-testimonial2-quote"),
      author: t("new-testimonials-testimonial2-author"),
      role: t("new-testimonials-testimonial2-role"),
      rating: 5,
      highlight: t("new-testimonials-testimonial2-highlight")
    },
    {
      quote: t("new-testimonials-testimonial3-quote"),
      author: t("new-testimonials-testimonial3-author"),
      role: t("new-testimonials-testimonial3-role"),
      rating: 5,
      highlight: t("new-testimonials-testimonial3-highlight")
    },
    {
      quote: t("new-testimonials-testimonial4-quote"),
      author: t("new-testimonials-testimonial4-author"),
      role: t("new-testimonials-testimonial4-role"),
      rating: 5,
      highlight: t("new-testimonials-testimonial4-highlight")
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="depoimentos" className="relative bg-background py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(74,159,255,0.05),transparent_70%)]" />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-background border border-border rounded-full mb-10 shadow-sm">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground/80">{t("new-testimonials-badge")}</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-[1.05]">
            {t("new-testimonials-headline1")}
            <br />
            <span className="text-primary">{t("new-testimonials-headline2")}</span>
          </h2>
          <p className="text-2xl text-muted-foreground leading-relaxed">
            {t("new-testimonials-subheadline")}
          </p>
        </div>

        {/* Main Testimonial Showcase */}
        <div className="mb-16">
          <div className="relative bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-12 md:p-16 text-primary-foreground shadow-2xl">
            {/* Quote icon */}
            <div className="absolute top-8 right-8 w-24 h-24 opacity-10">
              <Quote className="w-full h-full" />
            </div>

            {/* Highlight badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/20 backdrop-blur-sm rounded-full mb-8">
              <span className="text-sm font-semibold text-primary-foreground">{activeTestimonial.highlight}</span>
            </div>

            {/* Quote */}
            <blockquote className="text-3xl md:text-4xl font-bold text-primary-foreground mb-12 leading-relaxed max-w-4xl">
              "{activeTestimonial.quote}"
            </blockquote>

            {/* Author info */}
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground font-bold text-2xl">
                  {activeTestimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-primary-foreground text-xl">{activeTestimonial.author}</p>
                  <p className="text-primary-foreground/70">{activeTestimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {[...Array(activeTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-12 pt-8 border-t border-primary-foreground/20">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-primary-foreground/20 backdrop-blur-sm hover:bg-primary-foreground/30 flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-primary-foreground" />
              </button>
              
              <div className="flex gap-2 flex-1 justify-center">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === activeIndex ? 'w-8 bg-primary-foreground' : 'w-2 bg-primary-foreground/40'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-primary-foreground/20 backdrop-blur-sm hover:bg-primary-foreground/30 flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-6 h-6 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* All testimonials grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`text-left bg-background border-2 rounded-2xl p-6 transition-all ${
                index === activeIndex
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border hover:border-primary/30 hover:shadow-md'
              }`}
            >
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 mb-4 line-clamp-2">
                "{testimonial.quote}"
              </p>
              <p className="text-xs font-bold text-foreground">{testimonial.author}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
