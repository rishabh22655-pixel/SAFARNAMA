import React, { useState } from 'react';
import { Expense, TripMember, DebtSettlement } from '../../types';
import { Plus, ArrowRight, DollarSign, Split, Check, Receipt } from 'lucide-react';
import { calculateMinimalSettlement } from '../../lib/api';
import { Badge } from '../../components/Badge';

interface DebtSettlementViewProps {
  tripId: string;
  members: TripMember[];
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
}

export const DebtSettlementView: React.FC<DebtSettlementViewProps> = ({
  tripId,
  members,
  expenses,
  onAddExpense,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(members[0]?.user_id || '');
  const [category, setCategory] = useState<'transport' | 'accommodation' | 'food' | 'activities' | 'buffer'>('food');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');

  // Compute member names map
  const memberNames: Record<string, string> = {};
  members.forEach((m) => (memberNames[m.user_id] = m.name));

  // Compute minimal transactions locally or via API
  const [settlements, setSettlements] = useState<DebtSettlement[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  const runSettlementCalculation = async () => {
    try {
      const res = await calculateMinimalSettlement({
        expenses,
        memberNames,
      });
      setSettlements(res.settlements);
      setHasCalculated(true);
    } catch (e) {
      console.error('Failed to compute settlements', e);
    }
  };

  // Run on mount or when expenses change
  React.useEffect(() => {
    if (expenses.length > 0) {
      runSettlementCalculation();
    }
  }, [expenses]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    const payer = members.find((m) => m.user_id === paidBy);

    // Default shares for all members
    const shares: Record<string, number> = {};
    const equalShare = numAmount / (members.length || 1);
    members.forEach((m) => {
      shares[m.user_id] = equalShare;
    });

    const newExp: Expense = {
      id: 'exp-' + Date.now(),
      trip_id: tripId,
      title: title.trim() || 'Mountain Expense',
      paid_by: paidBy || members[0]?.user_id || 'usr-default',
      paid_by_name: payer?.name || 'Traveler',
      amount: numAmount,
      category,
      split_type: splitType,
      shares,
      created_at: new Date().toISOString()
    };

    onAddExpense(newExp);
    setShowAddModal(false);
    setTitle('');
    setAmount('');
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#141210] border border-[#26231E] shadow-xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#23201A] gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-safari-copper mb-1">
            Minimal-Transactions Split
          </div>
          <h3 className="text-2xl font-serif text-safari-cream font-medium">
            Shared Expenses & Debt Settlement
          </h3>
          <p className="text-xs text-safari-muted mt-1">
            Total recorded: <span className="text-safari-amber font-mono font-medium">₹{totalSpent.toLocaleString('en-IN')}</span> across {expenses.length} receipt{expenses.length === 1 ? '' : 's'}.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Expense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Expenses Ledger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-safari-copper flex items-center justify-between">
            <span>Expenses Ledger</span>
            <span className="text-[10px] text-zinc-500 font-sans">Equal / Custom Shares</span>
          </div>

          {expenses.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#0C0A09] border border-[#23201A] text-center text-xs text-safari-muted">
              No shared expenses recorded yet. Click "Record Expense" to split transport, cabins, or meals.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl bg-[#0C0A09] border border-[#23201A] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#181512] border border-[#2E2922] flex items-center justify-center text-safari-amber">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-serif text-safari-cream font-medium">
                        {exp.title}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        Paid by <span className="text-safari-copper">{exp.paid_by_name}</span> · {exp.category}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-mono font-medium text-safari-cream">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      {exp.split_type} split
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Who Owes Whom (Minimal Settlement Graph) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#0E0C0A] border border-[#23201A] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C1814]">
            <span className="text-xs font-mono uppercase tracking-wider text-safari-copper">
              Who Owes Whom
            </span>
            <Badge
              type="LIVE"
              source="Greedy Bipartite Net Settlement Engine"
              timestamp={new Date().toISOString()}
            />
          </div>

          {settlements.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              {expenses.length === 0 ? 'Balances are even.' : 'Calculating minimal settlement paths...'}
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#141210] border border-amber-900/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-rose-300">{s.from_name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-medium text-emerald-300">{s.to_name}</span>
                  </div>
                  <div className="font-mono font-semibold text-safari-amber">
                    ₹{s.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 rounded-lg bg-[#141210] border border-[#23201A] text-[11px] text-zinc-400 leading-relaxed font-sans">
            Minimal-transactions algorithm condenses all pairwise debts down to at most {Math.max(1, members.length - 1)} transfers.
          </div>
        </div>

      </div>

      {/* Record Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#141210] border border-[#2E2922] rounded-2xl p-6 text-[#EDE5DB]">
            <h3 className="text-xl font-serif text-safari-cream font-medium mb-4">
              Record Shared Group Expense
            </h3>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-safari-copper mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 4x4 Mountain Jeep Taxi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-safari-copper mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="50"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="4200"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-sm font-mono text-safari-cream"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-safari-copper mb-1">
                  Paid By
                </label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream"
                >
                  {members.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-safari-copper mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream"
                >
                  <option value="transport">Transport</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="food">Food & Dining</option>
                  <option value="activities">Activities & Permits</option>
                  <option value="buffer">Emergency Buffer</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs uppercase text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase bg-safari-amber hover:bg-safari-amber-hover text-black shadow-lg"
                >
                  Add to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
