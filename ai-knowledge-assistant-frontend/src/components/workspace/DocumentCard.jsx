import React from 'react';
import { CalendarDays, FileText, Trash2 } from 'lucide-react';
import { formatBytes, formatDate } from '../../utils/format';

export default function DocumentCard({ document, onDeleteClick }) {
  return (
    <div className="group rounded-2xl border border-line bg-surface p-3.5 shadow-soft transition hover:shadow-lift">
      <div className="flex items-start gap-3">
        <div className="relative flex h-11 w-9 shrink-0 items-end justify-center rounded-md border border-line bg-sunken pb-1.5">
          <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-bl-md border-b border-l border-line bg-surface" />
          <FileText className="h-4 w-4 text-danger/80" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink" title={document.fileName}>
            {document.fileName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-ink-faint">
            <span>{formatBytes(document.fileSize)}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(document.uploadedAt)}
            </span>
          </div>
        </div>
        <button
          onClick={onDeleteClick}
          className="-mr-1 -mt-1 rounded-lg p-1.5 text-ink-faint opacity-70 transition hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
          aria-label="Remove document"
          title="Remove document"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 px-2.5 py-1.5 text-xs font-medium text-success">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        Read and ready for your questions
      </div>
    </div>
  );
}
