# Technical Spec: Error Handling Compliance

## 0. Summary

**Goal:** Ensure all components follow the error handling guidelines defined in `.kiro/steering/rules/error-handling.md`, specifically preserving page layout when displaying errors.  
**Out of scope:** Adding new error handling where none exists; modifying error messages or translations.

## 1. Technical Design

### 1.1 Amplify schema changes

No schema changes required.

### 1.2 Type definitions

No type changes required.

### 1.3 API / Data fetching changes

No API changes required.

### 1.4 Page changes

No page-level changes required. All changes are at the component level.

### 1.5 Component changes

The following components violate the "Preserve page layout when displaying errors" guideline by returning early with just an error element instead of keeping the page structure:

| Component                | File                                                       | Violation                                                |
| ------------------------ | ---------------------------------------------------------- | -------------------------------------------------------- |
| TrackDetail              | `src/components/track/track-detail.tsx`                    | Returns `<div>` on error, loses page layout              |
| TrackList                | `src/components/track/track-list.tsx`                      | Returns `<div>` on error, loses page layout              |
| ContentDetailContainer   | `src/components/content/content-detail-container.tsx`      | Returns `<Alert>` on error, loses page layout            |
| ContentEdit              | `src/components/content/content-edit.tsx`                  | Returns `<p>` on error, loses page layout                |
| ContentList              | `src/components/content/content-list.tsx`                  | Returns `<p>` on error, loses page layout                |
| LastStartedModuleSection | `src/components/dashboard/last-started-module-section.tsx` | Returns `<Alert>` on error, loses page layout            |
| ModuleDetailContainer    | `src/components/modules/module-detail-container.tsx`       | Returns `<Alert>` on error (4 places), loses page layout |

**Note:** These components are inner components that are rendered inside a page layout. The fix depends on how each component is used:

- If the component is always rendered inside a layout wrapper, the current pattern may be acceptable
- If the component can be rendered as a full page, it needs to wrap errors in the layout

### 1.6 Translation keys

No new translation keys required.

## 2. Acceptance Criteria

### AC1: Error states preserve page structure

**Given** a component encounters an error while loading data  
**When** the error state is rendered  
**Then** the page layout (header, navigation, sidebar) remains visible and the error is displayed within the content area

### Edge cases

- E1: Components that are always rendered inside a parent layout may not need changes if the parent handles the layout
- E2: Loading states should also preserve layout (some components already do this correctly)

## 3. Implementation Tasks

### 3.1 `src/components/track/track-detail.tsx` - Preserve layout on error

Change early return to render error within component structure.

```tsx
// Before
if (isError) return <div>{t("error-loading-track")}</div>;

// After - render error in place of content
// The parent page should provide the layout wrapper
```

### 3.2 `src/components/track/track-list.tsx` - Preserve layout on error

```tsx
// Before
if (isError) {
  return <div>{t("error-loading-tracks")}</div>;
}

// After - render error in place of content
```

### 3.3 `src/components/content/content-detail-container.tsx` - Preserve layout on error

```tsx
// Before
if (isError) {
  return <Alert variant="destructive">...</Alert>;
}

// After - render error in place of content
```

### 3.4 `src/components/content/content-edit.tsx` - Preserve layout on error

```tsx
// Before
if (contentQuery.isError || !defaultValues) {
  return <p className="text-sm text-red-600">...</p>;
}

// After - render error in place of content
```

### 3.5 `src/components/content/content-list.tsx` - Preserve layout on error

```tsx
// Before
if (listQ.isError) {
  return <p className="text-sm text-red-600">{t("couldnt-load-content")}</p>;
}

// After - render error in place of content
```

### 3.6 `src/components/dashboard/last-started-module-section.tsx` - Preserve layout on error

```tsx
// Before
if (isError) {
  return <Alert variant="destructive">...</Alert>;
}

// After - render error in place of content
```

### 3.7 `src/components/modules/module-detail-container.tsx` - Preserve layout on error (4 places)

This component has 4 early returns for different error states (module error, contents error, progress error, content progress error). All need to be refactored to render within the component structure.

```tsx
// Before
if (isModuleError) {
  return <Alert variant="destructive">...</Alert>;
}

// After - use conditional rendering within the main return
```

## 4. Execution Order

- [x] 3.1 - TrackDetail
- [x] 3.2 - TrackList
- [x] 3.3 - ContentDetailContainer
- [x] 3.4 - ContentEdit
- [ ] 3.5 - ContentList
- [ ] 3.6 - LastStartedModuleSection
- [ ] 3.7 - ModuleDetailContainer

Tasks can be executed in any order as they are independent.

## 5. Side Navigation

No side navigation changes required.

## 6. Open Questions and missing details

- Q1: ~~Should we create a shared error boundary or error display component to standardize error rendering across all components?~~ **Deferred - not now**
- Q2: ~~For components like `LastStartedModuleSection` that are dashboard widgets, should they show an error or simply not render when there's an error?~~ **Answer: Show error inside the component**
