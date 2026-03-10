import { PublicLayout } from "@/components/layout/public-layout";

export function TermsPage() {
  const sections = [
    {
      title: "1. Aceitação dos Termos",
      content: "Ao acessar e usar o StudAI, você concorda com estes Termos de Uso. Se não concordar, não use nossos serviços."
    },
    {
      title: "2. Descrição do Serviço",
      content: "StudAI é uma plataforma de aprendizado que oferece geração de cursos personalizados com IA, catálogo de recursos educacionais, sistema de acompanhamento de progresso e ferramentas de gamificação."
    },
    {
      title: "3. Conta de Usuário",
      content: "Para usar o StudAI, você deve ter pelo menos 13 anos, fornecer informações precisas, manter a segurança de sua senha e ser responsável por todas as atividades em sua conta."
    },
    {
      title: "4. Uso Aceitável",
      content: "Você concorda em não violar leis, compartilhar conteúdo ilegal, tentar acessar sistemas não autorizados, fazer engenharia reversa, usar bots não autorizados ou interferir no funcionamento da plataforma."
    },
    {
      title: "5. Conteúdo Gerado por IA",
      content: "O conteúdo gerado por IA é fornecido 'como está'. Não garantimos precisão ou adequação. Você é responsável por verificar o conteúdo gerado."
    },
    {
      title: "6. Propriedade Intelectual",
      content: "A plataforma StudAI é protegida por direitos autorais. Você mantém direitos sobre o conteúdo que cria."
    },
    {
      title: "7. Planos e Pagamentos",
      content: "Plano Free gratuito com limitações. Plano Pro com assinatura mensal e renovação automática. Cancelamento a qualquer momento sem taxas."
    },
    {
      title: "8. Limitação de Responsabilidade",
      content: "O StudAI é fornecido 'como está'. Não nos responsabilizamos por interrupções, perda de dados, decisões baseadas em IA ou danos indiretos."
    },
    {
      title: "9. Rescisão",
      content: "Podemos suspender sua conta se você violar estes termos. Você pode encerrar sua conta a qualquer momento."
    },
    {
      title: "10. Alterações nos Termos",
      content: "Podemos modificar estes termos. Mudanças significativas serão notificadas. Uso continuado constitui aceitação."
    },
  ];

  return (
    <PublicLayout>
      <div className="py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-16 text-center">
              <span className="text-sm font-semibold text-[#4A9FFF] tracking-wider uppercase block mb-6">Legal</span>
              <h1 className="text-6xl md:text-7xl font-normal text-gray-900 mb-6" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1), 8px 3px 8px rgba(0,0,0,0.1), 12px 4px 12px rgba(0,0,0,0.05)" }}>
                Termos de Uso
              </h1>
              <p className="text-lg text-gray-600">Última atualização: Fevereiro 2026</p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {sections.map((section, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]">
                  <h2 className="text-2xl font-normal text-gray-900 mb-4">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              ))}

              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#4A9FFF]/10 to-[#4A9FFF]/5 border border-[#4A9FFF]/20">
                <h2 className="text-2xl font-normal text-gray-900 mb-4">Contato</h2>
                <p className="text-gray-600">
                  Para questões sobre estes termos: <a href="mailto:legal@studai.app" className="text-[#4A9FFF] hover:text-[#3A8FEF] font-medium">legal@studai.app</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}