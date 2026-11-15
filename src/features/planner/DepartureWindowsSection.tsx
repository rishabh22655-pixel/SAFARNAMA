import React from 'react';
import { Destination, DepartureWindow, Activity } from '../../types';
import { Calendar, Users, Clock, Compass, Plus, Check, ShieldAlert, Sparkles } from 'lucide-react';
import { Badge } from '../../components/Badge';

interface DepartureWindowsSectionProps {
  selectedDestinations: Destination[];
  departureWindows: DepartureWindow[];
  activities: Activity[];
  selectedWindows: Record<string, string>; // destinationId -> windowId
  selectedActivities: string[]; // activity IDs
  onSelectWindow: (destId: string, windowId: string) => void;
  onToggleActivity: (activityId: string) => void;
  onAddCustomActivity?: (destId: string) => void;
}

export const DepartureWindowsSection: React.FC<DepartureWindowsSectionProps> = ({
  selectedDestinations,
  departureWindows,
  activities,
  selectedWindows,
  selectedActivities,
  onSelectWindow,
  onToggleActivity,
}) => {
  return (
    <section className="mt-16 sm:mt-24 pt-12 border-t border-[#1F1C17]">
      {/* Step Header */}
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-safari-copper font-medium mb-1">
          STEP 02
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-normal text-safari-cream tracking-tight">
          Pick a departure window & activities
        </h2>
        <p className="mt-3 text-sm text-safari-muted max-w-2xl leading-relaxed">
          Safarnama doesn't run daily departures. Every place has two windows a year — the only periods it films the way it should — and seats are capped so the group stays small.
        </p>
      </div>

      {/* Empty State */}
      {selectedDestinations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#2E2922] bg-[#12100E]/50 p-12 text-center">
          <Compass className="w-10 h-10 text-safari-copper mx-auto mb-3 opacity-60" />
          <p className="text-sm font-serif text-safari-muted">
            Add a destination above to see its travel windows.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {selectedDestinations.map((dest) => {
            const destWindows = departureWindows.filter((w) => w.destination_id === dest.id);
            const destActivities = activities.filter((a) => a.destination_id === dest.id);
            const selectedWinId = selectedWindows[dest.id];

            return (
              <div
                key={dest.id}
                className="p-6 sm:p-8 rounded-2xl bg-[#141210] border border-[#26231E] shadow-xl"
              >
                {/* Destination Subheading */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#23201A] gap-2">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C89B68]">
                      {dest.region}
                    </span>
                    <h3 className="text-2xl font-serif text-safari-cream font-medium">
                      {dest.name}
                    </h3>
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    Daily Base: <span className="text-safari-amber font-semibold">₹{dest.price_per_day.toLocaleString('en-IN')}</span> / day
                  </div>
                </div>

                {/* Departure Windows Choices */}
                <div className="mt-6">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-safari-copper mb-3 flex items-center justify-between">
                    <span>1. Seasonal Windows (Select One)</span>
                    <span className="text-[10px] text-zinc-500 font-sans normal-case">Strict capacity enforced</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destWindows.map((win) => {
                      const seatsLeft = win.seat_cap - win.seats_taken;
                      const isFull = seatsLeft <= 0;
                      const isSelected = selectedWinId === win.id;

                      const formattedStart = new Date(win.start_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      });
                      const formattedEnd = new Date(win.end_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      });

                      return (
                        <div
                          key={win.id}
                          onClick={() => {
                            if (!isFull) onSelectWindow(dest.id, win.id);
                          }}
                          className={`relative p-5 rounded-xl border transition-all ${
                            isFull
                              ? 'bg-[#100E0D]/60 border-[#221F1B] opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#1A1612] border-safari-amber shadow-[0_0_15px_rgba(245,166,91,0.2)] cursor-pointer'
                              : 'bg-[#0E0C0A] border-[#26231E] hover:border-[#3E382F] cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-base font-serif font-medium text-safari-cream">
                                {win.title}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-xs font-mono text-zinc-400">
                                <Calendar className="w-3.5 h-3.5 text-safari-amber" />
                                <span>{formattedStart} – {formattedEnd}</span>
                              </div>
                            </div>

                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-safari-amber text-black flex items-center justify-center">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-[#1C1915] flex items-center justify-between text-xs">
                            <span className="font-mono text-zinc-400">
                              {win.nights} Nights on road
                            </span>

                            {isFull ? (
                              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/60">
                                <ShieldAlert className="w-3 h-3" /> Full (0 of {win.seat_cap} left)
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded ${
                                  seatsLeft <= 2
                                    ? 'text-amber-300 bg-amber-950/70 border border-amber-800'
                                    : 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/50'
                                }`}
                              >
                                <Users className="w-3 h-3" />
                                {seatsLeft} seat{seatsLeft > 1 ? 's' : ''} left of {win.seat_cap}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Addable Activities List */}
                <div className="mt-8 pt-6 border-t border-[#23201A]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-safari-copper">
                      2. Curated Activities (Addable)
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      Seed data · Flagged editable
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {destActivities.map((act) => {
                      const isActSelected = selectedActivities.includes(act.id);

                      return (
                        <div
                          key={act.id}
                          onClick={() => onToggleActivity(act.id)}
                          className={`p-4 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                            isActSelected
                              ? 'bg-[#181511] border-safari-amber/70'
                              : 'bg-[#0E0C0A] border-[#26231E] hover:border-[#383329]'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-serif font-medium text-safari-cream">
                                {act.name}
                              </span>
                              {act.outdoor ? (
                                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-sky-950/80 text-sky-400 border border-sky-800/50">
                                  Outdoor
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                  Sheltered
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-safari-muted line-clamp-1">
                              {act.description}
                            </p>

                            <div className="mt-2 flex items-center gap-4 text-xs font-mono text-zinc-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-safari-copper" />
                                {act.duration_hours}h
                              </span>
                              <span className="text-safari-amber font-medium">
                                +₹{act.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                              isActSelected
                                ? 'bg-safari-amber text-black'
                                : 'border border-zinc-700 text-transparent'
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
