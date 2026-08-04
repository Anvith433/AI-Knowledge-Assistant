import React from 'react';
import { Bot, Cpu, Sparkles } from 'lucide-react';

export default function Navbar({ hasActiveDocument }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-100 tracking-tight text-lg">AI Knowledge Assistant</h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                RAG Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Spring AI + Ollama + PGVector</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium">
          <span className={`w-2 h-2 rounded-full ${hasActiveDocument ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-slate-300">
            {hasActiveDocument ? 'Document Ready' : 'Awaiting Document'}
          </span>
        </div>

      </div>
    </header>
  );
}