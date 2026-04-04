import { GraduationCap, Globe } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCustomI18n as useI18n } from "@/i18n";

/**
 * Footer component for the new landing page with navigation links and locale toggle.
 */
export function NewFooter() {
  const { t, locale, setLocale } = useI18n();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleLanguage = () => {
    setLocale(locale === "pt-BR" ? "en-US" : "pt-BR");
  };

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground text-xl">StudAI</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm">
              {t("footer.tagline")}
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-foreground/80 font-medium">
                {t("common.support")}:{" "}
                <a 
                  href="mailto:support@studai.app" 
                  className="text-primary hover:text-primary/80 hover:underline"
                >
                  support@studai.app
                </a>
              </p>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground bg-background rounded-lg border border-border hover:border-border hover:shadow-sm transition-all"
            >
              <Globe className="h-4 w-4" />
              <span>{locale === "pt-BR" ? "English" : "Português"}</span>
            </button>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Product */}
            <nav>
              <h4 className="font-semibold text-foreground mb-4 text-sm">{t("common.product")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/resources"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("footer.resources")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("footer.howItWorks")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/plans"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("footer.plans")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("footer.faqLink")}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Company */}
            <nav>
              <h4 className="font-semibold text-foreground mb-4 text-sm">{t("common.company")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("common.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("common.contact")}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Support */}
            <nav>
              <h4 className="font-semibold text-foreground mb-4 text-sm">{t("common.support")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/support"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("footer.talkToSupport")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("common.security")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("common.privacy")}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Legal */}
            <nav>
              <h4 className="font-semibold text-foreground mb-4 text-sm">{t("common.legal")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("common.privacy")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("common.terms")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {t("common.security")}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StudAI. {t("footer.allRights")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a 
                href="mailto:support@studai.app" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                support@studai.app
              </a>
              <Link 
                to="/privacy" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("common.privacy")}
              </Link>
              <Link 
                to="/terms" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("common.terms")}
              </Link>
              <Link 
                to="/security" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("common.security")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
