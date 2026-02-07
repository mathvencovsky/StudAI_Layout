# Technical Spec: AI Chat for Content Learning

## 0. Summary

Add an AI chat interface to the content details page that allows users to ask questions and get help while learning. The chat opens in a resizable panel next to the content, controlled by a button in the content header.

**Goal:** Enable users to interact with an AI assistant while viewing content to enhance their learning experience.  
**Out of scope:** AI model integration, chat history persistence, multi-turn conversation memory across sessions.

## 1. Technical Design

### 1.1 Amplify schema changes

The chat conversation is already defined in the Amplify schema as `Chat`. No schema changes required.

Existing definition:

```ts
Chat: a
  .conversation({
    aiModel: a.ai.model("Amazon Nova Micro"),
    systemPrompt: "You are a helpful learning assistant for StudAI.",
    handler: chatHandler,
  })
  .authorization((allow) => allow.owner()),
```

### 1.2 Type definitions

No new model types required. Component-specific types will be defined inline with components.

### 1.3 API / Data fetching changes

#### New: `src/hooks/ai/use-ai-hooks.ts`

Create AI hooks using Amplify's `createAIHooks`.

```ts
import { generateClient } from "aws-amplify/data";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { type Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export const { useAIConversation } = createAIHooks(client);
```

### 1.4 Page changes

#### `/routes/__root.tsx`

Wrap the root layout with `AiChatProvider` to make chat state available throughout the app.

```tsx
import { AiChatProvider } from "@/contexts/ai-chat-context";

const RootLayout = () => {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  }

  return (
    <AiChatProvider>
      <SidebarProvider style={{ ... }}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col p-6">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <TanStackRouterDevtools />
    </AiChatProvider>
  );
};
```

### 1.5 Component changes

#### New: `src/contexts/ai-chat-context.tsx`

Create a React context to manage the AI chat panel open/close state.

```tsx
interface AiChatContextValue {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

export const AiChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  // ...
};

export const useAiChat = () => useContext(AiChatContext);
```

#### New: `src/components/ui/resizable.tsx`

Add shadcn resizable component using the command:

```bash
npx --yes shadcn@latest add resizable
```

#### Modified: `src/components/layout/site-header.tsx`

Add an AI chat button to the far right of the breadcrumbs in the site header.

```tsx
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiChat } from "@/contexts/ai-chat-context";

export function SiteHeader({}: SiteHeaderProps) {
  const { toggleChat, isOpen } = useAiChat();
  const { t } = useTranslation();

  return (
    <header className="...">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="..." />
        <AppBreadcrumbs />
        <div className="ml-auto">
          <Button
            variant={isOpen ? "default" : "outline"}
            size="icon"
            onClick={toggleChat}
            aria-label={t("ai-chat-toggle")}
          >
            <Bot className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
```

#### Modified: `src/components/content/content-detail-view.tsx`

Wrap the content view with `ResizablePanelGroup` to display content and chat side by side when chat is open.

```tsx
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { AiChatPanel } from "./ai-chat-panel";
import { useAiChat } from "@/contexts/ai-chat-context";

export const ContentDetailView = ({ ... }) => {
  const { isOpen } = useAiChat();
  const isYouTube = isYouTubeUrl(content.link);

  return (
    <ResizablePanelGroup direction="horizontal" className="space-y-6">
      <ResizablePanel defaultSize={isOpen ? 60 : 100} minSize={30}>
        <div className="space-y-6">
          <ContentHeader {...} />
          {isYouTube ? <YouTubeEmbed url={content.link} /> : <ExternalLink url={content.link} />}
          {/* ... navigation buttons */}
        </div>
      </ResizablePanel>

      {isOpen && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={25}>
            <AiChatPanel contentId={content.id} contentTitle={content.title} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};
```

#### New: `src/components/content/ai-chat-panel.tsx`

Create the AI chat panel component using Amplify's `useAIConversation` hook.

