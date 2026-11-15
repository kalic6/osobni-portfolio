import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
}

interface ConfirmContextType {
  requestConfirm: (options: ConfirmOptions) => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm(): ConfirmContextType {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmOptions | null>(null);

  const requestConfirm = (options: ConfirmOptions) => {
    setDialog(options);
  };

  const handleConfirm = () => {
    if (dialog) {
      const action = dialog.onConfirm;
      setDialog(null);
      action();
    }
  };

  const handleCancel = () => {
    setDialog(null);
  };

  return (
    <ConfirmContext.Provider value={{ requestConfirm }}>
      {children}

      {dialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={handleCancel}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900 animate-in zoom-in-95 duration-150 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  dialog.isDanger !== false
                    ? 'bg-red-100 text-red-600'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {dialog.isDanger !== false ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                  {dialog.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {dialog.message}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors cursor-pointer"
                aria-label="Zavřít"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                {dialog.cancelLabel || 'Zrušit'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer shadow-xs ${
                  dialog.isDanger !== false
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-stone-900 hover:bg-stone-800'
                }`}
              >
                {dialog.confirmLabel || 'Smazat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
