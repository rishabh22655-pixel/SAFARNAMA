import React, { useState } from 'react';
import { Destination, DestinationVote } from '../../types';
import { ArrowUp, ArrowDown, Lock, CheckCircle2, Vote, Sparkles } from 'lucide-react';
import { Badge } from '../../components/Badge';

interface RankedChoiceVotingProps {
  destinations: Destination[];
  votes: DestinationVote[];
  isOwner: boolean;
  isLocked: boolean;
  currentUserId: string;
  onCastBallot: (ranking: string[]) => void;
  onLockResults: () => void;
}

export const RankedChoiceVoting: React.FC<RankedChoiceVotingProps> = ({
  destinations,
  votes,
  isOwner,
  isLocked,
  currentUserId,
  onCastBallot,
  onLockResults,
}) => {
  // Find current user's existing vote or initialize with default order
  const existingVote = votes.find((v) => v.user_id === currentUserId);
  const [ranking, setRanking] = useState<string[]>(() => {
    if (existingVote && existingVote.ranking.length > 0) {
      return existingVote.ranking;
    }
    return destinations.map((d) => d.id);
  });
  const [ballotCast, setBallotCast] = useState(Boolean(existingVote));

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newRank = [...ranking];
    const temp = newRank[index - 1];
    newRank[index - 1] = newRank[index];
    newRank[index] = temp;
    setRanking(newRank);
  };

  const moveDown = (index: number) => {
    if (index === ranking.length - 1) return;
    const newRank = [...ranking];
    const temp = newRank[index + 1];
    newRank[index + 1] = newRank[index];
    newRank[index] = temp;
    setRanking(newRank);
  };

  const handleVoteSubmit = () => {
    onCastBallot(ranking);
    setBallotCast(true);
  };

  // Compute Instant Runoff / Borda Count Tally
  // 1st place = N points, 2nd = N-1 points, etc.
  const scores: Record<string, number> = {};
  destinations.forEach((d) => (scores[d.id] = 0));

  votes.forEach((v) => {
    const totalCount = v.ranking.length;
    v.ranking.forEach((destId, rankIndex) => {
      const points = totalCount - rankIndex;
      scores[destId] = (scores[destId] || 0) + points;
    });
  });

  const sortedResults = [...destinations].sort(
    (a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)
  );

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#141210] border border-[#26231E] shadow-xl space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#23201A] gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-safari-copper mb-1">
            Democratic Consensus
          </div>
          <h3 className="text-2xl font-serif text-safari-cream font-medium">
            Ranked-Choice Destination Ballot
          </h3>
          <p className="text-xs text-safari-muted mt-1">
            {votes.length} ballot{votes.length === 1 ? '' : 's'} recorded. Rank destinations by dragging or using the arrows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            type="LIVE"
            source="Supabase Realtime Vote Tally"
            timestamp={new Date().toISOString()}
          />
          {isOwner && !isLocked && (
            <button
              onClick={onLockResults}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-safari-amber border border-safari-amber/40 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Tally</span>
            </button>
          )}
          {isLocked && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-amber-950/60 text-safari-amber border border-amber-800/60">
              <Lock className="w-3.5 h-3.5" /> Locked by Owner
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Ballot */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-safari-copper">
            Your Ranked Preferences {!isLocked ? '(Drag or Move Up/Down)' : '(Ballots Closed)'}
          </div>

          <div className="space-y-2.5">
            {ranking.map((destId, index) => {
              const dest = destinations.find((d) => d.id === destId);
              if (!dest) return null;

              return (
                <div
                  key={dest.id}
                  className="p-3.5 rounded-xl bg-[#0C0A09] border border-[#26231E] flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#181512] border border-[#2E2922] font-mono text-xs flex items-center justify-center text-safari-amber">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-serif font-medium text-safari-cream">
                        {dest.name}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500">
                        {dest.region} · ₹{dest.price_per_day.toLocaleString()} / day
                      </div>
                    </div>
                  </div>

                  {!isLocked && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        aria-label="Move destination preference up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(index)}
                        disabled={index === ranking.length - 1}
                        className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        aria-label="Move destination preference down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!isLocked && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleVoteSubmit}
                className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-md flex items-center justify-center gap-2"
              >
                <Vote className="w-4 h-4" />
                <span>{ballotCast ? 'Update My Ballot' : 'Cast Ranked Ballot'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Live Tally & Winner Leaderboard */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0E0C0A] border border-[#23201A] space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-safari-copper flex items-center justify-between">
            <span>Live Runoff Standings</span>
            <span className="text-[10px] text-zinc-500">Borda Metric</span>
          </div>

          <div className="space-y-3">
            {sortedResults.map((dest, i) => {
              const score = scores[dest.id] || 0;
              const maxScore = sortedResults[0] ? scores[sortedResults[0].id] || 1 : 1;
              const percent = Math.round((score / (maxScore || 1)) * 100);

              return (
                <div key={dest.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif text-safari-cream">
                      {i === 0 && <span className="text-safari-amber mr-1">★</span>}
                      {dest.name}
                    </span>
                    <span className="font-mono text-safari-copper">{score} pts</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1C1814] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        i === 0 ? 'bg-safari-amber' : 'bg-[#3A332A]'
                      }`}
                      style={{ width: `${Math.max(5, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {sortedResults[0] && (
            <div className="mt-4 p-3 rounded-lg bg-[#141210] border border-[#2A251E] text-xs text-zinc-400">
              <span className="text-safari-cream font-medium">Consensus Leader:</span> {sortedResults[0].name}.
              {isLocked && <span className="text-emerald-400 ml-1">Confirmed by group leader.</span>}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
