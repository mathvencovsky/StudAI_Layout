import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, HelpCircle, CheckCircle } from "lucide-react";

// Input length limits — prevent oversized payloads and stored XSS
const LIMITS = { name: 100, email: 254, subject: 200, message: 2000 };

function clamp(value: string, max: number): string {
  return value.slice(0, max);
}

export function ContactPage() {
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof fields>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const e: Partial<typeof fields> = {};
    if (!fields.name.trim()) e.name = "Nome é obrigatório";
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      e.email = "Email inválido";
    }
    if (!fields.subject.trim()) e.subject = "Assunto é obrigatório";
    if (fields.message.trim().length < 10) e.message = "Mensagem muito curta (mínimo 10 caracteres)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof typeof fields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: clamp(value, LIMITS[field]) }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // In production: POST to a backend endpoint — never trust client-side only
    // For now, show success state
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
            <p className="text-lg text-muted-foreground">
              Estamos aqui para ajudar. Envie sua mensagem e responderemos em breve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Email</CardTitle>
                <CardDescription>support@studai.app</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Chat</CardTitle>
                <CardDescription>Disponível 24/7</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <HelpCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">FAQ</CardTitle>
                <CardDescription>Respostas rápidas</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Envie sua Mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e entraremos em contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p className="font-semibold">Mensagem enviada!</p>
                  <p className="text-sm text-muted-foreground">
                    Responderemos em breve no email informado.
                  </p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        value={fields.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        maxLength={LIMITS.name}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={fields.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        maxLength={LIMITS.email}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      placeholder="Como podemos ajudar?"
                      value={fields.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      maxLength={LIMITS.subject}
                      aria-invalid={!!errors.subject}
                    />
                    {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Mensagem
                      <span className="text-xs text-muted-foreground ml-2">
                        ({fields.message.length}/{LIMITS.message})
                      </span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva sua dúvida ou sugestão..."
                      rows={6}
                      value={fields.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      maxLength={LIMITS.message}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                  </div>

                  <Button type="submit" className="w-full">
                    Enviar Mensagem
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
