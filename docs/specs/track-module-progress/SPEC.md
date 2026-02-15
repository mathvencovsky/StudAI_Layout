# Technical Spec: Track Module Progress Display

## 0. Summary

**Goal:** Display module progress (completion percentage) for each module node in the track viewer map tree, fetching progress data efficiently with a single batch API call.  
**Out of scope:** Track-level aggregate progress, progress editing from track view, progress notifications.

## 1. Technical Design

### 1.1 Amplify schema changes

No schema changes required. The existing `UserContentProgress` and `ModuleContent` models provide all necessary data.

### 1.2 Type definitions

No separate type definition files needed. Computed types are defined inline in the API file.

### 1.3 API / Data fetching changes

**`src/api/batch-module-progress.ts`** - New batch API for fetching progress of multiple modules

The key efficiency consideration: instead of making N queries (one per module), we make 2 queries total:
1. One query to get all `UserContentProgress` records for the current user (filtered by moduleIds)
2. One query to get all `ModuleContent` records for the given modules

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

export interface ModuleProgressInfo {
  moduleId: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
  status: "not_started" | "in_progress" | "completed";
}

export type ModuleProgressMap = Record<string, ModuleProgressInfo>;

const client = generateClient<Schema>();

/**
 * Fetches progress for multiple modules in a single batch operation.
 * Returns a map of moduleId to progress info.
 */
export const getBatchModuleProgress = async (
  moduleIds: string[],
): Promise<ModuleProgressMap> => {
  if (moduleIds.length === 0) {
    return {};
  }

  const [contentProgressResult, moduleContentsResult] = await Promise.all([
    client.models.UserContentProgress.list({
      filter: {
        or: moduleIds.map((id) => ({ moduleId: { eq: id } })),
      },
    }),
    client.models.ModuleContent.list({
      filter: {
        or: moduleIds.map((id) => ({ moduleId: { eq: id } })),
      },
    }),
  ]);

  const contentProgress = contentProgressResult.data ?? [];
  const moduleContents = moduleContentsResult.data ?? [];

  const totalByModule = new Map<string, number>();
  for (const mc of moduleContents) {
    const current = totalByModule.get(mc.moduleId) ?? 0;
    totalByModule.set(mc.moduleId, current + 1);
  }

  const completedByModule = new Map<string, number>();
  for (const cp of contentProgress) {
    if (cp.isCompleted) {
      const current = completedByModule.get(cp.moduleId) ?? 0;
      completedByModule.set(cp.moduleId, current + 1);
    }
  }

  const result: ModuleProgressMap = {};
  for (const moduleId of moduleIds) {
    const totalCount = totalByModule.get(moduleId) ?? 0;
    const completedCount = completedByModule.get(moduleId) ?? 0;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    let status: ModuleProgressInfo["status"] = "not_started";
    if (completedCount > 0 && completedCount < totalCount) {
      status = "in_progress";
    } else if (completedCount > 0 && completedCount === totalCount) {
      status = "completed";
    }

    result[moduleId] = {
      moduleId,
      completedCount,
      totalCount,
      percentage,
      status,
    };
  }

  return result;
};
```

**`src/hooks/track/use-batch-module-progress.ts`** - New hook for batch progress fetching

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getBatchModuleProgress, type ModuleProgressMap } from "@/api/batch-module-progress";

export const getBatchModuleProgressQueryOptions = (moduleIds: string[]) =>
  queryOptions<ModuleProgressMap>({
    queryKey: ["batchModuleProgress", moduleIds.sort()],
    queryFn: () => getBatchModuleProgress(moduleIds),
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    enabled: moduleIds.length > 0,
  });

/**
 * Hook to fetch progress for multiple modules in a single batch call
 */
export const useBatchModuleProgress = (moduleIds: string[]) =>
  useQuery(getBatchModuleProgressQueryOptions(moduleIds));
```

### 1.4 Page changes

No page changes required. The track detail page already renders `TrackFlowViewer`.

### 1.5 Component changes

**`src/components/track/module-node.tsx`** - Update to display progress

