import React, { useState, useRef, useEffect } from 'react';
import { Play, CheckCircle2, AlertCircle, Loader2, X, Move } from 'lucide-react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { mockApi } from '../../api/mockApi';
import { SimulationResult } from '../../types/workflow';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function SandboxPanel() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const res = await mockApi.simulate(nodes, edges);
      setResult(res);
    } catch (err) {
      setResult({ success: false, logs: [], errors: ['Simulation failed unexpectedly'] });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      className="absolute bottom-6 right-6 h-64 w-80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col shadow-2xl z-20"
      style={{ touchAction: "none" }}
    >
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-t-lg cursor-grab active:cursor-grabbing">
        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2 pointer-events-none">
           <Move size={12} className="text-zinc-400"/>
           <Play size={12} className="text-indigo-500 dark:text-indigo-400"/>
           Logs
        </span>
        <button
          onClick={handleSimulate}
          disabled={isRunning}
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking button
          className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 disabled:opacity-50 tracking-wider uppercase bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded"
        >
          {isRunning ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-3 font-mono text-[10px] space-y-2 cursor-auto"
        onPointerDown={(e) => e.stopPropagation()} // Prevent dragging from content area
      >
        {!result && !isRunning && (
            <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-500 italic px-4 text-center">
                Press Run Simulation to test graph execution.
            </div>
        )}

        {result && (
          <div className="flex flex-col gap-2">
             {result.errors && result.errors.length > 0 && (
                 <div className="text-rose-500 dark:text-rose-400">
                     <div className="flex items-center gap-1.5"><AlertCircle size={12}/> <span>Validation failed</span></div>
                     <ul className="pl-5 mt-1 space-y-1">
                         {result.errors.map((e, i) => <li key={i}>- {e}</li>)}
                     </ul>
                 </div>
             )}

             {result.success && result.logs.length > 0 && (
                 <div className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400">
                     <CheckCircle2 size={12} /> <span>Workflow validation passed</span>
                 </div>
             )}

             {result.logs.map((log) => (
                <div key={log.id} className="flex gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="text-zinc-400 dark:text-zinc-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="break-words">▶ {log.nodeLabel}: <span className="text-zinc-500">{log.message}</span></span>
                </div>
             ))}
             {result.success && (
                <div className="flex gap-2 text-zinc-400 dark:text-zinc-500"><span>_</span></div>
             )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
