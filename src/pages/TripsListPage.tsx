import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '../types';
import { getSavedPlans, getCurrentUser } from '../lib/storage';
import { Plus, Compass, Calendar, Users, ArrowRight, Film, MapPin } from 'lucide-react';
import { SEED_DESTINATIONS } from '../data/seedData';

export const TripsListPage: React.FC = () => {
  const [plans, setPlans] = useState<Trip[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    const loaded = getSavedPlans();
    if (loaded.length === 0) {
      // Provide initial demo plan if none exist
      const demoTrip: Trip = {
        id: 'trip-demo-kedar',
        name: 'Monsoon in the Ghats & Kedarnath',
        owner_id: user.id,
        invite_code: 'SAFAR8',
        destination_ids: ['dest-kedarnath', 'dest-offbeat'],
        departure_window_ids: ['win-kedar-1', 'win-offbeat-1'],
        activity_ids: ['act-kedar-1', 'act-off-1'],
        travellers_count: 2,
        budget: 68000,
        status: 'planning',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        destinations: [SEED_DESTINATIONS[2], SEED_DESTINATIONS[4]],
      };
      setPlans([demoTrip]);
    } else {
      setPlans(loaded);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#EDE5DB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-[#1F1C17] gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-safari-copper mb-2">
              Expedition Archive
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif text-safari-cream font-normal tracking-tight">
              Your Saved Journeys
            </h1>
            <p className="mt-2 text-sm text-safari-muted">
              {user.isGuest
                ? 'Stored locally on this device. Sign in from header to sync to cloud.'
                : `Synchronized with ${user.email}.`}
            </p>
          </div>

          <Link
            to="/planner"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-lg transition-transform active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Expedition</span>
          </Link>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((p) => {
            const firstDestId = p.destination_ids[0];
            const dest = SEED_DESTINATIONS.find((d) => d.id === firstDestId) || SEED_DESTINATIONS[0];

            return (
              <div
                key={p.id}
                className="group rounded-2xl overflow-hidden border border-[#26231E] bg-[#141210] hover:border-[#3E382F] transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#0C0A09]">
                  <img
                    src={dest.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-black/60 border border-white/10 text-white backdrop-blur-md">
                    Invite: {p.invite_code}
                  </span>
                </div>

                <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-safari-copper mb-1">
                      {p.destination_ids.length} Destination{p.destination_ids.length > 1 ? 's' : ''}
                    </div>
                    <h3 className="text-2xl font-serif text-safari-cream font-medium">
                      {p.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-4 text-xs font-mono text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-safari-copper" />
                        {p.travellers_count} travellers
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-safari-copper" />
                        Seasonal Window
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#23201A] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Allocated Budget</div>
                      <div className="text-sm font-mono text-safari-amber font-semibold">
                        ₹{(p.budget || 50000).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <Link
                      to={`/trips/${p.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-safari-amber hover:text-white transition-colors"
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
