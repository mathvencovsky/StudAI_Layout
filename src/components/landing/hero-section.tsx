import { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
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
    { id: "concurso" as Profile, label: t("hero-profile-concurso") },
    { id: "certificacao" as Profile, label: t("hero-profile-certificacao") },
    { id: "faculdade" as Profile, label: t("hero-profile-faculdade") },
  ];

  const benefits = {
    concurso: [
      t("hero-concurso-benefit1"),
      t("hero-concurso-benefit2"),
      t("hero-concurso-benefit3"),
    ],
    certificacao: [
      t("hero-certificacao-benefit1"),
      t("hero-certificacao-benefit2"),
      t("hero-certificacao-benefit3"),
    ],
    faculdade: [
      t("hero-faculdade-benefit1"),
      t("hero-faculdade-benefit2"),
      t("hero-faculdade-benefit3"),
    ],
  };

  return (
    <section className="container py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="space-y-8">
          <Badge variant="secondary" className="w-fit">
            {t("hero-kicker")}
          </Badge>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("hero-headline")}
              <span className="text-primary">{t("hero-headline-highlight")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              {t("hero-subheadline")}
            </p>
          </div>

          {/* Profile Selector */}
          <div className="space-y-3">
            <p className="text-sm font-medium">{t("hero-studying-for")}</p>
            <div className="flex flex-wrap gap-2">
              {profiles.map((profile) => (
                <Button
                  key={profile.id}
                  variant={selectedProfile === profile.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleProfileChange(profile.id)}
                >
                  {profile.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <Card className="p-6 space-y-3">
            {benefits[selectedProfile].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">{benefit}</p>
              </div>
            ))}
          </Card>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href="#planos">{t("hero-cta-primary")}</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#como-funciona">{t("hero-cta-secondary")}</a>
            </Button>
          </div>
        </div>

        {/* Right Column - Auth Card */}
        <div className="lg:pl-8">
          <AuthCard />
        </div>
      </div>
    </section>
  );
}
