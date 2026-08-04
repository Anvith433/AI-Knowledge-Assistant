import React from 'react';
import DocumentCard from './DocumentCard';
import { FileCode, Database } from 'lucide-react';

export default function Sidebar({ document, onDeleteClick, loading }) {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" /> Active Vector Store
          </h3>
        </div>

        {document ? (
          <DocumentCard document={document} onDeleteClick={onDeleteClick} />
        ) : (
          <div className="border border-dashed border-slate-800 rounded-2xl p-6 text-center bg-slate-950/20">
            <FileCode className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">No document uploaded</p>
            <p className="text-xs text-slate-500 mt-1">
              Upload a PDF to start asking questions.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}