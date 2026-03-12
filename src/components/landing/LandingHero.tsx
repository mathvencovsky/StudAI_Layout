import { useState, useEffect } from "react";
import { useSearch, useNavigate, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  RotateCcw,
  TrendingUp,
  Mail,
  Shield,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "./auth-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { KickerBadge, HeadlineHighlight } from "./ui";
import { useCustomI18n as useI18n } from "@/i18n";

export type ProfileKey = "concurso" | "certificacao" | "faculdade";

const STORAGE_KEY = "studai_perfil";

export function getProfileData(t: (key: any) => string) {
  return {
    concurso: {
      label: t("hero.profileConcurso"),
      benefits: [t("hero.concurso.benefit1"), t("hero.concurso.benefit2"), t("hero.concurso.benefit3")],
      microcopy: t("hero.concurso.microcopy"),
      contextLine: t("hero.concurso.contextLine"),
    },
    certificacao: {
      label: t("hero.profileCertificacao"),
      benefits: [t("hero.certificacao.benefit1"), t("hero.certificacao.benefit2"), t("hero.certificacao.benefit3")],
      microcopy: t("hero.certificacao.microcopy"),
      contextLine: t("hero.certificacao.contextLine"),
    },
    faculdade: {
      label: t("hero.profileFaculdade"),
      benefits: [t("hero.faculdade.benefit1"), t("hero.faculdade.benefit2"), t("hero.faculdade.benefit3")],
      microcopy: t("hero.faculdade.microcopy"),
      contextLine: t("hero.faculdade.contextLine"),
    },
  };
}

// Keep static profiles for backward compatibility (used by components that don't have i18n yet)
export const profiles: Record<
  ProfileKey,
  {
    label: string;
    benefits: string[];
    microcopy: string;
    contextLine: string;
  }
> = {
  concurso: {
    label: "Concurso",
    benefits: ["Rotina diária pronta para executar", "Revisão automática no tempo certo", "Progresso semanal visível"],
    microcopy: "Funciona para concursos federais, estaduais e municipais",
    contextLine: "Foco em constância e revisão.",
  },
  certificacao: {
    label: "Certificação",
    benefits: ["Trilha por tópicos e prioridades", "Revisões para fixação", "Cobertura do conteúdo por semana"],
    microcopy: "CFA, CPA-10/20, CEA, CFP e outras certificações",
    contextLine: "Cobertura e prática por tópico.",
  },
  faculdade: {
    label: "Faculdade",
    benefits: ["Organização por disciplina", "Revisões semanais sem esquecer", "Visão clara do que fazer hoje"],
    microcopy: "Para graduação, pós ou cursos livres",
    contextLine: "Disciplina, revisões e entregas em dia.",
  },
};

export function isValidProfile(value: string | null): value is ProfileKey {
  return value === "concurso" || value === "certificacao" || value === "faculdade";
}

export function getStoredProfile(): ProfileKey {
  if (typeof window === "undefined") return "concurso";
  const stored = localStorage.getItem(STORAGE_KEY);
  return isValidProfile(stored) ? stored : "concurso";
}

export function setStoredProfile(profile: ProfileKey): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, profile);
  }
}

