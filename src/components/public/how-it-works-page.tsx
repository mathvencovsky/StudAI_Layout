import { PublicLayout } from "@/components/layout/public-layout";
import { Link } from "@tanstack/react-router";
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
    <PublicLayout>
      <div className="py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <div className="mb-16 text-center">
              <span className="text-sm font-semibold text-[#4A9FFF] tracking-wider uppercase block mb-6">Como Funciona</span>
              <h1 className="text-6xl md:text-7xl font-normal text-gray-900 mb-6" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1), 8px 3px 8px rgba(0,0,0,0.1), 12px 4px 12px rgba(0,0,0,0.05)" }}>
                Aprenda Mais Rápido com IA
              </h1>
              <p className="text-lg text-gray-600">
                Uma plataforma completa que combina IA generativa, recursos verificados e gamificação para acelerar seu aprendizado
              </p>
            </div>

            {/* Passos */}
            <div className="mb-16">
              <h2 className="text-3xl font-normal text-gray-900 mb-12 text-center" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.4), 2px 1px 2px rgba(0,0,0,0.1)" }}>
                Seu Caminho para o Sucesso
              </h2>
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_48px_rgba(74,159,255,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl bg-gray-50 ${step.color} flex-shrink-0`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-normal text-gray-900 mb-2">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recursos */}
            <div className="mb-16">
              <h2 className="text-3xl font-normal text-gray-900 mb-12 text-center" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.4), 2px 1px 2px rgba(0,0,0,0.1)" }}>
                Recursos Principais
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="p-6 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_48px_rgba(74,159,255,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-[#4A9FFF] mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-normal text-gray-900 mb-2">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#4A9FFF] to-[#3A8FEF] text-white text-center">
              <h2 className="text-3xl font-normal mb-4">
                Pronto para Começar?
              </h2>
              <p className="mb-8 opacity-90">
                Crie sua conta gratuitamente e comece a aprender hoje mesmo
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link 
                  to="/"
                  className="inline-flex items-center justify-center rounded-full bg-white text-gray-900 px-8 py-3 font-medium hover:bg-gray-100 transition-colors"
                >
                  Criar Conta Grátis
                </Link>
                <Link 
                  to="/plans"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3 font-medium hover:bg-white/10 transition-colors"
                >
                  Ver Planos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
