# Technical Spec: Track - Module Tree Structure

## 0. Summary

**Goal:** Create a Track entity that groups modules in a tree structure, where users start from an initial module and branch out to different modules based on prerequisites, enabling learning paths like "Frontend Engineer" with modules for Programming Logic → HTML/JavaScript → CSS. Use React Flow for interactive visualization and editing.  
**Out of scope:** Track progress tracking, track completion logic, track recommendations, track search/discovery UI.

## 1. Technical Design

### 1.1 Amplify schema changes

Add a new model: `Track`. Store the module tree as parent pointers and optional ordering.

- `rootModuleId`: starting module ID
- `parentByModuleId`: `{ [moduleId]: "ROOT" | parentModuleId }`
- `positionByModuleId`: `{ [moduleId]: number }` for sibling order

```ts
// amplify/data/resource.ts

Track: a
  .model({
    title: a.string().required(),
    description: a.string().required(),

    rootModuleId: a.id().required(),

    // { [moduleId: string]: "ROOT" | parentModuleId }
    parentByModuleId: a.json().required(),

    // { [moduleId: string]: number }
    positionByModuleId: a.json(),

    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [
    allow.authenticated().to(["read"]),
    allow.owner().to(["create", "update", "delete"]),
  ]),
```

### 1.2 Type definitions

**`src/model/track.ts`**

```ts
import { type SelectionSet } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

export type Track = Schema["Track"]["type"];
export type TrackIdentifier = Schema["Track"]["identifier"];
export type TrackCreateInput = Schema["Track"]["createType"];
export type TrackUpdateInput = Schema["Track"]["updateType"];
export type TrackDeleteInput = Schema["Track"]["deleteType"];

export const trackSelectionSet = [
  "id",
  "title",
  "description",
  "rootModuleId",
  "parentByModuleId",
  "positionByModuleId",
  "createdAt",
  "updatedAt",
] as const;

export type TrackFull = SelectionSet<Track, typeof trackSelectionSet>;
```

### 1.3 API / Data fetching changes

**`src/api/track.ts`**

```ts
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import {
  type Track,
  type TrackIdentifier,
  type TrackCreateInput,
  type TrackUpdateInput,
  type TrackFull,
  trackSelectionSet,
} from "@/model/track";

const client = generateClient<Schema>();

/**
 * Get all tracks
 */
export const getTracks = async (): Promise<Track[]> => {
  const result = await client.models.Track.list();
  if (!result.data) return [];
  return result.data;
};

/**
 * Get a track by ID
 */
export const getTrack = async (
  identifier: TrackIdentifier,
): Promise<TrackFull | null> => {
  const result = await client.models.Track.get(identifier, {
    selectionSet: trackSelectionSet,
  });
  if (!result.data) return null;
  return result.data;
};

/**
 * Create a new track
 */
export const createTrack = async (input: TrackCreateInput): Promise<Track> => {
  const result = await client.models.Track.create(input);
  if (!result.data) throw new Error("Failed to create track");
  return result.data;
};

/**
 * Update a track
 */
export const updateTrack = async (input: TrackUpdateInput): Promise<Track> => {
  const result = await client.models.Track.update(input);
  if (!result.data) throw new Error("Failed to update track");
  return result.data;
};

/**
 * Delete a track
 */
export const deleteTrack = async (identifier: TrackIdentifier): Promise<void> => {
  const result = await client.models.Track.delete(identifier);
  if (!result.data) throw new Error("Failed to delete track");
};
```

**`src/hooks/track/use-tracks.ts`**

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getTracks } from "@/api/track";

/**
 * Query options for fetching all tracks
 */
export const getTracksQueryOptions = () =>
  queryOptions({
    queryKey: ["tracks"],
    queryFn: getTracks,
  });

/**
 * Hook to fetch all tracks
 */
export const useTracks = () => useQuery(getTracksQueryOptions());
```

**`src/hooks/track/use-track.ts`**

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getTrack } from "@/api/track";

/**
 * Query options for fetching a single track by ID
 */
export const getTrackQueryOptions = (trackId: string) =>
  queryOptions({
    queryKey: ["track", trackId],
    queryFn: () => getTrack({ id: trackId }),
  });

/**
 * Hook to fetch a single track by ID
 */
export const useTrack = (trackId: string) =>
  useQuery(getTrackQueryOptions(trackId));
```

