import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteDialog({ isOpen, fileName, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
        <div className="flex items-center gap-3 text-red-400 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-100">Delete Document?</h3>
        </div>

        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-slate-100">{fileName}</span>? 
          This will remove all generated vector embeddings. You can upload another document afterwards.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 border border-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 transition flex items-center gap-2"
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}