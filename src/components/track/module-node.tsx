import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

export interface ModuleNodeProps {
  data: {
    label: string;
    moduleId: string;
  };
}

/**
 * Custom React Flow node for displaying modules in the track flow
 */
export const ModuleNode = memo(({ data }: ModuleNodeProps) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 cursor-pointer hover:border-primary">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="font-medium text-sm">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});

ModuleNode.displayName = "ModuleNode";
