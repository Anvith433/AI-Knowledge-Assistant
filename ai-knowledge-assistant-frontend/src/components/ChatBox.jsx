import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function ChatBox({ onAsk, disabled, isAsking }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || disabled || isAsking) return;
    onAsk(question);
    setQuestion('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <textarea
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isAsking}
          placeholder={
            disabled
              ? 'Please upload a PDF document first...'
              : 'Ask anything about your document (Press Enter to send)...'
          }
          className="w-full bg-slate-950/60 text-slate-100 placeholder-slate-500 text-sm rounded-xl p-3.5 pr-24 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!question.trim() || disabled || isAsking}
          className="absolute right-3 bottom-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {isAsking ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}