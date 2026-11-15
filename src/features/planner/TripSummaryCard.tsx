import React, { useState } from 'react';
import { Destination, DepartureWindow, Activity, Trip } from '../../types';
import { Minus, Plus, Bookmark, Sparkles, CheckCircle2 } from 'lucide-react';
import { getCurrentUser, savePlanToStorage, generateDefaultItineraryItems } from '../../lib/storage';
import { useNavigate } from 'react-router-dom';

interface TripSummaryCardProps {
  selectedDestinations: Destination[];
  departureWindows: DepartureWindow[];
  activities: Activity[];
  selectedWindows: Record<string, string>; // destinationId -> windowId
  selectedActivities: string[]; // activity IDs
  travellers: number;
  onTravellersChange: (count: number) => void;
  planName: string;
  onPlanNameChange: (name: string) => void;
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({
  selectedDestinations,
  departureWindows,
  activities,
  selectedWindows,
  selectedActivities,
  travellers,
  onTravellersChange,
  planName,
  onPlanNameChange,
}) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculations
  // Total nights = sum of nights for each selected window
  let totalNights = 0;
  let destinationsDailyCost = 0;

  for (const dest of selectedDestinations) {
    const winId = selectedWindows[dest.id];
    const win = departureWindows.find((w) => w.id === winId);
    const nights = win ? win.nights : 0;
    totalNights += nights;
    destinationsDailyCost += nights * dest.price_per_day;
  }

  // Activities cost (per person)
  const activitiesCostPerPerson = selectedActivities.reduce((sum, actId) => {
    const act = activities.find((a) => a.id === actId);
    return sum + (act ? act.price : 0);
  }, 0);

  // Per person = daily destinations cost + activities cost
  const perPersonCost = destinationsDailyCost + activitiesCostPerPerson;

  // Total = per person cost * travellers
  const grandTotal = perPersonCost * travellers;

  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      const user = getCurrentUser();
      const tripId = 'trip-' + Date.now();
      const chosenWindows = Object.values(selectedWindows).filter(Boolean);
      const chosenActivities = activities.filter((a) => selectedActivities.includes(a.id));

      const itineraryItems = generateDefaultItineraryItems(
        tripId,
        selectedDestinations,
        departureWindows.filter((w) => chosenWindows.includes(w.id)),
        chosenActivities
      );

      const newTrip: Trip = {
        id: tripId,
        name: planName.trim() || 'Monsoon in the Ghats',
        owner_id: user.id,
        invite_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        destination_ids: selectedDestinations.map((d) => d.id),
        departure_window_ids: chosenWindows,
        activity_ids: selectedActivities,
        travellers_count: travellers,
        budget: grandTotal > 0 ? Math.round(grandTotal * 1.15) : 50000,
        status: 'planning',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        destinations: selectedDestinations,
        departure_windows: departureWindows.filter((w) => chosenWindows.includes(w.id)),
        activities: chosenActivities,
        itinerary_items: itineraryItems,
        alerts: []
      };

      await savePlanToStorage(newTrip, user);
      setSaveSuccess(true);
      setTimeout(() => {
        navigate(`/trips/${newTrip.id}`);
      }, 800);
    } catch (e) {
      console.error('Failed to save plan', e);
    } finally {
      setIsSaving(false);
    }
  };

  const hasSelections = selectedDestinations.length > 0;

  return (
    <div className="sticky top-28 bg-[#141210] border border-[#26231E] rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md">
      {/* Title */}
      <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-safari-copper font-medium mb-6">
        TRIP SUMMARY
      </div>

      {/* Travellers Stepper */}
      <div className="flex items-center justify-between pb-6 border-b border-[#23201A]">
        <span className="text-sm font-sans text-safari-cream">Travellers</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onTravellersChange(Math.max(1, travellers - 1))}
            className="w-8 h-8 rounded-full border border-[#38332A] flex items-center justify-center text-safari-cream hover:border-safari-copper hover:text-white transition-colors"
            aria-label="Decrease travellers"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-sm font-medium w-5 text-center text-safari-cream">
            {travellers}
          </span>

          <button
            type="button"
            onClick={() => onTravellersChange(travellers + 1)}
            className="w-8 h-8 rounded-full border border-[#38332A] flex items-center justify-center text-safari-cream hover:border-safari-copper hover:text-white transition-colors"
            aria-label="Increase travellers"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Itinerary List / Selections */}
      <div className="py-6 border-b border-[#23201A] min-h-[100px] flex flex-col justify-center">
        {!hasSelections ? (
          <p className="text-xs sm:text-sm text-safari-muted italic leading-relaxed text-center sm:text-left">
            Nothing planned yet. Your itinerary will build up here.
          </p>
        ) : (
          <div className="space-y-3">
            {selectedDestinations.map((dest) => {
              const winId = selectedWindows[dest.id];
              const win = departureWindows.find((w) => w.id === winId);
              const destActivitiesCount = selectedActivities.filter((actId) => {
                const act = activities.find((a) => a.id === actId);
                return act?.destination_id === dest.id;
              }).length;

              return (
                <div
                  key={dest.id}
                  className="text-xs p-3 rounded-lg bg-[#0C0A09] border border-[#23201A]"
                >
                  <div className="flex items-center justify-between font-serif text-sm text-safari-cream">
                    <span>{dest.name}</span>
                    <span className="font-mono text-[11px] text-safari-amber">
                      {win ? `${win.nights} nights` : 'No window yet'}
                    </span>
                  </div>
                  {win && (
                    <div className="text-[11px] font-mono text-zinc-400 mt-1">
                      {win.title} ({new Date(win.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(win.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                    </div>
                  )}
                  {destActivitiesCount > 0 && (
                    <div className="text-[10px] font-mono text-safari-copper mt-1">
                      + {destActivitiesCount} activity selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats Breakdown */}
      <div className="py-5 space-y-3 text-xs font-mono text-zinc-400 border-b border-[#23201A]">
        <div className="flex items-center justify-between">
          <span className="font-sans text-safari-muted">Nights on the road</span>
          <span className="text-safari-cream font-mono">{totalNights}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-sans text-safari-muted">Per person</span>
          <span className="text-safari-cream font-mono">₹{perPersonCost.toLocaleString('en-IN')}</span>
        </div>

        <div className="pt-2 flex items-baseline justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-safari-copper">TOTAL</span>
          <span className="text-3xl font-serif font-medium text-safari-cream">
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Name This Plan Input */}
      <div className="mt-6">
        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-safari-copper mb-2">
          NAME THIS PLAN
        </label>
        <input
          type="text"
          value={planName}
          onChange={(e) => onPlanNameChange(e.target.value)}
          placeholder="Monsoon in the Ghats"
          className="w-full px-4 py-3 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream placeholder:text-zinc-600 focus:outline-none focus:border-safari-amber transition-colors"
        />
      </div>

      {/* Save Button */}
      <div className="mt-5">
        <button
          type="button"
          onClick={handleSavePlan}
          disabled={isSaving}
          className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-[0_4px_16px_rgba(245,166,91,0.25)] transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-950" />
              Plan Saved!
            </>
          ) : isSaving ? (
            <>Saving Journey...</>
          ) : (
            'SAVE THIS PLAN'
          )}
        </button>
      </div>

      {/* Footnote */}
      <p className="mt-4 text-[11px] text-zinc-500 text-center leading-relaxed font-sans">
        Plans are kept on this device. Nothing is booked until we confirm your seats in the window.
      </p>
    </div>
  );
};
