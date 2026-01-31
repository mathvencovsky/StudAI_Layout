# Technical Spec: Auto-fill YouTube Metadata in Content Form

## 0. Summary

**Goal:** Add a button to the content creation form that, when a YouTube video link is provided, automatically fetches and populates the form fields (title, description, duration, etc.) using the existing YouTube metadata extraction code. This feature is only visible to admin users.  
**Out of scope:** Auto-fill for non-YouTube links, automatic detection without user action.

## 1. Technical Design

### 1.1 Amplify schema changes

No schema changes required.

### 1.2 Type definitions

No new type definitions required. Existing `ExtractedMetadata` from `src/api/metadata/types.ts` will be used.

### 1.3 API / Data fetching changes

Create a new React Query hook to fetch YouTube metadata:

**`src/api/metadata/fetch-youtube-metadata.ts`**

```ts
import {
  fetchFromMattwApi,
  getYouTubeVideoId,
} from "@/api/youtube";
import { type ExtractedMetadata } from "@/api/metadata/types";

/**
 * Fetches YouTube metadata for a given URL
 */
export const fetchYouTubeMetadata = async (
  url: string,
): Promise<ExtractedMetadata | null> => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }
  return fetchFromMattwApi(url, videoId);
};
```

**`src/hooks/content/use-fetch-youtube-metadata.ts`**

```ts
import { useMutation } from "@tanstack/react-query";
import { fetchYouTubeMetadata } from "@/api/metadata/fetch-youtube-metadata";

export const useFetchYouTubeMetadata = () => {
  return useMutation({
    mutationFn: fetchYouTubeMetadata,
  });
};
```

### 1.4 Page changes

No page changes required.

### 1.5 Component changes

**`src/components/content/forms/content-form.tsx`** - Add auto-fill button next to link field (admin only):

```tsx
import { useFetchYouTubeMetadata } from "@/hooks/content/use-fetch-youtube-metadata";
import { getYouTubeVideoId } from "@/api/metadata/youtube";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";

// Inside component:
const isAdminUser = useIsAdminUser();
const [autoFillError, setAutoFillError] = useState<string | null>(null);
const linkValue = useWatch({ control, name: "link" });
const fetchMetadataMutation = useFetchYouTubeMetadata();

const isYouTubeLink = linkValue ? !!getYouTubeVideoId(linkValue) : false;

const handleAutoFill = () => {
  if (!linkValue) return;
  setAutoFillError(null);
  fetchMetadataMutation.mutate(linkValue, {
    onSuccess: (metadata) => {
      if (!metadata) return;
      if (metadata.title) setValue("title", metadata.title);
      if (metadata.description) setValue("description", metadata.description);
      if (metadata.durationInSeconds)
        setValue("durationInSeconds", metadata.durationInSeconds);
      if (metadata.image) setValue("thumbnailUrl", metadata.image);
      if (metadata.author) setValue("author", metadata.author);
      if (metadata.publishedAt) setValue("publishedAt", metadata.publishedAt);
      if (metadata.language) setValue("language", metadata.language);
    },
    onError: (error) => {
      console.error("Failed to fetch YouTube metadata:", error);
      setAutoFillError(t("auto-fill-failed"));
    },
  });
};

// In JSX, next to link input:
<div className="flex gap-2">
  <Input id="link" {...register("link")} className="flex-1" />
  {isAdminUser && (
    <Button
      type="button"
      variant="outline"
      onClick={handleAutoFill}
      disabled={!isYouTubeLink || fetchMetadataMutation.isPending}
    >
      {fetchMetadataMutation.isPending
        ? t("loading")
        : t("auto-fill-from-youtube")}
    </Button>
  )}
</div>
{autoFillError && (
  <p className="text-sm text-red-600 mt-1">{autoFillError}</p>
)}
```

### 1.6 Translation keys

| Key                      | EN                        | PT-BR                                    |
| ------------------------ | ------------------------- | ---------------------------------------- |
| `auto-fill-from-youtube` | Auto-fill from video      | Preencher do vídeo                       |
| `loading`                | Loading...                | Carregando...                            |
| `auto-fill-failed`       | Could not load video data | Não foi possível carregar dados do vídeo |

