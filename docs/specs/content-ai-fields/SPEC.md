# Technical Spec: Content AI Fields and Tabbed Detail View

## 0. Summary

**Goal:** Add optional `aiTranscript` and `aiSummary` fields to Content, update forms to include these fields, and refactor the content detail page to use tabs for description, AI transcript, and AI summary with a hide-all toggle button.

**Out of scope:** AI generation of transcript/summary content, auto-population of these fields.

## 1. Technical Design

### 1.1 Amplify schema changes

Add two optional string fields to the Content model:

```ts
// amplify/data/resource.ts
Content: a.model({
  // ... existing fields
  aiTranscript: a.string(),
  aiSummary: a.string(),
  // ...
});
```

### 1.2 Type definitions

No new types needed. The existing `Content`, `ContentCreateInput`, and `ContentUpdateInput` types will automatically include the new fields via schema inference.

### 1.3 API / Data fetching changes

No changes required. Existing `getContent`, `createContent`, and `updateContent` functions will automatically handle the new fields.

### 1.4 Page changes

**Route:** `/content/$contentId` (content detail page)

The `ContentDetailView` component will be updated to:

- Remove inline description display
- Add a tabbed interface with tabs for: Description, AI Transcript, AI Summary
- Add a "Hide" toggle button that collapses all tab content
- Disable AI Transcript and AI Summary tabs when their respective fields are empty/null

### 1.5 Component changes

#### `ContentForm` (`src/components/content/forms/content-form.tsx`)

Add two new Textarea fields for `aiTranscript` and `aiSummary`.

```tsx
export interface ContentFormProps {
  // ... existing props (no changes)
}

// Add fields in the form:
<div>
  <Label htmlFor="aiTranscript">{t("content-ai-transcript")}</Label>
  <Textarea id="aiTranscript" rows={6} placeholder={t("optional")} {...register("aiTranscript")} />
</div>

<div>
  <Label htmlFor="aiSummary">{t("content-ai-summary")}</Label>
  <Textarea id="aiSummary" rows={6} placeholder={t("optional")} {...register("aiSummary")} />
</div>
```

#### `ContentHeader` (`src/components/content/content-metadata.tsx`)

Remove the description paragraph from this component. The description will now be displayed in a tab.

```tsx
// Remove this line:
// <p className="text-muted-foreground whitespace-pre-wrap">{content.description}</p>
```

#### `ContentDetailTabs` (`src/components/content/content-detail-tabs.tsx`) - NEW

New component to display tabbed content with Description, AI Transcript, AI Summary tabs and a Hide toggle.

```tsx
export interface ContentDetailTabsProps {
  description: string;
  aiTranscript?: string | null;
  aiSummary?: string | null;
}

export const ContentDetailTabs = ({
  description,
  aiTranscript,
  aiSummary,
}: ContentDetailTabsProps) => {
  const { t } = useTranslation();
  const [isHidden, setIsHidden] = useState(false);

  return (
    <Tabs defaultValue="description">
      <TabsList>
        <TabsTrigger value="description">{t("description")}</TabsTrigger>
        <TabsTrigger value="ai-transcript" disabled={!aiTranscript}>
          {t("content-ai-transcript")}
        </TabsTrigger>
        <TabsTrigger value="ai-summary" disabled={!aiSummary}>
          {t("content-ai-summary")}
        </TabsTrigger>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsHidden(!isHidden)}
        >
          {isHidden ? t("show") : t("hide")}
        </Button>
      </TabsList>
      {!isHidden && (
        <>
          <TabsContent value="description">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {description}
            </p>
          </TabsContent>
          <TabsContent value="ai-transcript">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {aiTranscript}
            </p>
          </TabsContent>
          <TabsContent value="ai-summary">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {aiSummary}
            </p>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};
```

#### `ContentDetailView` (`src/components/content/content-detail-view.tsx`)

Update to include the new `ContentDetailTabs` component.

```tsx
import { ContentDetailTabs } from "./content-detail-tabs";

// In the component, add after ContentHeader:
<ContentDetailTabs
  description={content.description}
  aiTranscript={content.aiTranscript}
  aiSummary={content.aiSummary}
/>;
```

### 1.6 Translation keys

| Key                     | Purpose                           |
| ----------------------- | --------------------------------- |
| `content-ai-transcript` | Label for AI Transcript field/tab |
| `content-ai-summary`    | Label for AI Summary field/tab    |
| `hide`                  | Button text to hide tab content   |
| `show`                  | Button text to show tab content   |

### 1.7 Sidebar

No sidebar changes required.

## 2. Acceptance Criteria

### AC1: Schema includes new fields

**Given** the Amplify schema is deployed  
**When** a Content item is created or updated  
**Then** `aiTranscript` and `aiSummary` fields can be stored as optional strings

### AC2: Content form displays new fields

**Given** a user is on the content create or edit page  
**When** the form loads  
**Then** textarea fields for AI Transcript and AI Summary are visible

### AC3: Content detail page shows tabbed interface

**Given** a user navigates to a content detail page  
**When** the page loads  
**Then** tabs for Description, AI Transcript, and AI Summary are displayed along with a Hide button

