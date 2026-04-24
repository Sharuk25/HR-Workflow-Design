import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { WorkflowNode } from '../types/workflow';

interface WorkflowState {
  workflowId: string | null;
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: OnNodesChange<WorkflowNode>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  setWorkflowId: (id: string | null) => void;
  setNodes: (nodes: WorkflowNode[] | ((nodes: WorkflowNode[]) => WorkflowNode[])) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  addNode: (node: WorkflowNode) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  setSelectedNodeId: (id: string | null) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  loadWorkflow: (id: string | null, nodes: WorkflowNode[], edges: Edge[]) => void;
  resetWorkflow: () => void;
}

const initialNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'startNode',
    position: { x: 250, y: 100 },
    data: { label: 'Start Workflow', metadata: [] },
  },
];

export const useWorkflowStore = create<WorkflowState>()(
  temporal(
    (set, get) => ({
      workflowId: null,
      nodes: initialNodes,
      edges: [],
      selectedNodeId: null,

      onNodesChange: (changes: NodeChange<WorkflowNode>[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },

      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      onConnect: (connection: Connection) => {
        set({
          edges: addEdge({ ...connection, type: 'custom' }, get().edges),
        });
      },
      
      setWorkflowId: (id) => set({ workflowId: id }),

      setNodes: (nodesInput) => {
        set({
          nodes: typeof nodesInput === 'function' ? nodesInput(get().nodes) : nodesInput,
        });
      },

      setEdges: (edgesInput) => {
        set({
          edges: typeof edgesInput === 'function' ? edgesInput(get().edges) : edgesInput,
        });
      },

      addNode: (node) => {
        set({ nodes: [...get().nodes, node] });
      },

      updateNodeData: (nodeId, data) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              return { ...node, data: { ...node.data, ...data } };
            }
            return node;
          }),
        });
      },

      setSelectedNodeId: (id) => {
        set({ selectedNodeId: id });
      },

      deleteNode: (id) => {
        set({
          nodes: get().nodes.filter((node) => node.id !== id),
          edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
          selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
        });
      },

      deleteEdge: (id) => {
        set({
          edges: get().edges.filter((edge) => edge.id !== id),
        });
      },

      loadWorkflow: (id, nodes, edges) => {
        set({ workflowId: id, nodes, edges, selectedNodeId: null });
        useWorkflowStore.temporal.getState().clear();
      },

      resetWorkflow: () => {
        set({ workflowId: null, nodes: initialNodes, edges: [], selectedNodeId: null });
        useWorkflowStore.temporal.getState().clear();
      },
    }),
    {
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }), // Only state to track for undo/redo
    }
  )
);
