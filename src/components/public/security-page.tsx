import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Server, Key, AlertTriangle } from "lucide-react";

export function SecurityPage() {
  const features = [
    {
      icon: Lock,
      title: "Criptografia de Ponta a Ponta",
      description: "Todos os dados são criptografados em trânsito (TLS 1.3) e em repouso (AES-256).",
    },
    {
      icon: Key,
      title: "Autenticação Segura",
      description: "Usamos AWS Cognito com autenticação multi-fator opcional e tokens JWT seguros.",
    },
    {
      icon: Server,
      title: "Infraestrutura AWS",
      description: "Hospedado na AWS com certificações ISO 27001, SOC 2 e conformidade LGPD.",
    },
    {
      icon: Eye,
      title: "Controle de Acesso",
      description: "Sistema owner-based: você controla quem acessa seus dados. Ninguém mais pode vê-los.",
    },
    {
      icon: Shield,
      title: "Monitoramento 24/7",
      description: "Monitoramento contínuo de segurança, detecção de anomalias e resposta a incidentes.",
    },
    {
      icon: AlertTriangle,
      title: "Backups Automáticos",
      description: "Backups diários automáticos com retenção de 30 dias e recuperação de desastres.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Segurança e Privacidade</h1>
            <p className="text-lg text-muted-foreground">
              Sua segurança é nossa prioridade. Veja como protegemos seus dados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx}>
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Práticas de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h3 className="font-semibold mb-2">Proteção de Dados</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Criptografia AES-256 para dados em repouso</li>
                <li>TLS 1.3 para dados em trânsito</li>
                <li>Tokens JWT com expiração curta</li>
                <li>Senhas com hash bcrypt</li>
              </ul>

              <h3 className="font-semibold mb-2 mt-6">Controle de Acesso</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Autenticação obrigatória para todas as operações</li>
                <li>Owner-based access control (você é dono dos seus dados)</li>
                <li>Sessões com timeout automático</li>
                <li>MFA (autenticação multi-fator) opcional</li>
              </ul>

              <h3 className="font-semibold mb-2 mt-6">Infraestrutura</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>AWS Amplify Gen 2 com melhores práticas</li>
                <li>DDoS protection via AWS Shield</li>
                <li>WAF (Web Application Firewall)</li>
                <li>Logs de auditoria completos</li>
              </ul>

              <h3 className="font-semibold mb-2 mt-6">Conformidade</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>LGPD (Lei Geral de Proteção de Dados)</li>
                <li>ISO 27001 (via AWS)</li>
                <li>SOC 2 Type II (via AWS)</li>
                <li>Auditorias regulares de segurança</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Reporte Vulnerabilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Se você descobrir uma vulnerabilidade de segurança, por favor nos informe imediatamente:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: security@studai.com</li>
                <li>Resposta em até 24 horas</li>
                <li>Programa de recompensas para descobertas válidas</li>
                <li>Divulgação responsável coordenada</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Dicas de Segurança para Usuários</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Use uma senha forte e única</li>
                <li>Ative autenticação multi-fator (MFA)</li>
                <li>Não compartilhe suas credenciais</li>
                <li>Faça logout em dispositivos compartilhados</li>
                <li>Mantenha seu email de recuperação atualizado</li>
                <li>Revise atividades suspeitas regularmente</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>    </div>
  );
}
