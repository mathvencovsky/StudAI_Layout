# Technical Spec: Favourites

## 0. Summary

**Goal:** Allow users to favourite contents and modules with a heart icon, display favourited state on detail pages, and provide a dedicated favourites page listing all favourited items.

**Out of scope:** Favouriting tracks, sorting/filtering favourites, notifications for favourited items.

## 1. Technical Design

### 1.1 Amplify schema changes

Add two separate models for content and module favourites:

```ts
// amplify/data/resource.ts
FavouriteContent: a
  .model({
    contentId: a.id().required(),
    content: a.belongsTo("Content", "contentId"),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),

FavouriteModule: a
  .model({
    moduleId: a.id().required(),
    module: a.belongsTo("Module", "moduleId"),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

Also add the reverse relationships to Content and Module models:

```ts
// In Content model, add:
favourites: a.hasMany("FavouriteContent", "contentId"),

// In Module model, add:
favourites: a.hasMany("FavouriteModule", "moduleId"),
```

### 1.2 Type definitions

Create model files for each favourite type:

```ts
// src/model/favourite-content.ts
import { type Schema } from "../../amplify/data/resource";

export type FavouriteContent = Schema["FavouriteContent"]["type"];
export type FavouriteContentIdentifier =
  Schema["FavouriteContent"]["identifier"];
export type FavouriteContentCreateInput =
  Schema["FavouriteContent"]["createType"];
export type FavouriteContentDeleteInput =
  Schema["FavouriteContent"]["deleteType"];
```

```ts
// src/model/favourite-module.ts
import { type Schema } from "../../amplify/data/resource";

export type FavouriteModule = Schema["FavouriteModule"]["type"];
export type FavouriteModuleIdentifier = Schema["FavouriteModule"]["identifier"];
export type FavouriteModuleCreateInput =
  Schema["FavouriteModule"]["createType"];
export type FavouriteModuleDeleteInput =
  Schema["FavouriteModule"]["deleteType"];
```

### 1.3 API / Data fetching changes

#### API functions

```ts
// src/api/favourite-content.ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type FavouriteContent,
  type FavouriteContentCreateInput,
  type FavouriteContentDeleteInput,
} from "@/model/favourite-content";

const client = generateClient<Schema>();

/**
 * Lists all favourite contents for the current user
 */
export const listFavouriteContents = async (): Promise<FavouriteContent[]> => {
  const result = await client.models.FavouriteContent.list();
  return result.data ?? [];
};

/**
 * Gets a favourite content by content ID
 */
export const getFavouriteContent = async (
  contentId: string,
): Promise<FavouriteContent | null> => {
  const result = await client.models.FavouriteContent.list({
    filter: { contentId: { eq: contentId } },
  });
  return result.data?.[0] ?? null;
};

/**
 * Creates a new favourite content
 */
export const createFavouriteContent = async (
  input: FavouriteContentCreateInput,
): Promise<FavouriteContent> => {
  const result = await client.models.FavouriteContent.create(input);
  if (!result.data) {
    throw new Error("Failed to create favourite content");
  }
  return result.data;
};

/**
 * Deletes a favourite content
 */
export const deleteFavouriteContent = async (
  input: FavouriteContentDeleteInput,
): Promise<void> => {
  await client.models.FavouriteContent.delete(input);
};
```

```ts
// src/api/favourite-module.ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type FavouriteModule,
  type FavouriteModuleCreateInput,
  type FavouriteModuleDeleteInput,
} from "@/model/favourite-module";

const client = generateClient<Schema>();

/**
 * Lists all favourite modules for the current user
 */
export const listFavouriteModules = async (): Promise<FavouriteModule[]> => {
  const result = await client.models.FavouriteModule.list();
  return result.data ?? [];
};

/**
 * Gets a favourite module by module ID
 */
export const getFavouriteModule = async (
  moduleId: string,
): Promise<FavouriteModule | null> => {
  const result = await client.models.FavouriteModule.list({
    filter: { moduleId: { eq: moduleId } },
  });
  return result.data?.[0] ?? null;
};

