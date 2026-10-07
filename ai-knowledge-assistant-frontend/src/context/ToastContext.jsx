import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const STYLES = {
  success: { icon: CheckCircle2, tone: 'text-success', bar: 'bg-success' },
  error: { icon: AlertCircle, tone: 'text-danger', bar: 'bg-danger' },
  info: { icon: Info, tone: 'text-accent', bar: 'bg-accent' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = 'info') => {
      const id = ++idRef.current;
      setToasts((list) => [...list.slice(-2), { id, message, type }]);
      setTimeout(() => dismiss(id), type === 'error' ? 6000 : 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const { icon: Icon, tone, bar } = STYLES[toast.type] || STYLES.info;
          return (
            <div
              key={toast.id}
              role={toast.type === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-2xl border border-line bg-surface py-3.5 pl-4 pr-3 shadow-lift animate-slide-in-right"
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone}`} />
              <p className="flex-1 text-sm leading-relaxed text-ink">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                className="-mr-1 rounded-lg p-1 text-ink-faint transition hover:bg-sunken hover:text-ink"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
