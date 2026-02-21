import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { 
  BookOpen, 
  HelpCircle, 
  Mail, 
  Shield, 
  FileText,
  Github,
  Twitter,
  Linkedin,
  Globe
} from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GlobalFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [currentLocale, setLocale] = useLocale();

  const locales = [
    { code: "pt", name: "Português" },
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
  ];

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-4">StudAI</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("footer-description")}
            </p>
            
            {/* Support Email */}
            <div className="mb-4">
              <a 
                href="mailto:support@studi.app"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                support@studi.app
              </a>
            </div>

            {/* Language Selector */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Globe className="h-4 w-4" />
                <span>{t("footer-language")}</span>
              </div>
              <Select value={currentLocale} onValueChange={setLocale}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("footer-language-select")} />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((locale) => (
                    <SelectItem key={locale.code} value={locale.code}>
                      {locale.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Social Networks */}
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("footer-resources")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/resources" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  {t("footer-catalog")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/how-it-works" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  {t("footer-how-it-works")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/plans" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {t("footer-plans")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("footer-support")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer-faq")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {t("footer-contact")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer-central-help")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">{t("footer-legal")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  {t("footer-privacy")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer-terms")}
                </Link>
              </li>
              <li>
                <Link 
                  to="/security" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer-security")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>{t("footer-copyright", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
