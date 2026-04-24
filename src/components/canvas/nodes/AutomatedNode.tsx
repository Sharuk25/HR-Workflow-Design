import { NodeProps } from '@xyflow/react';
import { AutomatedNodeData } from '../../../types/workflow';
import { BaseNode } from './BaseNode';

export function AutomatedNode({ data, selected }: NodeProps<AutomatedNodeData>) {
  return (
    <BaseNode
      label={data.label}
      typeLabel="Automated"
      accentColor="purple-500"
      textColor="text-purple-400"
      selected={selected}
    >
      <div>Action: {data.actionId || 'None'}</div>
    </BaseNode>
  );
}
