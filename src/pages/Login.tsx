import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Code2, Loader2, Workflow, Fingerprint } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../lib/firebase';
import { motion } from 'motion/react';

export function Login() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/30">
      
      {/* Decorative / Brand Side (Left on Desktop) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex-col items-start justify-between p-12 lg:p-16">
        {/* Abstract Pattern / Atmosphere */}
        <div className="absolute inset-0 z-0 opacity-50 mix-blend-multiply dark:mix-blend-screen pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200 dark:bg-indigo-900/40 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200 dark:bg-blue-900/30 blur-[100px]" />
        </div>

        {/* Brand / Logo Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Code2 size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">HR Workflow Designer</span>
        </motion.div>

        {/* Hero Text / Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative z-10 max-w-lg"
        >
          <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] mb-6 text-zinc-900 dark:text-white">
            Design processes that scale with your team.
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A visual, node-based workspace to map out, optimize, and organize complex human resources operations effortlessly.
          </p>
        </motion.div>

        {/* Mock/Abstract UI Element to show "what it is" */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
           className="relative z-10 w-full max-w-md p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl"
        >
           <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Workflow size={16} />
                </div>
                <div>
                  <div className="text-sm font-medium">Onboarding Sequence</div>
                  <div className="text-xs text-zinc-500">6 nodes • Active</div>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="w-2h-2 rounded-full bg-emerald-500" />
              </div>
           </div>
           
           <div className="space-y-3">
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-2 w-4/5 rounded-full bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-2 w-2/3 rounded-full bg-zinc-100 dark:bg-zinc-800" />
           </div>
        </motion.div>
      </div>

      {/* Form Side (Right on Desktop, Full on Mobile) */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-8 sm:p-12 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-md flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <div className="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 mb-6">
            <Code2 size={24} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">Welcome back</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 lg:mb-10">
              Sign in to your account to continue working on your workflows.
            </p>
          </motion.div>

          {error && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full mb-6 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 text-sm text-rose-600 dark:text-rose-400 flex items-start text-left gap-3"
            >
              <Fingerprint className="shrink-0 mt-0.5" size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-3.5 px-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {loading ? (
                <Loader2 className="animate-spin text-zinc-400" size={18} />
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:scale-110" aria-hidden="true">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
              )}
              Sign in with Google
            </button>
          </motion.div>

          {/* Optional Footer/Legal Links */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-xs text-zinc-400 dark:text-zinc-500 text-center lg:text-left"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
