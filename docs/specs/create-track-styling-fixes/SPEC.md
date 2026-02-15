# Technical Spec: Create Track Page Styling Fixes

## 0. Summary

**Goal:** Fix styling inconsistencies on the Create Track page to improve visual hierarchy, dark theme compatibility, and overall user experience.

**Out of scope:** Functional changes to the track creation flow, React Flow behavior modifications, or backend changes.

## 1. Technical Design

### 1.1 Amplify schema changes

No schema changes required.

### 1.2 Type definitions

No type definition changes required.

### 1.3 API / Data fetching changes

No API or data fetching changes required.

### 1.4 Page changes

#### `/track-create` route

Add page header with title and description, consistent with other create pages (e.g., `/module-create`).

```tsx
// src/routes/track-create.tsx
function TrackCreatePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("create-track")}</h1>
        <p className="text-muted-foreground">{t("create-track-description")}</p>
      </div>
      <TrackForm mode="create" />
    </div>
  );
}
```

#### `/track-edit/$trackId` route

Add page header with title and description for edit mode.

```tsx
// src/routes/track-edit/$trackId.tsx
function TrackEditPage() {
  const { trackId } = Route.useParams();
  const { t } = useTranslation();
  const { data: track, isLoading } = useTrack(trackId);

  if (isLoading) return <div>{t("loading")}</div>;
  if (!track) return <div>{t("track-not-found")}</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("edit-track")}</h1>
        <p className="text-muted-foreground">{t("edit-track-description")}</p>
      </div>
      <TrackForm
        mode="edit"
        trackId={trackId}
        initialData={{
          title: track.title,
          description: track.description,
          rootModuleId: track.rootModuleId,
          parentByModuleId: track.parentByModuleId as Record<string, string>,
        }}
      />
    </div>
  );
}
```

### 1.5 Component changes

#### `TrackForm` - Remove redundant wrapper and improve form field responsiveness

- Remove `max-w-xl` constraint to allow responsive width
- Use `w-full max-w-2xl` for better form field sizing

```tsx
// src/components/track/track-form.tsx
<div className="space-y-4 w-full max-w-2xl">
  {/* form fields */}
</div>
```

#### `TrackFlowEditor` - Enable React Flow dark mode with `colorMode` prop

React Flow v12+ has built-in dark mode support via the `colorMode` prop. Use the app's theme context to sync the color mode:

```tsx
// src/components/track/track-flow-editor.tsx
import { useTheme } from "@/hooks/use-theme";

// Inside component:
const { mode } = useTheme();

<ReactFlow
  nodes={nodes}
  edges={edges}
  colorMode={mode}
  // ... other props
>
```

#### `TrackFlowEditor` - Fix Panel styling for dark theme compatibility

