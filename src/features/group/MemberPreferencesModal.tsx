import React, { useState } from 'react';
import { MemberPreferences } from '../../types';
import { X, Sparkles, Check } from 'lucide-react';

interface MemberPreferencesModalProps {
  isOpen: boolean;
  initialPreferences?: MemberPreferences | null;
  onSave: (prefs: MemberPreferences) => void;
  onClose: () => void;
}

const INTEREST_OPTIONS = [
  'Cinematic Landscapes',
  'Temple & Stone Heritage',
  'Alpine Astrophotography',
  'Tea Estate Trails',
  'Foraged Mountain Cuisine',
  'High-altitude Trekking',
  'Silent Meditation',
  'Local Artisans & Crafts'
];

export const MemberPreferencesModal: React.FC<MemberPreferencesModalProps> = ({
  isOpen,
  initialPreferences,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialPreferences?.user_name || '');
  const [budgetMin, setBudgetMin] = useState(initialPreferences?.budget_min || 15000);
  const [budgetMax, setBudgetMax] = useState(initialPreferences?.budget_max || 45000);
  const [interests, setInterests] = useState<string[]>(
    initialPreferences?.interests || ['Cinematic Landscapes', 'High-altitude Trekking']
  );
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'intense'>(
    initialPreferences?.pace || 'moderate'
  );
  const [dietary, setDietary] = useState(initialPreferences?.dietary || 'Vegetarian / Mountain Organic');

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      user_id: initialPreferences?.user_id || 'usr-' + Date.now(),
      user_name: name.trim() || 'Fellow Traveler',
      budget_min: Number(budgetMin),
      budget_max: Number(budgetMax),
      interests,
      pace,
      dietary,
      submitted_at: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-[#141210] border border-[#2E2922] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#EDE5DB]">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#23201A]">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-safari-copper">
              Group Consensus Engine
            </div>
            <h3 className="text-2xl font-serif text-safari-cream font-medium">
              Submit Your Travel Preferences
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase text-safari-copper mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arjun Kapoor"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream focus:border-safari-amber focus:outline-none"
            />
          </div>

          {/* Budget Range */}
          <div>
            <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1.5">
              <span className="uppercase text-safari-copper">Individual Budget Range</span>
              <span className="text-safari-amber">₹{budgetMin.toLocaleString()} – ₹{budgetMax.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono">Min (₹)</span>
                <input
                  type="number"
                  step="1000"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0C0A09] border border-[#2E2922] text-sm font-mono text-safari-cream"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-mono">Max (₹)</span>
                <input
                  type="number"
                  step="1000"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0C0A09] border border-[#2E2922] text-sm font-mono text-safari-cream"
                />
              </div>
            </div>
          </div>

          {/* Pacing */}
          <div>
            <label className="block text-xs font-mono uppercase text-safari-copper mb-2">
              Journey Pacing
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['relaxed', 'moderate', 'intense'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPace(p)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono uppercase border transition-all ${
                    pace === p
                      ? 'bg-[#1C1813] border-safari-amber text-safari-cream'
                      : 'bg-[#0C0A09] border-[#26231E] text-zinc-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-mono uppercase text-safari-copper mb-2">
              Interests (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-safari-amber/20 border border-safari-amber text-safari-amber'
                        : 'bg-[#0C0A09] border border-[#26231E] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dietary */}
          <div>
            <label className="block text-xs font-mono uppercase text-safari-copper mb-1.5">
              Dietary Requirements
            </label>
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="e.g. Vegetarian, No peanuts, Mountain vegan"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream focus:border-safari-amber focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#23201A] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Save Preference Ballot
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