```tsx
import { useAIConversation } from "@/hooks/ai/use-ai-hooks";

export interface AiChatPanelProps {
  contentId: string;
  contentTitle: string;
}

export const AiChatPanel = ({ contentId, contentTitle }: AiChatPanelProps) => {
  const { t } = useTranslation();
  const [{ data, isLoading }, sendMessage] = useAIConversation("Chat");

  const handleSend = (content: string) => {
    sendMessage({ content });
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
        <Textarea placeholder={t("ai-chat-input-placeholder")} />
        <Button onClick={handleSend} disabled={isLoading}>
          {t("ai-chat-send")}
        </Button>
      </div>
    </div>
  );
};
```

### 1.6 Translation keys

- `ai-chat-toggle` - Aria label for the AI chat toggle button
- `ai-chat-title` - Title for the AI chat panel ("AI Assistant")
- `ai-chat-subtitle` - Subtitle for the AI chat panel ("Ask questions about this content")
- `ai-chat-input-placeholder` - Placeholder for the chat input ("Ask a question...")
- `ai-chat-send` - Label for the send button ("Send")
- `ai-chat-empty-state` - Message when no messages exist ("Start a conversation by asking a question")

## 1.7. Sidebar

No sidebar changes required.

## 2. Acceptance Criteria

### AC1: AI Chat Button Visibility

**Given** a user is viewing a content detail page at `/module/$moduleId/content/$contentId`  
**When** the page loads  
**Then** an AI chat button with a Bot icon should be visible in the site header to the far right of the breadcrumbs

### AC2: Open AI Chat Panel

**Given** the AI chat panel is closed  
**When** the user clicks the AI chat button  
**Then** the chat panel should open on the right side of the content using a resizable layout

### AC3: Close AI Chat Panel

**Given** the AI chat panel is open  
**When** the user clicks the AI chat button again  
**Then** the chat panel should close and the content should expand to full width

### AC4: Resizable Layout

**Given** the AI chat panel is open  
**When** the user drags the resize handle between content and chat  
**Then** the panel sizes should adjust accordingly with minimum size constraints

### AC5: Chat Interface Display

**Given** the AI chat panel is open  
**When** the user views the panel  
**Then** they should see a header with title, a message area, and an input field with send button

### Edge cases

- E1: Chat state should reset when navigating to a different content item
- E2: Button should show active state when chat is open
- E3: Layout should be responsive and handle small screen sizes gracefully
- E4: Resizable panels should respect minimum size constraints to prevent unusable layouts

## 3. Implementation Tasks

### 3.1 `src/hooks/ai/use-ai-hooks.ts` - Create AI Hooks

Create AI hooks using Amplify's `createAIHooks`.

```ts
import { generateClient } from "aws-amplify/data";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { type Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export const { useAIConversation } = createAIHooks(client);
```

### 3.2 `src/components/ui/resizable.tsx` - Add Resizable Component

Install shadcn resizable component.

```bash
npx --yes shadcn@latest add resizable
```

### 3.3 `src/contexts/ai-chat-context.tsx` - Create AI Chat Context

Create context provider to manage chat panel state.

```tsx
import { createContext, useContext, useState } from "react";

interface AiChatContextValue {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const AiChatContext = createContext<AiChatContextValue | undefined>(undefined);

export const AiChatProvider = ({ children }: { children: React.ReactNode }) => {
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

export const useAiChat = () => {
  const context = useContext(AiChatContext);
  if (!context) {
    throw new Error("useAiChat must be used within AiChatProvider");
  }
  return context;
};
```

### 3.4 `src/components/content/ai-chat-panel.tsx` - Create Chat Panel Component

Create the AI chat panel UI component using `useAIConversation`.

```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIConversation } from "@/hooks/ai/use-ai-hooks";

export interface AiChatPanelProps {
  contentId: string;
  contentTitle: string;
}

export const AiChatPanel = ({ contentId, contentTitle }: AiChatPanelProps) => {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [{ data, isLoading }, sendMessage] = useAIConversation("Chat");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ content: input });
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
```

### 3.5 `src/components/layout/site-header.tsx` - Add AI Chat Button

Add AI chat toggle button to the site header, to the far right of the breadcrumbs.

