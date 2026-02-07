import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIConversation } from "@/hooks/ai/use-ai-hooks";
import { useIsAiUser } from "@/hooks/use-is-ai-user";
import { useMyAiWaitlist } from "@/hooks/ai-waitlist/use-my-ai-waitlist";
import { useCreateAiWaitlist } from "@/hooks/ai-waitlist/use-create-ai-waitlist";
import { AiChatWaitlist } from "./ai-chat-waitlist";

export interface AiChatPanelProps {
  contentId: string;
  contentTitle: string;
}

export const AiChatPanel = ({
  contentId: _contentId,
  contentTitle: _contentTitle,
}: AiChatPanelProps) => {
  const { t } = useTranslation();
  const { isAiUser, isLoading: isChecking } = useIsAiUser();
  const { data: waitlistEntry, isLoading: isLoadingWaitlist } =
    useMyAiWaitlist();
  const { mutate: joinWaitlist, isPending: isJoining } = useCreateAiWaitlist();
  const [input, setInput] = useState("");
  const [{ data, isLoading }, sendMessage] = useAIConversation("Chat");

  if (isChecking || isLoadingWaitlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!isAiUser) {
    return (
      <AiChatWaitlist
        isOnWaitlist={!!waitlistEntry}
        isLoading={isJoining}
        onJoinWaitlist={() => joinWaitlist()}
      />
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ content: [{ text: input }] });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">{t("ai-chat-title")}</h2>
        <p className="text-sm text-muted-foreground">{t("ai-chat-subtitle")}</p>
      </div>
      <ScrollArea className="flex-1 p-4">
        {data.messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center mt-8">
            {t("ai-chat-empty-state")}
          </p>
        ) : (
          <div className="space-y-4">
            {data.messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.role === "user" ? "text-right" : "text-left"}
              >
                <div className="inline-block p-3 rounded-lg bg-muted">
                  {msg.content[0].text}
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