**`src/hooks/track/use-create-track.ts`**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrack } from "@/api/track";

/**
 * Hook to create a new track
 */
export const useCreateTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
};
```

**`src/hooks/track/use-update-track.ts`**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTrack } from "@/api/track";

/**
 * Hook to update an existing track
 */
export const useUpdateTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTrack,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["track", data.id] });
    },
  });
};
```

**`src/hooks/track/use-delete-track.ts`**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrack } from "@/api/track";
import { type TrackIdentifier } from "@/model/track";

/**
 * Hook to delete a track
 */
export const useDeleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (identifier: TrackIdentifier) => deleteTrack(identifier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
};
```

**`src/hooks/modules/use-modules.ts`**

```ts
import { useQuery, queryOptions } from "@tanstack/react-query";
import { getModules } from "@/api/modules";

/**
 * Query options for fetching all modules
 */
export const getModulesQueryOptions = () =>
  queryOptions({
    queryKey: ["modules"],
    queryFn: getModules,
  });

/**
 * Hook to fetch all modules
 */
export const useModules = () => useQuery(getModulesQueryOptions());
```

### 1.4 Page changes

**`src/routes/track/index.tsx`** - Track list page

```tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TrackList } from "@/components/track/track-list";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import { useCallback } from "react";

export const Route = createFileRoute("/track/")({
  component: TracksPage,
});