- Import `Bot` icon from `lucide-react`
- Import `useAiChat` hook
- Import `useTranslation` hook
- Add button with `ml-auto` to push it to the right
- Button should show active state when `isOpen` is true

```tsx
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiChat } from "@/contexts/ai-chat-context";
import { useTranslation } from "react-i18next";

export function SiteHeader({}: SiteHeaderProps) {
  const { toggleChat, isOpen } = useAiChat();
  const { t } = useTranslation();

  return (
    <header className="...">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="..." />
        <AppBreadcrumbs />
        <div className="ml-auto">
          <Button
            variant={isOpen ? "default" : "outline"}
            size="icon"
            onClick={toggleChat}
            aria-label={t("ai-chat-toggle")}
          >
            <Bot className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
```

### 3.6 `src/components/content/content-detail-view.tsx` - Add Resizable Layout

Wrap content with resizable panels to show chat alongside content.

- Import resizable components
- Import `useAiChat` hook
- Import `AiChatPanel` component
- Wrap existing content in `ResizablePanelGroup` and `ResizablePanel`
- Conditionally render chat panel with resize handle when `isOpen` is true

```tsx
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { AiChatPanel } from "./ai-chat-panel";
import { useAiChat } from "@/contexts/ai-chat-context";

const { isOpen } = useAiChat();

return (
  <ResizablePanelGroup direction="horizontal">
    <ResizablePanel defaultSize={isOpen ? 60 : 100} minSize={30}>
      {/* Existing content */}
    </ResizablePanel>
    {isOpen && (
      <>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={25}>
          <AiChatPanel contentId={content.id} contentTitle={content.title} />
        </ResizablePanel>
      </>
    )}
  </ResizablePanelGroup>
);
```

### 3.7 `src/routes/__root.tsx` - Wrap with Context Provider

Wrap the authenticated root layout with `AiChatProvider`.

```tsx
import { AiChatProvider } from "@/contexts/ai-chat-context";

const RootLayout = () => {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  }

  return (
    <AiChatProvider>
      <SidebarProvider style={{ ... }}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col p-6">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <TanStackRouterDevtools />
    </AiChatProvider>
  );
};
```

### 3.8 Translation files - Add new translation keys

Add translation keys to `src/i18n/locales/en.ts` and `src/i18n/locales/pt-br.ts`:

**English:**

```ts
"ai-chat-toggle": "Toggle AI chat",
"ai-chat-title": "AI Assistant",
"ai-chat-subtitle": "Ask questions about this content",
"ai-chat-input-placeholder": "Ask a question...",
"ai-chat-send": "Send",
"ai-chat-empty-state": "Start a conversation by asking a question",
```

**Portuguese:**

```ts
"ai-chat-toggle": "Alternar chat de IA",
"ai-chat-title": "Assistente de IA",
"ai-chat-subtitle": "Faça perguntas sobre este conteúdo",
"ai-chat-input-placeholder": "Faça uma pergunta...",
"ai-chat-send": "Enviar",
"ai-chat-empty-state": "Inicie uma conversa fazendo uma pergunta",
```

## 4. Execution Order

- [x] 3.1 Create AI hooks with useAIConversation
- [x] 3.2 Add resizable component from shadcn
- [x] 3.3 Create AI chat context provider
- [x] 3.4 Create AI chat panel component
- [x] 3.8 Add translation keys to both language files
- [x] 3.5 Add AI chat button to site header
- [x] 3.6 Add resizable layout to content detail view
- [x] 3.7 Wrap route with context provider

## 5. Open Questions and missing details

- Q1: Should the AI conversation have context about the specific content being viewed (title, description, type)?
- Q2: Should chat history persist when navigating between different content items within the same module?
- Q3: Should there be a maximum message history limit per conversation?
- Q4: Should the chat panel remember its size preference (localStorage)?
- Q5: Should the chat button be visible on all pages or only on content detail pages? Should be only on content detail pages
- Q6: What should the system prompt include to make the AI most helpful for learning?
- Q7: Should there be a way to start a new conversation or clear chat history?