- Replace white background (`bg-white`) with dark-theme-compatible styling (`bg-card`)
- Remove `shadow` class (doesn't work well on dark backgrounds)
- Improve button grouping and visual hierarchy
- Use `outline` variant for secondary actions (Auto Layout)
- Use `secondary` variant for Remove Selected instead of destructive styling

```tsx
// src/components/track/track-flow-editor.tsx
<Panel position="top-left" className="bg-card p-3 rounded-lg border space-y-3">
  <div className="flex gap-2 items-center">
    <Select value={selectedModuleToAdd} onValueChange={setSelectedModuleToAdd}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={t("select-module")} />
      </SelectTrigger>
      <SelectContent>
        {availableModules.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Button onClick={addModule} disabled={!selectedModuleToAdd}>
      {t("add-module")}
    </Button>
  </div>
  <div className="flex gap-2">
    <Button variant="outline" onClick={applyLayout}>
      {t("auto-layout")}
    </Button>
    <Button variant="secondary" onClick={removeSelectedNodes}>
      {t("remove-selected")}
    </Button>
    <Button onClick={handleSave}>
      {t("save-structure")}
    </Button>
  </div>
</Panel>
```

#### `TrackFlowEditor` - Reduce canvas height and add visual boundary

- Reduce default height from 500px to 400px
- Improve border styling for better visual definition

```tsx
// src/components/track/track-flow-editor.tsx
<div className="h-[400px] border rounded-lg bg-muted/20">
  <ReactFlow colorMode="dark">
    {/* ... */}
  </ReactFlow>
</div>
```

#### React Flow CSS Variables - Match app themes

The app has two theme dimensions:
- **Color mode**: `light` or `dark` (controlled by `colorMode` prop)
- **Color theme**: `default` or `studai` (controlled by `data-theme` attribute)

React Flow's built-in `colorMode` handles light/dark, but we need CSS overrides for the StudAI branded theme. The default theme can use React Flow's built-in colors.

```css
/* React Flow overrides for StudAI theme - light mode */
[data-theme="studai"] .light.react-flow {
  --xy-background-pattern-dots-color-default: oklch(0.6 0.15 260 / 0.3);
  --xy-node-background-color-default: oklch(0.98 0.01 265);
  --xy-node-color-default: oklch(0.2 0.02 265);
  --xy-node-border-default: 1px solid oklch(0.85 0.05 265);
  --xy-node-boxshadow-selected-default: 0 0 0 2px oklch(0.6 0.2 260);
  --xy-edge-stroke-default: oklch(0.5 0.1 260);
  --xy-edge-stroke-selected-default: oklch(0.6 0.2 260);
  --xy-handle-background-color-default: oklch(0.6 0.2 260);
  --xy-handle-border-color-default: oklch(0.98 0.01 265);
  --xy-controls-button-background-color-default: oklch(0.98 0.01 265);
  --xy-controls-button-background-color-hover-default: oklch(0.94 0.02 265);
  --xy-controls-button-color-default: oklch(0.2 0.02 265);
  --xy-controls-button-border-color-default: oklch(0.85 0.05 265);
}

/* React Flow overrides for StudAI theme - dark mode */
[data-theme="studai"] .dark.react-flow {
  --xy-background-pattern-dots-color-default: oklch(0.5 0.02 265 / 0.4);
  --xy-node-background-color-default: oklch(0.22 0.04 265);
  --xy-node-color-default: oklch(0.95 0.005 250);
  --xy-node-border-default: 1px solid oklch(0.32 0.04 265);
  --xy-node-boxshadow-selected-default: 0 0 0 2px oklch(0.6 0.2 260);
  --xy-edge-stroke-default: oklch(0.65 0.02 250);
  --xy-edge-stroke-selected-default: oklch(0.6 0.2 260);
  --xy-handle-background-color-default: oklch(0.6 0.2 260);
  --xy-handle-border-color-default: oklch(0.18 0.04 265);
  --xy-controls-button-background-color-default: oklch(0.22 0.04 265);
  --xy-controls-button-background-color-hover-default: oklch(0.28 0.04 265);
  --xy-controls-button-color-default: oklch(0.95 0.005 250);
  --xy-controls-button-border-color-default: oklch(0.32 0.04 265);
}
```

#### `TrackFlowViewer` - Remove MiniMap and apply theme styling

Remove the MiniMap component and apply the same theme-aware styling as the editor.

```tsx
// src/components/track/track-flow-viewer.tsx
import { useTheme } from "@/hooks/use-theme";

// Remove MiniMap from imports
// Remove <MiniMap /> from JSX

// Inside component:
const { mode } = useTheme();

<ReactFlow
  colorMode={mode}
  // ... other props
>
```

#### `ModuleNode` - Update styling to use theme colors

Replace hardcoded light theme colors with theme-aware classes.

```tsx
// src/components/track/module-node.tsx
// Before:
<div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 cursor-pointer hover:border-primary">

// After:
<div className="px-4 py-2 rounded-md bg-card border border-border cursor-pointer hover:border-primary">
```

### 1.6 Translation keys

| Key | EN | PT-BR | Usage |
|-----|-----|-------|-------|
| `create-track-description` | Create a learning track by organizing modules into a structured path. | Crie uma trilha de aprendizado organizando módulos em um caminho estruturado. | Create page subtitle (NEW) |
| `edit-track` | Edit Track | Editar Trilha | Edit page title (NEW) |
| `edit-track-description` | Modify the track structure and details. | Modifique a estrutura e detalhes da trilha. | Edit page subtitle (NEW) |
| `add-module` | Add Module | Adicionar Módulo | Button - already exists ✓ |
| `auto-layout` | Auto Layout | Layout Automático | Button - already exists ✓ |
| `remove-selected` | Remove Selected | Remover Selecionados | Button - already exists ✓ |
| `save-structure` | Save Structure | Salvar Estrutura | Button - already exists ✓ |

## 2. Acceptance Criteria

### AC1: Page header displays correctly

**Given** a user navigates to the Create Track page  
**When** the page loads  
**Then** a page title "Create Track" and description are visible at the top

### AC2: Control panel matches dark theme

**Given** a user is on the Create Track page with dark theme enabled  
**When** viewing the flow editor control panel  
**Then** the panel background matches the dark theme (uses card background color)

### AC3: Button hierarchy is clear

**Given** a user views the flow editor control panel  
**When** examining the buttons  
**Then** primary actions (Add Module, Save Structure) use default styling, secondary actions (Auto Layout, Remove Selected) use outline/secondary variants

### AC4: Form fields are responsive

**Given** a user is on the Create Track page  
**When** resizing the browser window  
**Then** the Title and Description fields adjust width appropriately up to max-w-2xl

### AC5: React Flow elements match StudAI theme

**Given** a user is on the Create Track page with dark theme  
**When** viewing the flow editor canvas  
**Then** the background dots, controls, nodes, and edges use the purple-tinted StudAI theme colors (not generic grays)

### Edge cases

- E1: Empty state - canvas should display correctly with no modules added
- E2: Many modules - panel should not overlap with nodes when canvas is populated

## 3. Implementation Tasks

### 3.1 `src/i18n/locales/en/common.ts` - Add new translation keys

```ts
"create-track-description": "Create a learning track by organizing modules into a structured path.",
"edit-track": "Edit Track",
"edit-track-description": "Modify the track structure and details.",
```

### 3.2 `src/i18n/locales/pt-BR/common.ts` - Add Portuguese translations

```ts
"create-track-description": "Crie uma trilha de aprendizado organizando módulos em um caminho estruturado.",
"edit-track": "Editar Trilha",
"edit-track-description": "Modifique a estrutura e detalhes da trilha.",
```

### 3.3 `src/routes/track-create.tsx` - Add page header

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { TrackForm } from "@/components/track/track-form";

export const Route = createFileRoute("/track-create")({
  component: TrackCreatePage,
});

function TrackCreatePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("create-track")}</h1>
        <p className="text-muted-foreground">{t("create-track-description")}</p>
      </div>
      <TrackForm mode="create" />
    </div>
  );
}
```

### 3.4 `src/routes/track-edit/$trackId.tsx` - Add page header

```tsx
function TrackEditPage() {
  const { trackId } = Route.useParams();
  const { t } = useTranslation();
  const { data: track, isLoading } = useTrack(trackId);

  if (isLoading) return <div>{t("loading")}</div>;
  if (!track) return <div>{t("track-not-found")}</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("edit-track")}</h1>
        <p className="text-muted-foreground">{t("edit-track-description")}</p>
      </div>
      <TrackForm
        mode="edit"
        trackId={trackId}
        initialData={{
          title: track.title,
          description: track.description,
          rootModuleId: track.rootModuleId,
          parentByModuleId: track.parentByModuleId as Record<string, string>,
        }}
      />
    </div>
  );
}
```

### 3.5 `src/components/track/track-form.tsx` - Improve form field responsiveness

Change `max-w-xl` to `w-full max-w-2xl`:

```tsx
<div className="space-y-4 w-full max-w-2xl">
```

### 3.6 `src/components/track/track-flow-editor.tsx` - Add React Flow dark mode and fix Panel styling

Key changes:
- Import `useTheme` and pass `colorMode={mode}` to `<ReactFlow>` for theme sync
- Update Panel className: `bg-white p-2 rounded shadow` → `bg-card p-3 rounded-lg border`
- Reorganize buttons into two rows with proper variants
- Reduce canvas height: `h-[500px]` → `h-[400px]`
- Add subtle background: `bg-muted/20`

```tsx
import { useTheme } from "@/hooks/use-theme";

