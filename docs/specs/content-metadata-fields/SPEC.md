# Technical Spec: Content Metadata Fields

## 0. Summary

**Goal:** Add common metadata fields (`thumbnailUrl`, `author`, `publishedAt`, `language`) to the Content model and display them across the application.  
**Out of scope:** Auto-detection of language from content, thumbnail generation.

## 1. Technical Design

### 1.1 Amplify schema changes

Add fields to `Content` model in `amplify/data/resource.ts`:

```ts
Content: a.model({
  // existing fields...
  thumbnailUrl: a.url(),
  author: a.string(),
  publishedAt: a.datetime(),
  language: a.string(),
});
```

### 1.2 Type definitions

Update `ExtractedMetadata` in `src/api/metadata/types.ts`:

```ts
export interface ExtractedMetadata {
  // existing fields...
  author?: string;
  publishedAt?: string;
  language?: string;
}
```

### 1.3 API / Data fetching changes

Update selection set in `src/api/module-content.ts`:

```ts
const moduleContentSelectionSet = [
  // existing fields...
  "content.thumbnailUrl",
  "content.author",
  "content.publishedAt",
  "content.language",
] as const;
```

Update YouTube metadata extraction in `src/api/youtube.ts`:

```ts
// Map YouTube API fields to ExtractedMetadata
return {
  // existing fields...
  author: snippet.channelTitle,
  publishedAt: snippet.publishedAt,
  language: snippet.defaultLanguage,
};
```

### 1.4 Page changes

No page changes required. Components handle display.

### 1.5 Component changes

**`src/components/content/forms/content-form.tsx`** - Add form fields:

```tsx
<Input name="thumbnailUrl" type="url" />
<Input name="author" type="text" />
<Input name="publishedAt" type="datetime-local" />
<Input name="language" type="text" />
```

**`src/components/content/content-metadata.tsx`** - Add display elements:

```tsx
{
  author && <Badge>{author}</Badge>;
}
{
  publishedAt && <span>{formatDate(publishedAt)}</span>;
}
{
  language && <Badge>{language}</Badge>;
}
```

**`src/components/content/content-csv-input.tsx`** - Update CSV import:

```tsx
interface CsvRow {
  // existing fields...
  thumbnailUrl?: string;
  author?: string;
  publishedAt?: string;
  language?: string;
}

const input: CreateContentInput = {
  // existing fields...
  thumbnailUrl: metadata?.image ?? row.thumbnailUrl,
  author: metadata?.author ?? row.author,
  publishedAt: metadata?.publishedAt ?? row.publishedAt,
  language: metadata?.language ?? row.language,
};
```

**`src/components/modules/module-content-item.tsx`** - Use stored thumbnail:

```tsx
const thumbnailUrl = item.content.thumbnailUrl ?? extractedMetadata?.image;
```

**`src/components/dashboard/content-item-display.tsx`** - Display metadata:

```tsx
{
  thumbnailUrl && <img src={thumbnailUrl} alt="" />;
}
{
  author && <span>{author}</span>;
}
```

**`src/components/modules/forms/content-selector.tsx`** - Show thumbnail in list:

```tsx
{
  content.thumbnailUrl && <img src={content.thumbnailUrl} alt="" />;
}
```

### 1.6 Translation keys

| Key                     | Usage                                      |
| ----------------------- | ------------------------------------------ |
| `content-thumbnail-url` | Label for thumbnail URL field in forms     |
| `content-author`        | Label for author field and display         |
| `content-published-at`  | Label for published date field and display |
| `content-language`      | Label for language field and display       |

## 2. Acceptance Criteria

### AC1: Content form includes new fields

**Given** a user is creating or editing content  
**When** they view the content form  
**Then** they see input fields for thumbnailUrl, author, publishedAt, and language

### AC2: CSV import supports new fields

**Given** a user imports content via CSV  
**When** the CSV contains thumbnailUrl, author, publishedAt, or language columns  
**Then** those values are saved to the content record

### AC3: YouTube metadata extraction populates new fields

**Given** a user adds YouTube content  
**When** metadata is extracted  
**Then** author, publishedAt, and language are populated from YouTube API

### AC4: Content displays new metadata

**Given** content has metadata fields populated  
**When** viewing content in module items, dashboard, or content selector  
**Then** thumbnailUrl, author, and other fields are displayed appropriately

### Edge cases

- E1: Missing metadata fields should not break display (graceful fallback)
- E2: CSV import with missing columns should use extracted metadata as fallback

## 3. Implementation Tasks

### 3.1 `amplify/data/resource.ts` - Add schema fields

Add new fields to Content model.

```ts
thumbnailUrl: a.url(),
author: a.string(),
publishedAt: a.datetime(),
language: a.string(),
```

### 3.2 `src/api/metadata/types.ts` - Update ExtractedMetadata

Add new optional fields.

```ts
author?: string;
publishedAt?: string;
language?: string;
```

### 3.3 `src/api/youtube.ts` - Extract new fields

Map YouTube API response fields.

```ts
author: snippet.channelTitle,
publishedAt: snippet.publishedAt,
language: snippet.defaultLanguage,
```

### 3.4 `src/api/module-content.ts` - Update selection set

Add new fields to selection set.

```ts
"content.thumbnailUrl",
"content.author",
"content.publishedAt",
"content.language",
```

### 3.5 `src/components/content/content-csv-input.tsx` - Update CSV import

- Add optional fields to CsvRow type
- Map fields to CreateContentInput with metadata fallback

### 3.6 `src/components/content/forms/content-form.tsx` - Add form fields

Add Input components for thumbnailUrl, author, publishedAt, language.

### 3.7 `src/components/content/content-metadata.tsx` - Add display

Display author, publishedAt, and language with appropriate formatting.

### 3.8 `src/components/modules/module-content-item.tsx` - Use stored thumbnail

Use stored thumbnailUrl with fallback to useExtractMetadata.

### 3.9 `src/components/dashboard/content-item-display.tsx` - Display metadata

Display thumbnailUrl as image and author text.

### 3.10 `src/components/modules/forms/content-selector.tsx` - Show thumbnail

Display thumbnail in selection list.

### 3.11 `src/i18n/locales/` - Add translations

Add translation keys to en and pt-BR locale files.

## 4. Execution Order

- [x] Update schema (`amplify/data/resource.ts`)
- [x] Update metadata types (`src/api/metadata/types.ts`)
- [x] Update YouTube API (`src/api/youtube.ts`)
- [x] Update selection set (`src/api/module-content.ts`)
- [x] Update CSV import (`src/components/content/content-csv-input.tsx`)
- [x] Update content form (`src/components/content/forms/content-form.tsx`)
- [x] Update content metadata display (`src/components/content/content-metadata.tsx`)
- [x] Update module content item (`src/components/modules/module-content-item.tsx`)
- [x] Update dashboard content item (`src/components/dashboard/content-item-display.tsx`)
- [x] Update content selector (`src/components/modules/forms/content-selector.tsx`)
- [x] Add translations

## 5. Open Questions and missing details

- Q1: ~~Should language field use a predefined list of languages or free text input?~~ Free text input for now.
- Q2: ~~What thumbnail size should be used as fallback when maxres is not available?~~ Use `standard` (640×480) as fallback.
