import { Card, CardContent } from "@/components/ui/card";

export function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Termos de Uso</h1>
          <p className="text-muted-foreground mb-8">Última atualização: Fevereiro 2026</p>

          <Card className="mb-6">
            <CardContent className="p-6 prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
              <p className="mb-4">
                Ao acessar e usar o StudAI, você concorda com estes Termos de Uso. Se não concordar, não use nossos serviços.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">2. Descrição do Serviço</h2>
              <p className="mb-4">
                StudAI é uma plataforma de aprendizado que oferece:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Geração de cursos personalizados com IA</li>
                <li>Catálogo de recursos educacionais verificados</li>
                <li>Sistema de acompanhamento de progresso</li>
                <li>Ferramentas de gamificação e motivação</li>
                <li>Chat com IA para suporte ao aprendizado</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">3. Conta de Usuário</h2>
              <p className="mb-4">Para usar o StudAI, você deve:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Ter pelo menos 13 anos de idade</li>
                <li>Fornecer informações precisas e completas</li>
                <li>Manter a segurança de sua senha</li>
                <li>Notificar-nos sobre uso não autorizado</li>
                <li>Ser responsável por todas as atividades em sua conta</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">4. Uso Aceitável</h2>
              <p className="mb-4">Você concorda em NÃO:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Violar leis ou regulamentos</li>
                <li>Compartilhar conteúdo ilegal, ofensivo ou prejudicial</li>
                <li>Tentar acessar sistemas não autorizados</li>
                <li>Fazer engenharia reversa da plataforma</li>
                <li>Usar bots ou automação não autorizada</li>
                <li>Revender ou redistribuir nossos serviços</li>
                <li>Interferir no funcionamento da plataforma</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">5. Conteúdo Gerado por IA</h2>
              <p className="mb-4">
                O conteúdo gerado por IA é fornecido "como está". Não garantimos precisão, completude ou adequação para fins específicos. Você é responsável por verificar e validar o conteúdo gerado.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">6. Propriedade Intelectual</h2>
              <p className="mb-4">
                A plataforma StudAI, incluindo design, código, marca e conteúdo, é protegida por direitos autorais e outras leis de propriedade intelectual. Você mantém direitos sobre o conteúdo que cria.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">7. Planos e Pagamentos</h2>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Plano Free: gratuito, com limitações de uso</li>
                <li>Plano Pro: assinatura mensal, renovação automática</li>
                <li>Cancelamento: a qualquer momento, sem taxas</li>
                <li>Reembolsos: conforme política de reembolso</li>
                <li>Mudanças de preço: notificadas com 30 dias de antecedência</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">8. Limitação de Responsabilidade</h2>
              <p className="mb-4">
                O StudAI é fornecido "como está". Não nos responsabilizamos por:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Interrupções ou erros no serviço</li>
                <li>Perda de dados ou conteúdo</li>
                <li>Decisões baseadas em conteúdo gerado por IA</li>
                <li>Conteúdo de terceiros ou links externos</li>
                <li>Danos indiretos ou consequenciais</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">9. Rescisão</h2>
              <p className="mb-4">
                Podemos suspender ou encerrar sua conta se você violar estes termos. Você pode encerrar sua conta a qualquer momento nas configurações.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">10. Alterações nos Termos</h2>
              <p className="mb-4">
                Podemos modificar estes termos. Mudanças significativas serão notificadas por email ou na plataforma. Uso continuado após mudanças constitui aceitação.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">11. Lei Aplicável</h2>
              <p className="mb-4">
                Estes termos são regidos pelas leis do Brasil. Disputas serão resolvidas nos tribunais competentes.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">12. Contato</h2>
              <p className="mb-4">
                Para questões sobre estes termos: legal@studai.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>    </div>
  );
}
