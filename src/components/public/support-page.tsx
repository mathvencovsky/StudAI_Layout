import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Mail, HelpCircle, Video, FileText } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SupportPage() {
  const resources = [
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Respostas para as perguntas mais frequentes",
      link: "/faq",
      color: "text-blue-500",
    },
    {
      icon: BookOpen,
      title: "Documentação",
      description: "Guias completos sobre como usar a plataforma",
      link: "/how-it-works",
      color: "text-green-500",
    },
    {
      icon: Video,
      title: "Tutoriais em Vídeo",
      description: "Aprenda visualmente com nossos tutoriais",
      link: "#",
      color: "text-red-500",
    },
    {
      icon: MessageSquare,
      title: "Chat ao Vivo",
      description: "Fale com nossa equipe em tempo real",
      link: "/contact",
      color: "text-purple-500",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Envie sua dúvida por email",
      link: "/contact",
      color: "text-orange-500",
    },
    {
      icon: FileText,
      title: "Base de Conhecimento",
      description: "Artigos e guias detalhados",
      link: "#",
      color: "text-cyan-500",
    },
  ];

  const commonIssues = [
    {
      title: "Como criar um curso com IA?",
      answer: "Acesse 'Criar Curso' no menu, preencha o formulário com título, descrição e nível desejado, e clique em 'Gerar Curso'. A IA criará um curso completo em segundos.",
    },
    {
      title: "Atingi meu limite mensal, e agora?",
      answer: "Você pode fazer upgrade para o plano Pro para ter limites maiores, ou aguardar o próximo mês quando os limites serão renovados.",
    },
    {
      title: "Como funciona a gamificação?",
      answer: "Você ganha XP ao completar tarefas, estudar e manter sequências. Ao acumular XP, você sobe de nível e desbloqueia conquistas.",
    },
    {
      title: "Posso usar offline?",
      answer: "Atualmente o StudAI requer conexão com internet. Estamos trabalhando em funcionalidades offline para versões futuras.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Central de Ajuda</h1>
            <p className="text-lg text-muted-foreground">
              Encontre respostas, tutoriais e entre em contato com nosso suporte
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {resources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <Icon className={`h-10 w-10 mx-auto mb-3 ${resource.color}`} />
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    {resource.link.startsWith('/') ? (
                      <Link to={resource.link}>
                        <Button variant="outline" size="sm">
                          Acessar
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Em Breve
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Problemas Comuns</h2>
            <div className="space-y-4">
              {commonIssues.map((issue, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{issue.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ainda precisa de ajuda?</h2>
              <p className="mb-6 opacity-90">
                Nossa equipe está pronta para ajudar você
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="secondary">
                    Entrar em Contato
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button variant="outline" className="border-primary-foreground/20 hover:bg-primary-foreground/10">
                    Ver FAQ Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>    </div>
  );
}
