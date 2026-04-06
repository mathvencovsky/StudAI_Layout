import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Loader2, Sparkles, X, ArrowLeft,
  BookOpen, HelpCircle, Dumbbell, Lightbulb, MessageSquare, RotateCcw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAIConversation } from "@/hooks/ai/use-ai-hooks";
import { useIsAiUser } from "@/hooks/use-is-ai-user";
import { type Content } from "@/model/content";
import { markdownConfig } from "@/lib/markdown-config";
import { AiChatWaitlist } from "./ai-chat-waitlist";
import { cn } from "@/lib/utils";

export interface AiStudyAssistantProps {
  content: Content;
  onClose: () => void;
}

// ─── Mode definitions ────────────────────────────────────────────────────────

type ModeId = "explain" | "quiz" | "examples" | "simplify" | "ask";

interface Mode {
  id: ModeId;
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  promptKey: string;
  color: string;
  followUpKeys: string[];
}

const MODES: Mode[] = [
  {
    id: "explain",
    icon: BookOpen,
    titleKey: "ai-mode-explain-title",
    descKey: "ai-mode-explain-desc",
    promptKey: "ai-mode-explain-prompt",
    color: "text-blue-500 bg-blue-500/10",
    followUpKeys: ["ai-followup-deeper", "ai-followup-simpler"],
  },
  {
    id: "quiz",
    icon: Dumbbell,
    titleKey: "ai-mode-quiz-title",
    descKey: "ai-mode-quiz-desc",
    promptKey: "ai-mode-quiz-prompt",
    color: "text-orange-500 bg-orange-500/10",
    followUpKeys: ["ai-followup-another-question", "ai-followup-explain-answer"],
  },
  {
    id: "examples",
    icon: Lightbulb,
    titleKey: "ai-mode-examples-title",
    descKey: "ai-mode-examples-desc",
    promptKey: "ai-mode-examples-prompt",
    color: "text-yellow-500 bg-yellow-500/10",
    followUpKeys: ["ai-followup-more-examples", "ai-followup-real-world"],
  },
  {
    id: "simplify",
    icon: HelpCircle,
    titleKey: "ai-mode-simplify-title",
    descKey: "ai-mode-simplify-desc",
    promptKey: "ai-mode-simplify-prompt",
    color: "text-green-500 bg-green-500/10",
    followUpKeys: ["ai-followup-deeper", "ai-followup-analogy"],
  },
  {
    id: "ask",
    icon: MessageSquare,
    titleKey: "ai-mode-ask-title",
    descKey: "ai-mode-ask-desc",
    promptKey: "",
    color: "text-purple-500 bg-purple-500/10",
    followUpKeys: [],
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Structured AI Study Assistant — no free-form chat by default.
 * Student picks a mode (Explain, Quiz, Examples, Simplify, Ask).
 * Each mode sends a precise, pre-built prompt to the AI.
 * Inspired by: https://zehfernandes.com/posts/why-is-everyone-obsessed-with-chat-interfaces
 */
export const AiStudyAssistant = ({ content, onClose }: AiStudyAssistantProps) => {
  const { t } = useTranslation();
  const { isAiUser, isLoading: isChecking } = useIsAiUser();
  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const [askInput, setAskInput] = useState("");
  const [{ data, isLoading }, sendMessage] = useAIConversation("Chat");

  const isResponding = isLoading;
  const lastAssistantMsg = [...data.messages].reverse().find((m) => m.role === "assistant");

  const buildPrompt = (mode: Mode, customText?: string): string => {
    if (mode.id === "ask") return customText ?? "";
    const base = t(mode.promptKey as any);
    return `${base}\n\nContent: "${content.title}"${content.aiSummary ? `\n\nSummary: ${content.aiSummary}` : ""}`;
  };

  const handleSelectMode = (mode: Mode) => {
    setActiveMode(mode);
    if (mode.id !== "ask") {
      const prompt = buildPrompt(mode);
      sendMessage({
        content: [{ text: prompt }],
        aiContext: { contentTitle: content.title, aiSummary: content.aiSummary },
      });
    }
  };

  const handleAsk = () => {
    if (!askInput.trim()) return;
    sendMessage({
      content: [{ text: askInput }],
      aiContext: data.messages.length === 0
        ? { contentTitle: content.title, aiSummary: content.aiSummary }
        : undefined,
    });
    setAskInput("");
  };

  const handleFollowUp = (key: string) => {
    const text = t(key as any);
    sendMessage({ content: [{ text }] });
  };

  const handleReset = () => {
    setActiveMode(null);
  };

  if (isChecking) {
    return (
      <PanelShell onClose={onClose}>
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </PanelShell>
    );
  }

  if (!isAiUser) {
    return (
      <PanelShell onClose={onClose}>
        <AiChatWaitlist />
      </PanelShell>
    );
  }

  return (
    <PanelShell onClose={onClose}>
      {/* Mode picker */}
      {!activeMode && (
        <div className="flex flex-col h-full">
          {/* Context */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-snug">
                {t("ai-chat-context-intro")}{" "}
                <span className="font-medium text-foreground">{content.title}</span>
              </p>
            </div>
          </div>

          {/* Mode grid */}
          <ScrollArea className="flex-1 min-h-0 px-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t("ai-mode-picker-label" as any)}
            </p>
            <div className="space-y-2">
              {MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleSelectMode(mode)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-accent transition-all text-left group"
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", mode.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {t(mode.titleKey as any)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {t(mode.descKey as any)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Active mode — result view */}
      {activeMode && (
        <div className="flex flex-col h-full">
          {/* Mode header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b flex-shrink-0">
            <button
              onClick={handleReset}
              className="p-1 rounded-md hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", activeMode.color)}>
              <activeMode.icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold">{t(activeMode.titleKey as any)}</span>
          </div>

          {/* Ask mode — free input */}
          {activeMode.id === "ask" && (
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1 min-h-0 p-4">
                {data.messages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center mt-8">
                    {t("ai-mode-ask-placeholder" as any)}
                  </p>
                )}
                <div className="space-y-4">
                  {data.messages.map((msg: any) => (
                    <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                          <Sparkles className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted rounded-tl-sm"
                      )}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown {...markdownConfig}>{msg.content[0].text}</ReactMarkdown>
                          </div>
                        ) : (
                          <p>{msg.content[0].text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isResponding && <TypingIndicator />}
                </div>
              </ScrollArea>
              <div className="p-3 border-t flex gap-2">
                <Textarea
                  value={askInput}
                  onChange={(e) => setAskInput(e.target.value)}
                  placeholder={t("ai-chat-input-placeholder")}
                  className="min-h-[40px] max-h-[100px] resize-none text-sm"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); }
                  }}
                />
                <Button size="icon" onClick={handleAsk} disabled={isResponding || !askInput.trim()} className="h-10 w-10 flex-shrink-0">
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Structured modes — single result + follow-ups */}
          {activeMode.id !== "ask" && (
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1 min-h-0 p-4">
                {isResponding && !lastAssistantMsg && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                      <Sparkles className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <TypingIndicator />
                  </div>
                )}
                {lastAssistantMsg && (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
                    <ReactMarkdown {...markdownConfig}>
                      {lastAssistantMsg.content[0].text}
                    </ReactMarkdown>
                  </div>
                )}
              </ScrollArea>

              {/* Follow-up actions */}
              {lastAssistantMsg && !isResponding && (
                <div className="p-3 border-t space-y-2 flex-shrink-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    {t("ai-followup-label" as any)}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {activeMode.followUpKeys.map((key) => (
                      <button
                        key={key}
                        onClick={() => handleFollowUp(key)}
                        className="text-left text-sm px-3 py-2 rounded-lg border border-border hover:border-primary/40 hover:bg-accent transition-all text-foreground/80 hover:text-foreground"
                      >
                        {t(key as any)}
                      </button>
                    ))}
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {t("ai-back-to-modes" as any)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </PanelShell>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PanelShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <p className="text-sm font-semibold">{t("ai-chat-title")}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 inline-flex">
      <div className="flex gap-1 items-center h-4">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
