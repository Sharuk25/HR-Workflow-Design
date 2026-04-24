import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '../../../lib/utils';

interface BaseNodeProps {
  label: string;
  typeLabel: string;
  accentColor: string; // e.g., 'indigo-500', 'blue-500'
  textColor: string;   // e.g., 'text-indigo-400'
  selected?: boolean;
  isEnd?: boolean;
  isStart?: boolean;
  children?: React.ReactNode;
}

export function BaseNode({
  label,
  typeLabel,
  accentColor,
  textColor,
  selected,
  isEnd,
  isStart,
  children,
}: BaseNodeProps) {
  // We construct the dynamic border/ring classes for the selected state
  const selectedBorder = `border-[color:var(--tw-colors-indigo-500)] ring-2 ring-[color:var(--tw-colors-indigo-500)]/20`;

  return (
    <div
      className={cn(
        'relative flex w-48 flex-col rounded bg-white dark:bg-zinc-900 shadow-xl transition-all',
        selected 
          ? `border border-indigo-500 ring-2 ring-indigo-500/20` 
          : 'border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-zinc-700'
      )}
    >
      {!isStart && <Handle type="target" position={Position.Top} className="h-3 w-3 bg-zinc-400 dark:bg-zinc-600 border-white dark:border-zinc-800" />}

      <div className="flex flex-col p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full bg-${accentColor.split('-')[0]}-500`}></div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${textColor}`}>{typeLabel}</span>
        </div>
        <div className="text-xs font-semibold mb-1 text-zinc-900 dark:text-zinc-100">{label}</div>
        {children && <div className="text-[10px] text-zinc-500">{children}</div>}
      </div>

      {!isEnd && <Handle type="source" position={Position.Bottom} className="h-3 w-3 bg-zinc-400 dark:bg-zinc-600 border-white dark:border-zinc-800" />}
    </div>
  );
}
