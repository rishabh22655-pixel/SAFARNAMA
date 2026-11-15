import React, { useState, useEffect } from 'react';
import { SEED_DESTINATIONS, SEED_DEPARTURE_WINDOWS, SEED_ACTIVITIES } from '../data/seedData';
import { DestinationCard } from '../features/planner/DestinationCard';
import { DepartureWindowsSection } from '../features/planner/DepartureWindowsSection';
import { TripSummaryCard } from '../features/planner/TripSummaryCard';
import { getInitialDraft, saveDraft, PlanDraft } from '../lib/storage';

export const PlannerPage: React.FC = () => {
  const [draft, setDraft] = useState<PlanDraft>(getInitialDraft());

  // Keep draft persisted in local storage
  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  const handleToggleDestination = (destId: string) => {
    setDraft((prev) => {
      const exists = prev.selectedDestinations.includes(destId);
      let updatedDestinations: string[];
      let updatedWindows = { ...prev.selectedWindows };
      let updatedActivities = [...prev.selectedActivities];

      if (exists) {
        updatedDestinations = prev.selectedDestinations.filter((id) => id !== destId);
        delete updatedWindows[destId];
        // Remove activities associated with this destination
        const destActIds = SEED_ACTIVITIES.filter((a) => a.destination_id === destId).map((a) => a.id);
        updatedActivities = updatedActivities.filter((id) => !destActIds.includes(id));
      } else {
        updatedDestinations = [...prev.selectedDestinations, destId];
        // Auto-select first available window for convenience
        const firstAvailableWin = SEED_DEPARTURE_WINDOWS.find(
          (w) => w.destination_id === destId && w.seat_cap > w.seats_taken
        );
        if (firstAvailableWin) {
          updatedWindows[destId] = firstAvailableWin.id;
        }
      }

      return {
        ...prev,
        selectedDestinations: updatedDestinations,
        selectedWindows: updatedWindows,
        selectedActivities: updatedActivities,
      };
    });
  };

  const handleSelectWindow = (destId: string, windowId: string) => {
    setDraft((prev) => ({
      ...prev,
      selectedWindows: {
        ...prev.selectedWindows,
        [destId]: windowId,
      },
    }));
  };

  const handleToggleActivity = (activityId: string) => {
    setDraft((prev) => {
      const exists = prev.selectedActivities.includes(activityId);
      return {
        ...prev,
        selectedActivities: exists
          ? prev.selectedActivities.filter((id) => id !== activityId)
          : [...prev.selectedActivities, activityId],
      };
    });
  };

  const selectedDestinationObjects = SEED_DESTINATIONS.filter((d) =>
    draft.selectedDestinations.includes(d.id)
  );

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#EDE5DB]">
      {/* 1. HERO SECTION (Matches screenshots exactly) */}
      <section className="relative w-full h-[540px] sm:h-[620px] flex items-end overflow-hidden border-b border-[#1C1814]">
        {/* Background Image: Kedarnath Himalayan Dawn */}
        <img
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=85"
          alt="Kedarnath Temple Dawn"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.08]"
        />

        {/* Cinematic gradient overlay matching screenshot */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A09]/80 via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-safari-copper font-medium mb-3">
              PLAN YOUR JOURNEY
            </div>

            {/* H1 Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-serif font-normal text-safari-cream tracking-tight leading-[1.08]">
              Build the trip, then hold a seat in the window
            </h1>

            {/* Body copy */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-safari-muted leading-relaxed max-w-2xl font-sans">
              We only travel when a place is worth filming. Each destination runs in fixed seasonal windows with a small number of seats — pick yours below.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN PLANNING AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Step 01 & Step 02 */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* STEP 01 */}
            <section>
              <div className="mb-8">
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-safari-copper font-medium mb-1">
                  STEP 01
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-normal text-safari-cream tracking-tight">
                  Choose your destinations
                </h2>
              </div>

              {/* Grid of Destination Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {SEED_DESTINATIONS.map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    isSelected={draft.selectedDestinations.includes(dest.id)}
                    onToggle={handleToggleDestination}
                  />
                ))}
              </div>
            </section>

            {/* STEP 02 */}
            <DepartureWindowsSection
              selectedDestinations={selectedDestinationObjects}
              departureWindows={SEED_DEPARTURE_WINDOWS}
              activities={SEED_ACTIVITIES}
              selectedWindows={draft.selectedWindows}
              selectedActivities={draft.selectedActivities}
              onSelectWindow={handleSelectWindow}
              onToggleActivity={handleToggleActivity}
            />
          </div>

          {/* Right Column: Sticky Trip Summary Card */}
          <div className="lg:col-span-4">
            <TripSummaryCard
              selectedDestinations={selectedDestinationObjects}
              departureWindows={SEED_DEPARTURE_WINDOWS}
              activities={SEED_ACTIVITIES}
              selectedWindows={draft.selectedWindows}
              selectedActivities={draft.selectedActivities}
              travellers={draft.travellers}
              onTravellersChange={(count) => setDraft((p) => ({ ...p, travellers: count }))}
              planName={draft.name}
              onPlanNameChange={(name) => setDraft((p) => ({ ...p, name }))}
            />
          </div>

        </div>
      </main>
    </div>
  );
};
