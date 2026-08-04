import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, HelpCircle } from 'lucide-react';

export default function AnswerCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4 animate-in fade-in duration-300">
      
      {/* User Question Prompt */}
      <div className="flex items-start gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 bg-slate-800 text-slate-300 rounded-lg shrink-0">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs uppercase font-semibold text-slate-400">Question</h4>
          <p className="text-slate-200 text-sm font-medium mt-0.5">{data.question}</p>
        </div>
      </div>

      {/* AI Answer Content */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h4 className="text-xs uppercase font-semibold text-blue-400 tracking-wider mb-2">AI Response</h4>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.answer}
            </ReactMarkdown>
          </div>
        </div>
      </div>

    </div>
  );
}