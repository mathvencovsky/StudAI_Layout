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

/**
 * Read-only React Flow visualization for track structure
 */
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
