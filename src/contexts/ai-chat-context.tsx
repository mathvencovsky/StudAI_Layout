import { createContext, useContext, useState } from "react";

interface AiChatContextValue {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const AiChatContext = createContext<AiChatContextValue | undefined>(undefined);

export interface AiChatProviderProps {
  children: React.ReactNode;
}

export const AiChatProvider = ({ children }: AiChatProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <AiChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat }}>
      {children}
    </AiChatContext.Provider>
  );
};

export const useAiChatContext = () => {
  const context = useContext(AiChatContext);
  if (!context) {
    throw new Error("useAiChatContext must be used within AiChatProvider");
  }
  return context;
};
