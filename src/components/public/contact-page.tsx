import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";

export function ContactPage() {
  return (
    <PublicLayout>
      <div className="py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-16 text-center">
              <span className="text-sm font-semibold text-[#4A9FFF] tracking-wider uppercase block mb-6">Suporte</span>
              <h1 className="text-6xl md:text-7xl font-normal text-gray-900 mb-6" style={{ textShadow: "1px 1px 0 rgba(192,192,192,0.6), 2px 1px 2px rgba(0,0,0,0.15), 4px 2px 4px rgba(0,0,0,0.1), 8px 3px 8px rgba(0,0,0,0.1), 12px 4px 12px rgba(0,0,0,0.05)" }}>
                Entre em Contato
              </h1>
              <p className="text-lg text-gray-600">Estamos aqui para ajudar. Envie sua mensagem e responderemos em breve.</p>
            </div>

            {/* Contact Methods */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_48px_rgba(74,159,255,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] transition-all duration-300 text-center">
                <Mail className="h-8 w-8 mx-auto mb-4 text-[#4A9FFF]" />
                <h3 className="text-xl font-normal text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">contato@studai.com</p>
              </div>

              <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_48px_rgba(74,159,255,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] transition-all duration-300 text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-4 text-[#4A9FFF]" />
                <h3 className="text-xl font-normal text-gray-900 mb-2">Chat</h3>
                <p className="text-gray-600">Disponível 24/7</p>
              </div>

              <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:bg-white/50 hover:backdrop-blur-2xl hover:shadow-[0_12px_48px_rgba(74,159,255,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] transition-all duration-300 text-center">
                <HelpCircle className="h-8 w-8 mx-auto mb-4 text-[#4A9FFF]" />
                <h3 className="text-xl font-normal text-gray-900 mb-2">FAQ</h3>
                <p className="text-gray-600">Respostas rápidas</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]">
              <h2 className="text-3xl font-normal text-gray-900 mb-2">Envie sua Mensagem</h2>
              <p className="text-gray-600 mb-8">Preencha o formulário abaixo e entraremos em contato</p>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-900">Nome</Label>
                    <Input id="name" placeholder="Seu nome" className="bg-white/60 border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" className="bg-white/60 border-gray-200" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-900">Assunto</Label>
                  <Input id="subject" placeholder="Como podemos ajudar?" className="bg-white/60 border-gray-200" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-900">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Descreva sua dúvida ou sugestão..."
                    rows={6}
                    className="bg-white/60 border-gray-200"
                  />
                </div>

                <Button type="submit" className="w-full bg-[#4A9FFF] hover:bg-[#3A8FEF] text-white">
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