/**
 * Creates a new favourite module
 */
export const createFavouriteModule = async (
  input: FavouriteModuleCreateInput,
): Promise<FavouriteModule> => {
  const result = await client.models.FavouriteModule.create(input);
  if (!result.data) {
    throw new Error("Failed to create favourite module");
  }
  return result.data;
};

/**
 * Deletes a favourite module
 */
export const deleteFavouriteModule = async (
  input: FavouriteModuleDeleteInput,
): Promise<void> => {
  await client.models.FavouriteModule.delete(input);
};
```

#### React Query hooks

```ts
// src/hooks/favourites/use-list-favourite-contents.ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { listFavouriteContents } from "@/api/favourite-content";

export const listFavouriteContentsQueryOptions = () =>
  queryOptions({
    queryKey: ["favourite-contents"],
    queryFn: listFavouriteContents,
  });

export const useListFavouriteContents = () =>
  useQuery(listFavouriteContentsQueryOptions());
```

```ts
// src/hooks/favourites/use-list-favourite-modules.ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { listFavouriteModules } from "@/api/favourite-module";

export const listFavouriteModulesQueryOptions = () =>
  queryOptions({
    queryKey: ["favourite-modules"],
    queryFn: listFavouriteModules,
  });

export const useListFavouriteModules = () =>
  useQuery(listFavouriteModulesQueryOptions());
```

```ts
// src/hooks/favourites/use-get-favourite-content.ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getFavouriteContent } from "@/api/favourite-content";

export const getFavouriteContentQueryOptions = (contentId: string) =>
  queryOptions({
    queryKey: ["favourite-content", contentId],
    queryFn: () => getFavouriteContent(contentId),
    enabled: !!contentId,
  });

export const useGetFavouriteContent = (contentId: string) =>
  useQuery(getFavouriteContentQueryOptions(contentId));
```

```ts
// src/hooks/favourites/use-get-favourite-module.ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getFavouriteModule } from "@/api/favourite-module";

export const getFavouriteModuleQueryOptions = (moduleId: string) =>
  queryOptions({
    queryKey: ["favourite-module", moduleId],
    queryFn: () => getFavouriteModule(moduleId),
    enabled: !!moduleId,
  });

export const useGetFavouriteModule = (moduleId: string) =>
  useQuery(getFavouriteModuleQueryOptions(moduleId));
```

```ts
// src/hooks/favourites/use-toggle-favourite-content.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFavouriteContent,
  deleteFavouriteContent,
  getFavouriteContent,
} from "@/api/favourite-content";

export const useToggleFavouriteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: string) => {
      const existing = await getFavouriteContent(contentId);
      if (existing) {
        await deleteFavouriteContent({ id: existing.id });
        return null;
      }
      return createFavouriteContent({ contentId });
    },
    onSuccess: (_, contentId) => {
      queryClient.invalidateQueries({
        queryKey: ["favourite-content", contentId],
      });
      queryClient.invalidateQueries({ queryKey: ["favourite-contents"] });
    },
  });
};
```

```ts
// src/hooks/favourites/use-toggle-favourite-module.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFavouriteModule,
  deleteFavouriteModule,
  getFavouriteModule,
} from "@/api/favourite-module";

export const useToggleFavouriteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleId: string) => {
      const existing = await getFavouriteModule(moduleId);
      if (existing) {
        await deleteFavouriteModule({ id: existing.id });
        return null;
      }
      return createFavouriteModule({ moduleId });
    },
    onSuccess: (_, moduleId) => {
      queryClient.invalidateQueries({
        queryKey: ["favourite-module", moduleId],
      });
      queryClient.invalidateQueries({ queryKey: ["favourite-modules"] });
    },
  });
};
```

### 1.4 Page changes

#### New favourites page

Create a new favourites page at `/favourites`:

```
src/routes/
  favourites.tsx          # Parent layout with breadcrumb
  favourites/
    index.tsx             # Favourites list page
