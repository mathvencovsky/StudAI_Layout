import { useTranslation } from "react-i18next";
import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Schema } from "../../../amplify/data/resource";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, BookOpen, Dumbbell, Lightbulb, HelpCircle, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { markdownConfig } from "@/lib/markdown-config";
import { cn } from "@/lib/utils";
import { useMyLearningPreference } from "@/hooks/learning-preference/use-my-learning-preference";
import { INTEREST_TRANSLATION_KEYS } from "@/components/learning-preferences/constants";

const client = generateClient<Schema>({ authMode: "userPool" });
const { useAIConversation } = createAIHooks(client);

// ── Starter prompts ──────────────────────────────────────────────────────────

const STARTERS = [
  {
    icon: BookOpen,
    label: "Explique um conceito",
    prompt: "Explique de forma clara e didática o conceito de ",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Dumbbell,
    label: "Me teste",
    prompt: "Crie 5 perguntas de múltipla escolha sobre o tema: ",
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: Lightbulb,
    label: "Exemplos práticos",
    prompt: "Dê 3 exemplos práticos e do mundo real sobre: ",
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: HelpCircle,
    label: "Simplifique",
    prompt: "Explique de forma muito simples, como se eu fosse iniciante: ",
    color: "text-green-500 bg-green-500/10 border-green-500/20",
  },
];

// ── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3 max-w-3xl mx-auto", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
        isUser ? "bg-primary text-primary-foreground text-xs font-bold" : "bg-primary/10"
      )}>
        {isUser ? "U" : <Sparkles className="h-4 w-4 text-primary" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        "rounded-2xl px-4 py-3 text-sm max-w-[85%]",
        isUser
          ? "bg-primary text-primary-foreground rounded-tr-sm"
          : "bg-muted rounded-tl-sm"
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&_*]:break-words [&_code]:break-all [&_pre]:overflow-x-auto">
            <ReactMarkdown {...markdownConfig}>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-3xl mx-auto">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 inline-flex">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export const ChatPage = () => {
  const { t } = useTranslation();
  const { data: preference } = useMyLearningPreference();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [{ data: { messages }, isLoading }, sendMessage] = useAIConversation("Chat");

  const hasMessages = messages.length > 0;

  // Build student profile context for first message
  const buildStudentContext = useCallback((): string => {
    if (!preference) return "";
    const parts: string[] = ["Perfil do aluno:"];
    if (preference.context) parts.push(`- Situação: ${preference.context}`);
    if (preference.experienceLevel) parts.push(`- Nível: ${preference.experienceLevel}`);
    if (preference.interests?.length) {
      const labels = preference.interests
        .map((i: string) => t(INTEREST_TRANSLATION_KEYS[i as keyof typeof INTEREST_TRANSLATION_KEYS] ?? i))
        .join(", ");
      parts.push(`- Interesses: ${labels}`);
    }
    if (preference.minutesPerDay) parts.push(`- Tempo disponível: ${preference.minutesPerDay} min/dia`);
    if (preference.hoursPerWeek) parts.push(`- Horas por semana: ${preference.hoursPerWeek}h`);
    return parts.length > 1 ? parts.join("\n") : "";
  }, [preference, t]);


  const handleSend = useCallback((text?: string) => {
    const msg = text ?? input;
    if (!msg.trim() || isLoading) return;
    // On first message, prepend student context so AI personalizes responses
    const isFirst = messages.length === 0;
    const studentCtx = isFirst ? buildStudentContext() : "";
    const fullMsg = studentCtx ? `${studentCtx}\n\nPergunta: ${msg}` : msg;
    sendMessage({ content: [{ text: fullMsg }] });
    setInput("");
    textareaRef.current?.focus();
  }, [input, isLoading, sendMessage, messages.length, buildStudentContext]);

  const handleStarterClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="flex flex-col h-[calc(100svh-var(--header-height,4rem))]">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-6 py-4 border-b flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-none">StudAI</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("ai-chat-subtitle")}
          </p>
        </div>
        {isLoading && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Gerando...
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-6 space-y-6">

          {/* Empty state */}
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-8">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Como posso ajudar?</h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Sou seu assistente de estudos. Posso explicar conceitos, criar quizzes, dar exemplos e muito mais.
                </p>
              </div>

              {/* Starter prompts */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {STARTERS.map(({ icon: Icon, label, prompt, color }) => (
                  <button
                    key={label}
                    onClick={() => handleStarterClick(prompt)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border text-left",
                      "hover:shadow-md transition-all group",
                      color
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg: any) => (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              text={msg.content[0]?.text ?? ""}
            />
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* ── Input area ── */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 rounded-2xl border bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all px-4 py-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              placeholder={t("chat-input-placeholder")}
              className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 p-0 min-h-[24px] max-h-[200px] text-sm bg-transparent"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-8 w-8 rounded-xl flex-shrink-0"
            >
              {isLoading
                ? <StopCircle className="h-4 w-4" />
                : <Send className="h-4 w-4" />
              }
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground/60 mt-2">
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
};
