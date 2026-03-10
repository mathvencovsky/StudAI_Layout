import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCustomI18n as useI18n } from "@/i18n";

export function LandingHeader() {
  const { t, locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - powerful and minimal */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:bg-[#4A9FFF]/10 transition-all duration-300">
              <GraduationCap className="w-6 h-6 text-[#4A9FFF]" />
            </div>
            <span className="text-2xl font-semibold text-gray-900 tracking-tight">StudAI</span>
          </Link>

          {/* Desktop Navigation - refined */}
          <nav className="hidden md:flex items-center gap-12">
            <button
              onClick={() => scrollToSection("produto")}
              className="text-base font-semibold text-gray-500 hover:text-[#4A9FFF] transition-colors duration-300"
            >
              {t("header.product")}
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-base font-semibold text-gray-500 hover:text-[#4A9FFF] transition-colors duration-300"
            >
              {t("header.howItWorks")}
            </button>
            <button
              onClick={() => scrollToSection("casos-de-uso")}
              className="text-base font-semibold text-gray-500 hover:text-[#4A9FFF] transition-colors duration-300"
            >
              Casos de uso
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="text-base font-semibold text-gray-500 hover:text-[#4A9FFF] transition-colors duration-300"
            >
              {t("header.testimonials")}
            </button>
            <button
              onClick={() => scrollToSection("planos")}
              className="text-base font-semibold text-gray-500 hover:text-[#4A9FFF] transition-colors duration-300"
            >
              {t("header.plans")}
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-base font-semibold text-gray-500 hover:text-[#4A9FFF] transition-colors duration-300"
            >
              {t("header.faq")}
            </button>
          </nav>

          {/* CTA + Language - powerful */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")}
              className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors duration-300 tracking-wide"
            >
              {locale === "pt-BR" ? "EN" : "PT"}
            </button>
            <Button
              onClick={() => scrollToSection("auth-section")}
              className="h-11 px-6 rounded-3xl text-base font-semibold bg-[#4A9FFF] text-white shadow-lg shadow-[#4A9FFF]/20 hover:shadow-xl hover:shadow-[#4A9FFF]/40 hover:scale-[1.02] transition-all duration-300"
            >
              {t("common.startFree")}
            </Button>
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-gray-900 hover:text-[#4A9FFF] transition-colors">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-gray-200">
              <nav className="flex flex-col gap-8 mt-12">
                <button
                  onClick={() => scrollToSection("produto")}
                  className="text-xl font-semibold text-gray-900 hover:text-[#4A9FFF] transition-colors text-left"
                >
                  {t("header.product")}
                </button>
                <button
                  onClick={() => scrollToSection("como-funciona")}
                  className="text-xl font-semibold text-gray-900 hover:text-[#4A9FFF] transition-colors text-left"
                >
                  {t("header.howItWorks")}
                </button>
                <button
                  onClick={() => scrollToSection("casos-de-uso")}
                  className="text-xl font-semibold text-gray-900 hover:text-[#4A9FFF] transition-colors text-left"
                >
                  Casos de uso
                </button>
                <button
                  onClick={() => scrollToSection("depoimentos")}
                  className="text-xl font-semibold text-gray-900 hover:text-[#4A9FFF] transition-colors text-left"
                >
                  {t("header.testimonials")}
                </button>
                <button
                  onClick={() => scrollToSection("planos")}
                  className="text-xl font-semibold text-gray-900 hover:text-[#4A9FFF] transition-colors text-left"
                >
                  {t("header.plans")}
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-xl font-semibold text-gray-900 hover:text-[#4A9FFF] transition-colors text-left"
                >
                  {t("header.faq")}
                </button>
                <Button
                  onClick={() => scrollToSection("auth-section")}
                  className="w-full h-14 rounded-3xl text-lg font-semibold bg-[#4A9FFF] text-white shadow-lg shadow-[#4A9FFF]/20 hover:shadow-xl hover:shadow-[#4A9FFF]/40"
                >
                  {t("common.startFree")}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}



