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
  /** Inline mode: renders as a card in the page flow, no close button */
  inline?: boolean;
  onClose?: () => void;
}

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

/**
 * Structured AI Study Assistant.
 * - inline=true: renders as a card in the page, always visible
 * - inline=false (default): renders as a side panel with close button
 */
export const AiStudyAssistant = ({ content, inline = false, onClose }: AiStudyAssistantProps) => {
  const { t } = useTranslation();
  const { isAiUser, isLoading: isChecking } = useIsAiUser();
  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const [askInput, setAskInput] = useState("");
  const [{ data, isLoading }, sendMessage] = useAIConversation("Chat");

  const lastAssistantMsg = [...data.messages].reverse().find((m) => m.role === "assistant");

  const buildPrompt = (mode: Mode): string => {
    const base = t(mode.promptKey as any);
    return `${base}\n\nContent: "${content.title}"${content.aiSummary ? `\n\nSummary: ${content.aiSummary}` : ""}`;
  };

  const handleSelectMode = (mode: Mode) => {
    setActiveMode(mode);
    if (mode.id !== "ask") {
      sendMessage({
        content: [{ text: buildPrompt(mode) }],
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
    sendMessage({ content: [{ text: t(key as any) }] });
  };

  const handleReset = () => setActiveMode(null);

  // ── Wrapper ──────────────────────────────────────────────────────────────
  const wrapper = (children: React.ReactNode) => {
    if (inline) {
      return (
        <div className="rounded-xl border-2 border-primary/20 bg-card overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-primary/5 border-b border-primary/10">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none">{t("ai-chat-title")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("ai-chat-subtitle")}</p>
            </div>
            {activeMode && (
              <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <RotateCcw className="h-3 w-3" />
                {t("ai-back-to-modes" as any)}
              </button>
            )}
          </div>
          {children}
        </div>
      );
    }

    // Panel mode
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            {activeMode && (
              <button onClick={handleReset} className="p-1 rounded-md hover:bg-accent transition-colors mr-1">
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <p className="text-sm font-semibold">{t("ai-chat-title")}</p>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {children}
      </div>
    );
  };

  // ── Loading / waitlist ────────────────────────────────────────────────────
  if (isChecking) {
    return wrapper(
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAiUser) {
    return wrapper(<AiChatWaitlist />);
  }

  // ── Mode picker ───────────────────────────────────────────────────────────
  if (!activeMode) {
    return wrapper(
      <div className={cn("p-4", inline ? "" : "flex-1 overflow-y-auto")}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {t("ai-mode-picker-label" as any)}
        </p>
        <div className={cn(
          "gap-2",
          inline
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            : "flex flex-col"
        )}>
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => handleSelectMode(mode)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border border-border bg-background",
                  "hover:border-primary/40 hover:bg-accent transition-all text-left group",
                  inline && "flex-col items-center text-center gap-2 p-4"
                )}
              >
                <div className={cn("rounded-lg flex items-center justify-center flex-shrink-0", mode.color,
                  inline ? "w-10 h-10" : "w-9 h-9"
                )}>
                  <Icon className={cn(inline ? "h-5 w-5" : "h-4 w-4")} />
                </div>
                <div className={cn("min-w-0", inline && "text-center")}>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t(mode.titleKey as any)}
                  </p>
                  {!inline && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {t(mode.descKey as any)}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Active mode: Ask (free input) ─────────────────────────────────────────
  if (activeMode.id === "ask") {
    const askContent = (
      <>
        {data.messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            {t("ai-mode-ask-placeholder" as any)}
          </p>
        )}
        <div className="space-y-3">
          {data.messages.map((msg: any) => (
            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Sparkles className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"
              )}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown {...markdownConfig}>{msg.content[0].text}</ReactMarkdown>
                  </div>
                ) : <p>{msg.content[0].text}</p>}
              </div>
            </div>
          ))}
          {isLoading && <TypingIndicator />}
        </div>
      </>
    );

    const askInput_ = (
      <div className={cn("flex gap-2", inline ? "pt-3 border-t mt-3" : "p-3 border-t")}>
        <Textarea
          value={askInput}
          onChange={(e) => setAskInput(e.target.value)}
          placeholder={t("ai-chat-input-placeholder")}
          className="min-h-[40px] max-h-[100px] resize-none text-sm"
          rows={1}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
        />
        <Button size="icon" onClick={handleAsk} disabled={isLoading || !askInput.trim()} className="h-10 w-10 flex-shrink-0">
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>
    );

    if (inline) {
      return wrapper(
        <div className="p-4">
          {askContent}
          {askInput_}
        </div>
      );
    }

    return wrapper(
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 min-h-0 p-4">{askContent}</ScrollArea>
        {askInput_}
      </div>
    );
  }

  // ── Active mode: structured result ────────────────────────────────────────
  const resultContent = (
    <>
      {isLoading && !lastAssistantMsg && (
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="h-3 w-3 text-primary-foreground" />
          </div>
          <TypingIndicator />
        </div>
      )}
      {lastAssistantMsg && (
        <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
          <ReactMarkdown {...markdownConfig}>{lastAssistantMsg.content[0].text}</ReactMarkdown>
        </div>
      )}
    </>
  );

  const followUps = lastAssistantMsg && !isLoading && (
    <div className={cn("space-y-2", inline ? "pt-3 border-t mt-3" : "p-3 border-t flex-shrink-0")}>
      <p className="text-xs text-muted-foreground font-medium">{t("ai-followup-label" as any)}</p>
      <div className={cn("gap-1.5", inline ? "flex flex-wrap" : "flex flex-col")}>
        {activeMode.followUpKeys.map((key) => (
          <button
            key={key}
            onClick={() => handleFollowUp(key)}
            className={cn(
              "text-sm px-3 py-2 rounded-lg border border-border",
              "hover:border-primary/40 hover:bg-accent transition-all text-foreground/80 hover:text-foreground text-left",
              inline && "text-xs py-1.5"
            )}
          >
            {t(key as any)}
          </button>
        ))}
        <button
          onClick={handleReset}
          className={cn(
            "flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg",
            "text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
            inline && "text-xs py-1.5"
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t("ai-back-to-modes" as any)}
        </button>
      </div>
    </div>
  );

  if (inline) {
    return wrapper(
      <div className="p-4">
        {/* Mode label */}
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", activeMode.color)}>
            <activeMode.icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t(activeMode.titleKey as any)}
          </span>
        </div>
        {resultContent}
        {followUps}
      </div>
    );
  }

  return wrapper(
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 min-h-0 p-4">{resultContent}</ScrollArea>
      {followUps}
    </div>
  );
};

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
