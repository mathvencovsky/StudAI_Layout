import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Send, Sparkles, X, ChevronDown, BookOpen, HelpCircle, FileText, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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

const SUGGESTED_QUESTIONS = [
  { icon: HelpCircle, labelKey: "ai-chat-suggest-explain" },
  { icon: BookOpen, labelKey: "ai-chat-suggest-summary" },
  { icon: FileText, labelKey: "ai-chat-suggest-quiz" },
  { icon: Lightbulb, labelKey: "ai-chat-suggest-examples" },
];

/**
 * AI Study Assistant panel — inspired by Coursera/Khan Academy.
 * Shows suggested prompts, conversation history, and a send input.
 */
export const AiStudyAssistant = ({ content, onClose }: AiStudyAssistantProps) => {
  const { t } = useTranslation();
  const { isAiUser, isLoading: isChecking } = useIsAiUser();
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [{ data, isLoading }, sendMessage] = useAIConversation("Chat");

  const hasMessages = data.messages.length > 0;

  const handleSend = (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    const aiContext =
      data.messages.length === 0
        ? { contentTitle: content.title, aiSummary: content.aiSummary }
        : undefined;
    sendMessage({ content: [{ text: msg }], aiContext });
    setInput("");
  };

  if (isChecking) {
    return (
      <div className="flex flex-col h-full">
        <AssistantHeader onClose={onClose} onMinimize={() => setIsMinimized(!isMinimized)} isMinimized={isMinimized} />
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isAiUser) {
    return (
      <div className="flex flex-col h-full">
        <AssistantHeader onClose={onClose} onMinimize={() => setIsMinimized(!isMinimized)} isMinimized={isMinimized} />
        {!isMinimized && <AiChatWaitlist />}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <AssistantHeader
        onClose={onClose}
        onMinimize={() => setIsMinimized(!isMinimized)}
        isMinimized={isMinimized}
      />

      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-4">
              {/* Welcome state with suggested prompts */}
              {!hasMessages && (
                <div className="space-y-4">
                  {/* Context badge */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                    <p className="text-xs text-muted-foreground leading-snug">
                      {t("ai-chat-context-intro")}{" "}
                      <span className="font-medium text-foreground line-clamp-1">
                        {content.title}
                      </span>
                    </p>
                  </div>

                  {/* Suggested questions */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      {t("ai-chat-suggestions-label")}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {SUGGESTED_QUESTIONS.map(({ icon: Icon, labelKey }) => (
                        <button
                          key={labelKey}
                          onClick={() => handleSend(t(labelKey as any))}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all text-left group"
                        >
                          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                            {t(labelKey as any)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {hasMessages && (
                <div className="space-y-4">
                  {data.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                          <Sparkles className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none [&_*]:break-words [&_code]:break-all [&_pre]:overflow-x-auto">
                            <ReactMarkdown {...markdownConfig}>
                              {msg.content[0].text}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p>{msg.content[0].text}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                        <Sparkles className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1 items-center h-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="p-3 border-t bg-background space-y-2">
            {/* Quick chips after first message */}
            {hasMessages && (
              <div className="flex gap-1.5 flex-wrap">
                {["ai-chat-chip-more", "ai-chat-chip-quiz", "ai-chat-chip-simpler"].map((key) => (
                  <Badge
                    key={key}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-colors text-xs py-1"
                    onClick={() => handleSend(t(key as any))}
                  >
                    {t(key as any)}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("ai-chat-input-placeholder")}
                className="min-h-[40px] max-h-[120px] resize-none text-sm"
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
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface AssistantHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

function AssistantHeader({ onClose, onMinimize, isMinimized }: AssistantHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">{t("ai-chat-title")}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{t("ai-chat-subtitle")}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMinimize}>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isMinimized && "rotate-180")} />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
