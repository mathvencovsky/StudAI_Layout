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
import { useResolvedColorMode } from "@/hooks/use-resolved-color-mode";

type ParentMap = Record<string, string>;

export interface TrackFlowEditorProps {
  initialRootModuleId?: string;
  initialParentByModuleId?: ParentMap;
  onChange: (
    rootModuleId: string,
    parentByModuleId: ParentMap,
    hasCycle: boolean,
  ) => void;
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

/**
 * Interactive React Flow editor for track structure
 */
export const TrackFlowEditor = ({
  initialParentByModuleId,
  onChange,
}: TrackFlowEditorProps) => {
  const { t } = useTranslation();
  const { data: modules, isLoading: isLoadingModules } = useModules();

  if (isLoadingModules) {
    return (
      <div className="h-[400px] border rounded-lg bg-muted/20 flex items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return (
    <TrackFlowEditorInner
      initialParentByModuleId={initialParentByModuleId}
      onChange={onChange}
      modules={modules ?? []}
    />
  );
};

interface TrackFlowEditorInnerProps {
  initialParentByModuleId?: ParentMap;
  onChange: (
    rootModuleId: string,
    parentByModuleId: ParentMap,
    hasCycle: boolean,
  ) => void;
  modules: { id: string; title: string }[];
}

const TrackFlowEditorInner = ({
  initialParentByModuleId,
  onChange,
  modules,
}: TrackFlowEditorInnerProps) => {
  const { t } = useTranslation();
  const colorMode = useResolvedColorMode();
  const [selectedModuleToAdd, setSelectedModuleToAdd] = useState<string>("");

  const moduleMap = useMemo(
    () => new Map(modules.map((m) => [m.id, m])),
    [modules],
  );

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!initialParentByModuleId) return { initialNodes: [], initialEdges: [] };

    const nodes: Node[] = Object.keys(initialParentByModuleId).map(
      (moduleId) => ({
        id: moduleId,
        type: "module",
        position: { x: 0, y: 0 },
        data: {
          label: moduleMap.get(moduleId)?.title ?? "Missing module",
          moduleId,
        },
      }),
    );

    const edges: Edge[] = Object.entries(initialParentByModuleId)
      .filter(([, parentId]) => parentId !== ROOT)
      .map(([moduleId, parentId]) => ({
        id: `${parentId}-${moduleId}`,
        source: parentId,
        target: moduleId,
      }));

    return {
      initialNodes: applyDagreLayout(nodes, edges),
      initialEdges: edges,
    };
  }, [initialParentByModuleId, moduleMap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const hasCycle = useMemo(() => detectCycle(edges), [edges]);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
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
    const selectedIds = new Set(
      nodes.filter((n) => n.selected).map((n) => n.id),
    );
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) =>
      eds.filter(
        (e) => !selectedIds.has(e.source) && !selectedIds.has(e.target),
      ),
    );
  }, [nodes, setNodes, setEdges]);

  const handleSave = useCallback(() => {
    const { rootModuleId, parentByModuleId } = flowToTrackStructure(
      nodes,
      edges,
    );
    onChange(rootModuleId, parentByModuleId, hasCycle);
  }, [nodes, edges, hasCycle, onChange]);

  const availableModules = useMemo(() => {
    const usedIds = new Set(nodes.map((n) => n.id));
    return modules.filter((m) => !usedIds.has(m.id));
  }, [modules, nodes]);

  return (
    <div className="h-[400px] border rounded-lg bg-muted/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ type: "default" }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={colorMode}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <Panel
          position="top-left"
          className="bg-card p-3 rounded-lg border space-y-3"
        >
          <div className="flex gap-2 items-center">
            <Select
              value={selectedModuleToAdd}
              onValueChange={setSelectedModuleToAdd}
            >
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
            <Button
              type="button"
              onClick={addModule}
              disabled={!selectedModuleToAdd}
            >
              {t("add-module")}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={applyLayout}>
              {t("auto-layout")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={removeSelectedNodes}
            >
              {t("remove-selected")}
            </Button>
            <Button type="button" onClick={handleSave}>
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
