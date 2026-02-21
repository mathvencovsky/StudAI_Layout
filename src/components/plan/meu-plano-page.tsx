import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Sparkles, 
  Crown, 
  Zap, 
  TrendingUp, 
  Shield, 
  Users, 
  Infinity,
  ChevronRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function MeuPlanoPage() {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const currentPlan = "free"; // Mock - em produção viria de um hook

  const plans = [
    {
      id: "free",
      name: t("pricing.free.name", "Gratuito"),
      tagline: t("pricing.free.tagline", "Para começar sua jornada"),
      price: t("pricing.free.price", "R$ 0"),
      period: t("pricing.free.forever", "para sempre"),
      description: t("pricing.free.desc", "Perfeito para quem está começando e quer experimentar a plataforma"),
      features: [
        t("pricing.free.feature1", "Acesso a conteúdos básicos"),
        t("pricing.free.feature2", "1 trilha ativa por vez"),
        t("pricing.free.feature3", "Progresso e estatísticas básicas"),
        t("pricing.free.feature4", "Comunidade de estudantes"),
        t("pricing.free.feature5", "Suporte por email"),
      ],
      cta: t("pricing.free.cta", "Plano Atual"),
      ctaVariant: "outline" as const,
      popular: false,
      icon: Users,
    },
    {
      id: "pro",
      name: t("pricing.pro.name", "Pro"),
      tagline: t("pricing.pro.tagline", "Para estudantes dedicados"),
      price: billingCycle === "monthly" ? "R$ 49,90" : "R$ 39,90",
      period: billingCycle === "monthly" ? "/mês" : "/mês (cobrado anualmente)",
      description: t("pricing.pro.desc", "Recursos avançados para acelerar seu aprendizado"),
      features: [
        t("pricing.pro.feature1", "IA ilimitada para criar trilhas personalizadas"),
        t("pricing.pro.feature2", "Trilhas ilimitadas simultâneas"),
        t("pricing.pro.feature3", "Acesso a todos os conteúdos premium"),
        t("pricing.pro.feature4", "Relatórios avançados e analytics"),
        t("pricing.pro.feature5", "Suporte prioritário"),
        "Sessões de estudo com IA",
        "Revisões espaçadas inteligentes",
        "Exportação de dados e certificados",
      ],
      cta: t("pricing.pro.cta", "Entrar na Lista de Espera"),
      ctaVariant: "default" as const,
      popular: true,
      icon: Crown,
      savings: billingCycle === "yearly" ? "Economize R$ 120/ano" : null,
    },
  ];

  const handleUpgrade = (planId: string) => {
    if (planId === "free") {
      toast.info("Você já está no plano gratuito");
      return;
    }

    // Abre email para lista de espera
    const subject = encodeURIComponent("interesse no plano pro - stud-ai");
    const body = encodeURIComponent(
      "Olá! Tenho interesse em fazer upgrade para o plano Pro.\n\nPor favor, me avise quando estiver disponível."
    );
    window.location.href = `mailto:support@studi.app?subject=${subject}&body=${body}`;
  };

  const benefits = [
    {
      icon: Zap,
      title: "IA Avançada",
      description: "Crie trilhas personalizadas com inteligência artificial",
    },
    {
      icon: TrendingUp,
      title: "Analytics Detalhado",
      description: "Acompanhe seu progresso com métricas avançadas",
    },
    {
      icon: Shield,
      title: "Suporte Premium",
      description: "Atendimento prioritário e especializado",
    },
    {
      icon: Infinity,
      title: "Sem Limites",
      description: "Acesso ilimitado a todos os recursos da plataforma",
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 pb-24 md:pb-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">
          <Sparkles className="w-3 h-3 mr-1" />
          {t("pricing.kicker", "Planos")}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold">
          {t("pricing.headline", "Escolha o plano ideal")}
          <span className="block text-primary mt-1">
            {t("pricing.headlineHighlight", "para sua jornada")}
          </span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("pricing.subheadline", "Comece grátis e faça upgrade quando precisar de mais recursos")}
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={billingCycle === "monthly" ? "font-semibold" : "text-muted-foreground"}>
          Mensal
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            billingCycle === "yearly" ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
              billingCycle === "yearly" ? "translate-x-7" : ""
            }`}
          />
        </button>
        <span className={billingCycle === "yearly" ? "font-semibold" : "text-muted-foreground"}>
          Anual
        </span>
        {billingCycle === "yearly" && (
          <Badge variant="secondary" className="ml-2">
            -20%
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? "border-2 border-primary shadow-lg shadow-primary/10"
                  : "border-2"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t("pricing.recommended", "Recomendado")}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    </div>
                    <CardDescription>{plan.tagline}</CardDescription>
                  </div>
                  {isCurrent && (
                    <Badge variant="secondary">Atual</Badge>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                      {plan.savings}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">{plan.description}</p>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full group"
                  variant={plan.ctaVariant}
                  size="lg"
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent}
                >
                  {isCurrent ? (
                    plan.cta
                  ) : (
                    <>
                      {plan.cta}
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                {plan.id === "pro" && (
                  <p className="text-xs text-center text-muted-foreground">
                    {t("pricing.pro.noSpam", "Sem spam. Apenas avisaremos quando estiver disponível.")}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="mt-12 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Por que fazer upgrade?</h2>
          <p className="text-muted-foreground">
            Desbloqueie todo o potencial da plataforma
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Posso cancelar a qualquer momento?</h3>
            <p className="text-sm text-muted-foreground">
              Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">O que acontece com meu progresso se eu cancelar?</h3>
            <p className="text-sm text-muted-foreground">
              Seu progresso é mantido e você volta para o plano gratuito com acesso aos recursos básicos.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Posso mudar de plano depois?</h3>
            <p className="text-sm text-muted-foreground">
              Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Tem alguma dúvida?</h3>
            <p className="text-sm text-muted-foreground">
              Entre em contato conosco em{" "}
              <a href="mailto:support@studi.app" className="text-primary hover:underline">
                support@studi.app
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trust Notice */}
      <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
        <Shield className="w-5 h-5 inline-block mr-2" />
        {t("pricing.trustNotice", "Seus dados estão seguros. Não compartilhamos suas informações.")}
      </div>
    </div>
  );
}
