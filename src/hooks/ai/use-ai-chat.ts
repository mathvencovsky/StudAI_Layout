import { useEffect } from "react";
import { useAiChatContext } from "@/contexts/ai-chat-context";
import { useAiIcon } from "@/contexts/ai-icon-context";

export interface UseAiChatOptions {
  showIcon?: boolean;
}

/** Provides AI chat state and optionally shows the AI icon in the header while mounted. */
export const useAiChat = ({ showIcon = true }: UseAiChatOptions = {}) => {
  const context = useAiChatContext();
  const { setShowAiIcon } = useAiIcon();

  useEffect(() => {
    if (showIcon) {
      setShowAiIcon(true);
      return () => setShowAiIcon(false);
    }
  }, [showIcon, setShowAiIcon]);

  return context;
};
