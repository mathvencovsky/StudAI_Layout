import { Card, CardContent } from "@/components/ui/card";

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
          <p className="text-muted-foreground mb-8">Última atualização: Fevereiro 2026</p>

          <Card className="mb-6">
            <CardContent className="p-6 prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold mb-4">1. Informações que Coletamos</h2>
              <p className="mb-4">
                Coletamos informações que você nos fornece diretamente ao criar uma conta, usar nossos serviços e interagir com nossa plataforma:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Informações de conta: nome, email, senha (criptografada)</li>
                <li>Dados de perfil: preferências de aprendizado, objetivos, nível</li>
                <li>Dados de uso: progresso de estudos, cursos criados, sessões</li>
                <li>Dados de interação: mensagens com IA, feedback, avaliações</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">2. Como Usamos suas Informações</h2>
              <p className="mb-4">Usamos as informações coletadas para:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Personalizar sua experiência de aprendizado</li>
                <li>Gerar cursos e recomendações com IA</li>
                <li>Enviar notificações e lembretes (se habilitado)</li>
                <li>Analisar uso e melhorar a plataforma</li>
                <li>Prevenir fraudes e garantir segurança</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">3. Compartilhamento de Dados</h2>
              <p className="mb-4">
                Não vendemos seus dados pessoais. Compartilhamos informações apenas quando:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Você nos autoriza explicitamente</li>
                <li>Necessário para fornecer o serviço (ex: AWS para hospedagem)</li>
                <li>Exigido por lei ou ordem judicial</li>
                <li>Para proteger direitos e segurança</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">4. Segurança</h2>
              <p className="mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Autenticação segura via AWS Cognito</li>
                <li>Controle de acesso baseado em proprietário</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">5. Seus Direitos</h2>
              <p className="mb-4">Você tem direito a:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar exclusão de dados</li>
                <li>Exportar seus dados</li>
                <li>Revogar consentimentos</li>
                <li>Opor-se ao processamento</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">6. Cookies e Tecnologias</h2>
              <p className="mb-4">
                Usamos cookies e tecnologias similares para melhorar sua experiência, analisar uso e personalizar conteúdo. Você pode gerenciar preferências de cookies nas configurações do navegador.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">7. Retenção de Dados</h2>
              <p className="mb-4">
                Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para fornecer serviços. Você pode solicitar exclusão a qualquer momento.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">8. Alterações nesta Política</h2>
              <p className="mb-4">
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas por email ou através da plataforma.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">9. Contato</h2>
              <p className="mb-4">
                Para questões sobre privacidade, entre em contato: privacy@studai.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>    </div>
  );
}