// Ultra-futuristic product preview with glassmorphism
function MiniProductPreview() {
  const { t } = useI18n();

  const todayTasks = [
    { label: t("preview.task1"), done: true },
    { label: t("preview.task2"), done: true },
    { label: t("preview.task3"), done: false },
  ];

  const reviewQueue = [
    { subject: t("preview.review1"), dueIn: t("preview.reviewDueToday") },
    { subject: t("preview.review2"), dueIn: t("preview.reviewDueTomorrow") },
    { subject: t("preview.review3"), dueIn: t("preview.reviewDue3Days") },
  ];

  return (
    <div className="relative w-full">
      <p className="text-xs text-muted-foreground/70 text-center mb-6 font-black uppercase tracking-widest">{t("common.illustrativeExample")}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Today - Glassmorphic */}
        <Card className="glass-strong border-gradient hover:scale-105 hover:glow-primary transition-all duration-500 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 glow-primary">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-black text-foreground">{t("preview.today")}</span>
              <span className="ml-auto text-xs font-black bg-gradient-to-r from-accent-warm/30 to-accent/20 text-accent-warm px-3 py-1.5 rounded-full backdrop-blur-sm">
                {t("preview.tasks")}
              </span>
            </div>
            <ul className="space-y-3.5">
              {todayTasks.map((task, i) => (
                <li key={i} className="flex items-center gap-3 text-sm group">
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                      task.done ? "bg-gradient-to-br from-success to-success/70 border-success scale-110 glow-accent" : "border-muted-foreground/30 group-hover:border-primary/50"
                    }`}
                  >
                    {task.done && <CheckCircle2 className="h-3.5 w-3.5 text-success-foreground" />}
                  </div>
                  <span
                    className={`font-semibold ${
                      task.done ? "text-muted-foreground/70 line-through" : "text-foreground"
                    }`}
                  >
                    {task.label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground/70 mt-5 font-black">
              {t("preview.completedOf")}
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Reviews - Glassmorphic */}
        <Card className="glass-strong border-gradient hover:scale-105 hover:glow-accent transition-all duration-500 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-accent-warm/30 to-accent/20 glow-accent">
                <RotateCcw className="h-5 w-5 text-accent-warm" />
              </div>
              <span className="text-sm font-black text-foreground">{t("preview.reviews")}</span>
            </div>
            <ul className="space-y-3.5">
              {reviewQueue.map((item, i) => (
                <li key={i} className="flex items-center justify-between text-sm group">
                  <span className="text-foreground font-semibold truncate group-hover:text-primary transition-colors">
                    {item.subject}
                  </span>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-black shrink-0 ml-2 backdrop-blur-sm ${
                      item.dueIn === t("preview.reviewDueToday")
                        ? "bg-gradient-to-r from-accent-warm/30 to-accent/20 text-accent-warm"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {item.dueIn}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground/70 mt-5 font-black">
              {t("preview.pending")}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Week - Glassmorphic */}
        <Card className="glass-strong border-gradient hover:scale-105 hover:glow-primary transition-all duration-500 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-success/30 to-accent/20 glow-primary">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <span className="text-sm font-black text-foreground">{t("preview.week")}</span>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground/80 font-semibold">{t("preview.progress")}</span>
                  <span className="text-foreground font-black text-gradient">68%</span>
                </div>
                <div className="relative h-3 rounded-full bg-muted/30 overflow-hidden">
                  <div className="absolute inset-0 gradient-animate opacity-70" style={{ width: '68%' }} />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground/80 font-semibold">{t("preview.hours")}</span>
                <span className="text-foreground font-black">8h 30min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground/80 font-semibold">{t("preview.goal")}</span>
                <span className="text-foreground font-black">12h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function LandingHero() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/" }) as { perfil?: ProfileKey; redirect?: string };
  const [profile, setProfile] = useState<ProfileKey>(() => {
    const urlProfile = searchParams?.perfil;
    if (isValidProfile(urlProfile)) return urlProfile;
    return getStoredProfile();
  });

  const profileData = getProfileData(t);
  const currentProfile = profileData[profile];

  const handleProfileChange = (value: string) => {
    if (!isValidProfile(value)) return;
    setProfile(value);
    setStoredProfile(value);
    navigate({ to: "/", search: { perfil: value }, replace: true });
  };

  useEffect(() => {
    const urlProfile = searchParams?.perfil;
    if (isValidProfile(urlProfile) && urlProfile !== profile) {
      setProfile(urlProfile);
      setStoredProfile(urlProfile);
    }
  }, [searchParams, profile]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        const emailInput = el.querySelector('input[type="email"]') as HTMLInputElement;
        emailInput?.focus();
      }, 150);
    });
  };

  return (
    <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Ultra-futuristic mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-accent-warm/30 via-accent/20 to-transparent blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-primary/30 to-transparent blur-3xl float opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-accent/20 to-transparent blur-2xl pulse-glow" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="min-w-0 text-center lg:text-left space-y-10">
            {/* Futuristic kicker badge with glassmorphism */}
            <div className="flex justify-center lg:justify-start animate-fade-in">
              <div className="glass-strong inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border-gradient">
                <Sparkles className="h-4 w-4 text-accent-warm animate-pulse" />
                <span className="text-sm font-black text-foreground tracking-wide">{t("hero.kicker")}</span>
              </div>
            </div>

            {/* Ultra-bold headline with animated gradient */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter animate-fade-in-up">
              <span className="block text-foreground">{t("hero.headline")}</span>
              <span className="block mt-3 text-gradient-animate">
                {t("hero.headlineHighlight")}
              </span>
            </h1>

            {/* Refined subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium animate-fade-in-up animation-delay-200">
              {t("hero.subheadline")}
            </p>

            {/* Futuristic profile selector with glassmorphism */}
            <div className="space-y-4 animate-fade-in-up animation-delay-300">
              <p className="text-xs font-black text-foreground/70 uppercase tracking-widest">{t("hero.studyingFor")}</p>
              <ToggleGroup
                type="single"
                value={profile}
                onValueChange={handleProfileChange}
                className="glass w-full max-w-lg mx-auto lg:mx-0 grid grid-cols-3 gap-2 p-2 rounded-3xl"
              >
                {(Object.keys(profileData) as ProfileKey[]).map((key) => (
                  <ToggleGroupItem
                    key={key}
                    value={key}
                    variant="outline"
                    className="px-6 py-4 text-sm font-black rounded-2xl border-0 transition-all duration-300 data-[state=on]:glass-strong data-[state=on]:gradient-animate data-[state=on]:text-white data-[state=on]:scale-105 data-[state=on]:glow-primary hover:scale-105"
                  >
                    {key === "certificacao" ? (
                      <>
                        <span className="sm:hidden">{t("hero.profileCertificacaoShort")}</span>
                        <span className="hidden sm:inline">{profileData[key].label}</span>
                      </>
                    ) : (
                      profileData[key].label
                    )}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Premium benefits list */}
            <ul className="space-y-4 w-full max-w-lg mx-auto lg:mx-0 text-left animate-fade-in-up animation-delay-400">
              {currentProfile.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-4 text-lg text-foreground group">
                  <div className="mt-1 p-2 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <span className="font-semibold leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Ultra-premium CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg mx-auto lg:mx-0 animate-fade-in-up animation-delay-500">
              <Button
                size="lg"
                onClick={() => scrollToId("auth-card")}
                className="group flex-1 text-lg font-black h-16 gradient-animate hover:scale-105 glow-primary transition-all duration-300 rounded-2xl relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToId("como-funciona")}
                className="glass-strong flex-1 text-lg font-black h-16 border-2 border-white/20 hover:scale-105 hover:glass transition-all duration-300 rounded-2xl"
              >
                {t("hero.ctaSecondary")}
              </Button>
            </div>

            {/* Microcopy with subtle styling */}
            <p className="text-sm text-muted-foreground/80 font-medium w-full max-w-lg mx-auto lg:mx-0 animate-fade-in-up animation-delay-600">
              {currentProfile.microcopy}
            </p>

            {/* Premium trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground/80 w-full max-w-lg mx-auto lg:mx-0 animate-fade-in-up animation-delay-700">
              <a
                href="mailto:support@studi.app"
                className="flex items-center gap-2.5 hover:text-foreground transition-all duration-300 font-semibold group"
              >
                <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>support@studi.app</span>
              </a>
              <Link
                to="/seguranca"
                className="flex items-center gap-2.5 hover:text-foreground transition-all duration-300 font-semibold group"
              >
                <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span>{t("common.security")}</span>
              </Link>
              <Link
                to="/privacidade"
                className="flex items-center gap-2.5 hover:text-foreground transition-all duration-300 font-semibold group"
              >
                <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <span>{t("common.privacy")}</span>
              </Link>
            </div>

            {/* Mobile preview */}
            <div className="mt-16 lg:hidden max-w-full animate-fade-in-up animation-delay-800">
              <MiniProductPreview />
            </div>
          </div>

          {/* Right column - Glassmorphic auth card and preview */}
          <div className="min-w-0 flex flex-col gap-10 animate-fade-in-left">
            <div id="auth-card" tabIndex={-1} className="outline-none flex justify-center lg:justify-end">
              <div className="w-full max-w-md transform hover:scale-[1.02] transition-all duration-500 float">
                <div className="glass-strong rounded-3xl p-1 glow-primary">
                  <AuthCard />
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <MiniProductPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
