import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown } from "lucide-react";
import { PLAN_LIMITS } from "../../../amplify/data/config/plan-limits";

export function PlansPage() {
  const freeLimits = PLAN_LIMITS.free;
  const proLimits = PLAN_LIMITS.pro;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Escolha seu Plano</h1>
            <p className="text-lg text-muted-foreground">
              Comece grátis e faça upgrade quando precisar de mais recursos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Plano Free */}
            <Card className="relative">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-2xl">Free</CardTitle>
                </div>
                <CardDescription>
                  Perfeito para começar sua jornada de aprendizado
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-6" variant="outline">
                  Plano Atual
                </Button>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      {freeLimits.coursePublishPerMonth} cursos publicados por mês
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      {freeLimits.coachMessagesPerDay} mensagens com Coach IA por dia
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      {freeLimits.recommendationsPerDay} recomendações por dia
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      Acesso a recursos verificados
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      Trilhas de aprendizado
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      Quizzes e revisões
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      Gamificação básica
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plano Pro */}
            <Card className="relative border-primary shadow-lg">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Recomendado
              </Badge>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <CardTitle className="text-2xl">Pro</CardTitle>
                </div>
                <CardDescription>
                  Para quem quer acelerar o aprendizado com IA
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 29,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-6">
                  Fazer Upgrade
                </Button>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm font-semibold">
                      {proLimits.coursePublishPerMonth} cursos publicados por mês
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm font-semibold">
                      {proLimits.coachMessagesPerDay} mensagens com Coach IA por dia
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm font-semibold">
                      {proLimits.recommendationsPerDay} recomendações por dia
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      Tudo do plano Free
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      Prioridade no suporte
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      Análises avançadas
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      Sem anúncios
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">
                      Acesso antecipado a novos recursos
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Rápido */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sim! Você pode cancelar seu plano Pro a qualquer momento. Não há taxas de cancelamento.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Como funciona o limite mensal?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Os limites são renovados no primeiro dia de cada mês. Cursos não utilizados não acumulam.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Posso fazer downgrade?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sim, você pode voltar para o plano Free a qualquer momento. Seus dados serão mantidos.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Há desconto anual?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Em breve! Estamos trabalhando em planos anuais com desconto especial.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>    </div>
  );
}
