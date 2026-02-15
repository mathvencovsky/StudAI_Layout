# Technical Spec: Track Search

## 0. Summary

**Goal:** Add a search bar to the tracks list page that filters tracks by title and description as the user types.  
**Out of scope:** Server-side search, search history, advanced filters (by date, owner, etc.).

## 1. Technical Design

### 1.1 Amplify schema changes

No schema changes required. Search will be performed client-side on the existing track data.

### 1.2 Type definitions

No new type definitions required.

### 1.3 API / Data fetching changes

No API changes required. The existing `useTracks` hook already fetches all tracks.

### 1.4 Page changes

No page changes required. The `TrackList` component will handle the search functionality internally.

### 1.5 Component changes

**`src/components/track/track-list.tsx`** - Add search input and filtering logic

```tsx
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useTracks } from "@/hooks/track/use-tracks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export interface TrackListProps {
  onCreateTrack?: () => void;
}

/**
 * Displays a list of tracks with search and optional create button
 */
export const TrackList = ({ onCreateTrack }: TrackListProps) => {
  const { t } = useTranslation();
  const { data: tracks, isLoading, isError } = useTracks();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTracks = useMemo(() => {
    if (!tracks) return [];
    if (!searchQuery.trim()) return tracks;

    const query = searchQuery.toLowerCase();
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(query) ||
        track.description.toLowerCase().includes(query),
    );
  }, [tracks, searchQuery]);

  const renderContent = () => {
    if (isLoading) {
      return <div>{t("loading")}</div>;
    }

    if (isError) {
      return <div>{t("error-loading-tracks")}</div>;
    }

    if (tracks?.length === 0) {
      return <p className="text-muted-foreground">{t("no-tracks")}</p>;
    }

    if (filteredTracks.length === 0) {
      return <p className="text-muted-foreground">{t("no-tracks-match-search")}</p>;
    }

    return (
      <div className="grid gap-4">
        {filteredTracks.map((track) => (
          <Card
            key={track.id}
            className="cursor-pointer hover:bg-accent"
            onClick={() =>
              navigate({
                to: "/track/$trackId",
                params: { trackId: track.id },
              })
            }
          >
            <CardHeader>
              <CardTitle>{track.title}</CardTitle>
              <CardDescription>{track.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("tracks")}</h1>
        {onCreateTrack && (
          <Button onClick={onCreateTrack}>{t("create-track")}</Button>
        )}
      </div>
      <Input
        placeholder={t("search-tracks")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {renderContent()}
    </div>
  );
};
```

### 1.6 Translation keys

| Key                      | EN                                      | PT-BR                                        |
| ------------------------ | --------------------------------------- | -------------------------------------------- |
| `no-tracks-match-search` | No tracks match your search             | Nenhuma trilha corresponde à sua pesquisa    |
| `search-tracks`          | Search tracks by title or description   | Pesquisar trilhas por título ou descrição    |

## 2. Acceptance Criteria

### AC1: Search bar is visible on tracks page

**Given** a user navigates to the tracks page  
**When** the page loads  
**Then** they see a search input field below the page header

### AC2: Filtering tracks by title

**Given** a user is on the tracks page with multiple tracks  
**When** they type a search term that matches a track title  
**Then** only tracks with matching titles are displayed

### AC3: Filtering tracks by description

**Given** a user is on the tracks page with multiple tracks  
**When** they type a search term that matches a track description  
**Then** only tracks with matching descriptions are displayed

### AC4: Case-insensitive search

**Given** a user is on the tracks page  
**When** they type a search term in any case (upper, lower, mixed)  
**Then** the search matches tracks regardless of case

### AC5: Empty search shows all tracks

**Given** a user has entered a search term  
**When** they clear the search input  
**Then** all tracks are displayed again

### AC6: No results message

**Given** a user is on the tracks page with tracks available  
**When** they type a search term that matches no tracks  
**Then** they see a "No tracks match your search" message

### Edge cases

- E1: Search with only whitespace shows all tracks
- E2: Search input is disabled while tracks are loading
- E3: Search input is hidden when there's an error loading tracks

## 3. Implementation Tasks

### 3.1 `src/i18n/locales/en/common.ts` - Add English translations

Add new translation keys for track search.

```ts
"no-tracks-match-search": "No tracks match your search",
"search-tracks": "Search tracks by title or description",
```

### 3.2 `src/i18n/locales/pt-BR/common.ts` - Add Portuguese translations

Add new translation keys for track search.

```ts
"no-tracks-match-search": "Nenhuma trilha corresponde à sua pesquisa",
"search-tracks": "Pesquisar trilhas por título ou descrição",
```

### 3.3 `src/components/track/track-list.tsx` - Add search functionality

- Add `useState` for `searchQuery`
- Add `useMemo` to filter tracks based on search query
- Add `Input` component for search
- Update render logic to show filtered results and "no results" message

## 4. Execution Order

- [x] 3.1 Add English translations
- [x] 3.2 Add Portuguese translations
- [x] 3.3 Update TrackList component with search functionality

## 5. Side Navigation

No side navigation changes required.

## 6. Open Questions and missing details

None.
