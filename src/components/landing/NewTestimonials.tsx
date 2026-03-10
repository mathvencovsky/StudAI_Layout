import { useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCustomI18n as useI18n } from "@/i18n";

export function NewTestimonials() {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote: t("newTestimonials.testimonial1.quote"),
      author: t("newTestimonials.testimonial1.author"),
      role: t("newTestimonials.testimonial1.role"),
      rating: 5,
      highlight: t("newTestimonials.testimonial1.highlight")
    },
    {
      quote: t("newTestimonials.testimonial2.quote"),
      author: t("newTestimonials.testimonial2.author"),
      role: t("newTestimonials.testimonial2.role"),
      rating: 5,
      highlight: t("newTestimonials.testimonial2.highlight")
    },
    {
      quote: t("newTestimonials.testimonial3.quote"),
      author: t("newTestimonials.testimonial3.author"),
      role: t("newTestimonials.testimonial3.role"),
      rating: 5,
      highlight: t("newTestimonials.testimonial3.highlight")
    },
    {
      quote: t("newTestimonials.testimonial4.quote"),
      author: t("newTestimonials.testimonial4.author"),
      role: t("newTestimonials.testimonial4.role"),
      rating: 5,
      highlight: t("newTestimonials.testimonial4.highlight")
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
    <section id="depoimentos" className="relative bg-white py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(74,159,255,0.05),transparent_70%)]" />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full mb-10 shadow-sm">
            <Star className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">{t("newTestimonials.badge")}</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-[1.05]">
            {t("newTestimonials.headline1")}
            <br />
            <span className="text-blue-600">{t("newTestimonials.headline2")}</span>
          </h2>
          <p className="text-2xl text-gray-600 leading-relaxed">
            {t("newTestimonials.subheadline")}
          </p>
        </div>

        {/* Main Testimonial Showcase */}
        <div className="mb-16">
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 md:p-16 text-white shadow-2xl">
            {/* Quote icon */}
            <div className="absolute top-8 right-8 w-24 h-24 opacity-10">
              <Quote className="w-full h-full" />
            </div>

            {/* Highlight badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <span className="text-sm font-semibold text-white">{activeTestimonial.highlight}</span>
            </div>

            {/* Quote */}
            <blockquote className="text-3xl md:text-4xl font-bold text-white mb-12 leading-relaxed max-w-4xl">
              "{activeTestimonial.quote}"
            </blockquote>

            {/* Author info */}
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl">
                  {activeTestimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white text-xl">{activeTestimonial.author}</p>
                  <p className="text-blue-100">{activeTestimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {[...Array(activeTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-white fill-white" />
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-12 pt-8 border-t border-white/20">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <div className="flex gap-2 flex-1 justify-center">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* All testimonials grid - smaller */}
        <div className="grid md:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`text-left bg-white border-2 rounded-2xl p-6 transition-all ${
                index === activeIndex
                  ? 'border-blue-600 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-blue-600 fill-blue-600" />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                "{testimonial.quote}"
              </p>
              <p className="text-xs font-bold text-gray-900">{testimonial.author}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