// Inside component:
const { mode } = useTheme();

return (
  <div className="h-[400px] border rounded-lg bg-muted/20">
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      colorMode={mode}
      fitView
    >
      <Background />
      <Controls />
      <Panel position="top-left" className="bg-card p-3 rounded-lg border space-y-3">
        <div className="flex gap-2 items-center">
          <Select value={selectedModuleToAdd} onValueChange={setSelectedModuleToAdd}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("select-module")} />
            </SelectTrigger>
            <SelectContent>
              {availableModules.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addModule} disabled={!selectedModuleToAdd}>
            {t("add-module")}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={applyLayout}>
            {t("auto-layout")}
          </Button>
          <Button variant="secondary" onClick={removeSelectedNodes}>
            {t("remove-selected")}
          </Button>
          <Button onClick={handleSave}>
            {t("save-structure")}
          </Button>
        </div>
      </Panel>
    </ReactFlow>
  </div>
);
```

### 3.7 `src/components/track/track-flow-viewer.tsx` - Remove MiniMap and add theme support

- Remove `MiniMap` from imports
- Remove `<MiniMap />` from JSX
- Add `useTheme` hook and pass `colorMode={mode}` to `<ReactFlow>`

```tsx
import { useTheme } from "@/hooks/use-theme";

// Inside component:
const { mode } = useTheme();

