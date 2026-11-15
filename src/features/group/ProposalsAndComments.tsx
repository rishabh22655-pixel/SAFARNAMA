import React, { useState } from 'react';
import { ChangeProposal, ItineraryComment, TripMember } from '../../types';
import { MessageSquare, Check, X, Send, Sparkles, User, AlertCircle } from 'lucide-react';

interface ProposalsAndCommentsProps {
  tripId: string;
  isOwner: boolean;
  currentUser: { id: string; name: string };
  proposals: ChangeProposal[];
  comments: ItineraryComment[];
  onApproveProposal: (proposalId: string) => void;
  onRejectProposal: (proposalId: string) => void;
  onAddProposal: (proposal: ChangeProposal) => void;
  onAddComment: (comment: ItineraryComment) => void;
}

export const ProposalsAndComments: React.FC<ProposalsAndCommentsProps> = ({
  tripId,
  isOwner,
  currentUser,
  proposals,
  comments,
  onApproveProposal,
  onRejectProposal,
  onAddProposal,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDesc, setProposalDesc] = useState('');

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: ItineraryComment = {
      id: 'cmt-' + Date.now(),
      trip_id: tripId,
      user_id: currentUser.id,
      user_name: currentUser.name,
      text: commentText.trim(),
      created_at: new Date().toISOString()
    };

    onAddComment(newComment);
    setCommentText('');
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle.trim()) return;

    const newProposal: ChangeProposal = {
      id: 'prop-' + Date.now(),
      trip_id: tripId,
      proposer_id: currentUser.id,
      proposer_name: currentUser.name,
      title: proposalTitle.trim(),
      description: proposalDesc.trim(),
      proposed_changes: [],
      status: 'pending',
      created_at: new Date().toISOString()
    };

    onAddProposal(newProposal);
    setShowProposalModal(false);
    setProposalTitle('');
    setProposalDesc('');
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#141210] border border-[#26231E] shadow-xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#23201A] gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-safari-copper mb-1">
            Democratic Collaboration
          </div>
          <h3 className="text-2xl font-serif text-safari-cream font-medium">
            Proposals & Member Discussion
          </h3>
          <p className="text-xs text-safari-muted mt-1">
            Propose itinerary modifications with owner approval workflow.
          </p>
        </div>

        <button
          onClick={() => setShowProposalModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-card hover:bg-[#1E1A16] border border-safari-amber/60 text-safari-cream shadow-md transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-safari-amber" />
          <span>Propose Itinerary Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Change Proposals */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-safari-copper flex items-center justify-between">
            <span>Change Proposals</span>
            <span className="text-[10px] text-zinc-500 font-sans">
              {isOwner ? 'Owner Approval Required' : 'Review Status'}
            </span>
          </div>

          {proposals.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#0C0A09] border border-[#23201A] text-center text-xs text-safari-muted">
              No change proposals yet. Any member can propose adding an offbeat stop or adjusting hours.
            </div>
          ) : (
            <div className="space-y-3">
              {proposals.map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 rounded-xl bg-[#0C0A09] border border-[#23201A] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-serif font-medium text-safari-cream">
                        {prop.title}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                        By <span className="text-safari-copper">{prop.proposer_name}</span> · {new Date(prop.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                        prop.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : prop.status === 'rejected'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>

                  <p className="text-xs text-safari-muted leading-relaxed font-sans">
                    {prop.description}
                  </p>

                  {/* Owner Controls */}
                  {isOwner && prop.status === 'pending' && (
                    <div className="pt-2 border-t border-[#1C1814] flex justify-end gap-2">
                      <button
                        onClick={() => onRejectProposal(prop.id)}
                        className="px-3 py-1 rounded-full text-xs font-mono uppercase text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => onApproveProposal(prop.id)}
                        className="px-4 py-1 rounded-full text-xs font-mono uppercase bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Realtime Discussion Comments */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-[#0E0C0A] border border-[#23201A] flex flex-col h-[400px]">
          <div className="text-xs font-mono uppercase tracking-wider text-safari-copper mb-4 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-safari-amber" />
            <span>Itinerary Discussion</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {comments.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                Start a discussion with fellow travelers.
              </div>
            ) : (
              comments.map((cmt) => (
                <div key={cmt.id} className="p-3 rounded-lg bg-[#141210] border border-[#26231E]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-serif font-medium text-safari-cream">
                      {cmt.user_name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {new Date(cmt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-safari-muted font-sans leading-relaxed">
                    {cmt.text}
                  </p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendComment} className="mt-4 pt-3 border-t border-[#1C1814] flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a thought for the cohort..."
              className="flex-1 px-4 py-2 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-xs text-safari-cream placeholder:text-zinc-600 focus:outline-none focus:border-safari-amber"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-xl bg-safari-amber hover:bg-safari-amber-hover text-black text-xs font-semibold uppercase disabled:opacity-40"
            >
              Post
            </button>
          </form>
        </div>

      </div>

      {/* Propose Edit Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#141210] border border-[#2E2922] rounded-2xl p-6 text-[#EDE5DB]">
            <h3 className="text-xl font-serif text-safari-cream font-medium mb-4">
              Propose Itinerary Modification
            </h3>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-safari-copper mb-1">
                  Proposal Title
                </label>
                <input
                  type="text"
                  required
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  placeholder="e.g. Switch Day 3 Sunset to George Everest Peak"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream focus:border-safari-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-safari-copper mb-1">
                  Reason & Trade-Offs
                </label>
                <textarea
                  rows={3}
                  required
                  value={proposalDesc}
                  onChange={(e) => setProposalDesc(e.target.value)}
                  placeholder="Explain why this provides superior photography or saves travel time..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C0A09] border border-[#2E2922] text-xs text-safari-cream focus:border-safari-amber focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 text-xs uppercase text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase bg-safari-amber hover:bg-safari-amber-hover text-black shadow-lg"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
