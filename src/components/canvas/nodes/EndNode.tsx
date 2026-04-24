import { NodeProps } from '@xyflow/react';
import { EndNodeData } from '../../../types/workflow';
import { BaseNode } from './BaseNode';

export function EndNode({ data, selected }: NodeProps<EndNodeData>) {
  return (
    <BaseNode
      label={data.label}
      typeLabel="End"
      accentColor="rose-500"
      textColor="text-rose-400"
      selected={selected}
      isEnd
    >
      <div className="italic">{data.endMessage || '(No message)'}</div>
    </BaseNode>
  );
}