## 2. Acceptance Criteria

### AC1: Auto-fill button appears for YouTube links (admin only)

**Given** an admin user is creating content  
**When** they enter a valid YouTube URL in the link field  
**Then** an "Auto-fill from video" button becomes enabled

### AC2: Auto-fill populates form fields

**Given** an admin user has entered a valid YouTube URL  
**When** they click the "Auto-fill from video" button  
**Then** the following fields are populated with YouTube metadata: title, description, durationInSeconds, thumbnailUrl, author, publishedAt, language

### AC3: Button is disabled for non-YouTube links

**Given** an admin user is creating content  
**When** the link field is empty or contains a non-YouTube URL  
**Then** the auto-fill button is disabled

### AC4: Loading state during fetch

**Given** an admin user clicks the auto-fill button  
**When** the metadata is being fetched  
**Then** the button shows a loading state and is disabled

### AC5: Button is hidden for non-admin users

**Given** a non-admin user is creating content  
**When** they view the content form  
**Then** the auto-fill button is not visible

### Edge cases

- E1: If metadata extraction fails, form values remain unchanged and error message is shown
- E2: If some metadata fields are missing, only available fields are populated
- E3: Button should work in both create and edit modes

## 3. Implementation Tasks

### 3.1 `src/api/metadata/fetch-youtube-metadata.ts` - Create fetch function

```ts
import {
  fetchFromMattwApi,
  getYouTubeVideoId,
} from "@/api/youtube";
import { type ExtractedMetadata } from "@/api/metadata/types";

/**
 * Fetches YouTube metadata for a given URL
 */
export const fetchYouTubeMetadata = async (
  url: string,
): Promise<ExtractedMetadata | null> => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }
  return fetchFromMattwApi(url, videoId);
};
```

### 3.2 `src/hooks/content/use-fetch-youtube-metadata.ts` - Create mutation hook

```ts
import { useMutation } from "@tanstack/react-query";
import { fetchYouTubeMetadata } from "@/api/metadata/fetch-youtube-metadata";

export const useFetchYouTubeMetadata = () => {
  return useMutation({
    mutationFn: fetchYouTubeMetadata,
  });
};
```

### 3.3 `src/components/content/forms/content-form.tsx` - Add auto-fill functionality

- Import `useFetchYouTubeMetadata` hook, `getYouTubeVideoId`, and `useIsAdminUser`
- Add `autoFillError` state for error display
- Add `useWatch` for link field to detect YouTube URLs (replace existing `watch` usage with `useWatch`)
- Add `handleAutoFill` function to fetch and populate form fields: title, description, durationInSeconds, thumbnailUrl (from `image`), author, publishedAt, language
- Add `onError` handler to set error message
- Add Button next to link input with loading state (only visible to admin users)
- Add error message display below link input

### 3.4 `src/i18n/locales/en/common.ts` - Add English translations

```ts
"auto-fill-from-youtube": "Auto-fill from video",
"loading": "Loading...",
"auto-fill-failed": "Could not load video data",
```

### 3.5 `src/i18n/locales/pt-BR/common.ts` - Add Portuguese translations

```ts
"auto-fill-from-youtube": "Preencher do vídeo",
"loading": "Carregando...",
"auto-fill-failed": "Não foi possível carregar dados do vídeo",
```

### 3.6 `src/api/youtube.ts` - Export fetchFromMattwApi

Export the existing `fetchFromMattwApi` function so it can be imported by other modules.

## 4. Execution Order

- [x] Export `fetchFromMattwApi` (`src/api/youtube.ts`)
- [x] Create fetch function (`src/api/metadata/fetch-youtube-metadata.ts`)
- [x] Create mutation hook (`src/hooks/content/use-fetch-youtube-metadata.ts`)
- [x] Update content form (`src/components/content/forms/content-form.tsx`)
- [x] Add translations (en and pt-BR)

## 5. Open Questions and missing details

- ~~Q1: Should the auto-fill overwrite existing values or only fill empty fields?~~ Override existing values.
- ~~Q2: Should there be a confirmation dialog before overwriting existing values?~~ No dialog needed.