```tsx
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { type ModuleProgressInfo } from "@/api/batch-module-progress";
import { cn } from "@/lib/utils";

export interface ModuleNodeProps {
  data: {
    label: string;
    moduleId: string;
    progress?: ModuleProgressInfo;
    isLoadingProgress?: boolean;
  };
}

const statusColors = {
  not_started: "border-border",
  in_progress: "border-yellow-500",
  completed: "border-green-500",
};

const progressBarColors = {
  not_started: "",
  in_progress: "[&>div]:bg-yellow-500",
  completed: "[&>div]:bg-green-500",
};

/**
 * Custom React Flow node for displaying modules with progress in the track flow
 */
export const ModuleNode = memo(({ data }: ModuleNodeProps) => {
  const { label, progress, isLoadingProgress } = data;
  const status = progress?.status ?? "not_started";

  return (
    <div
      className={cn(
        "px-4 py-2 rounded-md bg-card border-2 cursor-pointer hover:border-primary min-w-[180px]",
        statusColors[status],
      )}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="font-medium text-sm truncate">{label}</div>
      {isLoadingProgress && (
        <div className="mt-2 space-y-1">
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-3 w-8 mx-auto" />
        </div>
      )}
      {!isLoadingProgress && progress && progress.totalCount > 0 && (
        <div className="mt-2 space-y-1">
          <Progress value={progress.percentage} className={cn("h-1.5", progressBarColors[status])} />
          <div className="text-xs text-muted-foreground text-center">
            {progress.completedCount}/{progress.totalCount}
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});

ModuleNode.displayName = "ModuleNode";
```

**`src/components/track/track-flow-viewer.tsx`** - Update to fetch and pass progress data

```tsx
import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useModules } from "@/hooks/modules/use-modules";
import { useBatchModuleProgress } from "@/hooks/track/use-batch-module-progress";
import { useTheme } from "@/hooks/use-theme";
import { ModuleNode } from "@/components/track/module-node";
import { type ModuleProgressMap } from "@/api/batch-module-progress";

type ParentMap = Record<string, string>;

export interface TrackFlowViewerProps {
  rootModuleId: string;
  parentByModuleId: unknown;
  positionByModuleId: unknown;
}

const ROOT = "ROOT";
const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

const nodeTypes = { module: ModuleNode };

const coerceParentMap = (value: unknown): ParentMap => {
  if (!value || typeof value !== "object") return {};
  const result: ParentMap = {};
  for (const [key, val] of Object.entries(value)) {
    if (typeof val === "string") result[key] = val;
  }
  return result;
};

/**
 * Applies dagre layout to nodes and edges
 */
const applyDagreLayout = (nodes: Node[], edges: Edge[]): Node[] => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 80 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });
};

/**
 * Determines edge color based on connected nodes' progress status
 * - Green if both nodes are completed
 * - Yellow if either node is in progress
 * - Default otherwise
 */
const getEdgeColor = (
  sourceStatus: ModuleProgressInfo["status"] | undefined,
  targetStatus: ModuleProgressInfo["status"] | undefined,
): string | undefined => {
  const source = sourceStatus ?? "not_started";
  const target = targetStatus ?? "not_started";

  if (source === "completed" && target === "completed") {
    return "#22c55e"; // green-500
  }
  if (source === "in_progress" || target === "in_progress" || 
      source === "completed" || target === "completed") {
    return "#eab308"; // yellow-500
  }
  return undefined; // default color
};

/**
 * Converts track JSON structure to React Flow nodes and edges with progress data
 */
const buildFlowElements = (
  parentBy: ParentMap,
  moduleMap: Map<string, { id: string; title: string }>,
  progressMap: ModuleProgressMap,
  isLoadingProgress: boolean,
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  for (const [moduleId, parentId] of Object.entries(parentBy)) {
    const module = moduleMap.get(moduleId);
    const progress = progressMap[moduleId];

    nodes.push({
      id: moduleId,
      type: "module",
      position: { x: 0, y: 0 },
      data: {
        label: module?.title ?? "Missing module",
        moduleId,
        progress,
        isLoadingProgress,
      },
    });

    if (parentId !== ROOT) {
      const sourceProgress = progressMap[parentId];
      const targetProgress = progress;
      const edgeColor = getEdgeColor(sourceProgress?.status, targetProgress?.status);

      edges.push({
        id: `${parentId}-${moduleId}`,
        source: parentId,
        target: moduleId,
        type: "smoothstep",
        style: edgeColor ? { stroke: edgeColor, strokeWidth: 2 } : undefined,
      });
    }
  }

  const layoutedNodes = applyDagreLayout(nodes, edges);
  return { nodes: layoutedNodes, edges };
};

/**
 * Read-only React Flow visualization for track structure with module progress
 */
export const TrackFlowViewer = ({
  rootModuleId,
  parentByModuleId,
}: TrackFlowViewerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: modules } = useModules();
  const { mode } = useTheme();

  const parentBy = coerceParentMap(parentByModuleId);
  const moduleIds = useMemo(() => Object.keys(parentBy), [parentBy]);

  const { data: progressMap, isLoading: isLoadingProgress } = useBatchModuleProgress(moduleIds);

  const moduleMap = useMemo(
    () => new Map((modules ?? []).map((m) => [m.id, m])),
    [modules],
  );

  const { nodes, edges } = useMemo(
    () => buildFlowElements(parentBy, moduleMap, progressMap ?? {}, isLoadingProgress),
    [parentBy, moduleMap, progressMap, isLoadingProgress],
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    navigate({ to: "/module/$moduleId", params: { moduleId: node.id } });
  };

  if (Object.keys(parentBy).length === 0 || !rootModuleId) {
    return <div className="p-4">{t("no-modules-in-track")}</div>;
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      colorMode={mode}
      fitView
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
};
```

