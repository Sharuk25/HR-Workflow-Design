import React from 'react';
import { CalendarCheck, Flag, PlayCircle, UserCheck, Zap } from 'lucide-react';

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const draggables = [
    { type: 'startNode', label: 'Start Node', subtitle: 'Workflow entry', icon: PlayCircle, color: 'text-indigo-400', hoverColor: 'hover:border-indigo-500' },
    { type: 'taskNode', label: 'Task Node', subtitle: 'Human assignment', icon: CalendarCheck, color: 'text-blue-400', hoverColor: 'hover:border-blue-500' },
    { type: 'approvalNode', label: 'Approval Step', subtitle: 'Decision gate', icon: UserCheck, color: 'text-amber-400', hoverColor: 'hover:border-amber-500' },
    { type: 'automatedNode', label: 'Automated Step', subtitle: 'System action', icon: Zap, color: 'text-purple-400', hoverColor: 'hover:border-purple-500' },
    { type: 'endNode', label: 'End Node', subtitle: 'Workflow end', icon: Flag, color: 'text-red-400', hoverColor: 'hover:border-red-500' },
  ];

  return (
    <aside className="w-60 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-[#0c0c0e]">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Component Library</h2>
      </div>
      
      <div className="p-4 flex flex-col gap-3 overflow-y-auto">
        {draggables.map((item) => (
          <div
            key={item.type}
            className="group cursor-grab"
            onDragStart={(event) => onDragStart(event, item.type)}
            draggable
          >
            <div className={`p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors flex items-center gap-3 shadow-sm ${item.hoverColor}`}>
              <div className={`w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
                <span className="text-[10px] text-zinc-500">{item.subtitle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/5 rounded border border-indigo-200 dark:border-indigo-500/20">
          <p className="text-[10px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
            <strong>Pro Tip:</strong> Hold Shift to multi-select nodes and snap to the grid.
          </p>
        </div>
      </div>
    </aside>
  );
}
