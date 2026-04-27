import { Card, CardContent } from "@/components/ui/card";

export function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Política de Reembolso e Cancelamento</h1>
          <p className="text-muted-foreground mb-8">Última atualização: Abril 2026</p>

          <Card className="mb-6">
            <CardContent className="p-6 prose prose-sm max-w-none dark:prose-invert">
              <h2 className="text-xl font-bold mb-3">1. Cancelamento</h2>
              <p className="mb-4">
                Você pode cancelar sua assinatura StudAI Pro a qualquer momento, sem taxas de
                cancelamento. O cancelamento pode ser feito diretamente nas configurações da sua
                conta, na seção "Cobrança", através do Portal do Cliente Stripe.
              </p>
              <p className="mb-4">
                Após o cancelamento, você continuará tendo acesso aos recursos Pro até o final do
                período de cobrança já pago. Após essa data, sua conta será automaticamente
                rebaixada para o plano Free.
              </p>

              <h2 className="text-xl font-bold mb-3 mt-6">2. Reembolsos</h2>
              <p className="mb-4">
                Oferecemos reembolso integral nos primeiros 7 dias após a primeira assinatura, caso
                você não esteja satisfeito com o serviço. Para solicitar um reembolso, entre em
                contato com nosso suporte em{" "}
                <a href="mailto:support@studai.app" className="text-primary hover:underline">
                  support@studai.app
                </a>{" "}
                dentro desse prazo.
              </p>
              <p className="mb-4">
                Renovações de assinatura não são reembolsáveis, exceto em casos de erro de cobrança
                documentado. Avaliamos cada caso individualmente.
              </p>

              <h2 className="text-xl font-bold mb-3 mt-6">3. Como Cancelar</h2>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>
                  Acesse <strong>Configurações → Cobrança</strong> na plataforma.
                </li>
                <li>
                  Clique em <strong>Gerenciar Assinatura</strong>.
                </li>
                <li>
                  No Portal do Cliente Stripe, selecione <strong>Cancelar Plano</strong>.
                </li>
                <li>Confirme o cancelamento. Você receberá um email de confirmação.</li>
              </ol>

              <h2 className="text-xl font-bold mb-3 mt-6">4. Falhas de Pagamento</h2>
              <p className="mb-4">
                Em caso de falha no pagamento, você receberá uma notificação por email. Sua
                assinatura permanecerá ativa por um período de carência enquanto tentamos processar
                o pagamento. Se o pagamento não for regularizado, sua conta será rebaixada para o
                plano Free.
              </p>

              <h2 className="text-xl font-bold mb-3 mt-6">5. Contato</h2>
              <p className="mb-4">
                Para dúvidas sobre cobranças, reembolsos ou cancelamentos, entre em contato:{" "}
                <a href="mailto:support@studai.app" className="text-primary hover:underline">
                  support@studai.app
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