<ReactFlow
  colorMode={mode}
  // ... existing props
>
  <Background />
  <Controls />
  {/* MiniMap removed */}
</ReactFlow>
```

### 3.8 `src/components/track/module-node.tsx` - Update node styling for theme

Replace hardcoded colors with theme-aware classes:

```tsx
export const ModuleNode = memo(({ data }: ModuleNodeProps) => {
  return (
    <div className="px-4 py-2 rounded-md bg-card border border-border cursor-pointer hover:border-primary">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="font-medium text-sm">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});
```

### 3.9 `src/index.css` - Add React Flow CSS variables for StudAI theme

The app has 4 theme combinations (default/studai × light/dark). React Flow's built-in colors work for the default theme. Only the StudAI theme needs overrides:

```css
/* React Flow overrides for StudAI theme - light mode */
[data-theme="studai"] .light.react-flow {
  --xy-background-pattern-dots-color-default: oklch(0.6 0.15 260 / 0.3);
  --xy-node-background-color-default: oklch(0.98 0.01 265);
  --xy-node-color-default: oklch(0.2 0.02 265);
  --xy-node-border-default: 1px solid oklch(0.85 0.05 265);
  --xy-node-boxshadow-selected-default: 0 0 0 2px oklch(0.6 0.2 260);
  --xy-edge-stroke-default: oklch(0.5 0.1 260);
  --xy-edge-stroke-selected-default: oklch(0.6 0.2 260);
  --xy-handle-background-color-default: oklch(0.6 0.2 260);
  --xy-handle-border-color-default: oklch(0.98 0.01 265);
  --xy-controls-button-background-color-default: oklch(0.98 0.01 265);
  --xy-controls-button-background-color-hover-default: oklch(0.94 0.02 265);
  --xy-controls-button-color-default: oklch(0.2 0.02 265);
  --xy-controls-button-border-color-default: oklch(0.85 0.05 265);
}

/* React Flow overrides for StudAI theme - dark mode */
[data-theme="studai"] .dark.react-flow {
  --xy-background-pattern-dots-color-default: oklch(0.5 0.02 265 / 0.4);
  --xy-node-background-color-default: oklch(0.22 0.04 265);
  --xy-node-color-default: oklch(0.95 0.005 250);
  --xy-node-border-default: 1px solid oklch(0.32 0.04 265);
  --xy-node-boxshadow-selected-default: 0 0 0 2px oklch(0.6 0.2 260);
  --xy-edge-stroke-default: oklch(0.65 0.02 250);
  --xy-edge-stroke-selected-default: oklch(0.6 0.2 260);
  --xy-handle-background-color-default: oklch(0.6 0.2 260);
  --xy-handle-border-color-default: oklch(0.18 0.04 265);
  --xy-controls-button-background-color-default: oklch(0.22 0.04 265);
  --xy-controls-button-background-color-hover-default: oklch(0.28 0.04 265);
  --xy-controls-button-color-default: oklch(0.95 0.005 250);
  --xy-controls-button-border-color-default: oklch(0.32 0.04 265);
}
```

## 4. Execution Order

- [x] 3.1 Add English translation keys
- [x] 3.2 Add Portuguese translation keys
- [x] 3.3 Update track-create.tsx with page header
- [x] 3.4 Update track-edit/$trackId.tsx with page header
- [x] 3.5 Update track-form.tsx form field width
- [x] 3.6 Update track-flow-editor.tsx (colorMode, Panel styling, canvas)
- [x] 3.7 Update track-flow-viewer.tsx (remove MiniMap, add colorMode)
- [x] 3.8 Update module-node.tsx styling for theme
- [x] 3.9 Add React Flow CSS variables to index.css

## 5. Side Navigation

No side navigation changes required.

## 6. Open Questions and missing details

- Q1: Should the "Remove Selected" button be hidden when no nodes are selected?
- Q2: Should the canvas height be configurable or remain fixed at 400px?
