/**
 * EXEMPLO DE SEÇÃO COM COMPONENTES VISUAIS MELHORADOS
 * 
 * Este arquivo demonstra como usar os novos componentes visuais
 * para criar seções modernas e atraentes na landing page.
 * 
 * Copie e adapte este código para suas seções existentes.
 */

import {
  SectionWrapper,
  KickerBadge,
  HeadlineHighlight,
  SectionDivider,
  FloatingCard,
  GradientText,
  ShimmerButton,
} from "./ui";
import { CheckCircle2, Sparkles, TrendingUp } from "lucide-react";

export function ExampleEnhancedSection() {
  return (
    <>
      {/* Seção Hero Melhorada */}
      <SectionWrapper variant="gradient" withNoise>
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge de categoria com animação */}
          <div className="animate-fade-in-up">
            <KickerBadge variant="warm">
              <Sparkles className="w-3 h-3" />
              Para concursos, certificações e faculdade
            </KickerBadge>
          </div>

          {/* Título principal com destaque animado */}
          <h1 className="display-h1 animate-fade-in-up animate-stagger-1">
            Seu plano de estudo{" "}
            <HeadlineHighlight variant="warm">
              pronto todo dia
            </HeadlineHighlight>
          </h1>

          {/* Subtítulo com gradiente */}
          <p className="text-xl text-muted-foreground animate-fade-in-up animate-stagger-2">
            Defina a meta e a data. O sistema monta o cronograma e mostra onde você está.
          </p>

          {/* Botões com efeitos */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-stagger-3">
            <ShimmerButton className="text-base px-8 py-4">
              Criar meu plano grátis
            </ShimmerButton>
            
            <button className="px-8 py-4 rounded-lg font-semibold text-sm border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105">
              Ver como funciona
            </button>
          </div>

          {/* Microcopy */}
          <p className="text-sm text-muted-foreground animate-fade-in-up animate-stagger-4">
            Funciona para concursos federais, estaduais e municipais
          </p>
        </div>
      </SectionWrapper>

      {/* Divisor animado */}
      <SectionDivider variant="dots" />

      {/* Seção de Features com Cards Flutuantes */}
      <SectionWrapper variant="plain">
        <div className="text-center space-y-6 mb-12">
          <KickerBadge variant="primary">
            Prova de valor
          </KickerBadge>

          <h2 className="display-h2">
            Clareza para estudar{" "}
            <HeadlineHighlight variant="primary">
              todos os dias
            </HeadlineHighlight>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plano do dia, revisões e progresso semanal no mesmo lugar.
          </p>
        </div>

        {/* Grid de features com cards flutuantes */}
        <div className="grid md:grid-cols-3 gap-6">
          <FloatingCard delay={0} className="animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Plano de hoje com tarefas claras
                </h3>
                <p className="text-muted-foreground">
                  Saiba exatamente o que estudar hoje sem perder tempo decidindo.
                </p>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard delay={100} className="animate-fade-in-up animate-stagger-1">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent-warm/10 text-accent-warm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Fila de revisões para manter consistência
                </h3>
                <p className="text-muted-foreground">
                  Revisões automáticas no momento certo para fixar o conteúdo.
                </p>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard delay={200} className="animate-fade-in-up animate-stagger-2">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Indicadores semanais para ajustar o ritmo
                </h3>
                <p className="text-muted-foreground">
                  Acompanhe seu progresso e ajuste sua rotina conforme necessário.
                </p>
              </div>
            </div>
          </FloatingCard>
        </div>
      </SectionWrapper>

      {/* Divisor com gradiente */}
      <SectionDivider variant="gradient" />

      {/* Seção com background escuro */}
      <SectionWrapper variant="dark">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="display-h2">
            Pronto para ter{" "}
            <GradientText animated>
              clareza
            </GradientText>
            ?
          </h2>

          <p className="text-lg opacity-90">
            Crie sua conta gratuita e veja seu primeiro plano do dia em minutos.
          </p>

          <ShimmerButton className="text-base px-8 py-4">
            Começar grátis
          </ShimmerButton>

          <p className="text-sm opacity-70">
            Sem cartão de crédito • Cancele quando quiser
          </p>
        </div>
      </SectionWrapper>

      {/* Divisor com onda */}
      <SectionDivider variant="wave" />

      {/* Seção com glass morphism */}
      <SectionWrapper variant="tint">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 md:p-12">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">
                Ainda com dúvidas?
              </h3>
              <p className="text-muted-foreground">
                Entre em contato com nosso suporte e tire todas as suas dúvidas.
              </p>
              <button className="px-6 py-3 rounded-lg font-semibold text-sm bg-background hover:bg-muted transition-colors">
                Falar com o suporte
              </button>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}

/**
 * COMO USAR ESTE EXEMPLO:
 * 
 * 1. Copie os componentes que você quer usar
 * 2. Adapte o conteúdo para suas necessidades
 * 3. Ajuste as cores e variantes conforme seu design
 * 4. Teste em diferentes tamanhos de tela
 * 
 * DICAS:
 * 
 * - Use `animate-fade-in-up` com `animate-stagger-X` para criar efeitos de entrada escalonados
 * - Combine `FloatingCard` com delays diferentes para criar movimento orgânico
 * - Use `HeadlineHighlight` para destacar palavras-chave importantes
 * - Alterne entre `SectionWrapper` variants para criar ritmo visual
 * - Use `SectionDivider` para separar seções de forma elegante
 * 
 * PERFORMANCE:
 * 
 * - Todas as animações usam transform/opacity (GPU-accelerated)
 * - Respeita prefers-reduced-motion automaticamente
 * - CSS puro, sem JavaScript para animações
 */
