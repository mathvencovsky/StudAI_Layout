import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";

/**
 * Navigation header for the landing page with mobile menu support.
 */
export function LandingHeader() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const setLocale = (lang: string) => i18n.changeLanguage(lang);
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-semibold text-foreground tracking-tight">StudAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            <button
              onClick={() => scrollToSection("produto")}
              className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {t("header-product")}
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {t("header-how-it-works")}
            </button>
            <button
              onClick={() => scrollToSection("casos-de-uso")}
              className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {t("header-use-cases")}
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {t("header-testimonials")}
            </button>
            <button
              onClick={() => scrollToSection("planos")}
              className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {t("header-plans")}
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-base font-semibold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {t("header-faq")}
            </button>
          </nav>

          {/* CTA + Language */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setLocale(locale === "pt-BR" ? "en" : "pt-BR")}
              className="text-sm font-medium text-muted-foreground/70 hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              {locale === "pt-BR" ? "EN" : "PT"}
            </button>
            <Button
              onClick={() => scrollToSection("auth-section")}
              className="h-11 px-6 rounded-3xl text-base font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300"
            >
              {t("common-start-free")}
            </Button>
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary transition-colors">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border">
              <nav className="flex flex-col gap-8 mt-12">
                <button
                  onClick={() => scrollToSection("produto")}
                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors text-left"
                >
                  {t("header-product")}
                </button>
                <button
                  onClick={() => scrollToSection("como-funciona")}
                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors text-left"
                >
                  {t("header-how-it-works")}
                </button>
                <button
                  onClick={() => scrollToSection("casos-de-uso")}
                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors text-left"
                >
                  {t("header-use-cases")}
                </button>
                <button
                  onClick={() => scrollToSection("depoimentos")}
                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors text-left"
                >
                  {t("header-testimonials")}
                </button>
                <button
                  onClick={() => scrollToSection("planos")}
                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors text-left"
                >
                  {t("header-plans")}
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors text-left"
                >
                  {t("header-faq")}
                </button>
                <Button
                  onClick={() => scrollToSection("auth-section")}
                  className="w-full h-14 rounded-3xl text-lg font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40"
                >
                  {t("common-start-free")}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
