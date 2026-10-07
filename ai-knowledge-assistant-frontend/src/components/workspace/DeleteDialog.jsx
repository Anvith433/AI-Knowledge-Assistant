import React, { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import Spinner from '../ui/Spinner';

export default function DeleteDialog({ isOpen, fileName, onConfirm, onCancel, isDeleting }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && !isDeleting && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={() => !isDeleting && onCancel()} />
      <div className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-lift animate-scale-in">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <Trash2 className="h-6 w-6" />
        </div>
        <h3 id="delete-title" className="font-display text-2xl font-medium text-ink">
          Remove this document?
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">{fileName}</span> and everything I learned from it will be removed, along with the
          conversation about it. You can always upload a new one afterwards.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button ref={cancelRef} type="button" onClick={onCancel} disabled={isDeleting} className="btn-outline">
            Keep it
          </button>
          <button type="button" onClick={onConfirm} disabled={isDeleting} className="btn-danger">
            {isDeleting ? (
              <>
                <Spinner /> Removing…
              </>
            ) : (
              'Yes, remove it'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
