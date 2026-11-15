import React, { useState } from 'react';
import { ReplanAlternative } from '../../lib/api';
import { X, Check, ArrowRight, Clock, Plus, Trash2, Edit3, ShieldCheck } from 'lucide-react';
import { Badge } from '../../components/Badge';

interface PlanDiffModalProps {
  isOpen: boolean;
  alternatives: ReplanAlternative[];
  isLoading: boolean;
  errorMessage?: string | null;
  onAcceptAlternative: (alternative: ReplanAlternative) => void;
  onDismiss: () => void;
  onRetry: () => void;
}

export const PlanDiffModal: React.FC<PlanDiffModalProps> = ({
  isOpen,
  alternatives,
  isLoading,
  errorMessage,
  onAcceptAlternative,
  onDismiss,
  onRetry
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen) return null;

  const currentAlt = alternatives[selectedIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-[#141210] border border-[#2E2922] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#26231E] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-safari-copper mb-1">
              AI Dynamic Replanning · Gemini 1.5 + OSRM Feasibility
            </div>
            <h3 className="text-2xl font-serif text-safari-cream font-medium">
              Alternative Itinerary Proposals
            </h3>
          </div>
          <button
            onClick={onDismiss}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-safari-amber border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-serif text-safari-cream">
                Consulting Gemini AI & verifying OSRM mountain driving feasibility...
              </p>
              <p className="text-xs font-mono text-zinc-500">
                Checking consecutive stop travel hours & weather bounds
              </p>
            </div>
          ) : errorMessage ? (
            <div className="p-8 rounded-xl bg-rose-950/30 border border-rose-800 text-center space-y-4">
              <p className="text-sm text-rose-200">{errorMessage}</p>
              <button
                onClick={onRetry}
                className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white shadow-lg"
              >
                Retry AI Replanning
              </button>
            </div>
          ) : alternatives.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              No alternative proposals available.
            </div>
          ) : (
            <>
              {/* Alternatives Selection Tabs */}
              <div className="flex gap-3 border-b border-[#23201A] pb-3 overflow-x-auto">
                {alternatives.map((alt, idx) => (
                  <button
                    key={alt.id || idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all text-left flex flex-col gap-0.5 shrink-0 ${
                      selectedIndex === idx
                        ? 'bg-[#1C1813] border border-safari-amber text-safari-cream shadow-md'
                        : 'bg-[#0E0C0A] border border-[#23201A] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="font-serif text-sm">
                      Option {String.fromCharCode(65 + idx)}: {alt.title}
                    </span>
                    <span className="font-mono text-[10px] text-safari-copper">
                      Cost: {alt.costDelta >= 0 ? `+₹${alt.costDelta}` : `-₹${Math.abs(alt.costDelta)}`}
                    </span>
                  </button>
                ))}
              </div>

              {currentAlt && (
                <div className="space-y-6">
                  {/* Option summary */}
                  <div className="p-5 rounded-xl bg-[#0C0A09] border border-[#26231E]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <h4 className="text-xl font-serif text-safari-cream">
                        {currentAlt.title}
                      </h4>
                      <div className="flex items-center gap-3">
                        <Badge
                          type="LIVE"
                          source="OSRM Travel Engine"
                          timestamp={new Date().toISOString()}
                        />
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-safari-amber">
                          Travel Time: {currentAlt.travelTimeHours || 'Feasible (< 3h)'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-safari-muted leading-relaxed">
                      <span className="text-safari-copper font-medium">Director Rationale:</span> {currentAlt.rationale}
                    </p>

                    <p className="mt-2 text-xs text-zinc-400">
                      <span className="text-zinc-300 font-medium">Trade-off:</span> {currentAlt.tradeOffs}
                    </p>
                  </div>

                  {/* Plan Diff View (Removed / Added / Kept / Modified) */}
                  <div>
                    <h5 className="text-xs font-mono uppercase tracking-[0.2em] text-safari-copper mb-3">
                      Itinerary Modifications (Diff)
                    </h5>

                    <div className="space-y-3">
                      {currentAlt.items.map((item, idx) => {
                        const isAdded = item.action === 'added';
                        const isRemoved = item.action === 'removed';
                        const isModified = item.action === 'modified';

                        return (
                          <div
                            key={item.id || idx}
                            className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                              isAdded
                                ? 'bg-emerald-950/20 border-emerald-800/60'
                                : isRemoved
                                ? 'bg-rose-950/20 border-rose-800/60 line-through opacity-75'
                                : isModified
                                ? 'bg-amber-950/20 border-amber-800/60'
                                : 'bg-[#0E0C0A] border-[#26231E]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5">
                                {isAdded ? (
                                  <span className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center text-xs font-bold">
                                    <Plus className="w-3 h-3" />
                                  </span>
                                ) : isRemoved ? (
                                  <span className="w-5 h-5 rounded-full bg-rose-900/60 text-rose-400 flex items-center justify-center text-xs font-bold">
                                    <Trash2 className="w-3 h-3" />
                                  </span>
                                ) : isModified ? (
                                  <span className="w-5 h-5 rounded-full bg-amber-900/60 text-amber-300 flex items-center justify-center text-xs font-bold">
                                    <Edit3 className="w-3 h-3" />
                                  </span>
                                ) : (
                                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs">
                                    ●
                                  </span>
                                )}
                              </span>

                              <div>
                                <div className="text-xs font-mono text-zinc-400">
                                  Day {item.day} · {item.start_time} - {item.end_time}
                                </div>
                                <div className="text-sm font-serif font-medium text-safari-cream">
                                  {item.place}
                                </div>
                                {item.modification_reason && (
                                  <div className="text-[11px] text-emerald-400 mt-0.5">
                                    ↳ {item.modification_reason}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right text-xs font-mono">
                              <div className="text-safari-cream">
                                ₹{item.cost_estimate.toLocaleString('en-IN')}
                              </div>
                              <span
                                className={`text-[10px] uppercase font-semibold ${
                                  isAdded
                                    ? 'text-emerald-400'
                                    : isRemoved
                                    ? 'text-rose-400'
                                    : 'text-zinc-500'
                                }`}
                              >
                                {item.action}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#26231E] bg-[#0E0C0A] flex items-center justify-between">
          <button
            onClick={onDismiss}
            className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
          >
            Dismiss
          </button>

          {currentAlt && !isLoading && (
            <button
              onClick={() => onAcceptAlternative(currentAlt)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-[0_0_20px_rgba(245,166,91,0.3)] transition-transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Accept & Apply Alternative</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
