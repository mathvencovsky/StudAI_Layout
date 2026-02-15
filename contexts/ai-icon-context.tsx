import { createContext, useContext, useEffect, useState } from "react";

interface AiIconContextValue {
  showAiIcon: boolean;
  setShowAiIcon: (show: boolean) => void;
}

const AiIconContext = createContext<AiIconContextValue | undefined>(undefined);

export interface AiIconProviderProps {
  children: React.ReactNode;
}

/** Provides AI icon visibility state to the component tree. */
export const AiIconProvider = ({ children }: AiIconProviderProps) => {
  const [showAiIcon, setShowAiIcon] = useState(false);

  return (
    <AiIconContext.Provider value={{ showAiIcon, setShowAiIcon }}>
      {children}
    </AiIconContext.Provider>
  );
};

export const useAiIcon = () => {
  const context = useContext(AiIconContext);
  if (!context) {
    throw new Error("useAiIcon must be used within AiIconProvider");
  }
  return context;
};

/** Shows the AI icon in the site header while the calling component is mounted. */
export const useShowAiIcon = () => {
  const { setShowAiIcon } = useAiIcon();

  useEffect(() => {
    setShowAiIcon(true);
    return () => setShowAiIcon(false);
  }, [setShowAiIcon]);
};

/** Returns whether the AI icon should be visible. */
export const useAiIconVisible = () => {
  const { showAiIcon } = useAiIcon();
  return showAiIcon;
};
