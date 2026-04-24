import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { mockApi, AutomatedAction } from '../../api/mockApi';
import { Trash2 } from 'lucide-react';

export function PropertiesPanel() {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  const [automations, setAutomations] = useState<AutomatedAction[]>([]);
  
  useEffect(() => {
    mockApi.getAutomations().then(setAutomations);
  }, []);

  if (!selectedNodeId) {
    return (
      <aside className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] flex flex-col h-full items-center justify-center p-6 text-center text-sm text-zinc-500">
        Select a node on the canvas to configure its properties.
      </aside>
    );
  }

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const handleChange = (key: string, value: any) => {
    updateNodeData(node.id, { [key]: value });
  };

  const inputClass = "w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 text-xs focus:border-indigo-500 outline-none text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600";
  const labelClass = "block text-[10px] text-zinc-500 uppercase font-semibold mb-2";

  const renderFormFields = () => {
    switch (node.type) {
      case 'startNode':
        return (
          <>
            <div className="mb-4">
              <label className={labelClass}>Title</label>
              <input
                type="text"
                className={inputClass}
                value={node.data.label as string}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>
            {/* Metadata could be a dynamic list, keeping simple for prototype */}
          </>
        );
      case 'taskNode':
        return (
          <>
            <div className="mb-4">
              <label className={labelClass}>Title</label>
              <input
                type="text"
                className={inputClass}
                value={node.data.label as string}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className={labelClass}>Description</label>
              <textarea
                className={inputClass}
                value={(node.data.description as string) || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className={labelClass}>Assignee</label>
              <input
                type="text"
                className={inputClass}
                value={(node.data.assignee as string) || ''}
                onChange={(e) => handleChange('assignee', e.target.value)}
                placeholder="e.g., HR Team"
              />
            </div>
            <div className="mb-4">
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                className={inputClass}
                value={(node.data.dueDate as string) || ''}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
          </>
        );
      case 'approvalNode':
        return (
          <>
            <div className="mb-4">
              <label className={labelClass}>Title</label>
              <input
                type="text"
                className={inputClass}
                value={node.data.label as string}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className={labelClass}>Approver Role</label>
              <select
                className={inputClass}
                value={(node.data.approverRole as string) || ''}
                onChange={(e) => handleChange('approverRole', e.target.value)}
              >
                <option value="">Select Role...</option>
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
              </select>
            </div>
            <div className="mb-4">
              <label className={labelClass}>Auto-approve Threshold (days)</label>
              <input
                type="number"
                className={inputClass}
                value={(node.data.autoApproveThreshold as number) || ''}
                onChange={(e) => handleChange('autoApproveThreshold', Number(e.target.value))}
              />
            </div>
          </>
        );
      case 'automatedNode':
        const selectedAction = automations.find((a) => a.id === node.data.actionId);
        return (
          <>
            <div className="mb-4">
              <label className={labelClass}>Title</label>
              <input
                type="text"
                className={inputClass}
                value={node.data.label as string}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className={labelClass}>Action</label>
              <select
                className={inputClass}
                value={(node.data.actionId as string) || ''}
                onChange={(e) => handleChange('actionId', e.target.value)}
              >
                <option value="">Select Action...</option>
                {automations.map((action) => (
                  <option key={action.id} value={action.id}>
                    {action.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedAction && selectedAction.params.length > 0 && (
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded flex flex-col gap-2 mb-4">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Parameters</h4>
                {selectedAction.params.map((param) => (
                  <div key={param} className="last:mb-0">
                    <label className="block text-[10px] text-zinc-600 dark:text-zinc-400 mb-1 capitalize">{param}</label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded p-1.5 text-xs text-zinc-900 dark:text-zinc-200 focus:border-indigo-500 outline-none"
                      value={((node.data.actionParams as any)?.[param]) || ''}
                      onChange={(e) => {
                        const currentParams = (node.data.actionParams as any) || {};
                        handleChange('actionParams', { ...currentParams, [param]: e.target.value });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        );
      case 'endNode':
        return (
          <>
            <div className="mb-4">
              <label className={labelClass}>Title</label>
              <input
                type="text"
                className={inputClass}
                value={node.data.label as string}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className={labelClass}>End Message</label>
              <textarea
                className={inputClass}
                value={(node.data.endMessage as string) || ''}
                onChange={(e) => handleChange('endMessage', e.target.value)}
                rows={2}
              />
            </div>
            <div className="mb-4 flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="isSummary"
                checked={(node.data.isSummary as boolean) || false}
                onChange={(e) => handleChange('isSummary', e.target.checked)}
                className="rounded text-indigo-500 bg-zinc-900 border-zinc-800"
              />
              <label htmlFor="isSummary" className="text-xs font-medium text-zinc-300 cursor-pointer">Generate Summary Report</label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Node Configuration</h2>
        <button
          onClick={() => deleteNode(node.id)}
          className="text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title="Delete Node"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="p-5 flex flex-col gap-6 flex-1">
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{node.type.replace('Node', '')}</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-600 font-mono">ID: {node.id.split('-')[0]}</span>
        </div>
        {renderFormFields()}
      </div>
      <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        <button className="w-full justify-center flex items-center py-2 text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded shadow-sm opacity-60">
          Auto-Saving enabled
        </button>
      </div>
    </aside>
  );
}
