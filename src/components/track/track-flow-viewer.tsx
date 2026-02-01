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
import {
  type ModuleProgressMap,
  type ModuleProgressInfo,
} from "@/api/batch-module-progress";

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
 */
const getEdgeColor = (
  sourceStatus: ModuleProgressInfo["status"] | undefined,
  targetStatus: ModuleProgressInfo["status"] | undefined,
): string | undefined => {
  const source = sourceStatus ?? "not_started";
  const target = targetStatus ?? "not_started";

  if (source === "completed" && target === "completed") {
    return "#22c55e";
  }
  if (
    source === "in_progress" ||
    target === "in_progress" ||
    source === "completed" ||
    target === "completed"
  ) {
    return "#eab308";
  }
  return undefined;
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
      const edgeColor = getEdgeColor(
        progressMap[parentId]?.status,
        progress?.status,
      );
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
  const { data: modules, isLoading: isLoadingModules } = useModules();

  if (isLoadingModules) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return (
    <TrackFlowViewerInner
      rootModuleId={rootModuleId}
      parentByModuleId={parentByModuleId}
      modules={modules ?? []}
    />
  );
};

interface TrackFlowViewerInnerProps {
  rootModuleId: string;
  parentByModuleId: unknown;
  modules: { id: string; title: string }[];
}

const TrackFlowViewerInner = ({
  rootModuleId,
  parentByModuleId,
  modules,
}: TrackFlowViewerInnerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useTheme();

  const parentBy = coerceParentMap(parentByModuleId);
  const moduleIds = useMemo(() => Object.keys(parentBy), [parentBy]);

  const { data: progressMap, isLoading: isLoadingProgress } =
    useBatchModuleProgress(moduleIds);

  const moduleMap = useMemo(
    () => new Map(modules.map((m) => [m.id, m])),
    [modules],
  );

  const { nodes, edges } = useMemo(
    () =>
      buildFlowElements(
        parentBy,
        moduleMap,
        progressMap ?? {},
        isLoadingProgress,
      ),
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
      defaultEdgeOptions={{ type: "default" }}
      onNodeClick={onNodeClick}
      colorMode={mode}
      fitView
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
};
