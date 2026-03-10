import { useState } from "react";
import { X, Check, TrendingUp, ArrowRight } from "lucide-react";

export function NewBeforeAfterSection() {
  const [activeView, setActiveView] = useState<'before' | 'after'>('after');

  const beforeItems = [
    "Sem direção clara do que estudar",
    "Esquece o que aprendeu em dias",
    "Perde horas decidindo por onde começar",
    "Desiste no meio do caminho"
  ];

  const afterItems = [
    "Plano personalizado criado pela IA",
    "Revisões automáticas programadas",
    "Tarefas diárias prontas para usar",
    "Progresso visível e motivador"
  ];

  const stats = [
    { value: "3x", label: "Mais consistência nos estudos" },
    { value: "80%", label: "Menos tempo perdido" },
    { value: "2x", label: "Maior retenção de conteúdo" },
    { value: "100%", label: "Personalizado para você" }
  ];

  return (
    <section className="relative bg-white py-12 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-blue-50 border border-blue-100 rounded-full mb-10">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Transformação</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-[1.05]">
            Antes e depois
            <br />
            <span className="text-blue-600">do StudAI</span>
          </h2>
          <p className="text-2xl text-gray-600 leading-relaxed">
            Veja a diferença que a IA faz na sua rotina de estudos
          </p>
        </div>

        {/* Interactive Toggle */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gray-100 rounded-2xl p-2">
            <button
              onClick={() => setActiveView('before')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                activeView === 'before'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sem StudAI
            </button>
            <button
              onClick={() => setActiveView('after')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                activeView === 'after'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Com StudAI
            </button>
          </div>
        </div>

        {/* Comparison View */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Before Card */}
          <div className={`transition-all duration-500 ${
            activeView === 'before' ? 'scale-105 opacity-100' : 'scale-95 opacity-40'
          }`}>
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-10 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <X className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sem StudAI</span>
                  <h3 className="text-3xl font-bold text-gray-900">Estudar é difícil</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                {beforeItems.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <X className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* After Card */}
          <div className={`transition-all duration-500 ${
            activeView === 'after' ? 'scale-105 opacity-100' : 'scale-95 opacity-40'
          }`}>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-xl" />
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 h-full text-white shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-100 uppercase tracking-wide">Com StudAI</span>
                    <h3 className="text-3xl font-bold text-white">Estudar é simples</h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {afterItems.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                      <Check className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                      <span className="text-lg text-white font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA inside card */}
                <button
                  onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-8 w-full flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all group"
                >
                  Começar agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-600 hover:shadow-xl transition-all">
                <div className="text-6xl font-bold text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-base text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