function TracksPage() {
  const navigate = useNavigate();
  const isAdminUser = useIsAdminUser();

  const onCreateTrack = useCallback(() => {
    navigate({ to: "/track-create" });
  }, [navigate]);

  return (
    <TrackList onCreateTrack={isAdminUser ? onCreateTrack : undefined} />
  );
}
```

**`src/routes/track/$trackId.tsx`** - Track detail layout

```tsx
import { getTrackQueryOptions } from "@/hooks/track/use-track";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/track/$trackId")({
  component: RouteComponent,
  loader: async ({ params: { trackId }, context }) => {
    return {
      crumb: (
        await context.queryClient.ensureQueryData(getTrackQueryOptions(trackId))
      )?.title,
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
```

**`src/routes/track/$trackId/index.tsx`** - Track detail page

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { TrackDetail } from "@/components/track/track-detail";

export const Route = createFileRoute("/track/$trackId/")({
  component: TrackDetailPage,
});

function TrackDetailPage() {
  const { trackId } = Route.useParams();
  return <TrackDetail trackId={trackId} />;
}
```

**`src/routes/track-create.tsx`** - Track create page

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { TrackForm } from "@/components/track/track-form";

export const Route = createFileRoute("/track-create")({
  component: TrackCreatePage,
});

function TrackCreatePage() {
  return <TrackForm mode="create" />;
}
```

**`src/routes/track-edit/$trackId.tsx`** - Track edit page

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { TrackForm } from "@/components/track/track-form";
import { useTrack } from "@/hooks/track/use-track";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/track-edit/$trackId")({
  component: TrackEditPage,
});

function TrackEditPage() {
  const { trackId } = Route.useParams();
  const { t } = useTranslation();
  const { data: track, isLoading } = useTrack(trackId);

  if (isLoading) return <div>{t("loading")}</div>;
  if (!track) return <div>{t("track-not-found")}</div>;

  return (
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
  );
}
```

### 1.5 Component changes

**`src/components/track/track-list.tsx`** - List of tracks

```tsx
import { useTranslation } from "react-i18next";
import { useTracks } from "@/hooks/track/use-tracks";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";

export interface TrackListProps {
  onCreateTrack?: () => void;
}

export const TrackList = ({ onCreateTrack }: TrackListProps) => {
  const { t } = useTranslation();
  const { data: tracks, isLoading, isError } = useTracks();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (isError) {
    return <div>{t("error-loading-tracks")}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("tracks")}</h1>
        {onCreateTrack && (
          <Button onClick={onCreateTrack}>{t("create-track")}</Button>
        )}
      </div>
      {tracks?.length === 0 ? (
        <p className="text-muted-foreground">{t("no-tracks")}</p>
      ) : (
        <div className="grid gap-4">
          {tracks?.map((track) => (
            <Card
              key={track.id}
              className="cursor-pointer hover:bg-accent"
              onClick={() =>
                navigate({ to: "/track/$trackId", params: { trackId: track.id } })
              }
            >
              <CardHeader>
                <CardTitle>{track.title}</CardTitle>
                <CardDescription>{track.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
```

**`src/components/track/track-detail.tsx`** - Track detail with React Flow visualization and Edit/Delete buttons

```tsx
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useTrack } from "@/hooks/track/use-track";
import { useDeleteTrack } from "@/hooks/track/use-delete-track";
import { useIsAdminUser } from "@/hooks/use-is-admin-user";
import { TrackFlowViewer } from "@/components/track/track-flow-viewer";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface TrackDetailProps {
  trackId: string;
}

export const TrackDetail = ({ trackId }: TrackDetailProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: track, isLoading, isError } = useTrack(trackId);
  const deleteTrackMutation = useDeleteTrack();
  const isAdminUser = useIsAdminUser();

  const handleEdit = () => {
    navigate({ to: "/track-edit/$trackId", params: { trackId } });
  };

  const handleDelete = () => {
    deleteTrackMutation.mutate({ id: trackId }, {
      onSuccess: () => {
        navigate({ to: "/track" });
      },
    });
  };

  if (isLoading) return <div>{t("loading")}</div>;
  if (isError) return <div>{t("error-loading-track")}</div>;
  if (!track) return <div>{t("track-not-found")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{track.title}</h1>
          <p className="text-muted-foreground">{track.description}</p>
        </div>
        {isAdminUser && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              {t("edit")}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">{t("delete")}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("delete-track-confirm-title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("delete-track-confirm-description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    {t("delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <div className="h-[500px] border rounded-lg">
        <TrackFlowViewer
          rootModuleId={track.rootModuleId}
          parentByModuleId={track.parentByModuleId}
          positionByModuleId={track.positionByModuleId ?? {}}
        />
      </div>
    </div>
  );
};
```

**`src/components/track/track-flow-viewer.tsx`** - Read-only React Flow visualization with auto-layout

```tsx
import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useModules } from "@/hooks/modules/use-modules";
import { ModuleNode } from "@/components/track/module-node";

type ParentMap = Record<string, string>;

export interface TrackFlowViewerProps {
  rootModuleId: string;
  parentByModuleId: unknown;
  positionByModuleId: unknown;
}

const ROOT = "ROOT";
const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

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
 * Converts track JSON structure to React Flow nodes and edges
 */
const buildFlowElements = (
  parentBy: ParentMap,
  moduleMap: Map<string, { id: string; title: string }>,
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  for (const [moduleId, parentId] of Object.entries(parentBy)) {
    const module = moduleMap.get(moduleId);
    nodes.push({
      id: moduleId,
      type: "module",
      position: { x: 0, y: 0 },
      data: { label: module?.title ?? "Missing module", moduleId },
    });

    if (parentId !== ROOT) {
      edges.push({
        id: `${parentId}-${moduleId}`,
        source: parentId,
        target: moduleId,
        type: "smoothstep",
      });
    }
  }

  const layoutedNodes = applyDagreLayout(nodes, edges);
  return { nodes: layoutedNodes, edges };
};

export const TrackFlowViewer = ({
  rootModuleId,
  parentByModuleId,
}: TrackFlowViewerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: modules } = useModules();

  const parentBy = coerceParentMap(parentByModuleId);
  const moduleMap = useMemo(
    () => new Map((modules ?? []).map((m) => [m.id, m])),
    [modules],
  );

  const { nodes, edges } = useMemo(
    () => buildFlowElements(parentBy, moduleMap),
    [parentBy, moduleMap],
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
      fitView
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background />
      <Controls showInteractive={false} />
      <MiniMap />
    </ReactFlow>
  );
};
```

**`src/components/track/module-node.tsx`** - Custom React Flow node for modules

```tsx
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

interface ModuleNodeData {
  label: string;
  moduleId: string;
}

export const ModuleNode = memo(({ data }: NodeProps<ModuleNodeData>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 cursor-pointer hover:border-primary">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="font-medium text-sm">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});

ModuleNode.displayName = "ModuleNode";
```

**`src/components/track/track-flow-editor.tsx`** - Interactive React Flow editor with auto-layout and cycle detection

```tsx
import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModules } from "@/hooks/modules/use-modules";
import { ModuleNode } from "@/components/track/module-node";

type ParentMap = Record<string, string>;

export interface TrackFlowEditorProps {
  initialRootModuleId?: string;
  initialParentByModuleId?: ParentMap;
  onChange: (rootModuleId: string, parentByModuleId: ParentMap, hasCycle: boolean) => void;
}

const ROOT = "ROOT";
const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const nodeTypes = { module: ModuleNode };

/**
 * Detects if the graph contains a cycle
 */
const detectCycle = (edges: Edge[]): boolean => {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.source) ?? [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const visited = new Set<string>();
  const inStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    if (inStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    inStack.add(nodeId);

    for (const neighbor of adjacency.get(nodeId) ?? []) {
      if (hasCycle(neighbor)) return true;
    }

    inStack.delete(nodeId);
    return false;
  };

  for (const nodeId of adjacency.keys()) {
    if (hasCycle(nodeId)) return true;
  }

  return false;
};

/**
 * Applies dagre layout to nodes and edges
 */
const applyDagreLayout = (nodes: Node[], edges: Edge[]): Node[] => {
  if (nodes.length === 0) return nodes;

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
 * Converts React Flow nodes/edges back to track JSON structure
 */
const flowToTrackStructure = (
  nodes: Node[],
  edges: Edge[],
): { rootModuleId: string; parentByModuleId: ParentMap } => {
  const parentByModuleId: ParentMap = {};
  const hasIncomingEdge = new Set(edges.map((e) => e.target));

  for (const node of nodes) {
    const incomingEdge = edges.find((e) => e.target === node.id);
    parentByModuleId[node.id] = incomingEdge ? incomingEdge.source : ROOT;
  }

  const rootModuleId = nodes.find((n) => !hasIncomingEdge.has(n.id))?.id ?? "";

  return { rootModuleId, parentByModuleId };
};

export const TrackFlowEditor = ({
  initialParentByModuleId,
  onChange,
}: TrackFlowEditorProps) => {
  const { t } = useTranslation();
  const { data: modules } = useModules();
  const [selectedModuleToAdd, setSelectedModuleToAdd] = useState<string>("");

  const moduleMap = useMemo(
    () => new Map((modules ?? []).map((m) => [m.id, m])),
    [modules],
  );

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!initialParentByModuleId) return { initialNodes: [], initialEdges: [] };

    const nodes: Node[] = Object.keys(initialParentByModuleId).map((moduleId) => ({
      id: moduleId,
      type: "module",
      position: { x: 0, y: 0 },
      data: { label: moduleMap.get(moduleId)?.title ?? "Missing module", moduleId },
    }));

    const edges: Edge[] = Object.entries(initialParentByModuleId)
      .filter(([_, parentId]) => parentId !== ROOT)
      .map(([moduleId, parentId]) => ({
        id: `${parentId}-${moduleId}`,
        source: parentId,
        target: moduleId,
        type: "smoothstep",
      }));

    return { initialNodes: applyDagreLayout(nodes, edges), initialEdges: edges };
  }, [initialParentByModuleId, moduleMap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const hasCycle = useMemo(() => detectCycle(edges), [edges]);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: "smoothstep" }, eds));
    },
    [setEdges],
  );

  const applyLayout = useCallback(() => {
    setNodes((nds) => applyDagreLayout(nds, edges));
  }, [edges, setNodes]);

  const addModule = useCallback(() => {
    if (!selectedModuleToAdd) return;
    const module = moduleMap.get(selectedModuleToAdd);
    if (!module) return;

    const newNode: Node = {
      id: module.id,
      type: "module",
      position: { x: 0, y: 0 },
      data: { label: module.title, moduleId: module.id },
    };

    setNodes((nds) => {
      const updatedNodes = [...nds, newNode];
      return applyDagreLayout(updatedNodes, edges);
    });
    setSelectedModuleToAdd("");
  }, [selectedModuleToAdd, moduleMap, edges, setNodes]);

  const removeSelectedNodes = useCallback(() => {
    const selectedIds = new Set(nodes.filter((n) => n.selected).map((n) => n.id));
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) =>
      eds.filter((e) => !selectedIds.has(e.source) && !selectedIds.has(e.target)),
    );
  }, [nodes, setNodes, setEdges]);

  const handleSave = useCallback(() => {
    const { rootModuleId, parentByModuleId } = flowToTrackStructure(nodes, edges);
    onChange(rootModuleId, parentByModuleId, hasCycle);
  }, [nodes, edges, hasCycle, onChange]);

  const availableModules = useMemo(() => {
    const usedIds = new Set(nodes.map((n) => n.id));
    return (modules ?? []).filter((m) => !usedIds.has(m.id));
  }, [modules, nodes]);

  return (
    <div className="h-[500px] border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-left" className="bg-white p-2 rounded shadow space-y-2">
          <div className="flex gap-2">
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
            <Button onClick={addModule} disabled={!selectedModuleToAdd} size="sm">
              {t("add-module")}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={applyLayout} variant="outline" size="sm">
              {t("auto-layout")}
            </Button>
            <Button onClick={removeSelectedNodes} variant="destructive" size="sm">
              {t("remove-selected")}
            </Button>
            <Button onClick={handleSave} size="sm">
              {t("save-structure")}
            </Button>
          </div>
          {hasCycle && (
            <p className="text-sm text-red-600">{t("cycle-detected")}</p>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
};
```

**`src/components/track/track-form.tsx`** - Form for creating/editing tracks with React Flow editor

```tsx
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateTrack } from "@/hooks/track/use-create-track";
import { useUpdateTrack } from "@/hooks/track/use-update-track";
import { TrackFlowEditor } from "@/components/track/track-flow-editor";

type ParentMap = Record<string, string>;

type FormValues = {
  title: string;
  description: string;
};

export interface TrackFormProps {
  mode: "create" | "edit";
  trackId?: string;
  initialData?: {
    title: string;
    description: string;
    rootModuleId: string;
    parentByModuleId: ParentMap;
  };
}

export const TrackForm = ({ mode, trackId, initialData }: TrackFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createTrackMutation = useCreateTrack();
  const updateTrackMutation = useUpdateTrack();

  const [rootModuleId, setRootModuleId] = useState(initialData?.rootModuleId ?? "");
  const [parentByModuleId, setParentByModuleId] = useState<ParentMap>(
    initialData?.parentByModuleId ?? {},
  );
  const [hasCycle, setHasCycle] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
    },
  });

  const handleFlowChange = useCallback(
    (newRootModuleId: string, newParentByModuleId: ParentMap, newHasCycle: boolean) => {
      setRootModuleId(newRootModuleId);
      setParentByModuleId(newParentByModuleId);
      setHasCycle(newHasCycle);
    },
    [],
  );

  const isPending = createTrackMutation.isPending || updateTrackMutation.isPending;
  const canSubmit = rootModuleId && !hasCycle && !isPending;

  const onSubmit = (values: FormValues) => {
    if (!canSubmit) return;

    if (mode === "create") {
      createTrackMutation.mutate(
        {
          title: values.title,
          description: values.description,
          rootModuleId,
          parentByModuleId,
          positionByModuleId: {},
        },
        {
          onSuccess: (track) => {
            navigate({ to: "/track/$trackId", params: { trackId: track.id } });
          },
        },
      );
    } else if (mode === "edit" && trackId) {
      updateTrackMutation.mutate(
        {
          id: trackId,
          title: values.title,
          description: values.description,
          rootModuleId,
          parentByModuleId,
          positionByModuleId: {},
        },
        {
          onSuccess: () => {
            navigate({ to: "/track/$trackId", params: { trackId } });
          },
        },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4 max-w-xl">
        <div className="space-y-2">
          <Label htmlFor="title">{t("title")}</Label>
          <Input id="title" {...register("title", { required: t("title-required") })} />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t("description")}</Label>
          <Textarea
            id="description"
            {...register("description", { required: t("description-required") })}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("track-structure")}</Label>
        <p className="text-sm text-muted-foreground">{t("track-structure-help")}</p>
        <TrackFlowEditor
          initialRootModuleId={initialData?.rootModuleId}
          initialParentByModuleId={initialData?.parentByModuleId}
          onChange={handleFlowChange}
        />
        {!rootModuleId && (
          <p className="text-sm text-red-600">{t("root-module-required")}</p>
        )}
        {hasCycle && (
          <p className="text-sm text-red-600">{t("cycle-detected")}</p>
        )}
      </div>

      <Button type="submit" disabled={!canSubmit}>
        {isPending
          ? t("loading")
          : mode === "create"
            ? t("create-track")
            : t("save-changes")}
      </Button>
    </form>
  );
};
```

### 1.6 Translation keys

| Key                                | EN                                                       | PT-BR                                                              |
| ---------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| `add-module`                       | Add Module                                               | Adicionar Módulo                                                   |
| `auto-layout`                      | Auto Layout                                              | Layout Automático                                                  |
| `cancel`                           | Cancel                                                   | Cancelar                                                           |
| `create-track`                     | Create Track                                             | Criar Trilha                                                       |
| `cycle-detected`                   | Cycle detected. Remove circular connections to save.     | Ciclo detectado. Remova conexões circulares para salvar.           |
| `delete`                           | Delete                                                   | Excluir                                                            |
| `delete-track-confirm-title`       | Delete track?                                            | Excluir trilha?                                                    |
| `delete-track-confirm-description` | This action cannot be undone. This will permanently delete the track. | Esta ação não pode ser desfeita. A trilha será excluída permanentemente. |
| `description-required`             | Description is required                                  | Descrição é obrigatória                                            |
| `edit`                             | Edit                                                     | Editar                                                             |
| `error-loading-track`              | Error loading track                                      | Erro ao carregar trilha                                            |
| `error-loading-tracks`             | Error loading tracks                                     | Erro ao carregar trilhas                                           |
| `missing-module`                   | Missing module                                           | Módulo ausente                                                     |
| `no-modules-in-track`              | No modules in this track                                 | Nenhum módulo nesta trilha                                         |
| `no-tracks`                        | No tracks available                                      | Nenhuma trilha disponível                                          |
| `remove-selected`                  | Remove Selected                                          | Remover Selecionados                                               |
| `root-module-required`             | At least one module is required                          | Pelo menos um módulo é obrigatório                                 |
| `save-changes`                     | Save Changes                                             | Salvar Alterações                                                  |
| `save-structure`                   | Save Structure                                           | Salvar Estrutura                                                   |
| `select-module`                    | Select a module                                          | Selecione um módulo                                                |
| `title-required`                   | Title is required                                        | Título é obrigatório                                               |
| `track-not-found`                  | Track not found                                          | Trilha não encontrada                                              |
| `track-structure`                  | Track Structure                                          | Estrutura da Trilha                                                |
| `track-structure-help`             | Add modules and connect them to define the learning path | Adicione módulos e conecte-os para definir o caminho de aprendizado |
| `tracks`                           | Tracks                                                   | Trilhas                                                            |

## 2. Acceptance Criteria

### AC1: Create a track with visual editor

**Given** an admin user is on the track creation page  
**When** they fill in title, description, add modules via the React Flow editor, connect them, and submit  
**Then** a new track is created with the correct `rootModuleId` and `parentByModuleId` structure, and they are redirected to the track detail page

### AC2: View track list

**Given** a user navigates to the tracks page  
**When** the page loads  
**Then** they see a list of all available tracks with title and description

### AC3: View track detail with React Flow visualization

**Given** a user clicks on a track from the list  
**When** the track detail page loads  
**Then** they see the track title, description, and an interactive React Flow diagram showing modules as nodes and their relationships as edges

### AC4: Navigate to module from track visualization

**Given** a user is viewing a track detail page  
**When** they click on a module node in the React Flow diagram  
**Then** they are navigated to that module's detail page

### AC5: Add modules in editor

**Given** an admin user is creating/editing a track  
**When** they select a module from the dropdown and click "Add Module"  
**Then** a new node appears in the React Flow editor

### AC6: Module can only be added once per track

**Given** an admin user is creating/editing a track and a module is already in the editor  
**When** they view the module dropdown  
**Then** that module is not available for selection

### AC7: Connect modules in editor

**Given** an admin user has multiple modules in the editor  
**When** they drag from one node's handle to another node's handle  
**Then** an edge is created connecting the two modules

### AC8: Remove modules in editor

**Given** an admin user has selected one or more nodes  
**When** they click "Remove Selected"  
**Then** the selected nodes and their connected edges are removed

### AC9: Edit an existing track

**Given** an admin user is viewing a track detail page  
**When** they click the "Edit" button  
**Then** they are navigated to the edit page with the form pre-filled with the track's title, description, and module structure

### AC10: Update track saves changes

**Given** an admin user is on the track edit page  
**When** they modify the title, description, or module structure and submit  
**Then** the track is updated and they are redirected to the track detail page

### AC11: Delete a track with confirmation

**Given** an admin user is viewing a track detail page  
**When** they click the "Delete" button and confirm the deletion  
**Then** the track is deleted and they are redirected to the track list page

### AC12: Edit/Delete buttons only visible to admin users

**Given** a non-admin user is viewing a track detail page  
**When** the page loads  
**Then** the Edit and Delete buttons are not visible

### AC13: Tracks item in sidebar navigation

**Given** a user is logged in  
**When** they view the sidebar  
**Then** they see a "Tracks" item that navigates to the tracks list page

### AC14: Deleted modules show as missing

**Given** a track contains a reference to a module that has been deleted  
**When** a user views the track detail page  
**Then** the node displays "Missing module" instead of the module title

### Edge cases

- E1: Track with empty `parentByModuleId` or no modules shows "No modules in this track"
- E2: Track references a module ID not found in modules list shows "Missing module" for that node
- E3: User cannot submit form without at least one module in the editor
- E4: Disconnected nodes (no incoming edge) are treated as root candidates; the first one becomes `rootModuleId`
- E5: Canceling delete confirmation does not delete the track
- E6: If track structure contains a cycle, viewer renders only reachable nodes without crashing
- E7: Editor shows validation error and disables save if structure contains a cycle

## 3. Implementation Tasks

### 3.1 Install @xyflow/react and dagre packages

```bash
npm install @xyflow/react dagre @types/dagre
```

### 3.2 `amplify/data/resource.ts` - Add Track model

Add Track model with JSON structure fields.

```ts
Track: a
  .model({
    title: a.string().required(),
    description: a.string().required(),
    rootModuleId: a.id().required(),
    parentByModuleId: a.json().required(),
    positionByModuleId: a.json(),
    owner: a
      .string()
      .authorization((allow) => [allow.owner().to(["read", "delete"])]),
  })
  .authorization((allow) => [
    allow.authenticated().to(["read"]),
    allow.owner().to(["create", "update", "delete"]),
  ]),
```

### 3.3 `src/model/track.ts` - Create Track type definitions

Create the model file with schema-inferred types and selection set.

### 3.4 `src/api/track.ts` - Create Track API functions

Create CRUD functions for Track.

### 3.5 `src/hooks/track/use-tracks.ts` - Create useTracks hook

Create query hook for listing tracks.

### 3.6 `src/hooks/track/use-track.ts` - Create useTrack hook

Create query hook for getting a single track.

### 3.7 `src/hooks/track/use-create-track.ts` - Create useCreateTrack hook

Create mutation hook for creating tracks.

### 3.8 `src/hooks/track/use-update-track.ts` - Create useUpdateTrack hook

Create mutation hook for updating tracks.

### 3.9 `src/hooks/track/use-delete-track.ts` - Create useDeleteTrack hook

Create mutation hook for deleting tracks.

### 3.10 `src/hooks/modules/use-modules.ts` - Create useModules hook

Create query hook for listing all modules.

### 3.11 `src/components/track/module-node.tsx` - Create custom React Flow node

Create custom node component for displaying modules in the flow.

### 3.12 `src/components/track/track-flow-viewer.tsx` - Create read-only flow viewer

Create React Flow component for viewing track structure (read-only).

### 3.13 `src/components/track/track-flow-editor.tsx` - Create interactive flow editor

Create React Flow component for editing track structure (add/remove/connect modules).

### 3.14 `src/components/track/track-list.tsx` - Create TrackList component

Create component to display list of tracks with empty and error states.

### 3.15 `src/components/track/track-detail.tsx` - Create TrackDetail component

Create component to display track details with React Flow viewer, Edit/Delete buttons, and error state.

### 3.16 `src/components/track/track-form.tsx` - Create TrackForm component

Create form component with React Flow editor for creating/editing tracks.

### 3.17 `src/routes/track/index.tsx` - Create tracks list route

Create route for tracks list page.

### 3.18 `src/routes/track/$trackId.tsx` - Create track detail layout route

Create route layout for track detail.

### 3.19 `src/routes/track/$trackId/index.tsx` - Create track detail route

Create route for track detail page.

### 3.20 `src/routes/track-create.tsx` - Create track creation route

Create route for track creation page.

### 3.21 `src/routes/track-edit/$trackId.tsx` - Create track edit route

Create route for track edit page that loads existing track data.

### 3.22 `src/components/layout/app-sidebar.tsx` - Add Tracks item to sidebar

Add a new navigation item for Tracks in the `navMain` array.

```tsx
navMain: [
  {
    title: t("dashboard"),
    onClick: () => {
      setOpen(false);
      setOpenMobile(false);
      navigate({ to: "/dashboard" });
    },
    icon: IconDashboard,
  },
  {
    title: t("modules"),
    onClick: () => {
      setOpen(false);
      setOpenMobile(false);
      navigate({ to: "/module" });
    },
    icon: IconDashboard,
  },
  {
    title: t("tracks"),
    onClick: () => {
      setOpen(false);
      setOpenMobile(false);
      navigate({ to: "/track" });
    },
    icon: IconDashboard,
  },
],
```

### 3.23 `src/i18n/locales/en/common.ts` - Add English translations

Add translation keys for track feature.

### 3.24 `src/i18n/locales/pt-BR/common.ts` - Add Portuguese translations

Add translation keys for track feature.

## 4. Execution Order

- [x] 3.1 Install @xyflow/react and dagre packages
- [x] 3.2 Add schema model (`amplify/data/resource.ts`)
- [x] 3.3 Create Track types (`src/model/track.ts`)
- [x] 3.4 Create Track API (`src/api/track.ts`)
- [x] 3.5 Create useTracks hook
- [x] 3.6 Create useTrack hook
- [x] 3.7 Create useCreateTrack hook
- [x] 3.8 Create useUpdateTrack hook
- [x] 3.9 Create useDeleteTrack hook
- [x] 3.10 Create useModules hook
- [x] 3.23 Add English translations
- [x] 3.24 Add Portuguese translations
- [x] 3.11 Create ModuleNode component
- [x] 3.12 Create TrackFlowViewer component
- [x] 3.13 Create TrackFlowEditor component
- [x] 3.14 Create TrackList component (with empty and error states)
- [x] 3.15 Create TrackDetail component (with Edit/Delete buttons, error state)
- [x] 3.16 Create TrackForm component (create/edit modes)
- [x] 3.17 Create tracks list route
- [x] 3.18 Create track detail layout route
- [x] 3.19 Create track detail route
- [x] 3.20 Create track creation route
- [x] 3.21 Create track edit route
- [x] 3.22 Add Tracks item to AppSidebar

## 5. Open Questions and missing details

- ~~Q1: Should there be validation to prevent cycles when connecting modules in the editor?~~ Yes, prevent saving cycles and handle gracefully when loading.
- ~~Q2: Should node positions be persisted in the database for consistent layout across sessions?~~ No, use dagre auto-layout each time.
- ~~Q3: Should there be auto-layout functionality (e.g., using dagre) to arrange nodes automatically?~~ Yes, use auto-layout.
- ~~Q4: Can a module appear multiple times in a track?~~ No, each module can only appear once per track.
- ~~Q5: What happens if a module is deleted but still referenced in a track?~~ Show "Missing module" in the viewer/editor.
