# Technical Spec: AI Chat Waitlist

## 0. Summary

Add a waitlist system for the AI Chat feature. Users not in the "Ai" Cognito group see a waitlist message with a join button. Clicking the button records their interest in the database. Users who already joined see a confirmation that they're on the waitlist.

**Goal:** Gate AI Chat access to "Ai" group members and collect waitlist signups from other users.  
**Out of scope:** Admin interface to manage waitlist, automatic group assignment, email notifications.

## 1. Technical Design

### 1.1 Amplify schema changes

Add a new `AiWaitlist` model to track users who want access to the AI Chat feature.

```ts
// amplify/data/resource.ts

AiWaitlist: a
  .model({
    requestedAt: a.timestamp().required(),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

Add "Ai" group to auth configuration:

```ts
// amplify/auth/resource.ts
groups: ["Admin", "Ai"],
```

### 1.2 Type definitions

```ts
// src/model/ai-waitlist.ts
import { type Schema } from "../../amplify/data/resource";

export type AiWaitlist = Schema["AiWaitlist"]["type"];
export type AiWaitlistIdentifier = Schema["AiWaitlist"]["identifier"];
export type AiWaitlistCreateInput = Schema["AiWaitlist"]["createType"];
```

### 1.3 API / Data fetching changes

#### New: `src/api/ai-waitlist/get-my-ai-waitlist.ts`

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../../amplify/data/resource";
import { type AiWaitlist } from "@/model/ai-waitlist";

const client = generateClient<Schema>();

export const getMyAiWaitlist = async (): Promise<AiWaitlist | null> => {
  const result = await client.models.AiWaitlist.list();
  return result.data?.[0] ?? null;
};
```

#### New: `src/api/ai-waitlist/create-ai-waitlist.ts`

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../../amplify/data/resource";
import { type AiWaitlist } from "@/model/ai-waitlist";

const client = generateClient<Schema>();

export const createAiWaitlist = async (): Promise<AiWaitlist | null> => {
  const result = await client.models.AiWaitlist.create({
    requestedAt: Date.now(),
  });
  return result.data;
};
```

#### New: `src/hooks/ai-waitlist/use-my-ai-waitlist.ts`

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMyAiWaitlist } from "@/api/ai-waitlist/get-my-ai-waitlist";

export const getMyAiWaitlistQueryOptions = () =>
  queryOptions({
    queryKey: ["ai-waitlist", "me"],
    queryFn: getMyAiWaitlist,
  });

export const useMyAiWaitlist = () => useQuery(getMyAiWaitlistQueryOptions());
```

#### New: `src/hooks/ai-waitlist/use-create-ai-waitlist.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAiWaitlist } from "@/api/ai-waitlist/create-ai-waitlist";

export const useCreateAiWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAiWaitlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-waitlist", "me"] });
    },
  });
};
```

#### New: `src/hooks/use-is-ai-user.ts`

```ts
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export const useIsAiUser = () => {
  const { user, loading } = useAuth();
  const [isAiUser, setIsAiUser] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    const checkAiStatus = async () => {
      if (!user) {
        setIsAiUser(false);
        setIsChecking(false);
        return;
      }

      try {
        const session = await fetchAuthSession({ forceRefresh: true });
        const groups =
          (session.tokens?.accessToken?.payload?.["cognito:groups"] as
            | string[]
            | undefined) ?? [];
        setIsAiUser(groups.includes("Ai"));
      } catch {
        setIsAiUser(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAiStatus();
  }, [user, loading]);

  return { isAiUser, isChecking };
};
```

### 1.4 Page changes

No page changes required. The AI chat panel component handles the waitlist logic.

### 1.5 Component changes

#### New: `src/components/content/ai-chat-waitlist.tsx`

Component shown when user is not in the "Ai" group.

```tsx
export interface AiChatWaitlistProps {
  isOnWaitlist: boolean;
  isLoading: boolean;
  onJoinWaitlist: () => void;
}

export const AiChatWaitlist = ({
  isOnWaitlist,
  isLoading,
  onJoinWaitlist,
}: AiChatWaitlistProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <Bot className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="font-semibold text-lg mb-2">{t("ai-chat-waitlist-title")}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {isOnWaitlist
          ? t("ai-chat-waitlist-already-joined")
          : t("ai-chat-waitlist-description")}
      </p>
      {!isOnWaitlist && (
        <Button onClick={onJoinWaitlist} disabled={isLoading}>
          {isLoading ? t("ai-chat-waitlist-joining") : t("ai-chat-waitlist-join")}
        </Button>
      )}
    </div>
  );
};
```

#### Modified: `src/components/content/ai-chat-panel.tsx`

Add waitlist check before showing chat interface.

```tsx
import { useIsAiUser } from "@/hooks/use-is-ai-user";
import { useMyAiWaitlist } from "@/hooks/ai-waitlist/use-my-ai-waitlist";
import { useCreateAiWaitlist } from "@/hooks/ai-waitlist/use-create-ai-waitlist";
import { AiChatWaitlist } from "./ai-chat-waitlist";

