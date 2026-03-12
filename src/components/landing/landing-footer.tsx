import { Link } from "@tanstack/react-router";
import { GraduationCap, Globe } from "lucide-react";
import { useCustomI18n as useI18n } from "@/i18n";

const SUPPORT_EMAIL = "support@studai.app";

function isHomePath() {
  return typeof window !== "undefined" && window.location.pathname === "/";
}

export function LandingFooter() {
  const { t, locale, setLocale } = useI18n();

  const goToHash = (hash: string) => {
    if (!isHomePath()) {
      window.location.assign(`/${hash}`);
      return;
    }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleLocale = () => {
    setLocale(locale === "pt-BR" ? "en-US" : "pt-BR");
  };

  type FooterLink = { label: string; href: string; kind: "hash" | "route" | "external" };

  const footerLinks: Record<string, FooterLink[]> = {
    produto: [
      { label: "Resources", href: "#produto", kind: "hash" },
      { label: "How it works", href: "#como-funciona", kind: "hash" },
      { label: "Plans", href: "#planos", kind: "hash" },
      { label: "FAQ", href: "#faq", kind: "hash" },
    ],
    empresa: [
      { label: "About", href: "/sobre", kind: "route" },
      { label: "Contact", href: "/contato", kind: "route" },
    ],
    suporte: [
      { label: "Talk to support", href: `mailto:${SUPPORT_EMAIL}`, kind: "external" },
      { label: "Security", href: "/seguranca", kind: "route" },
      { label: "Privacy", href: "/privacidade", kind: "route" },
    ],
    legal: [
      { label: "Privacy", href: "/privacidade", kind: "route" },
      { label: "Terms", href: "/termos", kind: "route" },
      { label: "Security", href: "/seguranca", kind: "route" },
    ],
  };

  const renderLink = (link: FooterLink) => {
    const baseClass = "text-sm text-gray-600 hover:text-gray-900 transition-colors block";

    if (link.kind === "hash")
      return (
        <button onClick={() => goToHash(link.href)} className={baseClass}>
          {link.label}
        </button>
      );

    if (link.kind === "route")
      return (
        <Link to={link.href} className={baseClass}>
          {link.label}
        </Link>
      );

    return (
      <a href={link.href} className={baseClass} rel="noopener noreferrer">
        {link.label}
      </a>
    );
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand - Takes more space */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-xl">StudAI</span>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-sm">
              Organize your studies with clarity. Track your progress with consistency.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-700 font-medium">
                Support: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 hover:text-blue-700 hover:underline">{SUPPORT_EMAIL}</a>
              </p>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <Globe className="h-4 w-4" />
              <span>{locale === "pt-BR" ? "English" : "Português"}</span>
            </button>
          </div>

          {/* Links Grid - Takes remaining space */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Product */}
            <nav>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">Product</h4>
              <ul className="space-y-3">
                {footerLinks.produto.map((link) => (
                  <li key={link.label}>{renderLink(link)}</li>
                ))}
              </ul>
            </nav>

            {/* Company */}
            <nav>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">Company</h4>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.label}>{renderLink(link)}</li>
                ))}
              </ul>
            </nav>

            {/* Support */}
            <nav>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">Support</h4>
              <ul className="space-y-3">
                {footerLinks.suporte.map((link) => (
                  <li key={link.label}>{renderLink(link)}</li>
                ))}
              </ul>
            </nav>

            {/* Legal */}
            <nav>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>{renderLink(link)}</li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar with divider */}
        <div className="pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} StudAI. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a 
                href={`mailto:${SUPPORT_EMAIL}`} 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {SUPPORT_EMAIL}
              </a>
              <Link 
                to="/privacidade" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy
              </Link>
              <Link 
                to="/termos" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Terms
              </Link>
              <Link 
                to="/seguranca" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
