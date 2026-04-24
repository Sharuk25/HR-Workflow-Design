import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import { useWorkflowStore } from '../../store/useWorkflowStore';
import { nodeTypes } from './nodes';
import DeletableEdge from './edges/DeletableEdge';
import { NodeType, WorkflowNode } from '../../types/workflow';
import { useTheme } from '../../contexts/ThemeContext';

const edgeTypes = {
  custom: DeletableEdge,
};

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { theme } = useTheme();
  
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onConnect = useWorkflowStore((state) => state.onConnect);
  const addNode = useWorkflowStore((state) => state.addNode);
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      let label = 'New Node';
      if (type === 'taskNode') label = 'Human Task';
      if (type === 'approvalNode') label = 'Manager Approval';
      if (type === 'automatedNode') label = 'System Action';
      if (type === 'endNode') label = 'End Workflow';

      const newNode: WorkflowNode = {
        id: uuidv4(),
        type,
        position,
        data: { label },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode],
  );

  const onSelectionChange = useCallback(
    ({ nodes }: { nodes: WorkflowNode[] }) => {
      if (nodes.length === 1) {
        setSelectedNodeId(nodes[0].id);
      } else {
        setSelectedNodeId(null);
      }
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div className="reactflow-wrapper flex-1 h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onSelectionChange={onSelectionChange as any}
        onPaneClick={onPaneClick}
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={{ 
          animated: true, 
          type: 'custom',
          style: { strokeWidth: 2, stroke: theme === 'dark' ? '#52525b' : '#a1a1aa' },
          markerEnd: { type: MarkerType.ArrowClosed, color: theme === 'dark' ? '#52525b' : '#a1a1aa' },
          interactionWidth: 20
        }}
        fitView
        className="bg-transparent"
        minZoom={0.2}
      >
        <Background color={theme === 'dark' ? '#27272a' : '#d4d4d8'} gap={24} size={2} />
        <Controls 
          className="flex flex-col gap-1 shadow-sm [&_button]:!bg-white dark:[&_button]:!bg-zinc-800 [&_button]:!border-zinc-200 dark:[&_button]:!border-zinc-700 [&_button]:!border [&_button]:rounded hover:[&_button]:!bg-zinc-100 dark:hover:[&_button]:!bg-zinc-700 [&_button_svg]:!fill-zinc-600 dark:[&_button_svg]:!fill-zinc-400" 
        />
        <MiniMap 
          zoomable 
          pannable 
          className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          maskColor={theme === 'dark' ? '#00000040' : '#ffffff80'}
          nodeClassName={(n) => {
            if (n.type === 'startNode') return 'fill-indigo-500';
            if (n.type === 'endNode') return 'fill-rose-500';
            if (n.type === 'approvalNode') return 'fill-amber-500';
            if (n.type === 'automatedNode') return 'fill-purple-500';
            return 'fill-blue-500';
        }} />
      </ReactFlow>
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
