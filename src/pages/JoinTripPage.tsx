import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, setCurrentUser, getSavedPlans } from '../lib/storage';
import { Compass, Users, ArrowRight, Sparkles } from 'lucide-react';
import { SEED_DESTINATIONS } from '../data/seedData';

export const JoinTripPage: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [name, setName] = useState(currentUser.isGuest ? '' : currentUser.name);
  const [email, setEmail] = useState(currentUser.isGuest ? '' : currentUser.email);

  // Match trip from invite code
  const plans = getSavedPlans();
  const matchedTrip = plans.find((p) => p.invite_code?.toUpperCase() === inviteCode?.toUpperCase()) || plans[0];

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const user = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      email,
      name: name.trim() || email.split('@')[0],
      isGuest: false
    };
    setCurrentUser(user);

    if (matchedTrip) {
      navigate(`/trips/${matchedTrip.id}`);
    } else {
      navigate('/trips');
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#EDE5DB] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#141210] border border-[#2E2922] rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-900/50 text-[10px] font-mono uppercase tracking-widest text-safari-copper">
            <Sparkles className="w-3.5 h-3.5 text-safari-amber" />
            <span>Invitation to Join Cohort</span>
          </div>

          <h1 className="text-3xl font-serif text-safari-cream">
            {matchedTrip ? matchedTrip.name : 'Safarnama Travel Cohort'}
          </h1>

          <p className="text-xs text-safari-muted">
            Invite Code: <span className="font-mono text-safari-amber font-semibold">{inviteCode}</span>
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase text-safari-copper mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Sen"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream focus:border-safari-amber focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-safari-copper mb-1">
              Your Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="traveler@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream focus:border-safari-amber focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#26231E] text-xs text-zinc-400 space-y-1">
            <div className="text-safari-cream font-medium">As a cohort member, you can:</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-zinc-400">
              <li>Cast ballots in ranked-choice destination voting</li>
              <li>Submit individual budget constraints and dietary needs</li>
              <li>Split shared expenses with minimal transaction settlement</li>
              <li>Propose itinerary edits and review AI alternative plans</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-lg flex items-center justify-center gap-2"
          >
            <span>Accept Invitation & Join Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
