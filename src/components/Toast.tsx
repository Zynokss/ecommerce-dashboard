import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 ${
        toast.type === 'success'
          ? 'bg-emerald-950/90 border-emerald-800/80 text-emerald-200 dark:bg-emerald-950/90 dark:border-emerald-800/80 dark:text-emerald-200'
          : toast.type === 'error'
          ? 'bg-rose-950/90 border-rose-800/80 text-rose-200 dark:bg-rose-950/90 dark:border-rose-800/80 dark:text-rose-200'
          : 'bg-slate-900/90 border-slate-800 text-slate-200'
      }`}
    >
      <div className="flex items-center gap-2.5 text-xs font-semibold">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};