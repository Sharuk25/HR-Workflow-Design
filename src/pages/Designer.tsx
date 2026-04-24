import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '../components/canvas/Canvas';
import { Sidebar } from '../components/sidebar/Sidebar';
import { PropertiesPanel } from '../components/properties/PropertiesPanel';
import { SandboxPanel } from '../components/sandbox/SandboxPanel';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { Code2, Undo2, Redo2, LogOut, Save, Download, Image as ImageIcon, Loader2, Home, Sun, Moon, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logout, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toPng } from 'html-to-image';
import { useTheme } from '../contexts/ThemeContext';

export function Designer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const workflowId = useWorkflowStore((state) => state.workflowId);
  const setWorkflowId = useWorkflowStore((state) => state.setWorkflowId);
  const loadWorkflow = useWorkflowStore((state) => state.loadWorkflow);
  
  const { currentUser, isAdmin } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Extract temporal state from zundo
  const { undo, redo } = useWorkflowStore.temporal.getState();

  useEffect(() => {
    async function fetchWorkflow() {
      if (!currentUser || !id || id === 'new') return;
      if (id === workflowId) return; // already loaded
      
      setLoading(true);
      try {
        const docRef = doc(db, 'workflows', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Ensure arrays are truthy before spreading, though they are stored as such.
          loadWorkflow(id, data.nodes || [], data.edges || []);
        } else {
          console.error("No such workflow!");
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching workflow:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, [id, currentUser, workflowId, loadWorkflow, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const idToSave = workflowId || crypto.randomUUID();
      const workflowRef = doc(db, 'workflows', idToSave);
      
      if (workflowId) {
        await updateDoc(workflowRef, {
          nodes,
          edges,
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(workflowRef, {
          userId: currentUser.uid,
          nodes,
          edges,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp()
        });
        setWorkflowId(idToSave);
      }
    } catch (error) {
      console.error("Error saving workflow", error);
      alert("Failed to save workflow. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `workflow-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
            loadWorkflow(workflowId, parsed.nodes, parsed.edges);
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

  const handleExportImage = async () => {
    const reactFlowElement = document.querySelector('.react-flow') as HTMLElement | null;
    if (!reactFlowElement) return;

    try {
      const dataUrl = await toPng(reactFlowElement, {
        filter: (node) => {
          // Exclude the controls and minimap from the image export
          const el = node as HTMLElement;
          if (
            el?.classList?.contains('react-flow__controls') ||
            el?.classList?.contains('react-flow__panel') ||
            el?.classList?.contains('react-flow__minimap')
          ) {
            return false;
          }
          return true;
        },
      });
      const a = document.createElement('a');
      a.setAttribute('download', `workflow-export-${Date.now()}.png`);
      a.setAttribute('href', dataUrl);
      a.click();
    } catch (err) {
      console.error('Error exporting image', err);
      alert("Error exporting image");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans transition-colors">
      {/* Header */}
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-[#09090b] z-10 shrink-0 transition-colors">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="w-8 h-8 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            title="Back to Dashboard"
          >
            <Home size={18} />
          </button>
          <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center shadow-sm">
            <Code2 className="text-white" size={16} />
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">HR Workflow Designer <span className="text-zinc-500 font-normal ml-2">v1.4.0</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-zinc-200 dark:border-zinc-800 pr-4 mr-1">
             <button 
                onClick={handleExportImage} 
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors flex items-center gap-1.5"
                title="Export Image"
              >
                <ImageIcon size={16} />
                <span className="text-xs font-medium">Export</span>
             </button>
             <label className="cursor-pointer p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors flex items-center gap-1.5" title="Import JSON">
                <Upload size={16} />
                <span className="text-xs font-medium">Import</span>
                <input type="file" accept=".json" onChange={handleUploadJson} className="hidden" />
             </label>
             <button 
                onClick={handleDownloadJson} 
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors flex items-center gap-1.5"
                title="Download JSON"
              >
                <Download size={16} />
                <span className="text-xs font-medium">Download</span>
             </button>
             <button 
                onClick={handleSave} 
                disabled={saving}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors flex items-center gap-1.5 disabled:opacity-50"
                title="Save Workflow"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span className="text-xs font-medium">Save</span>
             </button>
          </div>
          <div className="flex items-center gap-2 border-r border-zinc-200 dark:border-zinc-800 pr-4 mr-1">
             <button 
                onClick={() => undo()} 
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                title="Undo"
              >
                <Undo2 size={16} />
             </button>
             <button 
                onClick={() => redo()} 
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                title="Redo"
              >
                <Redo2 size={16} />
             </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">System Ready</span>
            </div>
            {currentUser && (
              <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-3">
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
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        <main className="flex flex-1 flex-col relative min-w-0 bg-white dark:bg-transparent">
          <Canvas />
          <SandboxPanel />
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400 font-medium animate-pulse">Loading workflow...</p>
            </div>
          )}
        </main>
        
        <PropertiesPanel />
      </div>

      {/* Footer */}
      <footer className="h-8 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] flex items-center justify-between px-6 shrink-0 transition-colors">
        <div className="flex gap-4">
          <span className="text-[10px] text-zinc-500 dark:text-zinc-600">Nodes: {nodes.length}</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-600">Edges: {edges.length}</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-600 font-mono">Draft saved recently</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 cursor-pointer">API Documentation</span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 cursor-pointer">Settings</span>
        </div>
      </footer>
    </div>
  );
}
