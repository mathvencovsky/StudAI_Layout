import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
            <p className="text-lg text-muted-foreground">
              Encontre respostas para as dúvidas mais comuns
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold mb-4">{section.category}</h2>
                <div className="space-y-4">
                  {section.questions.map((faq, qIdx) => (
                    <Card key={qIdx}>
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.q}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.a}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Card className="mt-12 bg-muted">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Não encontrou sua resposta?</h3>
              <p className="text-muted-foreground mb-4">
                Entre em contato conosco e teremos prazer em ajudar
              </p>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
              >
                Falar com Suporte
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
