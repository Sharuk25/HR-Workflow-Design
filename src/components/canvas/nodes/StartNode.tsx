import { NodeProps } from '@xyflow/react';
import { StartNodeData } from '../../../types/workflow';
import { BaseNode } from './BaseNode';

export function StartNode({ data, selected }: NodeProps<StartNodeData>) {
  return (
    <BaseNode
      label={data.label}
      typeLabel="Start"
      accentColor="indigo-500"
      textColor="text-indigo-400"
      selected={selected}
      isStart
    >
      <div>Triggers on initialization</div>
    </BaseNode>
  );
}
