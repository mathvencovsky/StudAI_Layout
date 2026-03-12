import { PublicLayout } from "@/components/layout/public-layout";
import { BookOpen, MessageSquare, Mail, HelpCircle, Video, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SupportPage() {
  const resources = [
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Respostas para as perguntas mais frequentes",
      link: "/faq",
    },
    {
      icon: BookOpen,
      title: "Documentação",
      description: "Guias completos sobre como usar a plataforma",
      link: "/how-it-works",
    },
    {
      icon: MessageSquare,
      title: "Chat ao Vivo",
      description: "Fale com nossa equipe em tempo real",
      link: "/contact",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Envie sua dúvida por email",
      link: "/contact",
    },
  ];

  const commonIssues = [
    {
      title: "Como criar um curso com IA?",
      answer: "Acesse 'Criar Curso' no menu, preencha o formulário com título, descrição e nível desejado, e clique em 'Gerar Curso'. A IA criará um curso completo em segundos.",
    },
    {
      title: "Atingi meu limite mensal, e agora?",
      answer: "Você pode fazer upgrade para o plano Pro para ter limites maiores, ou aguardar o próximo mês quando os limites serão renovados.",
    },
    {
      title: "Como funciona a gamificação?",
      answer: "Você ganha XP ao completar tarefas, estudar e manter sequências. Ao acumular XP, você sobe de nível e desbloqueia conquistas.",
    },
    {
      title: "Posso usar offline?",
      answer: "Atualmente o StudAI requer conexão com internet. Estamos trabalhando em funcionalidades offline para versões futuras.",
    },
  ];

  return (
    <PublicLayout>
      <div className="py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-16 text-center">
              <span className="text-sm font-semibold text-[#4A9FFF] tracking-wider uppercase block mb-6">Suporte</span>
              <h1 className="text-6xl md:text-7xl font-normal text-gray-900 mb-6" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1), 8px 3px 8px rgba(0,0,0,0.1), 12px 4px 12px rgba(0,0,0,0.05)" }}>
                Central de Ajuda
              </h1>
              <p className="text-xl text-gray-600">
                Encontre respostas, tutoriais e entre em contato com nosso suporte
              </p>
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {resources.map((resource, idx) => {
                const Icon = resource.icon;
                return (
                  <Link key={idx} to={resource.link}>
                    <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_48px_rgba(74,159,255,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:border-white/80 hover:scale-[1.02] transition-all duration-300 text-center h-full">
                      <Icon className="h-12 w-12 mx-auto mb-4 text-[#4A9FFF]" />
                      <h3 className="text-xl font-normal text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Common Issues */}
            <div className="mb-16">
              <h2 className="text-4xl font-normal text-gray-900 mb-8 text-center" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1)" }}>
                Problemas Comuns
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {commonIssues.map((issue, idx) => (
                  <div key={idx} className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]">
                    <h3 className="text-xl font-normal text-gray-900 mb-4">{issue.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{issue.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-12 rounded-3xl bg-gradient-to-br from-[#4A9FFF]/10 to-[#4A9FFF]/5 border border-[#4A9FFF]/20 text-center">
              <h2 className="text-3xl font-normal text-gray-900 mb-4">Ainda precisa de ajuda?</h2>
              <p className="text-gray-600 mb-8">
                Nossa equipe está pronta para ajudar você
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/contact">
                  <button className="px-8 py-4 bg-[#4A9FFF] hover:bg-[#3A8FEF] text-white font-semibold rounded-full transition-all duration-200 hover:scale-105 shadow-lg">
                    Entrar em Contato
                  </button>
                </Link>
                <Link to="/faq">
                  <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-full transition-all duration-200 hover:scale-105 border-2 border-gray-200">
                    Ver FAQ Completo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}