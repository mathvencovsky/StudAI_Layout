import { PublicLayout } from "@/components/layout/public-layout";
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
    <PublicLayout>
      <div className="py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-16 text-center">
              <Shield className="h-16 w-16 mx-auto mb-6 text-[#4A9FFF]" />
              <span className="text-sm font-semibold text-[#4A9FFF] tracking-wider uppercase block mb-6">Segurança</span>
              <h1 className="text-6xl md:text-7xl font-normal text-gray-900 mb-6" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1), 8px 3px 8px rgba(0,0,0,0.1), 12px 4px 12px rgba(0,0,0,0.05)" }}>
                Segurança e Privacidade
              </h1>
              <p className="text-xl text-gray-600">
                Sua segurança é nossa prioridade. Veja como protegemos seus dados.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_48px_rgba(74,159,255,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:border-white/80 hover:scale-[1.02] transition-all duration-300">
                    <Icon className="h-10 w-10 text-[#4A9FFF] mb-4" />
                    <h3 className="text-xl font-normal text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Practices */}
            <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] mb-8">
              <h2 className="text-3xl font-normal text-gray-900 mb-8" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1)" }}>
                Práticas de Segurança
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-normal text-gray-900 mb-4">Proteção de Dados</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Criptografia AES-256 para dados em repouso</li>
                    <li>TLS 1.3 para dados em trânsito</li>
                    <li>Tokens JWT com expiração curta</li>
                    <li>Senhas com hash bcrypt</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-normal text-gray-900 mb-4">Controle de Acesso</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Autenticação obrigatória</li>
                    <li>Owner-based access control</li>
                    <li>Sessões com timeout automático</li>
                    <li>MFA opcional</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-normal text-gray-900 mb-4">Infraestrutura</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>AWS Amplify Gen 2</li>
                    <li>DDoS protection via AWS Shield</li>
                    <li>WAF (Web Application Firewall)</li>
                    <li>Logs de auditoria completos</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-normal text-gray-900 mb-4">Conformidade</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>LGPD</li>
                    <li>ISO 27001 (via AWS)</li>
                    <li>SOC 2 Type II (via AWS)</li>
                    <li>Auditorias regulares</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Report */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#4A9FFF]/10 to-[#4A9FFF]/5 border border-[#4A9FFF]/20">
              <h3 className="text-2xl font-normal text-gray-900 mb-4">Reporte Vulnerabilidades</h3>
              <p className="text-gray-600 mb-4">
                Se você descobrir uma vulnerabilidade de segurança, por favor nos informe imediatamente:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Email: <a href="mailto:security@studai.app" className="text-[#4A9FFF] hover:text-[#3A8FEF] font-medium">security@studai.app</a></li>
                <li>Resposta em até 24 horas</li>
                <li>Programa de recompensas para descobertas válidas</li>
                <li>Divulgação responsável coordenada</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}