### 1.6 Translation keys

| Key | EN | PT-BR |
| --- | --- | --- |
| `module-progress-completed` | Completed | Concluído |
| `module-progress-in-progress` | In Progress | Em Progresso |
| `module-progress-not-started` | Not Started | Não Iniciado |

## 2. Acceptance Criteria

### AC1: Display progress on module nodes

**Given** a user is viewing a track detail page  
**When** the track flow viewer loads  
**Then** each module node displays a progress bar and completion count (e.g., "3/5")

### AC2: Progress reflects user's actual completion

**Given** a user has completed 2 out of 4 content items in a module  
**When** they view the track containing that module  
**Then** the module node shows 50% progress and "2/4"

### AC3: Visual status indicators

**Given** a user is viewing a track  
**When** they look at module nodes  
**Then** nodes show visual status:
- Gray border for not started (0% progress)
- Yellow border for in progress (1-99% progress)
- Green border for completed (100% progress)

### AC4: Efficient data fetching

**Given** a track contains 10 modules  
**When** the track detail page loads  
**Then** progress data is fetched in a single batch API call (not 10 separate calls)

### AC5: Empty modules show no progress bar

**Given** a module has no content items  
**When** it appears in the track viewer  
**Then** no progress bar is displayed (only the module title)

### AC6: Loading state while fetching progress

**Given** a user is viewing a track detail page  
**When** progress data is being fetched  
**Then** each module node displays a skeleton placeholder for the progress bar and count

### AC7: Progress bar color matches status

**Given** a user is viewing a track  
**When** they look at module nodes with progress  
**Then** the progress bar color matches the border status:
- Default color for not started
- Yellow progress bar for in progress
- Green progress bar for completed

### AC8: Edge colors reflect connected nodes' progress

**Given** a user is viewing a track with connected modules  
**When** they look at the edges between nodes  
**Then** edge colors are determined by the connected nodes:
- Green edge if both source and target nodes are completed
- Yellow edge if either source or target node is in progress (and neither condition above is met)
- Default color if both nodes are not started

### Edge cases

- E1: Module with 0 content items shows no progress bar
- E2: Deleted content items are not counted in progress
- E3: Progress updates when user navigates back to track after completing content
- E4: Missing modules (deleted) show "Missing module" with no progress
- E5: If progress fetching fails, nodes display without progress (no error state shown)

## 3. Implementation Tasks

### 3.1 `src/api/batch-module-progress.ts` - Create batch progress API with types

