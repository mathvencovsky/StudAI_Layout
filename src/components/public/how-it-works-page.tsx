import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  BookOpen, 
  Target, 
  Zap, 
  TrendingUp,
  Award,
  Calendar,
  MessageSquare
} from "lucide-react";

export function HowItWorksPage() {
  const steps = [
    {
      icon: Target,
      title: "1. Defina seu Objetivo",
      description: "Conte-nos o que você quer aprender e em quanto tempo. Nossa IA vai criar um plano personalizado para você.",
      color: "text-blue-500",
    },
    {
      icon: Brain,
      title: "2. Gere Cursos com IA",
      description: "Use nossa IA para gerar cursos completos sobre qualquer tema. Receba módulos estruturados com tarefas práticas.",
      color: "text-purple-500",
    },
    {
      icon: BookOpen,
      title: "3. Estude com Recursos Verificados",
      description: "Acesse recursos curados e verificados. Links para vídeos, artigos e documentação de qualidade.",
      color: "text-green-500",
    },
    {
      icon: MessageSquare,
      title: "4. Converse com a IA",
      description: "Tire dúvidas, peça explicações e receba recomendações personalizadas através do chat com IA.",
      color: "text-orange-500",
    },
    {
      icon: Zap,
      title: "5. Pratique e Revise",
      description: "Faça quizzes para testar seu conhecimento e use o sistema de revisão espaçada para fixar o conteúdo.",
      color: "text-yellow-500",
    },
    {
      icon: TrendingUp,
      title: "6. Acompanhe seu Progresso",
      description: "Veja estatísticas detalhadas, mantenha sua sequência de estudos e suba de nível com gamificação.",
      color: "text-red-500",
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "IA Generativa",
      description: "Gere cursos completos, receba recomendações e tire dúvidas com nossa IA avançada.",
    },
    {
      icon: BookOpen,
      title: "Recursos Verificados",
      description: "Catálogo curado de recursos de qualidade, priorizando conteúdo em português.",
    },
    {
      icon: Target,
      title: "Plano Personalizado",
      description: "Defina metas e receba um plano de estudos adaptado ao seu ritmo e objetivos.",
    },
    {
      icon: Calendar,
      title: "Organização",
      description: "Calendário integrado, tarefas diárias e lembretes para manter você no caminho certo.",
    },
    {
      icon: Award,
      title: "Gamificação",
      description: "XP, níveis, sequências e conquistas para manter você motivado.",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Relatórios detalhados sobre seu progresso, tempo de estudo e áreas de melhoria.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <Badge className="mb-4">Como Funciona</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Aprenda Mais Rápido com IA
            </h1>
            <p className="text-lg text-muted-foreground">
              Uma plataforma completa que combina IA generativa, recursos verificados e gamificação para acelerar seu aprendizado
            </p>
          </div>

          {/* Passos */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Seu Caminho para o Sucesso
            </h2>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-muted ${step.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle>{step.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recursos */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Recursos Principais
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Pronto para Começar?
              </h2>
              <p className="mb-6 opacity-90">
                Crie sua conta gratuitamente e comece a aprender hoje mesmo
              </p>
              <div className="flex gap-4 justify-center">
                <a 
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-6 py-3 font-medium hover:bg-background/90 transition-colors"
                >
                  Criar Conta Grátis
                </a>
                <a 
                  href="/plans"
                  className="inline-flex items-center justify-center rounded-md border border-primary-foreground/20 px-6 py-3 font-medium hover:bg-primary-foreground/10 transition-colors"
                >
                  Ver Planos
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
