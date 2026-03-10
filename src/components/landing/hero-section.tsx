import { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles } from "lucide-react";
import { AuthCard } from "./auth-card";

type Profile = "concurso" | "certificacao" | "faculdade";

export function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useSearch({ from: "/" });
  const [selectedProfile, setSelectedProfile] = useState<Profile>("concurso");

  useEffect(() => {
    const profileParam = (search as any)?.perfil as Profile | undefined;
    if (profileParam && ["concurso", "certificacao", "faculdade"].includes(profileParam)) {
      setSelectedProfile(profileParam);
    }
  }, [search]);

  const handleProfileChange = (profile: Profile) => {
    setSelectedProfile(profile);
    navigate({ search: { perfil: profile } });
  };

  const profiles = [
    { id: "concurso" as Profile, label: t("hero.profileConcurso") },
    { id: "certificacao" as Profile, label: t("hero.profileCertificacao") },
    { id: "faculdade" as Profile, label: t("hero.profileFaculdade") },
  ];

  const benefits = {
    concurso: [
      t("hero.concurso.benefit1"),
      t("hero.concurso.benefit2"),
      t("hero.concurso.benefit3"),
    ],
    certificacao: [
      t("hero.certificacao.benefit1"),
      t("hero.certificacao.benefit2"),
      t("hero.certificacao.benefit3"),
    ],
    faculdade: [
      t("hero.faculdade.benefit1"),
      t("hero.faculdade.benefit2"),
      t("hero.faculdade.benefit3"),
    ],
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(74,222,128,0.05),transparent_50%)]" />
      
      <div className="container relative py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Column */}
          <div className="space-y-12 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {t("hero.kicker")}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-balance">
                {t("hero.headline")}
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t("hero.headlineHighlight")}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                {t("hero.subheadline")}
              </p>
            </div>

            {/* Profile Selector */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t("hero.studyingFor")}
              </p>
              <div className="flex flex-wrap gap-2">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleProfileChange(profile.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      selectedProfile === profile.id
                        ? "bg-foreground text-background shadow-lg"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    {profile.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits[selectedProfile].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-base text-foreground/80 leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button 
                size="lg" 
                asChild
                className="px-8 py-6 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <a href="#planos">{t("hero.ctaPrimary")}</a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="px-8 py-6 text-base font-semibold rounded-full border-2"
              >
                <a href="#como-funciona">{t("hero.ctaSecondary")}</a>
              </Button>
            </div>
          </div>

          {/* Right Column - Auth Card */}
          <div className="lg:pl-12">
            <div className="relative">
              <AuthCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
