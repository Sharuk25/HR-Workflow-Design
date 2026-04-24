import { NodeProps } from '@xyflow/react';
import { TaskNodeData } from '../../../types/workflow';
import { BaseNode } from './BaseNode';

export function TaskNode({ data, selected }: NodeProps<TaskNodeData>) {
  return (
    <BaseNode
      label={data.label}
      typeLabel="Task"
      accentColor="blue-500"
      textColor="text-blue-400"
      selected={selected}
    >
      <div>{data.assignee ? `Assignee: ${data.assignee}` : 'Assignee: Unassigned'}</div>
    </BaseNode>
  );
}