export const AiChatPanel = ({ contentId, contentTitle }: AiChatPanelProps) => {
  const { isAiUser, isChecking } = useIsAiUser();
  const { data: waitlistEntry, isLoading: isLoadingWaitlist } = useMyAiWaitlist();
  const { mutate: joinWaitlist, isPending: isJoining } = useCreateAiWaitlist();

  if (isChecking || isLoadingWaitlist) {
    return <LoadingSpinner />;
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

  // Existing chat UI...
};
```

### 1.6 Translation keys

- `ai-chat-waitlist-title` - Title for waitlist panel
- `ai-chat-waitlist-description` - Description explaining the waitlist
- `ai-chat-waitlist-join` - Button text to join waitlist
- `ai-chat-waitlist-joining` - Button text while joining
- `ai-chat-waitlist-already-joined` - Message when already on waitlist

## 1.7. Sidebar

No sidebar changes required.

## 2. Acceptance Criteria

### AC1: User not in "Ai" group sees waitlist

**Given** a user is not in the "Ai" Cognito group  
**When** they open the AI chat panel  
**Then** they see a waitlist message with a "Join Waitlist" button

### AC2: User joins waitlist

**Given** a user is not in the "Ai" group and has not joined the waitlist  
**When** they click the "Join Waitlist" button  
**Then** a record is created in the database with their user ID and timestamp, and the UI updates to show they're on the waitlist

### AC3: User already on waitlist

**Given** a user has already joined the waitlist  
**When** they open the AI chat panel  
**Then** they see a message confirming they're on the waitlist (no join button)

### AC4: User in "Ai" group sees chat

**Given** a user is in the "Ai" Cognito group  
**When** they open the AI chat panel  
**Then** they see the full AI chat interface

### Edge cases

- E1: Loading states should be shown while checking group membership and waitlist status
- E2: If waitlist creation fails, show an error message and allow retry
- E3: User should only have one waitlist entry (owner-based auth ensures this)

## 3. Implementation Tasks

### 3.1 `amplify/auth/resource.ts` - Add "Ai" group

Add "Ai" to the groups array.

```ts
groups: ["Admin", "Ai"],
```

### 3.2 `amplify/data/resource.ts` - Add AiWaitlist model

Add the AiWaitlist model to the schema.

```ts
AiWaitlist: a
  .model({
    requestedAt: a.timestamp().required(),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

### 3.3 `src/model/ai-waitlist.ts` - Create type definitions

```ts
import { type Schema } from "../../amplify/data/resource";

export type AiWaitlist = Schema["AiWaitlist"]["type"];
export type AiWaitlistIdentifier = Schema["AiWaitlist"]["identifier"];
export type AiWaitlistCreateInput = Schema["AiWaitlist"]["createType"];
```

### 3.4 `src/api/ai-waitlist/get-my-ai-waitlist.ts` - Create API function

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../../amplify/data/resource";
import { type AiWaitlist } from "@/model/ai-waitlist";

const client = generateClient<Schema>();

export const getMyAiWaitlist = async (): Promise<AiWaitlist | null> => {
  const result = await client.models.AiWaitlist.list();
  return result.data?.[0] ?? null;
};
```

### 3.5 `src/api/ai-waitlist/create-ai-waitlist.ts` - Create API function

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../../amplify/data/resource";
import { type AiWaitlist } from "@/model/ai-waitlist";

const client = generateClient<Schema>();

export const createAiWaitlist = async (): Promise<AiWaitlist | null> => {
  const result = await client.models.AiWaitlist.create({
    requestedAt: Date.now(),
  });
  return result.data;
};
```

### 3.6 `src/hooks/ai-waitlist/use-my-ai-waitlist.ts` - Create query hook

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getMyAiWaitlist } from "@/api/ai-waitlist/get-my-ai-waitlist";

export const getMyAiWaitlistQueryOptions = () =>
  queryOptions({
    queryKey: ["ai-waitlist", "me"],
    queryFn: getMyAiWaitlist,
  });

export const useMyAiWaitlist = () => useQuery(getMyAiWaitlistQueryOptions());
```

### 3.7 `src/hooks/ai-waitlist/use-create-ai-waitlist.ts` - Create mutation hook

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAiWaitlist } from "@/api/ai-waitlist/create-ai-waitlist";

export const useCreateAiWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAiWaitlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-waitlist", "me"] });
    },
  });
};
```

### 3.8 `src/hooks/use-is-ai-user.ts` - Create group check hook

```ts
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export const useIsAiUser = () => {
  const { user, loading } = useAuth();
  const [isAiUser, setIsAiUser] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    const checkAiStatus = async () => {
      if (!user) {
        setIsAiUser(false);
        setIsChecking(false);
        return;
      }

      try {
        const session = await fetchAuthSession({ forceRefresh: true });
        const groups =
          (session.tokens?.accessToken?.payload?.["cognito:groups"] as
            | string[]
            | undefined) ?? [];
        setIsAiUser(groups.includes("Ai"));
      } catch {
        setIsAiUser(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAiStatus();
  }, [user, loading]);

  return { isAiUser, isChecking };
};
```

### 3.9 `src/components/content/ai-chat-waitlist.tsx` - Create waitlist component

```tsx
import { useTranslation } from "react-i18next";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AiChatWaitlistProps {
  isOnWaitlist: boolean;
  isLoading: boolean;
  onJoinWaitlist: () => void;
}

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
```

### 3.10 `src/components/content/ai-chat-panel.tsx` - Add waitlist check

Modify to check group membership and show waitlist UI when needed.

```tsx
import { useIsAiUser } from "@/hooks/use-is-ai-user";
import { useMyAiWaitlist } from "@/hooks/ai-waitlist/use-my-ai-waitlist";
import { useCreateAiWaitlist } from "@/hooks/ai-waitlist/use-create-ai-waitlist";
import { AiChatWaitlist } from "./ai-chat-waitlist";
import { Loader2 } from "lucide-react";

export const AiChatPanel = ({
  contentId: _contentId,
  contentTitle: _contentTitle,
}: AiChatPanelProps) => {
  const { t } = useTranslation();
  const { isAiUser, isChecking } = useIsAiUser();
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

  // ... existing chat UI
};
```

### 3.11 Translation files - Add new keys

**English (`src/i18n/locales/en/common.ts`):**

```ts
"ai-chat-waitlist-already-joined": "You're on the waitlist! We'll notify you when AI Chat is available.",
"ai-chat-waitlist-description": "AI Chat is currently in limited access. Join the waitlist to be notified when it's available for you.",
"ai-chat-waitlist-join": "Join Waitlist",
"ai-chat-waitlist-joining": "Joining...",
"ai-chat-waitlist-title": "AI Chat Waitlist",
```

**Portuguese (`src/i18n/locales/pt-BR/common.ts`):**

```ts
"ai-chat-waitlist-already-joined": "Você está na lista de espera! Avisaremos quando o Chat de IA estiver disponível.",
"ai-chat-waitlist-description": "O Chat de IA está com acesso limitado. Entre na lista de espera para ser notificado quando estiver disponível.",
"ai-chat-waitlist-join": "Entrar na Lista",
"ai-chat-waitlist-joining": "Entrando...",
"ai-chat-waitlist-title": "Lista de Espera do Chat de IA",
```

## 4. Execution Order

- [x] 3.1 Add "Ai" group to auth config
- [x] 3.2 Add AiWaitlist model to schema
- [x] 3.3 Create type definitions
- [x] 3.4 Create get API function
- [x] 3.5 Create create API function
- [x] 3.6 Create query hook
- [x] 3.7 Create mutation hook
- [x] 3.8 Create group check hook
- [x] 3.9 Create waitlist component
- [x] 3.11 Add translation keys
- [x] 3.10 Modify ai-chat-panel to use waitlist

## 5. Open Questions and missing details

- Q1: Should admins be able to view all waitlist entries?
- Q2: Should there be a way to remove yourself from the waitlist?
- Q3: Should the waitlist entry include any additional user information (email, reason for interest)?
