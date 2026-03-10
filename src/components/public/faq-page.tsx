import { PublicLayout } from "@/components/layout/public-layout";
import { Link } from "@tanstack/react-router";

export function FaqPage() {
  const faqs = [
    {
      category: "Geral",
      questions: [
        {
          q: "O que é o StudAI?",
          a: "StudAI é uma plataforma de aprendizado inteligente que usa IA para gerar cursos personalizados, recomendar recursos e acompanhar seu progresso de estudos.",
        },
        {
          q: "Preciso pagar para usar?",
          a: "Não! Oferecemos um plano gratuito completo. O plano Pro oferece mais recursos de IA e funcionalidades avançadas.",
        },
        {
          q: "Como funciona a IA?",
          a: "Nossa IA analisa seus objetivos e gera cursos estruturados, recomenda recursos verificados e responde suas dúvidas sobre os temas que você está estudando.",
        },
      ],
    },
    {
      category: "Cursos e Conteúdo",
      questions: [
        {
          q: "Posso criar cursos sobre qualquer tema?",
          a: "Sim! Nossa IA pode gerar cursos sobre praticamente qualquer tema. Os cursos incluem módulos estruturados e tarefas práticas.",
        },
        {
          q: "Os recursos são confiáveis?",
          a: "Sim! Todos os recursos em nosso catálogo são verificados e curados. Priorizamos fontes oficiais e conteúdo de qualidade.",
        },
        {
          q: "Posso adicionar meus próprios recursos?",
          a: "Atualmente não, mas estamos trabalhando nessa funcionalidade para versões futuras.",
        },
      ],
    },
    {
      category: "Planos e Pagamento",
      questions: [
        {
          q: "Qual a diferença entre Free e Pro?",
          a: "O plano Free permite 2 cursos gerados por mês e 10 mensagens de IA por dia. O Pro oferece 20 cursos/mês, 100 mensagens/dia e recursos avançados.",
        },
        {
          q: "Posso cancelar a qualquer momento?",
          a: "Sim! Não há período de fidelidade. Você pode cancelar seu plano Pro a qualquer momento sem taxas.",
        },
        {
          q: "Há desconto para estudantes?",
          a: "Estamos trabalhando em um programa de descontos para estudantes. Fique atento às novidades!",
        },
      ],
    },
    {
      category: "Privacidade e Segurança",
      questions: [
        {
          q: "Meus dados estão seguros?",
          a: "Sim! Usamos AWS Amplify com autenticação Cognito e criptografia de ponta a ponta. Seus dados são protegidos.",
        },
        {
          q: "Vocês compartilham meus dados?",
          a: "Não! Seus dados pessoais e de estudo são privados e nunca são compartilhados com terceiros.",
        },
        {
          q: "Posso exportar meus dados?",
          a: "Sim! Você pode solicitar uma exportação completa dos seus dados a qualquer momento.",
        },
      ],
    },
  ];

  return (
    <PublicLayout>
      <div className="py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-16 text-center">
              <span className="text-sm font-semibold text-[#4A9FFF] tracking-wider uppercase block mb-6">Ajuda</span>
              <h1 className="text-6xl md:text-7xl font-normal text-gray-900 mb-6" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1), 8px 3px 8px rgba(0,0,0,0.1), 12px 4px 12px rgba(0,0,0,0.05)" }}>
                Perguntas Frequentes
              </h1>
              <p className="text-lg text-gray-600">Encontre respostas para as dúvidas mais comuns</p>
            </div>

            {/* FAQ Sections */}
            <div className="space-y-12">
              {faqs.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-3xl font-normal text-gray-900 mb-6" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.4), 2px 1px 2px rgba(0,0,0,0.1)" }}>
                    {section.category}
                  </h2>
                  <div className="space-y-6">
                    {section.questions.map((faq, qIdx) => (
                      <div key={qIdx} className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_48px_rgba(74,159,255,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] transition-all duration-300">
                        <h3 className="text-xl font-normal text-gray-900 mb-3">{faq.q}</h3>
                        <p className="text-gray-600">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[#4A9FFF]/10 to-[#4A9FFF]/5 border border-[#4A9FFF]/20 text-center">
              <h3 className="text-2xl font-normal text-gray-900 mb-3">Não encontrou sua resposta?</h3>
              <p className="text-gray-600 mb-6">Entre em contato conosco e teremos prazer em ajudar</p>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#4A9FFF] text-white px-8 py-3 font-medium hover:bg-[#3A8FEF] transition-colors"
              >
                Falar com Suporte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
