import { SimulationResult, WorkflowNode } from '../types/workflow';
import { Edge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

export interface AutomatedAction {
  id: string;
  label: string;
  params: string[];
}

const mockAutomations: AutomatedAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'slack_message', label: 'Post to Slack', params: ['channel', 'message'] },
  { id: 'update_db', label: 'Update Database', params: ['table', 'recordId'] },
];

export const mockApi = {
  getAutomations: async (): Promise<AutomatedAction[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAutomations;
  },

  simulate: async (nodes: WorkflowNode[], edges: Edge[]): Promise<SimulationResult> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const logs: SimulationResult['logs'] = [];
    const errors: string[] = [];

    // Basic Validation
    const startNodes = nodes.filter((n) => n.type === 'startNode');
    if (startNodes.length === 0) {
      errors.push('Workflow must have at least one Start Node.');
      return { success: false, logs, errors };
    }
    if (startNodes.length > 1) {
      errors.push('Workflow cannot have more than one Start Node.');
      return { success: false, logs, errors };
    }

    const startNode = startNodes[0];
    let currentNodeId: string | null = startNode.id;
    const visited = new Set<string>();

    while (currentNodeId) {
      if (visited.has(currentNodeId)) {
        errors.push(`Cycle detected at node: ${nodes.find(n => n.id === currentNodeId)?.data.label}`);
        return { success: false, logs, errors };
      }
      visited.add(currentNodeId);

      const node = nodes.find((n) => n.id === currentNodeId);
      if (!node) break;

      logs.push({
        id: uuidv4(),
        nodeId: node.id,
        nodeLabel: node.data.label as string,
        status: 'success',
        message: `Executed node: ${node.data.label}`,
        timestamp: new Date().toISOString(),
      });

      // Find next node
      const outgoingEdges = edges.filter((e) => e.source === currentNodeId);
      if (outgoingEdges.length > 1) {
          // For simplicity in this mock simulation: take the first one, or handle branched?
          // Since it's a linear simple mock simulation, we'll just follow the first path or log a warning.
          logs.push({
              id: uuidv4(),
              nodeId: node.id,
              nodeLabel: node.data.label as string,
              status: 'success',
              message: `Multiple paths detected. Following edge: ${outgoingEdges[0].id}`,
              timestamp: new Date().toISOString()
          });
      }
      
      currentNodeId = outgoingEdges.length > 0 ? outgoingEdges[0].target : null;
    }

    return {
      success: errors.length === 0,
      logs,
      errors,
    };
  },
};
