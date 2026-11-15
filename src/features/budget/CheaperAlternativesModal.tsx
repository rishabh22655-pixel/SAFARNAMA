import React, { useState, useEffect } from 'react';
import { ItineraryItem } from '../../types';
import { CheaperAlternativeProposal, fetchCheaperAlternatives } from '../../lib/api';
import { X, Sparkles, TrendingDown, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { ConfirmationModal } from '../../components/ConfirmationModal';

interface CheaperAlternativesModalProps {
  isOpen: boolean;
  items: ItineraryItem[];
  budget: number;
  categoriesBreakdown: Record<string, number>;
  onApplyProposal: (proposal: CheaperAlternativeProposal) => void;
  onClose: () => void;
}

export const CheaperAlternativesModal: React.FC<CheaperAlternativesModalProps> = ({
  isOpen,
  items,
  budget,
  categoriesBreakdown,
  onApplyProposal,
  onClose,
}) => {
  const [proposals, setProposals] = useState<CheaperAlternativeProposal[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmation state
  const [pendingProposal, setPendingProposal] = useState<CheaperAlternativeProposal | null>(null);

  const loadProposals = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchCheaperAlternatives({
        items,
        budget,
        categoriesBreakdown,
      });
      setProposals(data.proposals);
      setAnalysis(data.analysis);
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to query budget intelligence');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadProposals();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="w-full max-w-3xl bg-[#141210] border border-[#2E2922] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#26231E] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-safari-copper mb-1">
                AI Budget Intelligence · Verified Math
              </div>
              <h3 className="text-2xl font-serif text-safari-cream font-medium">
                Cheaper Alternative Swaps
              </h3>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-safari-amber border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-serif text-safari-cream">
                  Analyzing cost levers with Gemini AI & recomputing exact verified savings...
                </p>
              </div>
            ) : errorMessage ? (
              <div className="p-6 rounded-xl bg-rose-950/40 border border-rose-800 text-center space-y-3">
                <p className="text-sm text-rose-200">{errorMessage}</p>
                <button
                  onClick={loadProposals}
                  className="px-5 py-2 rounded-full text-xs font-semibold uppercase bg-rose-600 hover:bg-rose-500 text-white"
                >
                  Retry Analysis
                </button>
              </div>
            ) : (
              <>
                {analysis && (
                  <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#26231E] text-xs sm:text-sm text-safari-muted leading-relaxed">
                    <span className="text-safari-copper font-medium">Strategic Assessment:</span> {analysis}
                  </div>
                )}

                <div className="space-y-4">
                  {proposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-5 rounded-xl bg-[#0E0C0A] border border-[#23201A] hover:border-safari-copper/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-serif font-medium text-safari-cream">
                            {prop.title}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {prop.type.replace('_', ' ')}
                          </span>
                          <Badge
                            type="LIVE"
                            source="Server Recomputed Delta"
                            timestamp={prop.verifiedAt}
                          />
                        </div>

                        <p className="text-xs text-safari-muted">
                          {prop.description}
                        </p>

                        <div className="text-[11px] text-zinc-400 font-sans">
                          <span className="text-safari-copper">Trade-off:</span> {prop.tradeOff}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-3">
                        <div className="text-right">
                          <div className="text-xs font-mono text-zinc-500 line-through">
                            ₹{prop.currentCost.toLocaleString('en-IN')}
                          </div>
                          <div className="text-sm font-mono font-bold text-emerald-400">
                            Save ₹{prop.serverVerifiedSaving.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPendingProposal(prop)}
                          className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-md flex items-center gap-1.5"
                        >
                          <span>Apply Swap</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#26231E] bg-[#0E0C0A] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(pendingProposal)}
        title="Apply Cost-Saving Swap?"
        description={
          pendingProposal
            ? `You are about to swap "${pendingProposal.title}". This will save ₹${pendingProposal.serverVerifiedSaving.toLocaleString('en-IN')} on your itinerary.`
            : ''
        }
        details={
          pendingProposal ? (
            <div>
              <p><strong>Modification:</strong> {pendingProposal.description}</p>
              <p className="mt-1"><strong>Trade-off:</strong> {pendingProposal.tradeOff}</p>
            </div>
          ) : null
        }
        confirmLabel="Confirm Swap"
        onConfirm={() => {
          if (pendingProposal) {
            onApplyProposal(pendingProposal);
            setPendingProposal(null);
          }
        }}
        onCancel={() => setPendingProposal(null)}
      />
    </>
  );
};
