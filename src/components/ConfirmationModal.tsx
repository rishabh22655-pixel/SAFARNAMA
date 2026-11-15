import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  details?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  details,
  confirmLabel = 'Accept & Apply',
  cancelLabel = 'Dismiss',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#141210] border border-[#2E2922] rounded-2xl shadow-2xl overflow-hidden p-6 text-[#EDE5DB]">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${isDestructive ? 'bg-rose-950/60 text-rose-400 border border-rose-900/50' : 'bg-amber-950/60 text-safari-amber border border-amber-900/50'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-serif font-medium text-safari-cream">{title}</h3>
            <p className="mt-1 text-sm text-safari-muted leading-relaxed">{description}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {details && (
          <div className="mt-4 p-3 bg-[#0C0A09] rounded-xl border border-[#26231E] max-h-60 overflow-y-auto text-xs text-zinc-300">
            {details}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#26231E]">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs uppercase tracking-wider font-medium text-zinc-400 hover:text-white transition-colors rounded-full"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-safari-amber hover:bg-safari-amber-hover text-black shadow-[0_0_15px_rgba(245,166,91,0.3)]'
            }`}
          >
            <Check className="w-4 h-4" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
