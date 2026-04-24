import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from '@xyflow/react';
import { useWorkflowStore } from '../../../store/useWorkflowStore';
import { X } from 'lucide-react';

export default function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const deleteEdge = useWorkflowStore((state) => state.deleteEdge);
  
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            className="w-5 h-5 bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-red-400 hover:border-red-500 hover:bg-zinc-900 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md group"
            onClick={(event) => {
              event.stopPropagation();
              deleteEdge(id);
            }}
            title="Remove connection"
          >
            <X size={12} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