Create API function that fetches progress for multiple modules efficiently. Types are defined inline.

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

export interface ModuleProgressInfo {
  moduleId: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
  status: "not_started" | "in_progress" | "completed";
}

export type ModuleProgressMap = Record<string, ModuleProgressInfo>;

const client = generateClient<Schema>();

/**
 * Fetches progress for multiple modules in a single batch operation
 */
export const getBatchModuleProgress = async (
  moduleIds: string[],
): Promise<ModuleProgressMap> => {
  if (moduleIds.length === 0) {
    return {};
  }

  const [contentProgressResult, moduleContentsResult] = await Promise.all([
    client.models.UserContentProgress.list({
      filter: {
        or: moduleIds.map((id) => ({ moduleId: { eq: id } })),
      },
    }),
    client.models.ModuleContent.list({
      filter: {
        or: moduleIds.map((id) => ({ moduleId: { eq: id } })),
      },
    }),
  ]);

  const contentProgress = contentProgressResult.data ?? [];
  const moduleContents = moduleContentsResult.data ?? [];

  const totalByModule = new Map<string, number>();
  for (const mc of moduleContents) {
    const current = totalByModule.get(mc.moduleId) ?? 0;
    totalByModule.set(mc.moduleId, current + 1);
  }

  const completedByModule = new Map<string, number>();
  for (const cp of contentProgress) {
    if (cp.isCompleted) {
      const current = completedByModule.get(cp.moduleId) ?? 0;
      completedByModule.set(cp.moduleId, current + 1);
    }
  }

  const result: ModuleProgressMap = {};
  for (const moduleId of moduleIds) {
    const totalCount = totalByModule.get(moduleId) ?? 0;
    const completedCount = completedByModule.get(moduleId) ?? 0;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    let status: ModuleProgressInfo["status"] = "not_started";
    if (completedCount > 0 && completedCount < totalCount) {
      status = "in_progress";
    } else if (completedCount > 0 && completedCount === totalCount) {
      status = "completed";
    }

    result[moduleId] = { moduleId, completedCount, totalCount, percentage, status };
  }

  return result;
};
```

### 3.2 `src/hooks/track/use-batch-module-progress.ts` - Create batch progress hook

Create React Query hook for the batch progress API.

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getBatchModuleProgress, type ModuleProgressMap } from "@/api/batch-module-progress";

export const getBatchModuleProgressQueryOptions = (moduleIds: string[]) =>
  queryOptions<ModuleProgressMap>({
    queryKey: ["batchModuleProgress", moduleIds.sort()],
    queryFn: () => getBatchModuleProgress(moduleIds),
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    enabled: moduleIds.length > 0,
  });

/**
 * Hook to fetch progress for multiple modules in a single batch call
 */
export const useBatchModuleProgress = (moduleIds: string[]) =>
  useQuery(getBatchModuleProgressQueryOptions(moduleIds));
```

### 3.3 `src/components/track/module-node.tsx` - Update to show progress

Update the ModuleNode component to display progress bar, loading state, and status colors.

```tsx
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { type ModuleProgressInfo } from "@/api/batch-module-progress";
import { cn } from "@/lib/utils";

export interface ModuleNodeProps {
  data: {
    label: string;
    moduleId: string;
    progress?: ModuleProgressInfo;
    isLoadingProgress?: boolean;
  };
}

const statusColors = {
  not_started: "border-border",
  in_progress: "border-yellow-500",
  completed: "border-green-500",
};

const progressBarColors = {
  not_started: "",
  in_progress: "[&>div]:bg-yellow-500",
  completed: "[&>div]:bg-green-500",
};

/**
 * Custom React Flow node for displaying modules with progress in the track flow
 */
export const ModuleNode = memo(({ data }: ModuleNodeProps) => {
  const { label, progress, isLoadingProgress } = data;
  const status = progress?.status ?? "not_started";

  return (
    <div
      className={cn(
        "px-4 py-2 rounded-md bg-card border-2 cursor-pointer hover:border-primary min-w-[180px]",
        statusColors[status],
      )}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="font-medium text-sm truncate">{label}</div>
      {isLoadingProgress && (
        <div className="mt-2 space-y-1">
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-3 w-8 mx-auto" />
        </div>
      )}
      {!isLoadingProgress && progress && progress.totalCount > 0 && (
        <div className="mt-2 space-y-1">
          <Progress value={progress.percentage} className={cn("h-1.5", progressBarColors[status])} />
          <div className="text-xs text-muted-foreground text-center">
            {progress.completedCount}/{progress.totalCount}
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});

ModuleNode.displayName = "ModuleNode";
```

