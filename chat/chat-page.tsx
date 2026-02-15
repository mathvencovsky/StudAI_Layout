import { useTranslation } from "react-i18next";
import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Schema } from "../../../amplify/data/resource";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCallback, useState } from "react";

const client = generateClient<Schema>({ authMode: "userPool" });

const { useAIConversation } = createAIHooks(client);

export const ChatPage = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("Chat");
  const onSend = useCallback(() => {
    handleSendMessage({ content: [{ text: input }] });
    setInput("");
  }, [input, handleSendMessage]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{t("chat-title")}</h1>
      </div>

      <ScrollArea className="flex-1 rounded-lg border p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p>{message.content[0].text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder={t("chat-input-placeholder")}
        />
        <Button onClick={onSend} size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
