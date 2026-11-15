import React, { useState } from 'react';
import { Trip, ItineraryItem, Alert } from '../../types';
import { TrendingDown, AlertCircle, Edit2, Check, Sparkles, PieChart, ShieldAlert } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { CheaperAlternativesModal } from './CheaperAlternativesModal';

interface BudgetTrackerProps {
  trip: Trip;
  items: ItineraryItem[];
  onUpdateItemCost: (itemId: string, newCost: number) => void;
  onApplyProposal: (proposal: any) => void;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  trip,
  items,
  onUpdateItemCost,
  onApplyProposal,
}) => {
  const [showAlternativesModal, setShowAlternativesModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Categories breakdown
  const categoryTotals: Record<string, { total: number; isUserEntered: boolean }> = {
    transport: { total: 0, isUserEntered: false },
    accommodation: { total: 0, isUserEntered: false },
    food: { total: 0, isUserEntered: false },
    activities: { total: 0, isUserEntered: false },
    buffer: { total: 0, isUserEntered: false }
  };

  items.forEach((item) => {
    const cost = item.actual_cost !== undefined ? item.actual_cost : item.cost_estimate;
    const cat = item.category === 'scenic' ? 'activities' : item.category;
    if (categoryTotals[cat]) {
      categoryTotals[cat].total += cost;
      if (item.actual_cost !== undefined) {
        categoryTotals[cat].isUserEntered = true;
      }
    }
  });

  // Calculate 10% buffer
  const rawSubtotal = Object.values(categoryTotals).reduce((sum, c) => sum + c.total, 0);
  categoryTotals.buffer.total = Math.round(rawSubtotal * 0.10);

  const grandTotalCost = rawSubtotal + categoryTotals.buffer.total;
  const budget = trip.budget || 50000;
  const budgetUsedPercent = Math.min(100, Math.round((grandTotalCost / budget) * 100));

  const is80Percent = budgetUsedPercent >= 80 && budgetUsedPercent < 100;
  const isOverBudget = grandTotalCost > budget;

  const handleStartEdit = (item: ItineraryItem) => {
    setEditingItemId(item.id);
    setEditValue((item.actual_cost !== undefined ? item.actual_cost : item.cost_estimate).toString());
  };

  const handleSaveEdit = (itemId: string) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) {
      onUpdateItemCost(itemId, val);
    }
    setEditingItemId(null);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#141210] border border-[#26231E] shadow-xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#23201A] gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-safari-copper mb-1">
            Financial Guard
          </div>
          <h3 className="text-2xl font-serif text-safari-cream font-medium">
            Automated Budget Intelligence
          </h3>
          <p className="text-xs text-safari-muted mt-1">
            Tracking 5 categories including mandatory 10% alpine contingency buffer.
          </p>
        </div>

        <button
          onClick={() => setShowAlternativesModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-card hover:bg-[#1E1A16] border border-safari-amber/60 text-safari-cream shadow-md transition-all self-start sm:self-auto"
        >
          <TrendingDown className="w-4 h-4 text-safari-amber" />
          <span>Find Cheaper Swaps (AI)</span>
        </button>
      </div>

      {/* Budget Progress Meter */}
      <div className="p-6 rounded-xl bg-[#0C0A09] border border-[#26231E] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-safari-cream font-medium">Trip Expenditure vs Budget</span>
            {isOverBudget ? (
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-400 border border-rose-800">
                Over Budget ({budgetUsedPercent}%)
              </span>
            ) : is80Percent ? (
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                80% Budget Warning
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                On Target ({budgetUsedPercent}%)
              </span>
            )}
          </div>
          <div className="text-safari-copper">
            <span className="text-white font-serif text-base">₹{grandTotalCost.toLocaleString('en-IN')}</span> / ₹{budget.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="w-full h-2.5 bg-[#1C1814] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOverBudget
                ? 'bg-rose-500'
                : is80Percent
                ? 'bg-amber-400'
                : 'bg-safari-amber'
            }`}
            style={{ width: `${Math.min(100, (grandTotalCost / budget) * 100)}%` }}
          />
        </div>

        {/* Warning notification banner if 80% or 100% */}
        {(is80Percent || isOverBudget) && (
          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isOverBudget
                ? 'Budget ceiling exceeded. Review cheaper alternative activity swaps below.'
                : 'You have consumed 80% of your allocated trip budget.'}
            </span>
          </div>
        )}
      </div>

      {/* Categories Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(categoryTotals).map(([cat, info]) => {
          const badgeType = info.isUserEntered ? 'USER-ENTERED' : 'ESTIMATE';

          return (
            <div
              key={cat}
              className="p-4 rounded-xl bg-[#0E0C0A] border border-[#23201A] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-safari-copper">
                  {cat}
                </span>
                <Badge
                  type={badgeType}
                  basis={badgeType === 'ESTIMATE' ? 'Daily regional index + activity seeds' : undefined}
                />
              </div>

              <div className="text-lg font-serif text-safari-cream font-medium">
                ₹{info.total.toLocaleString('en-IN')}
              </div>

              <div className="text-[10px] font-mono text-zinc-500">
                {cat === 'buffer' ? '10% safety pool' : `${Math.round((info.total / (grandTotalCost || 1)) * 100)}% of total`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overridable Line Items Table */}
      <div className="space-y-3 pt-4 border-t border-[#23201A]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-safari-copper">
            Itinerary Cost Overrides (Click to Enter Actuals)
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            Overrides switch badge to USER-ENTERED
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.map((item) => {
            const isEditing = editingItemId === item.id;
            const currentCost = item.actual_cost !== undefined ? item.actual_cost : item.cost_estimate;
            const isOverridden = item.actual_cost !== undefined;

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#0C0A09] border border-[#23201A] flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-zinc-500">D{item.day}</span>
                  <div>
                    <span className="text-safari-cream font-medium">{item.place}</span>
                    <span className="text-[11px] font-mono text-zinc-500 ml-2">({item.category})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    type={isOverridden ? 'USER-ENTERED' : 'ESTIMATE'}
                    basis="Initial seasonal quote"
                  />

                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 px-2 py-1 rounded bg-[#181512] border border-safari-amber font-mono text-xs text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="p-1 bg-safari-amber text-black rounded hover:bg-safari-amber-hover"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleStartEdit(item)}
                      className="flex items-center gap-1.5 font-mono text-safari-cream hover:text-safari-amber cursor-pointer px-2 py-1 rounded hover:bg-[#181512]"
                      title="Click to edit actual cost"
                    >
                      <span>₹{currentCost.toLocaleString('en-IN')}</span>
                      <Edit2 className="w-3 h-3 text-zinc-500" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cheaper Alternatives AI Modal */}
      <CheaperAlternativesModal
        isOpen={showAlternativesModal}
        items={items}
        budget={budget}
        categoriesBreakdown={{
          transport: categoryTotals.transport.total,
          accommodation: categoryTotals.accommodation.total,
          food: categoryTotals.food.total,
          activities: categoryTotals.activities.total
        }}
        onApplyProposal={(prop) => {
          onApplyProposal(prop);
          setShowAlternativesModal(false);
        }}
        onClose={() => setShowAlternativesModal(false)}
      />

    </div>
  );
};
