import { useTranslation } from "react-i18next";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyAiWaitlist } from "@/hooks/ai-waitlist/use-my-ai-waitlist";
import { useCreateAiWaitlist } from "@/hooks/ai-waitlist/use-create-ai-waitlist";

/**
 * Component shown when user is not in the "Ai" group.
 * Loads all waitlist data independently.
 */
export const AiChatWaitlist = () => {
  const { t } = useTranslation();
  const { data: waitlistEntry, isLoading: isLoadingWaitlist } =
    useMyAiWaitlist();
  const { mutate: joinWaitlist, isPending: isJoining } = useCreateAiWaitlist();

  if (isLoadingWaitlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const isOnWaitlist = !!waitlistEntry;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="font-semibold text-lg mb-2">
        {t("ai-chat-waitlist-title")}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {isOnWaitlist
          ? t("ai-chat-waitlist-already-joined")
          : t("ai-chat-waitlist-description")}
      </p>
      {!isOnWaitlist && (
        <Button onClick={() => joinWaitlist()} disabled={isJoining}>
          {isJoining
            ? t("ai-chat-waitlist-joining")
            : t("ai-chat-waitlist-join")}
        </Button>
      )}
    </div>
  );
};