### 3.4 `src/components/track/track-flow-viewer.tsx` - Integrate progress fetching and edge coloring

Update TrackFlowViewer to fetch batch progress, pass to nodes, and color edges based on progress.

Key changes:
- Extract moduleIds from parentByModuleId
- Call useBatchModuleProgress with moduleIds
- Pass progress data and loading state to buildFlowElements
- Update NODE_HEIGHT to accommodate progress bar
- Add getEdgeColor function to determine edge color based on connected nodes
- Apply edge styles in buildFlowElements

```tsx
// Add imports
import { useBatchModuleProgress } from "@/hooks/track/use-batch-module-progress";
import { type ModuleProgressMap, type ModuleProgressInfo } from "@/api/batch-module-progress";

// Update NODE_HEIGHT
const NODE_HEIGHT = 80;

/**
 * Determines edge color based on connected nodes' progress status
 */
const getEdgeColor = (
  sourceStatus: ModuleProgressInfo["status"] | undefined,
  targetStatus: ModuleProgressInfo["status"] | undefined,
): string | undefined => {
  const source = sourceStatus ?? "not_started";
  const target = targetStatus ?? "not_started";

  if (source === "completed" && target === "completed") {
    return "#22c55e"; // green-500
  }
  if (source === "in_progress" || target === "in_progress" || 
      source === "completed" || target === "completed") {
    return "#eab308"; // yellow-500
  }
  return undefined;
};

// Update buildFlowElements to apply edge colors
// When creating edges:
const sourceProgress = progressMap[parentId];
const targetProgress = progressMap[moduleId];
const edgeColor = getEdgeColor(sourceProgress?.status, targetProgress?.status);

edges.push({
  id: `${parentId}-${moduleId}`,
  source: parentId,
  target: moduleId,
  type: "smoothstep",
  style: edgeColor ? { stroke: edgeColor, strokeWidth: 2 } : undefined,
});

// In component:
const moduleIds = useMemo(() => Object.keys(parentBy), [parentBy]);
const { data: progressMap, isLoading: isLoadingProgress } = useBatchModuleProgress(moduleIds);

// Pass progressMap and isLoadingProgress to buildFlowElements
const { nodes, edges } = useMemo(
  () => buildFlowElements(parentBy, moduleMap, progressMap ?? {}, isLoadingProgress),
  [parentBy, moduleMap, progressMap, isLoadingProgress],
);
```

### 3.5 `src/i18n/locales/en/common.ts` - Add English translations

Add new translation keys.

```ts
"module-progress-completed": "Completed",
"module-progress-in-progress": "In Progress",
"module-progress-not-started": "Not Started",
```

### 3.6 `src/i18n/locales/pt-BR/common.ts` - Add Portuguese translations

Add new translation keys.

```ts
"module-progress-completed": "Concluído",
"module-progress-in-progress": "Em Progresso",
"module-progress-not-started": "Não Iniciado",
```

## 4. Execution Order

- [x] 3.1 Create batch progress API with types (`src/api/batch-module-progress.ts`)
- [x] 3.2 Create batch progress hook (`src/hooks/track/use-batch-module-progress.ts`)
- [x] 3.5 Add English translations
- [x] 3.6 Add Portuguese translations
- [x] 3.3 Update ModuleNode component (progress bar, loading state, status colors)
- [x] 3.4 Update TrackFlowViewer component (fetch progress, pass to nodes, edge coloring)

## 5. Side Navigation

No side navigation changes required.

## 6. Open Questions and missing details

- Q1: Should the skeleton loading state have a minimum display time to avoid flickering on fast connections?
