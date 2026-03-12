import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown } from "lucide-react";
import { PLAN_LIMITS } from "../../../amplify/data/config/plan-limits";

export function PlansPage() {
  const freeLimits = PLAN_LIMITS.free;
  const proLimits = PLAN_LIMITS.pro;

  return (
    <PublicLayout>
      <div className="py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <span className="text-sm font-semibold text-[#4A9FFF] tracking-wider uppercase block mb-6">Planos</span>
            <h1 className="text-6xl md:text-7xl font-normal text-gray-900 mb-6" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1), 8px 3px 8px rgba(0,0,0,0.1), 12px 4px 12px rgba(0,0,0,0.05)" }}>
              Escolha seu Plano
            </h1>
            <p className="text-lg text-gray-600">Comece grátis e faça upgrade quando precisar de mais recursos</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Plano Free */}
              <div className="relative p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_48px_rgba(74,159,255,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-6 w-6 text-[#4A9FFF]" />
                  <h2 className="text-2xl font-normal text-gray-900">Free</h2>
                </div>
                <p className="text-gray-600 mb-6">Perfeito para começar sua jornada de aprendizado</p>
                <div className="mb-8">
                  <span className="text-4xl font-normal text-gray-900">R$ 0</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                
                <Button className="w-full mb-8 bg-white text-gray-900 border border-gray-200 hover:bg-gray-50" variant="outline">
                  Plano Atual
                </Button>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {freeLimits.coursePublishPerMonth} cursos publicados por mês
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {freeLimits.coachMessagesPerDay} mensagens com Coach IA por dia
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {freeLimits.recommendationsPerDay} recomendações por dia
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Acesso a recursos verificados
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Trilhas de aprendizado
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Quizzes e revisões
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Gamificação básica
                    </span>
                  </div>
                </div>
              </div>

              {/* Plano Pro */}
              <div className="relative p-8 rounded-3xl bg-white/40 backdrop-blur-md border-2 border-[#4A9FFF]/40 shadow-[0_8px_32px_rgba(74,159,255,0.15)] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_40px_rgba(74,159,255,0.2)] transition-all duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4A9FFF] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recomendado
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-2xl font-normal text-gray-900">Pro</h2>
                </div>
                <p className="text-gray-600 mb-6">Para quem quer acelerar o aprendizado com IA</p>
                <div className="mb-8">
                  <span className="text-4xl font-normal text-gray-900">R$ 29,90</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                
                <Button className="w-full mb-8 bg-[#4A9FFF] hover:bg-[#3A8FEF] text-white">
                  Fazer Upgrade
                </Button>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900">
                      {proLimits.coursePublishPerMonth} cursos publicados por mês
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900">
                      {proLimits.coachMessagesPerDay} mensagens com Coach IA por dia
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900">
                      {proLimits.recommendationsPerDay} recomendações por dia
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Tudo do plano Free
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Prioridade no suporte
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Análises avançadas
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Sem anúncios
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Acesso antecipado a novos recursos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Rápido */}
            <div className="mt-16">
              <h2 className="text-3xl font-normal text-gray-900 mb-12 text-center" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.4), 2px 1px 2px rgba(0,0,0,0.1)" }}>
                Perguntas Frequentes
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]">
                  <h3 className="text-lg font-normal text-gray-900 mb-3">Posso cancelar a qualquer momento?</h3>
                  <p className="text-sm text-gray-600">
                    Sim! Você pode cancelar seu plano Pro a qualquer momento. Não há taxas de cancelamento.
                  </p>
                </div>
                
                <div className="p-6 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]">
                  <h3 className="text-lg font-normal text-gray-900 mb-3">Como funciona o limite mensal?</h3>
                  <p className="text-sm text-gray-600">
                    Os limites são renovados no primeiro dia de cada mês. Cursos não utilizados não acumulam.
                  </p>
                </div>
                
                <div className="p-6 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]">
                  <h3 className="text-lg font-normal text-gray-900 mb-3">Posso fazer downgrade?</h3>
                  <p className="text-sm text-gray-600">
                    Sim, você pode voltar para o plano Free a qualquer momento. Seus dados serão mantidos.
                  </p>
                </div>
                
                <div className="p-6 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]">
                  <h3 className="text-lg font-normal text-gray-900 mb-3">Há desconto anual?</h3>
                  <p className="text-sm text-gray-600">
                    Em breve! Estamos trabalhando em planos anuais com desconto especial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