```

```tsx
// src/routes/favourites.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/favourites")({
  component: RouteComponent,
  loader: () => ({ crumb: "Favourites" }),
});

function RouteComponent() {
  return <Outlet />;
}
```

```tsx
// src/routes/favourites/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { FavouritesListContainer } from "@/components/favourites/favourites-list-container";

export const Route = createFileRoute("/favourites/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FavouritesListContainer />;
}
```

#### Module detail page

Update `ModuleHeader` to include the favourite button.

#### Content detail page

Update `ContentHeader` to include the favourite button.

### 1.5 Component changes

#### FavouriteContentButton component

```tsx
// src/components/favourites/favourite-content-button.tsx
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetFavouriteContent } from "@/hooks/favourites/use-get-favourite-content";
import { useToggleFavouriteContent } from "@/hooks/favourites/use-toggle-favourite-content";
import { cn } from "@/lib/utils";

export interface FavouriteContentButtonProps {
  contentId: string;
}

export const FavouriteContentButton = ({
  contentId,
}: FavouriteContentButtonProps) => {
  const { t } = useTranslation();
  const { data: favourite } = useGetFavouriteContent(contentId);
  const toggleMutation = useToggleFavouriteContent();

  const isFavourited = !!favourite;

  const handleClick = () => {
    toggleMutation.mutate(contentId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={toggleMutation.isPending}
      aria-label={t(
        isFavourited ? "remove-from-favourites" : "add-to-favourites",
      )}
    >
      <Heart
        className={cn("h-5 w-5", isFavourited && "fill-current text-primary")}
      />
    </Button>
  );
};
```

#### FavouriteModuleButton component

```tsx
// src/components/favourites/favourite-module-button.tsx
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetFavouriteModule } from "@/hooks/favourites/use-get-favourite-module";
import { useToggleFavouriteModule } from "@/hooks/favourites/use-toggle-favourite-module";
import { cn } from "@/lib/utils";

export interface FavouriteModuleButtonProps {
  moduleId: string;
}

export const FavouriteModuleButton = ({
  moduleId,
}: FavouriteModuleButtonProps) => {
  const { t } = useTranslation();
  const { data: favourite } = useGetFavouriteModule(moduleId);
  const toggleMutation = useToggleFavouriteModule();

  const isFavourited = !!favourite;

  const handleClick = () => {
    toggleMutation.mutate(moduleId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={toggleMutation.isPending}
      aria-label={t(
        isFavourited ? "remove-from-favourites" : "add-to-favourites",
      )}
    >
      <Heart
        className={cn("h-5 w-5", isFavourited && "fill-current text-primary")}
      />
    </Button>
  );
};
```

#### FavouritesListContainer component

```tsx
// src/components/favourites/favourites-list-container.tsx
import { useTranslation } from "react-i18next";
import { useListFavouriteContents } from "@/hooks/favourites/use-list-favourite-contents";
import { useListFavouriteModules } from "@/hooks/favourites/use-list-favourite-modules";
import { FavouriteContentsList } from "./favourite-contents-list";
import { FavouriteModulesList } from "./favourite-modules-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const FavouritesListContainer = () => {
  const { t } = useTranslation();
  const {
    data: favouriteContents,
    isLoading: isContentsLoading,
    isError: isContentsError,
  } = useListFavouriteContents();
  const {
    data: favouriteModules,
    isLoading: isModulesLoading,
    isError: isModulesError,
  } = useListFavouriteModules();

  const isLoading = isContentsLoading || isModulesLoading;
  const isError = isContentsError || isModulesError;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("error")}</AlertTitle>
        <AlertDescription>{t("couldnt-load-favourites")}</AlertDescription>
      </Alert>
    );
  }

  const hasNoFavourites =
    (!favouriteContents || favouriteContents.length === 0) &&
    (!favouriteModules || favouriteModules.length === 0);

  if (hasNoFavourites) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {t("no-favourites")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {favouriteModules && favouriteModules.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("modules")}</h2>
          <FavouriteModulesList favourites={favouriteModules} />
        </section>
      )}
      {favouriteContents && favouriteContents.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("contents")}</h2>
          <FavouriteContentsList favourites={favouriteContents} />
        </section>
      )}
    </div>
  );
};
```

#### FavouriteContentsList component

```tsx
// src/components/favourites/favourite-contents-list.tsx
import { type FavouriteContent } from "@/model/favourite-content";
import { FavouriteContentItem } from "./favourite-content-item";

