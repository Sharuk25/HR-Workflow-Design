import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, logout } from '../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Code2, Plus, LogOut, Loader2, FileJson, Clock, Sun, Moon, Upload, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { nodeTypes } from '../components/canvas/nodes';
import DeletableEdge from '../components/canvas/edges/DeletableEdge';
import { useTheme } from '../contexts/ThemeContext';

const edgeTypes = {
  custom: DeletableEdge,
};

interface WorkflowMeta {
  id: string;
  updatedAt: number;
  createdAt: number;
  nodes: any[];
  edges: any[];
}

export function Dashboard() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<WorkflowMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const resetWorkflow = useWorkflowStore(state => state.resetWorkflow);
  const loadWorkflow = useWorkflowStore(state => state.loadWorkflow);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    async function fetchWorkflows() {
      if (!currentUser) return;
      try {
        const workflowsRef = collection(db, 'workflows');
        const q = query(workflowsRef, where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          const getTimestamp = (field: any) => field?.toMillis ? field.toMillis() : field || 0;
          return {
            id: doc.id,
            updatedAt: getTimestamp(docData.updatedAt),
            createdAt: getTimestamp(docData.createdAt),
            nodes: docData.nodes || [],
            edges: docData.edges || [],
          };
        });
        
        data.sort((a, b) => b.updatedAt - a.updatedAt);
        setWorkflows(data);
      } catch (error) {
        console.error("Error fetching workflows", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkflows();
  }, [currentUser]);

  const handleCreateNew = () => {
    resetWorkflow();
    navigate('/designer/new');
  };

  const handleOpenWorkflow = (id: string) => {
    navigate(`/designer/${id}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleUploadJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const parsed = JSON.parse(result);
          if (parsed.nodes && parsed.edges) {
            loadWorkflow(null, parsed.nodes, parsed.edges);
            navigate('/designer/new');
          } else {
            alert('Invalid JSON file. Missing nodes or edges.');
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDeleteWorkflow = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setWorkflows(prev => prev.filter(w => w.id !== id));
      await deleteDoc(doc(db, 'workflows', id));
    } catch (error) {
      console.error("Failed to delete workflow", error);
      // Revert optimistic delete if it fails
      // We'd typically refetch or just log, but the app should not crash.
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden transition-colors">
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-[#09090b] shrink-0 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center shadow-sm">
            <Code2 className="text-white" size={16} />
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">HR Workflow Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          {currentUser && (
            <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-4 ml-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[120px] truncate" title={currentUser.email || ''}>
                {currentUser.email}
              </span>
              {isAdmin && (
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-medium border border-indigo-200 dark:border-indigo-500/20">
                  ADMIN
                </span>
              )}
              <button
                onClick={handleLogout}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors ml-1"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold dark:text-white text-zinc-900 tracking-tight">Your Workflows</h2>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-md font-medium transition-colors text-sm shadow-sm" title="Import JSON workflow">
                <Upload size={16} />
                Import
                <input type="file" accept=".json" onChange={handleUploadJson} className="hidden" />
              </label>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm shadow-sm"
              >
                <Plus size={16} />
                Create New
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
          ) : workflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 shadow-sm">
              <FileJson className="text-zinc-400 dark:text-zinc-600 mb-4" size={48} />
              <p className="text-zinc-500 dark:text-zinc-400 mb-4 text-sm">You haven't created any workflows yet.</p>
              <button
                onClick={handleCreateNew}
                className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm transition-colors cursor-pointer"
              >
                Start building now &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  onClick={() => handleOpenWorkflow(workflow.id)}
                  className="group bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-zinc-700 rounded-xl p-0 cursor-pointer transition-all hover:shadow-lg dark:hover:shadow-black/50 hover:-translate-y-0.5 overflow-hidden flex flex-col h-72"
                >
                  <div className="h-40 w-full border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 relative pointer-events-none">
                    <ReactFlowProvider>
                      <ReactFlow
                        nodes={workflow.nodes || []}
                        edges={workflow.edges || []}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        fitView
                        panOnDrag={false}
                        zoomOnScroll={false}
                        zoomOnDoubleClick={false}
                        elementsSelectable={false}
                        nodesDraggable={false}
                        nodesConnectable={false}
                        proOptions={{ hideAttribution: true }}
                        className="dark:opacity-80"
                      />
                    </ReactFlowProvider>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1 relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteWorkflow(e, workflow.id);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
                      title="Delete Workflow"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-200 mb-1 pr-8">Untitled Workflow</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-4 font-mono truncate">ID: {workflow.id}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(workflow.updatedAt).toLocaleDateString()}
                      </div>
                      <div>
                        {(workflow.nodes || []).length} Nodes &middot; {(workflow.edges || []).length} Edges
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

