import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIConversation } from "@/hooks/ai/use-ai-hooks";
import { useIsAiUser } from "@/hooks/use-is-ai-user";
import { type Content } from "@/model/content";
import { markdownConfig } from "@/lib/markdown-config";
import { AiChatWaitlist } from "./ai-chat-waitlist";

export interface AiChatPanelProps {
  content: Content;
}

export const AiChatPanel = ({ content }: AiChatPanelProps) => {
  const { t } = useTranslation();
  const { isAiUser, isLoading: isChecking } = useIsAiUser();
  const [input, setInput] = useState("");
  const [{ data, isLoading }, sendMessage] = useAIConversation("Chat");

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!isAiUser) {
    return <AiChatWaitlist />;
  }

  const handleSend = () => {
    if (!input.trim()) return;
    const aiContext =
      data.messages.length === 0
        ? { contentTitle: content.title, aiSummary: content.aiSummary }
        : undefined;
    sendMessage({ content: [{ text: input }], aiContext });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">{t("ai-chat-title")}</h2>
        <p className="text-sm text-muted-foreground">{t("ai-chat-subtitle")}</p>
      </div>
      <ScrollArea className="flex-1 min-h-0 p-4">
        {data.messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center mt-8">
            {t("ai-chat-empty-state")}
          </p>
        ) : (
          <div className="space-y-4">
            {data.messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div className="p-3 rounded-lg bg-muted w-96 overflow-hidden">
                  <div className="prose prose-sm dark:prose-invert max-w-none [&_*]:break-words [&_code]:break-all [&_pre]:overflow-x-auto">
                    <ReactMarkdown {...markdownConfig}>
                      {msg.content[0].text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t space-y-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("ai-chat-input-placeholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={isLoading} className="w-full">
          {t("ai-chat-send")}
        </Button>
      </div>
    </div>
  );
};