export interface FavouriteContentsListProps {
  favourites: FavouriteContent[];
}

export const FavouriteContentsList = ({
  favourites,
}: FavouriteContentsListProps) => {
  return (
    <div className="space-y-4">
      {favourites.map((favourite) => (
        <FavouriteContentItem key={favourite.id} favourite={favourite} />
      ))}
    </div>
  );
};
```

#### FavouriteModulesList component

```tsx
// src/components/favourites/favourite-modules-list.tsx
import { type FavouriteModule } from "@/model/favourite-module";
import { FavouriteModuleItem } from "./favourite-module-item";

export interface FavouriteModulesListProps {
  favourites: FavouriteModule[];
}

export const FavouriteModulesList = ({
  favourites,
}: FavouriteModulesListProps) => {
  return (
    <div className="space-y-4">
      {favourites.map((favourite) => (
        <FavouriteModuleItem key={favourite.id} favourite={favourite} />
      ))}
    </div>
  );
};
```

#### FavouriteContentItem component

```tsx
// src/components/favourites/favourite-content-item.tsx
import { useNavigate } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetContent } from "@/hooks/content/use-get-content";
import { type FavouriteContent } from "@/model/favourite-content";
import { FavouriteContentButton } from "./favourite-content-button";
import { Skeleton } from "@/components/ui/skeleton";

export interface FavouriteContentItemProps {
  favourite: FavouriteContent;
}

export const FavouriteContentItem = ({
  favourite,
}: FavouriteContentItemProps) => {
  const navigate = useNavigate();
  const { data: content, isLoading } = useGetContent(favourite.contentId);

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!content) return null;

  const handleClick = () => {
    navigate({
      to: "/content/$contentId",
      params: { contentId: favourite.contentId },
    });
  };

  return (
    <Card className="cursor-pointer hover:bg-accent/50" onClick={handleClick}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{content.title}</CardTitle>
        <div onClick={(e) => e.stopPropagation()}>
          <FavouriteContentButton contentId={favourite.contentId} />
        </div>
      </CardHeader>
    </Card>
  );
};
```

#### FavouriteModuleItem component

```tsx
// src/components/favourites/favourite-module-item.tsx
import { useNavigate } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useModule } from "@/hooks/modules/use-module";
import { type FavouriteModule } from "@/model/favourite-module";
import { FavouriteModuleButton } from "./favourite-module-button";
import { Skeleton } from "@/components/ui/skeleton";

export interface FavouriteModuleItemProps {
  favourite: FavouriteModule;
}

export const FavouriteModuleItem = ({
  favourite,
}: FavouriteModuleItemProps) => {
  const navigate = useNavigate();
  const { data: module, isLoading } = useModule(favourite.moduleId);

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!module) return null;

  const handleClick = () => {
    navigate({
      to: "/module/$moduleId",
      params: { moduleId: favourite.moduleId },
    });
  };

  return (
    <Card className="cursor-pointer hover:bg-accent/50" onClick={handleClick}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{module.title}</CardTitle>
        <div onClick={(e) => e.stopPropagation()}>
          <FavouriteModuleButton moduleId={favourite.moduleId} />
        </div>
      </CardHeader>
    </Card>
  );
};
```

#### Update ModuleHeader

Add `FavouriteModuleButton` to the module header:

```tsx
// src/components/modules/module-header.tsx
// Add import
import { FavouriteModuleButton } from "@/components/favourites/favourite-module-button";

// Add to CardHeader, next to the title
<div className="flex items-center gap-2">
  <CardTitle>{module.title}</CardTitle>
  <FavouriteModuleButton moduleId={module.id} />
