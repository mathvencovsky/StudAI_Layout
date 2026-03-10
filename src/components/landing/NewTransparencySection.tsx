import { useState } from "react";
import { Shield, Database, Lock, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function NewTransparencySection() {
  const [activeTab, setActiveTab] = useState(0);

  const principles = [
    {
      icon: Database,
      title: "Seus dados, suas regras",
      description: "Usamos seus dados apenas para operar sua conta e acompanhar progresso. Nunca vendemos informações pessoais.",
      details: [
        "Dados armazenados com criptografia",
        "Acesso restrito apenas ao necessário",
        "Sem compartilhamento com terceiros",
        "Você controla o que coletamos"
      ]
    },
    {
      icon: Shield,
      title: "Segurança em primeiro lugar",
      description: "Criptografia ponta a ponta (HTTPS) e autenticação segura. Seus dados protegidos 24/7.",
      details: [
        "SSL/TLS em todas as conexões",
        "Autenticação de dois fatores",
        "Monitoramento contínuo",
        "Backups automáticos diários"
      ]
    },
    {
      icon: Lock,
      title: "Privacidade garantida",
      description: "Você controla o que compartilha. Pode exportar ou deletar seus dados a qualquer momento.",
      details: [
        "Controle total sobre seus dados",
        "Exportação em formato padrão",
        "Exclusão permanente sob demanda",
        "Sem rastreamento desnecessário"
      ]
    },
    {
      icon: Download,
      title: "Transparência total",
      description: "Acesso completo ao que coletamos e como usamos. Sem letras miúdas ou pegadinhas.",
      details: [
        "Documentação clara e acessível",
        "Notificação de mudanças",
        "Relatórios de uso disponíveis",
        "Suporte sempre disponível"
      ]
    }
  ];

  const activePrinciple = principles[activeTab];
  const ActiveIcon = activePrinciple.icon;

  return (
    <section id="transparencia" className="relative bg-white py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-blue-50 border border-blue-100 rounded-full mb-10">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Transparência</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-[1.05]">
            Privacidade e
            <br />
            <span className="text-blue-600">controle</span>
          </h2>
          <p className="text-2xl text-gray-600 leading-relaxed">
            Seus dados sob seu controle. Sempre.
          </p>
        </div>

        {/* Quick Summary */}
        <div className="mb-16 p-10 bg-gradient-to-br from-blue-50 to-blue-50/50 border-2 border-blue-100 rounded-3xl max-w-4xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xl">⚡</span>
            </div>
            Resumo em 30 segundos
          </h3>
          <ul className="space-y-5 text-gray-700">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-lg">✓</span>
              </div>
              <span className="text-lg">Usamos seus dados para operar sua conta e acompanhar progresso</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-lg">✓</span>
              </div>
              <span className="text-lg">Não vendemos dados pessoais. Nunca.</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-lg">✓</span>
              </div>
              <span className="text-lg">Você pode solicitar exportação ou exclusão através do suporte a qualquer momento</span>
            </li>
          </ul>
        </div>

        {/* Interactive Principles */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Tabs */}
          <div className="space-y-4">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              const isActive = activeTab === index;
              
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left rounded-2xl p-6 transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xl scale-105'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-white/20' : 'bg-blue-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <span className={`font-bold text-lg ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {principle.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Content */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-10 h-full">
              <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mb-8">
                <ActiveIcon className="w-10 h-10 text-blue-600" />
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                {activePrinciple.title}
              </h3>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {activePrinciple.description}
              </p>

              <div className="space-y-4">
                {activePrinciple.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-8 justify-center pt-12 border-t border-gray-200">
          {[
            { to: "/privacy", label: "Política de Privacidade" },
            { to: "/security", label: "Segurança" },
            { to: "/terms", label: "Termos de Uso" },
            { to: "/support", label: "Falar com Suporte" }
          ].map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium text-lg group"
            >
              {link.label}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
