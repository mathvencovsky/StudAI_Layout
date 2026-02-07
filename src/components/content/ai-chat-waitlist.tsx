import { useTranslation } from "react-i18next";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AiChatWaitlistProps {
  isOnWaitlist: boolean;
  isLoading: boolean;
  onJoinWaitlist: () => void;
}

/**
 * Component shown when user is not in the "Ai" group
 */
export const AiChatWaitlist = ({
  isOnWaitlist,
  isLoading,
  onJoinWaitlist,
}: AiChatWaitlistProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <Bot className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="font-semibold text-lg mb-2">
        {t("ai-chat-waitlist-title")}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {isOnWaitlist
          ? t("ai-chat-waitlist-already-joined")
          : t("ai-chat-waitlist-description")}
      </p>
      {!isOnWaitlist && (
        <Button onClick={onJoinWaitlist} disabled={isLoading}>
          {isLoading
            ? t("ai-chat-waitlist-joining")
            : t("ai-chat-waitlist-join")}
        </Button>
      )}
    </div>
  );
};
