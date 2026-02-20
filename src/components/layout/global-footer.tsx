import { Link } from "@tanstack/react-router";
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
          {/* Sobre */}
          <div>
            <h3 className="font-semibold text-lg mb-4">StudAI</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Plataforma de aprendizado inteligente com IA para acelerar sua jornada de estudos.
            </p>
            
            {/* Email de Suporte */}
            <div className="mb-4">
              <a 
                href="mailto:support@studi.app"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                support@studi.app
              </a>
            </div>

            {/* Seletor de Idioma */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Globe className="h-4 w-4" />
                <span>Idioma</span>
              </div>
              <Select value={currentLocale} onValueChange={setLocale}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o idioma" />
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

            {/* Redes Sociais */}
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

          {/* Recursos */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/resources" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Catálogo de Recursos
                </Link>
              </li>
              <li>
                <Link 
                  to="/how-it-works" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link 
                  to="/plans" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Planos
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contato
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Privacidade
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link 
                  to="/security" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Segurança
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} StudAI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
