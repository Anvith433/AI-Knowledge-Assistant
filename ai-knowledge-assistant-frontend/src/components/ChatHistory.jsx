import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { History, MessageSquare, Clock } from 'lucide-react';

export default function ChatHistory({ history }) {
  if (!history || history.length === 0) {
    return null;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
        <History className="w-5 h-5 text-blue-400" />
        <h3 className="text-base font-semibold text-slate-200">Previous Q&A History</h3>
        <span className="ml-auto text-xs text-slate-500">{history.length} items</span>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {history.map((item) => (
          <div
            key={item.id || item.createdAt}
            className="p-4 bg-slate-950/60 border border-slate-800/60 rounded-xl space-y-3 hover:border-slate-700 transition"
          >
            {/* Question */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{item.question}</span>
              </div>
              {item.createdAt && (
                <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {formatDate(item.createdAt)}
                </span>
              )}
            </div>

            {/* Answer */}
            <div className="text-xs text-slate-400 pl-6 border-l-2 border-slate-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.answer}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}