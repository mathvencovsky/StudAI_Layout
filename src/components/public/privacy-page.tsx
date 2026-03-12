import { PublicLayout } from "@/components/layout/public-layout";

export function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-16 text-center">
              <span className="text-sm font-semibold text-[#4A9FFF] tracking-wider uppercase block mb-6">Legal</span>
              <h1 className="text-6xl md:text-7xl font-normal text-gray-900 mb-6" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1), 8px 3px 8px rgba(0,0,0,0.1), 12px 4px 12px rgba(0,0,0,0.05)" }}>
                Política de Privacidade
              </h1>
              <p className="text-lg text-gray-600">Última atualização: Fevereiro 2026</p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] mb-8">
                <h2 className="text-3xl font-normal text-gray-900 mb-6">1. Informações que Coletamos</h2>
                <p className="text-gray-600 mb-4">
                  Coletamos informações que você nos fornece diretamente ao criar uma conta, usar nossos serviços e interagir com nossa plataforma:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Informações de conta: nome, email, senha (criptografada)</li>
                  <li>Dados de perfil: preferências de aprendizado, objetivos, nível</li>
                  <li>Dados de uso: progresso de estudos, cursos criados, sessões</li>
                  <li>Dados de interação: mensagens com IA, feedback, avaliações</li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] mb-8">
                <h2 className="text-3xl font-normal text-gray-900 mb-6">2. Como Usamos suas Informações</h2>
                <p className="text-gray-600 mb-4">Usamos as informações coletadas para:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Personalizar sua experiência de aprendizado</li>
                  <li>Gerar cursos e recomendações com IA</li>
                  <li>Enviar notificações e lembretes (se habilitado)</li>
                  <li>Analisar uso e melhorar a plataforma</li>
                  <li>Prevenir fraudes e garantir segurança</li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] mb-8">
                <h2 className="text-3xl font-normal text-gray-900 mb-6">3. Compartilhamento de Dados</h2>
                <p className="text-gray-600 mb-4">
                  Não vendemos seus dados pessoais. Compartilhamos informações apenas quando:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Você nos autoriza explicitamente</li>
                  <li>Necessário para fornecer o serviço (ex: AWS para hospedagem)</li>
                  <li>Exigido por lei ou ordem judicial</li>
                  <li>Para proteger direitos e segurança</li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] mb-8">
                <h2 className="text-3xl font-normal text-gray-900 mb-6">4. Segurança</h2>
                <p className="text-gray-600 mb-4">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Autenticação segura via AWS Cognito</li>
                  <li>Controle de acesso baseado em proprietário</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares</li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] mb-8">
                <h2 className="text-3xl font-normal text-gray-900 mb-6">5. Seus Direitos</h2>
                <p className="text-gray-600 mb-4">Você tem direito a:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir informações incorretas</li>
                  <li>Solicitar exclusão de dados</li>
                  <li>Exportar seus dados</li>
                  <li>Revogar consentimentos</li>
                  <li>Opor-se ao processamento</li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] mb-8">
                <h2 className="text-3xl font-normal text-gray-900 mb-6">6. Contato</h2>
                <p className="text-gray-600">
                  Para questões sobre privacidade, entre em contato: <a href="mailto:privacy@studai.app" className="text-[#4A9FFF] hover:text-[#3A8FEF] font-medium">privacy@studai.app</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}