</div>;
```

#### Update ContentHeader

Add `FavouriteContentButton` to the content header:

```tsx
// src/components/content/content-metadata.tsx
// Add import
import { FavouriteContentButton } from "@/components/favourites/favourite-content-button";

// Add to the title row
<div className="flex items-center gap-2">
  <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
  <FavouriteContentButton contentId={content.id} />
  {/* existing completion button */}
</div>;
```

### 1.6 Translation keys

| Key                       | Usage                             |
| ------------------------- | --------------------------------- |
| `favourites`              | Sidebar item and page title       |
| `add-to-favourites`       | Aria label for unfavourited state |
| `remove-from-favourites`  | Aria label for favourited state   |
| `no-favourites`           | Empty state message               |
| `couldnt-load-favourites` | Error message                     |
| `contents`                | Section header on favourites page |

## 2. Acceptance Criteria

### AC1: Favourite a module

**Given** a user is on a module detail page  
**When** they click the heart icon  
**Then** the heart icon fills with the theme primary color and the module is saved to favourites

### AC2: Unfavourite a module

**Given** a user has favourited a module  
**When** they click the filled heart icon  
**Then** the heart icon becomes unfilled and the module is removed from favourites

### AC3: Favourite a content

**Given** a user is on a content detail page  
**When** they click the heart icon  
**Then** the heart icon fills with the theme primary color and the content is saved to favourites

### AC4: View favourites page

**Given** a user has favourited items  
**When** they navigate to the favourites page  
**Then** they see a list of all favourited modules and contents

### AC5: Navigate from favourites

**Given** a user is on the favourites page  
**When** they click on a favourited item  
**Then** they are navigated to the detail page of that item

### AC6: Favourite state persists

**Given** a user has favourited a module or content  
**When** they navigate away and return to the detail page  
**Then** the heart icon is still filled

### Edge cases

- E1: User tries to favourite while offline - show error, don't update UI
- E2: Favourited item is deleted - item should not appear in favourites list
- E3: Empty favourites list - show "no favourites" message

## 3. Implementation Tasks

### 3.1 `amplify/data/resource.ts` - Add Favourite models

Add the FavouriteContent and FavouriteModule models to the schema:

```ts
FavouriteContent: a
  .model({
    contentId: a.id().required(),
    content: a.belongsTo("Content", "contentId"),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),

FavouriteModule: a
  .model({
    moduleId: a.id().required(),
    module: a.belongsTo("Module", "moduleId"),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [allow.owner()]),
```

Add reverse relationships to Content and Module models:

```ts
// In Content model:
favourites: a.hasMany("FavouriteContent", "contentId"),

// In Module model:
favourites: a.hasMany("FavouriteModule", "moduleId"),
```

### 3.2 `src/model/favourite-content.ts` - Create type definitions

Create the model file with schema-inferred types for FavouriteContent.

### 3.3 `src/model/favourite-module.ts` - Create type definitions

Create the model file with schema-inferred types for FavouriteModule.

### 3.4 `src/api/favourite-content.ts` - Create API functions

Create functions for listing, getting, creating, and deleting favourite contents.

### 3.5 `src/api/favourite-module.ts` - Create API functions

Create functions for listing, getting, creating, and deleting favourite modules.

### 3.6 `src/hooks/favourites/use-list-favourite-contents.ts` - Create list hook

Create React Query hook for listing favourite contents.

### 3.7 `src/hooks/favourites/use-list-favourite-modules.ts` - Create list hook

Create React Query hook for listing favourite modules.

### 3.8 `src/hooks/favourites/use-get-favourite-content.ts` - Create get hook

Create React Query hook for getting a single favourite content.

### 3.9 `src/hooks/favourites/use-get-favourite-module.ts` - Create get hook

Create React Query hook for getting a single favourite module.

### 3.10 `src/hooks/favourites/use-toggle-favourite-content.ts` - Create toggle mutation

Create React Query mutation for toggling favourite content state.

### 3.11 `src/hooks/favourites/use-toggle-favourite-module.ts` - Create toggle mutation

Create React Query mutation for toggling favourite module state.

### 3.12 `src/components/favourites/favourite-content-button.tsx` - Create button component

Create the heart icon button component for content.

### 3.13 `src/components/favourites/favourite-module-button.tsx` - Create button component

Create the heart icon button component for modules.

### 3.14 `src/components/favourites/favourites-list-container.tsx` - Create container

Create the container component for the favourites page.

### 3.15 `src/components/favourites/favourite-contents-list.tsx` - Create list component

Create the list component for rendering favourite contents.

### 3.16 `src/components/favourites/favourite-modules-list.tsx` - Create list component

Create the list component for rendering favourite modules.

### 3.17 `src/components/favourites/favourite-content-item.tsx` - Create item component

Create the item component for individual favourite contents.

### 3.18 `src/components/favourites/favourite-module-item.tsx` - Create item component

Create the item component for individual favourite modules.

### 3.19 `src/routes/favourites.tsx` - Create parent layout route

Create the parent layout route with breadcrumb.

### 3.20 `src/routes/favourites/index.tsx` - Create favourites page

Create the favourites index page.

### 3.21 `src/components/modules/module-header.tsx` - Add favourite button

Add the FavouriteModuleButton to the module header.

### 3.22 `src/components/content/content-metadata.tsx` - Add favourite button

Add the FavouriteContentButton to the content header.

### 3.23 `src/components/layout/app-sidebar.tsx` - Add sidebar item

Add favourites navigation item to the sidebar.

### 3.24 `src/i18n/locales/en/translation.ts` - Add English translations

Add translation keys for favourites feature.

### 3.25 `src/i18n/locales/pt-BR/translation.ts` - Add Portuguese translations

Add translation keys for favourites feature.

## 4. Execution Order

- [x] 3.1 - Add Favourite models to schema
- [x] 3.2 - Create favourite-content type definitions
- [x] 3.3 - Create favourite-module type definitions
- [x] 3.4 - Create favourite-content API functions
- [x] 3.5 - Create favourite-module API functions
- [x] 3.6 - Create use-list-favourite-contents hook
- [x] 3.7 - Create use-list-favourite-modules hook
- [ ] 3.8 - Create use-get-favourite-content hook
- [ ] 3.9 - Create use-get-favourite-module hook
- [ ] 3.10 - Create use-toggle-favourite-content mutation
- [ ] 3.11 - Create use-toggle-favourite-module mutation
- [ ] 3.12 - Create favourite-content-button component
- [ ] 3.13 - Create favourite-module-button component
- [ ] 3.14 - Create favourites-list-container component
- [ ] 3.15 - Create favourite-contents-list component
- [ ] 3.16 - Create favourite-modules-list component
- [ ] 3.17 - Create favourite-content-item component
- [ ] 3.18 - Create favourite-module-item component
- [ ] 3.19 - Create favourites parent layout route
- [ ] 3.20 - Create favourites index page
- [ ] 3.21 - Add favourite button to module header
- [ ] 3.22 - Add favourite button to content header
- [ ] 3.23 - Add favourites to sidebar
- [ ] 3.24 - Add English and portuguese translations

## 5. Sidebar

Yes, this feature requires a new sidebar item:

- **Label:** `t("favourites")`
- **Icon:** `IconHeart` from `@tabler/icons-react`
- **Route:** `/favourites`
- **Placement:** In `navMain` array, after "Modules"

```tsx
{
  title: t("favourites"),
  onClick: () => {
    setOpen(false);
    setOpenMobile(false);
    navigate({ to: "/favourites" });
  },
  icon: IconHeart,
},
```

## 6. Open Questions and missing details

- Q1: Should the favourites page group items by type (modules vs contents) or show them in a single mixed list sorted by date? Should show 2 separete lists
- Q2: Should there be a limit on the number of favourites a user can have? No
- Q3: Should the favourite button show a loading spinner while toggling, or use optimistic updates? Yes
