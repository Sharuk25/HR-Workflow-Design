import { Node, Edge } from '@xyflow/react';

export type NodeType = 'startNode' | 'taskNode' | 'approvalNode' | 'automatedNode' | 'endNode';

export interface BaseNodeData extends Record<string, unknown> {
  label: string;
}

export interface StartNodeData extends BaseNodeData {
  metadata?: Array<{ key: string; value: string }>;
}

export interface TaskNodeData extends BaseNodeData {
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: Array<{ key: string; value: string }>;
}

export interface ApprovalNodeData extends BaseNodeData {
  approverRole?: string;
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  actionId?: string;
  actionParams?: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  endMessage?: string;
  isSummary?: boolean;
}

export type WorkflowNode = Node<BaseNodeData, NodeType>;

export interface ExecutionLog {
  id: string;
  nodeId: string;
  nodeLabel: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  logs: ExecutionLog[];
  errors?: string[];
}
