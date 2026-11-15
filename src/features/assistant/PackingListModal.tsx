import React, { useState, useEffect } from 'react';
import { Trip, ItineraryItem, PackingItem } from '../../types';
import { X, Check, Backpack, Sparkles, Filter, CloudSnow, Sun, Plus } from 'lucide-react';

interface PackingListModalProps {
  isOpen: boolean;
  trip: Trip;
  items: ItineraryItem[];
  currentUserId: string;
  onClose: () => void;
}

export const PackingListModal: React.FC<PackingListModalProps> = ({
  isOpen,
  trip,
  items,
  currentUserId,
  onClose,
}) => {
  const storageKey = `safarnama_packing_${trip.id}_${currentUserId}`;

  const [packingList, setPackingList] = useState<PackingItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Generate weather & activity informed checklist
    const generated: PackingItem[] = [
      // Alpine & Weather
      {
        id: 'pack-1',
        trip_id: trip.id,
        user_id: currentUserId,
        item_name: 'Windproof Shell & Down Jacket (Rated to -5°C)',
        category: 'clothing',
        packed: false,
        weather_reason: 'Mandatory for Kedarnath alpine mornings and ridge winds'
      },
      {
        id: 'pack-2',
        trip_id: trip.id,
        user_id: currentUserId,
        item_name: 'Waterproof Gore-Tex Mountain Boots',
        category: 'clothing',
        packed: false,
        weather_reason: 'Trekking on loose moraine and wet moss trails'
      },
      {
        id: 'pack-3',
        trip_id: trip.id,
        user_id: currentUserId,
        item_name: 'Thermal Base Layers (Merino Wool x 2)',
        category: 'clothing',
        packed: false,
        weather_reason: 'Evening temperature drops to 2°C'
      },
      // Gear & Photography
      {
        id: 'pack-4',
        trip_id: trip.id,
        user_id: currentUserId,
        item_name: 'Headlamp with Red-Light Mode (For dawn aarti)',
        category: 'gear',
        packed: false,
        weather_reason: 'Pre-dawn trail starts before 05:00 AM'
      },
      {
        id: 'pack-5',
        trip_id: trip.id,
        user_id: currentUserId,
        item_name: 'Camera Weather Cover & Spare Cold-Resistant Batteries',
        category: 'tech',
        packed: false,
        weather_reason: 'Sub-zero temperatures drain lithium cells 40% faster'
      },
      {
        id: 'pack-6',
        trip_id: trip.id,
        user_id: currentUserId,
        item_name: '20,000mAh Power Bank (Sub-zero rated)',
        category: 'tech',
        packed: false,
        weather_reason: 'Limited valley solar charging grid'
      },
      // Documents & Health
      {
        id: 'pack-7',
        trip_id: trip.id,
        user_id: currentUserId,
        item_name: 'Government Photo ID + Kedarnath Yatra Biometric Pass',
        category: 'documents',
        packed: false,
        weather_reason: 'Required at mountain gate checkposts'
      },
      {
        id: 'pack-8',
        trip_id: trip.id,
        user_id: currentUserId,
        item_name: 'High Altitude Acclimatization Kit (Diamox, ORS, Lip Balm)',
        category: 'toiletries',
        packed: false,
        weather_reason: 'Elevations exceed 3,500m'
      }
    ];

    return generated;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(packingList));
    } catch (e) {}
  }, [packingList, storageKey]);

  if (!isOpen) return null;

  const togglePacked = (id: string) => {
    setPackingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: PackingItem = {
      id: 'pack-' + Date.now(),
      trip_id: trip.id,
      user_id: currentUserId,
      item_name: newItemName.trim(),
      category: 'gear',
      packed: false,
      weather_reason: 'Personal added item'
    };
    setPackingList((prev) => [newItem, ...prev]);
    setNewItemName('');
  };

  const filteredItems =
    activeCategory === 'all'
      ? packingList
      : packingList.filter((i) => i.category === activeCategory);

  const packedCount = packingList.filter((i) => i.packed).length;
  const progressPercent = Math.round((packedCount / (packingList.length || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#141210] border border-[#2E2922] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] text-[#EDE5DB]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23201A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-900/50 flex items-center justify-center text-safari-amber">
              <Backpack className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-safari-copper">
                Forecast-Aware Checklist
              </div>
              <h3 className="text-2xl font-serif text-safari-cream font-medium">
                Personal Packing Guide
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 p-4 rounded-xl bg-[#0C0A09] border border-[#26231E] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Packed {packedCount} of {packingList.length} gear essentials</span>
            <span className="text-safari-amber font-semibold">{progressPercent}% Ready</span>
          </div>
          <div className="w-full h-2 bg-[#1C1814] rounded-full overflow-hidden">
            <div
              className="h-full bg-safari-amber rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {['all', 'clothing', 'gear', 'tech', 'documents', 'toiletries'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full uppercase transition-colors shrink-0 ${
                activeCategory === cat
                  ? 'bg-safari-amber text-black font-semibold'
                  : 'bg-[#181512] text-zinc-400 border border-[#2A251E] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Packing Items List */}
        <div className="mt-4 overflow-y-auto flex-1 space-y-2.5 pr-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => togglePacked(item.id)}
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                item.packed
                  ? 'bg-[#100E0D] border-[#221F1B] opacity-60'
                  : 'bg-[#0E0C0A] border-[#26231E] hover:border-safari-copper/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center transition-all ${
                    item.packed
                      ? 'bg-safari-amber text-black'
                      : 'border border-zinc-700 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <span
                    className={`text-sm font-serif ${
                      item.packed ? 'line-through text-zinc-500' : 'text-safari-cream font-medium'
                    }`}
                  >
                    {item.item_name}
                  </span>
                  {item.weather_reason && (
                    <div className="text-[11px] text-safari-copper/90 mt-0.5 font-sans">
                      ↳ {item.weather_reason}
                    </div>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono uppercase text-zinc-500">
                {item.category}
              </span>
            </div>
          ))}
        </div>

        {/* Add custom item */}
        <form onSubmit={handleAddItem} className="mt-4 pt-3 border-t border-[#23201A] flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add custom piece of gear..."
            className="flex-1 px-4 py-2 rounded-xl bg-[#0C0A09] border border-[#26231E] text-xs text-safari-cream placeholder:text-zinc-600 focus:outline-none focus:border-safari-amber"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-safari-amber text-black text-xs font-semibold uppercase flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

      </div>
    </div>
  );
};
