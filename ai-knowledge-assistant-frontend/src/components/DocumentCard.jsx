import React, { useState } from 'react';
import { FileText, Trash2, Calendar, HardDrive } from 'lucide-react';

export default function DocumentCard({ document, onDeleteClick }) {
  if (!document) return null;

  // Format file size (bytes to MB)
  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  // Format date timestamp
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md relative group hover:border-slate-700 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 overflow-hidden">
          <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-100 truncate" title={document.fileName}>
              {document.fileName}
            </h4>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-slate-500" />
                {formatSize(document.fileSize)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {formatDate(document.uploadedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={onDeleteClick}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition shrink-0"
          title="Delete Document"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Status</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
          {document.status || 'UPLOADED'}
        </span>
      </div>
    </div>
  );
}