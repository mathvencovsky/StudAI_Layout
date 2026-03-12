import { PublicLayout } from "@/components/layout/public-layout";
import { Target, Heart, Lightbulb, Users, Zap, Globe } from "lucide-react";

export function AboutPage() {
  return (
    <PublicLayout>
      <div className="py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-20 text-center">
            <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase block mb-6">
              Sobre nós
            </span>
            <h1 className="text-6xl md:text-7xl font-medium text-gray-900 mb-6">
              Transformando a educação com IA
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Acreditamos que cada pessoa merece acesso a uma educação personalizada e eficiente. 
              Nossa missão é democratizar o aprendizado através da inteligência artificial.
            </p>
          </div>

          {/* Mission Section */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-12 border border-blue-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-900">Nossa Missão</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Capacitar estudantes de todo o mundo com ferramentas de aprendizado inteligentes que se adaptam 
                ao ritmo e estilo de cada pessoa. Queremos tornar o estudo mais eficiente, personalizado e 
                acessível para todos, eliminando barreiras e maximizando resultados.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-semibold text-gray-900 mb-12 text-center">
              Nossos Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Foco no Estudante
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Cada decisão que tomamos é pensada para melhorar a experiência e os resultados dos nossos usuários.
                </p>
              </div>

              {/* Value 2 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Inovação Constante
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Estamos sempre explorando novas tecnologias e metodologias para oferecer a melhor experiência de aprendizado.
                </p>
              </div>

              {/* Value 3 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Comunidade
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Acreditamos no poder da colaboração e no aprendizado compartilhado entre estudantes.
                </p>
              </div>

              {/* Value 4 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Eficiência
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Otimizamos cada minuto de estudo para que você alcance seus objetivos mais rapidamente.
                </p>
              </div>

              {/* Value 5 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Acessibilidade
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Educação de qualidade deve estar ao alcance de todos, independente de localização ou recursos.
                </p>
              </div>

              {/* Value 6 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Resultados
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Medimos nosso sucesso pelo sucesso dos nossos estudantes em alcançar suas metas.
                </p>
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
              <h2 className="text-3xl font-semibold mb-6">Nossa Visão</h2>
              <p className="text-lg text-gray-200 leading-relaxed mb-6">
                Imaginamos um futuro onde cada estudante tem acesso a um tutor pessoal alimentado por IA, 
                capaz de entender suas necessidades únicas, adaptar-se ao seu ritmo e guiá-lo no caminho 
                mais eficiente para o sucesso.
              </p>
              <p className="text-lg text-gray-200 leading-relaxed">
                Queremos ser a plataforma líder global em educação personalizada, transformando a forma 
                como milhões de pessoas aprendem e alcançam seus objetivos acadêmicos e profissionais.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-8">
                <div className="text-5xl font-bold text-blue-600 mb-2">10k+</div>
                <div className="text-gray-600">Estudantes ativos</div>
              </div>
              <div className="p-8">
                <div className="text-5xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-gray-600">Taxa de satisfação</div>
              </div>
              <div className="p-8">
                <div className="text-5xl font-bold text-blue-600 mb-2">1M+</div>
                <div className="text-gray-600">Horas de estudo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