### AC4: Tabs are disabled when content is empty

**Given** a content item has no `aiTranscript` value  
**When** the user views the content detail page  
**Then** the AI Transcript tab is disabled and cannot be selected

**Given** a content item has no `aiSummary` value  
**When** the user views the content detail page  
**Then** the AI Summary tab is disabled and cannot be selected

### AC5: Hide button toggles tab content visibility

**Given** a user is viewing the content detail page with tabs visible  
**When** the user clicks the Hide button  
**Then** all tab content is hidden and the button text changes to "Show"

**Given** tab content is hidden  
**When** the user clicks the Show button  
**Then** the selected tab content becomes visible again

### Edge cases

- E1: Content with all AI fields empty should show only Description tab enabled
- E2: Very long transcript/summary text should be scrollable within the tab content area
- E3: Hide state should not persist across page navigation

## 3. Implementation Tasks

### 3.1 `amplify/data/resource.ts` - Add AI fields to Content model

Add `aiTranscript` and `aiSummary` optional string fields.

```ts
Content: a.model({
  title: a.string().required(),
  description: a.string().required(),
  // ... existing fields
  aiTranscript: a.string(),
  aiSummary: a.string(),
  // ... rest of fields
});
```

### 3.2 `src/i18n/locales/en/common.ts` - Add English translations

```ts
"content-ai-summary": "AI Summary",
"content-ai-transcript": "AI Transcript",
"hide": "Hide",
"show": "Show",
```

### 3.3 `src/i18n/locales/pt-BR/common.ts` - Add Portuguese translations

```ts
"content-ai-summary": "Resumo IA",
"content-ai-transcript": "Transcrição IA",
"hide": "Ocultar",
"show": "Mostrar",
```

### 3.4 `src/components/content/forms/content-form.tsx` - Add form fields

Add two Textarea fields for `aiTranscript` and `aiSummary` after the existing fields.

```tsx
<div>
  <Label htmlFor="aiTranscript">{t("content-ai-transcript")}</Label>
  <Textarea
    id="aiTranscript"
    rows={6}
    placeholder={t("optional")}
    {...register("aiTranscript")}
  />
</div>

<div>
  <Label htmlFor="aiSummary">{t("content-ai-summary")}</Label>
  <Textarea
    id="aiSummary"
    rows={6}
    placeholder={t("optional")}
    {...register("aiSummary")}
  />
</div>
```

### 3.5 `src/components/content/content-detail-tabs.tsx` - Create new component

Create the tabbed interface component with hide toggle functionality.

```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export interface ContentDetailTabsProps {
  description: string;
  aiTranscript?: string | null;
  aiSummary?: string | null;
}

export const ContentDetailTabs = ({
  description,
  aiTranscript,
  aiSummary,
}: ContentDetailTabsProps) => {
  const { t } = useTranslation();
  const [isHidden, setIsHidden] = useState(false);

  return (
    <Tabs defaultValue="description">
      <TabsList>
        <TabsTrigger value="description">{t("description")}</TabsTrigger>
        <TabsTrigger value="ai-transcript" disabled={!aiTranscript}>
          {t("content-ai-transcript")}
        </TabsTrigger>
        <TabsTrigger value="ai-summary" disabled={!aiSummary}>
          {t("content-ai-summary")}
        </TabsTrigger>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsHidden(!isHidden)}
        >
          {isHidden ? t("show") : t("hide")}
        </Button>
      </TabsList>
      {!isHidden && (
        <>
          <TabsContent value="description">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {description}
            </p>
          </TabsContent>
          <TabsContent value="ai-transcript">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {aiTranscript}
            </p>
          </TabsContent>
          <TabsContent value="ai-summary">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {aiSummary}
            </p>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};
```

### 3.6 `src/components/content/content-metadata.tsx` - Remove description

Remove the description paragraph from `ContentHeader` component.

```tsx
// Remove this block:
// <p className="text-muted-foreground whitespace-pre-wrap">
//   {content.description}
// </p>
```

### 3.7 `src/components/content/content-detail-view.tsx` - Add tabs component

Import and render `ContentDetailTabs` after `ContentHeader`.

```tsx
import { ContentDetailTabs } from "./content-detail-tabs";

// In the component JSX, after ContentHeader:
<ContentDetailTabs
  description={content.description}
  aiTranscript={content.aiTranscript}
  aiSummary={content.aiSummary}
/>;
```

## 4. Execution Order

- [x] 3.1 - Update Amplify schema with new fields
- [x] 3.2 - Add English translations
- [x] 3.3 - Add Portuguese translations
- [x] 3.4 - Add form fields to ContentForm
- [x] 3.5 - Create ContentDetailTabs component
- [x] 3.6 - Remove description from ContentHeader
- [x] 3.7 - Integrate ContentDetailTabs in ContentDetailView

## 5. Open Questions and missing details

- Q1: Should the Hide button remember its state per content item (localStorage) or reset on each page load? Should reset
- Q2: Is there a maximum character limit for aiTranscript and aiSummary fields? No
- Q3: Should the tabs component have any specific styling or use the default shadcn tabs appearance? Default
