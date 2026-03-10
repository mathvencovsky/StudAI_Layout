import { Brain, Zap, Target, TrendingUp } from "lucide-react";

export function AIShowcaseSection() {
  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(74,159,255,0.05),transparent_70%)]" />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-blue-50 border border-blue-100 rounded-full mb-10">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Tecnologia</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-[1.05]">
            IA que realmente
            <br />
            <span className="text-blue-600">entende você</span>
          </h2>
          
          <p className="text-2xl text-gray-600 leading-relaxed">
            Não é só um algoritmo. É uma IA que aprende com você, adapta seu plano em tempo real, e te guia todos os dias.
          </p>
        </div>

        {/* Features showcase - Asymmetric layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Large feature */}
          <div className="lg:col-span-7">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-12 h-full hover:border-blue-200 hover:shadow-2xl transition-all group">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Brain className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Adaptação em tempo real
              </h3>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                A IA monitora seu desempenho, identifica dificuldades, e ajusta automaticamente o conteúdo e a velocidade. Você sempre estuda no ritmo certo.
              </p>

              {/* Mini visualization */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Dificuldade detectada</span>
                  <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">Ajustando...</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-sm text-gray-600">Reduzindo complexidade</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-sm text-gray-600">Adicionando exemplos práticos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-sm text-gray-600">Programando revisão extra</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two smaller features stacked */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-10 hover:border-blue-200 hover:shadow-2xl transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Zap className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Plano diário automático
              </h3>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Todo dia, a IA cria suas tarefas baseado no seu objetivo, tempo disponível e progresso.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-3xl p-10 hover:border-blue-200 hover:shadow-2xl transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <TrendingUp className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Revisões inteligentes
              </h3>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Sistema de repetição espaçada. A IA programa revisões nos momentos ideais para máxima retenção.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom stat bar */}
        <div className="mt-20 bg-gray-900 rounded-3xl p-12">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-3">3x</div>
              <div className="text-gray-400 text-lg">Mais retenção que métodos tradicionais</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-3">80%</div>
              <div className="text-gray-400 text-lg">Menos tempo perdido decidindo o que estudar</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-3">24/7</div>
              <div className="text-gray-400 text-lg">IA sempre disponível para adaptar seu plano</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-3">100%</div>
              <div className="text-gray-400 text-lg">Personalizado para seu ritmo e objetivo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
