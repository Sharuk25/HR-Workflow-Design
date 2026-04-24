import { NodeProps } from '@xyflow/react';
import { ApprovalNodeData } from '../../../types/workflow';
import { BaseNode } from './BaseNode';

export function ApprovalNode({ data, selected }: NodeProps<ApprovalNodeData>) {
  return (
    <BaseNode
      label={data.label}
      typeLabel="Approval"
      accentColor="amber-500"
      textColor="text-amber-400"
      selected={selected}
    >
      <div>Approver: {data.approverRole || 'Unassigned'}</div>
      {data.autoApproveThreshold !== undefined ? <div>Auto-approve: &lt;{data.autoApproveThreshold}d</div> : null}
    </BaseNode>
  );
}
