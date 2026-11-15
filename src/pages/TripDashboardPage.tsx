import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Trip,
  ItineraryItem,
  Alert,
  TripMember,
  Expense,
  ChangeProposal,
  ItineraryComment,
  DestinationVote,
  MemberPreferences,
  ItineraryRevision
} from '../types';
import { SEED_DESTINATIONS } from '../data/seedData';
import { getSavedPlans, getCurrentUser, savePlanToStorage } from '../lib/storage';
import { checkWeatherDisruptions, requestReplan, ReplanAlternative } from '../lib/api';
import { LeafletMap } from '../components/LeafletMap';
import { Badge } from '../components/Badge';
import { DisruptionBanner } from '../features/replan/DisruptionBanner';
import { PlanDiffModal } from '../features/replan/PlanDiffModal';
import { BudgetTracker } from '../features/budget/BudgetTracker';
import { RankedChoiceVoting } from '../features/group/RankedChoiceVoting';
import { DebtSettlementView } from '../features/group/DebtSettlementView';
import { ProposalsAndComments } from '../features/group/ProposalsAndComments';
import { MemberPreferencesModal } from '../features/group/MemberPreferencesModal';
import { ChatAssistantDrawer } from '../features/assistant/ChatAssistantDrawer';
import { PackingListModal } from '../features/assistant/PackingListModal';
import { BookingAssistanceModal } from '../features/assistant/BookingAssistanceModal';
import { NotificationSettingsModal } from '../components/NotificationSettingsModal';
import {
  Calendar,
  Users,
  Compass,
  Sparkles,
  MapPin,
  CheckCircle,
  RotateCcw,
  Bot,
  Backpack,
  Bell,
  ExternalLink,
  Share2,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Layers
} from 'lucide-react';

export const TripDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = getCurrentUser();

  // Load trip or fallback
  const [trip, setTrip] = useState<Trip | null>(() => {
    const plans = getSavedPlans();
    const found = plans.find((p) => p.id === id);
    if (found) return found;

    // Default template trip if not found
    const dest = SEED_DESTINATIONS[2]; // Kedarnath
    return {
      id: id || 'trip-demo',
      name: 'Kedarnath — Stone, Snow & A Bell',
      owner_id: currentUser.id,
      invite_code: 'SAFAR8',
      destination_ids: [dest.id],
      departure_window_ids: ['win-kedar-1'],
      activity_ids: ['act-kedar-1', 'act-kedar-2'],
      travellers_count: 2,
      budget: 65000,
      status: 'planning',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      destinations: [dest],
      itinerary_items: [
        {
          id: 'item-1',
          trip_id: id || 'trip-demo',
          day: 1,
          start_time: '13:00',
          end_time: '15:30',
          place: 'Kedarnath Valley GMVN Stone Resthouse Check-in',
          lat: 30.7352,
          lng: 79.0669,
          category: 'accommodation',
          outdoor: false,
          cost_estimate: 2800,
          status: 'done'
        },
        {
          id: 'item-2',
          trip_id: id || 'trip-demo',
          day: 1,
          start_time: '17:00',
          end_time: '19:00',
          place: 'Mandakini Gorge Sunset Vantage & Audio Capture',
          lat: 30.7380,
          lng: 79.0690,
          category: 'scenic',
          outdoor: true,
          cost_estimate: 600,
          status: 'planned'
        },
        {
          id: 'item-3',
          trip_id: id || 'trip-demo',
          day: 2,
          start_time: '04:30',
          end_time: '06:30',
          place: 'Kedarnath Sanctum Dawn Aarti & Stone Viewing',
          lat: 30.7352,
          lng: 79.0669,
          category: 'activity',
          outdoor: false,
          cost_estimate: 1200,
          status: 'planned'
        },
        {
          id: 'item-4',
          trip_id: id || 'trip-demo',
          day: 2,
          start_time: '08:30',
          end_time: '14:30',
          place: 'Chorabari Glacier & High Tarn Ridge Ascent',
          lat: 30.7500,
          lng: 79.0750,
          category: 'activity',
          outdoor: true,
          cost_estimate: 3400,
          status: 'planned'
        }
      ]
    };
  });

  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>(
    trip?.itinerary_items || []
  );
  const [alerts, setAlerts] = useState<Alert[]>(trip?.alerts || []);
  const [revisions, setRevisions] = useState<ItineraryRevision[]>([]);
  const [lastCheckedAt, setLastCheckedAt] = useState<string>(new Date().toISOString());
  const [isCheckingDisruptions, setIsCheckingDisruptions] = useState(false);

  // Replan modal states
  const [showReplanModal, setShowReplanModal] = useState(false);
  const [replanAlternatives, setReplanAlternatives] = useState<ReplanAlternative[]>([]);
  const [isReplanning, setIsReplanning] = useState(false);
  const [replanError, setReplanError] = useState<string | null>(null);

  // Group trip states
  const [members, setMembers] = useState<TripMember[]>([
    {
      id: 'mem-1',
      trip_id: trip?.id || '',
      user_id: currentUser.id,
      name: currentUser.name || 'Group Organizer',
      email: currentUser.email,
      role: 'owner',
      status: 'active',
      joined_at: new Date().toISOString()
    },
    {
      id: 'mem-2',
      trip_id: trip?.id || '',
      user_id: 'usr-kavya',
      name: 'Kavya Nair',
      email: 'kavya@gmail.com',
      role: 'member',
      status: 'active',
      joined_at: new Date().toISOString()
    }
  ]);
  const [memberPrefs, setMemberPrefs] = useState<MemberPreferences[]>([]);
  const [showPrefsModal, setShowPrefsModal] = useState(false);
  const [votes, setVotes] = useState<DestinationVote[]>([]);
  const [isVotingLocked, setIsVotingLocked] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [proposals, setProposals] = useState<ChangeProposal[]>([]);
  const [comments, setComments] = useState<ItineraryComment[]>([]);

  // Modals & Assistant drawers
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [showPackingModal, setShowPackingModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Active tab in dashboard
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'group' | 'map'>('itinerary');

  // Sync state changes to storage
  const persistChanges = (updatedItems: ItineraryItem[], updatedAlerts?: Alert[]) => {
    if (!trip) return;
    const updatedTrip: Trip = {
      ...trip,
      itinerary_items: updatedItems,
      alerts: updatedAlerts || alerts,
      updated_at: new Date().toISOString()
    };
    setTrip(updatedTrip);
    savePlanToStorage(updatedTrip, currentUser);
  };

  // Check live weather disruptions
  const handleCheckDisruptions = async () => {
    setIsCheckingDisruptions(true);
    try {
      const result = await checkWeatherDisruptions(itineraryItems);
      setItineraryItems(result.items);
      const newAlerts = [...result.alerts, ...alerts.filter((a) => a.type !== 'weather_disruption')];
      setAlerts(newAlerts);
      setLastCheckedAt(result.checkedAt);
      persistChanges(result.items, newAlerts);
    } catch (e) {
      console.error('Weather disruption scan failed', e);
    } finally {
      setIsCheckingDisruptions(false);
    }
  };

  // Run initial weather check once
  useEffect(() => {
    handleCheckDisruptions();
  }, []);

  // Trigger AI dynamic replanning
  const handleTriggerReplan = async () => {
    setShowReplanModal(true);
    setIsReplanning(true);
    setReplanError(null);

    const disrupted = itineraryItems.filter((i) => i.status === 'disrupted');
    const remaining = itineraryItems.filter((i) => i.status !== 'done');

    try {
      const response = await requestReplan({
        disruptedItems: disrupted.length > 0 ? disrupted : [itineraryItems[1]],
        remainingSchedule: remaining,
        budgetLeft: trip ? trip.budget - 12000 : 35000,
        groupInterests: ['high altitude alpine photography', 'sheltered tea tastings', 'temple sanctum aarti'],
        fixedConstraints: {
          windowDates: 'Fixed Departure Window',
          groupSize: trip?.travellers_count || 2
        }
      });
      setReplanAlternatives(response.alternatives);
    } catch (err: any) {
      setReplanError(err.message || 'AI replan failed');
    } finally {
      setIsReplanning(false);
    }
  };

  // Accept alternative replan with revision snapshot & undo
  const handleAcceptAlternative = (alt: ReplanAlternative) => {
    // Save snapshot of current items before applying
    const snapshot: ItineraryRevision = {
      id: 'rev-' + Date.now(),
      trip_id: trip?.id || '',
      created_at: new Date().toISOString(),
      description: `Replaced disrupted stops with: ${alt.title}`,
      snapshot: {
        items: [...itineraryItems],
        total_cost: itineraryItems.reduce((s, i) => s + (i.actual_cost || i.cost_estimate), 0)
      }
    };
    setRevisions((prev) => [snapshot, ...prev]);

    // Apply the alternative items
    const newItems = alt.items.map((item, idx) => ({
      id: item.id || `alt-item-${Date.now()}-${idx}`,
      trip_id: trip?.id || '',
      day: item.day,
      start_time: item.start_time,
      end_time: item.end_time,
      place: item.place,
      lat: item.lat,
      lng: item.lng,
      category: item.category,
      outdoor: item.outdoor,
      cost_estimate: item.cost_estimate,
      status: 'planned' as const,
      disruption_reason: undefined
    }));

    setItineraryItems(newItems);
    setShowReplanModal(false);
    persistChanges(newItems);
  };

  // Undo last revision
  const handleUndoRevision = () => {
    if (revisions.length === 0) return;
    const [latest, ...rest] = revisions;
    setItineraryItems(latest.snapshot.items);
    setRevisions(rest);
    persistChanges(latest.snapshot.items);
  };

  // Mark item as done
  const handleToggleDone = (itemId: string) => {
    const updated = itineraryItems.map((item) =>
      item.id === itemId
        ? { ...item, status: (item.status === 'done' ? 'planned' : 'done') as any }
        : item
    );
    setItineraryItems(updated);
    persistChanges(updated);
  };

  // Update line item cost override
  const handleUpdateItemCost = (itemId: string, newCost: number) => {
    const updated = itineraryItems.map((item) =>
      item.id === itemId
        ? { ...item, actual_cost: newCost, cost_badge: 'USER-ENTERED' as const }
        : item
    );
    setItineraryItems(updated);
    persistChanges(updated);
  };

  // Apply budget proposal swap
  const handleApplyBudgetProposal = (proposal: any) => {
    if (proposal.targetItemId) {
      const updated = itineraryItems.map((item) =>
        item.id === proposal.targetItemId
          ? {
              ...item,
              place: `${item.place} (${proposal.title})`,
              cost_estimate: proposal.proposedCost,
              actual_cost: proposal.proposedCost
            }
          : item
      );
      setItineraryItems(updated);
      persistChanges(updated);
    }
  };

  // AI assistant tool action confirmation handler
  const handleApplyAssistantAction = (action: any) => {
    if (action.type === 'trigger_replan') {
      handleTriggerReplan();
    } else if (action.type === 'add_item' && action.parameters) {
      const p = action.parameters;
      const newItem: ItineraryItem = {
        id: 'ast-item-' + Date.now(),
        trip_id: trip?.id || '',
        day: p.day || 1,
        start_time: p.start_time || '15:00',
        end_time: p.end_time || '17:00',
        place: p.place || 'Curated Stop',
        lat: p.lat || 30.735,
        lng: p.lng || 79.066,
        category: p.category || 'activity',
        outdoor: p.outdoor || false,
        cost_estimate: p.cost || 1200,
        status: 'planned'
      };
      const updated = [...itineraryItems, newItem];
      setItineraryItems(updated);
      persistChanges(updated);
    }
  };

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/join/${trip?.invite_code || 'SAFAR8'}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 3000);
  };

  if (!trip) return null;

  const doneCount = itineraryItems.filter((i) => i.status === 'done').length;
  const progressPercent = Math.round((doneCount / (itineraryItems.length || 1)) * 100);
  const disruptedCount = itineraryItems.filter((i) => i.status === 'disrupted').length;

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#EDE5DB]">
      
      {/* Top Banner / Breadcrumb Header */}
      <div className="border-b border-[#1F1C17] bg-[#12100E] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Link to="/trips" className="hover:text-safari-cream">Trips</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-safari-amber font-serif text-sm">{trip.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyInviteLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono border border-[#2E2922] bg-[#0C0A09] hover:border-safari-copper text-safari-cream transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-safari-amber" />
              <span>{copiedInvite ? 'Copied Invite URL!' : `Invite Code: ${trip.invite_code}`}</span>
            </button>

            <button
              onClick={() => setShowNotifModal(true)}
              className="p-2 rounded-full border border-[#2E2922] bg-[#0C0A09] hover:border-safari-copper text-zinc-400 hover:text-white"
              title="Notification Settings"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowPackingModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono border border-[#2E2922] bg-[#0C0A09] hover:border-safari-copper text-safari-cream transition-colors"
            >
              <Backpack className="w-3.5 h-3.5 text-safari-amber" />
              <span>Packing List</span>
            </button>

            <button
              onClick={() => setShowBookingModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono border border-[#2E2922] bg-[#0C0A09] hover:border-safari-copper text-safari-cream transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-safari-amber" />
              <span>Bookings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Hero */}
      <div className="border-b border-[#1F1C17] bg-[#0E0C0A] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-safari-copper">
                Active Expedition Dashboard
              </span>
              <Badge
                type="LIVE"
                source="Open-Meteo & OSRM Engine"
                timestamp={lastCheckedAt}
              />
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif text-safari-cream font-medium tracking-tight">
              {trip.name}
            </h1>

            <div className="flex items-center gap-6 text-xs font-mono text-zinc-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-safari-copper" />
                {trip.travellers_count} Travellers ({members.length} Confirmed)
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-safari-copper" />
                Spring Portal Window · 6 Nights
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Seat Cap Enforced
              </span>
            </div>
          </div>

          {/* Progress Bar & Undo Revision Button */}
          <div className="flex flex-col items-start md:items-end gap-3 min-w-[240px]">
            {revisions.length > 0 && (
              <button
                onClick={handleUndoRevision}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-safari-amber hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo Replanning Revision ({revisions.length})</span>
              </button>
            )}

            <div className="w-full space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Journey Progress</span>
                <span className="text-safari-amber">{doneCount} of {itineraryItems.length} stops ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-[#1C1814] rounded-full overflow-hidden">
                <div
                  className="h-full bg-safari-amber rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#1F1C17] bg-[#141210] sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-4 border-b-2 transition-colors shrink-0 ${
              activeTab === 'itinerary'
                ? 'border-safari-amber text-safari-cream font-semibold'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Itinerary Timeline {disruptedCount > 0 && <span className="ml-1 text-rose-400">({disruptedCount} alert)</span>}
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`py-4 border-b-2 transition-colors shrink-0 ${
              activeTab === 'map'
                ? 'border-safari-amber text-safari-cream font-semibold'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            OSRM Mountain Map
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`py-4 border-b-2 transition-colors shrink-0 ${
              activeTab === 'budget'
                ? 'border-safari-amber text-safari-cream font-semibold'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Budget Intelligence
          </button>

          <button
            onClick={() => setActiveTab('group')}
            className={`py-4 border-b-2 transition-colors shrink-0 ${
              activeTab === 'group'
                ? 'border-safari-amber text-safari-cream font-semibold'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Group Consensus & Split
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* B1 Weather Disruption Banner (Always Visible if Disrupted) */}
        <DisruptionBanner
          alerts={alerts}
          disruptedItems={itineraryItems.filter((i) => i.status === 'disrupted')}
          isChecking={isCheckingDisruptions}
          onCheckNow={handleCheckDisruptions}
          onViewAlternatives={handleTriggerReplan}
          lastCheckedAt={lastCheckedAt}
        />

        {/* Tab 1: Itinerary Timeline */}
        {activeTab === 'itinerary' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Timeline Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-xl font-serif text-safari-cream font-medium">
                  Day-by-Day Expedition Schedule
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  Click checkmark to log completed stops
                </span>
              </div>

              <div className="space-y-4">
                {itineraryItems.map((item, idx) => {
                  const isDisrupted = item.status === 'disrupted';
                  const isDone = item.status === 'done';

                  return (
                    <div
                      key={item.id || idx}
                      className={`p-5 rounded-2xl border transition-all ${
                        isDisrupted
                          ? 'bg-rose-950/20 border-rose-800 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                          : isDone
                          ? 'bg-[#100E0D] border-[#221F1B] opacity-70'
                          : 'bg-[#141210] border-[#26231E] hover:border-[#383329]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          {/* Toggle done button */}
                          <button
                            type="button"
                            onClick={() => handleToggleDone(item.id)}
                            className={`w-6 h-6 rounded-full mt-1 flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-emerald-500 text-black'
                                : 'border border-zinc-600 hover:border-safari-amber text-transparent'
                            }`}
                            title="Mark as done"
                          >
                            <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                          </button>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-mono text-safari-copper font-medium">
                                Day {item.day} · {item.start_time} - {item.end_time}
                              </span>

                              <Badge
                                type={item.cost_badge || 'ESTIMATE'}
                                basis="Initial seasonal baseline"
                              />

                              {item.outdoor ? (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                                  Outdoor
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                  Sheltered
                                </span>
                              )}

                              {item.weather_forecast && (
                                <Badge
                                  type="LIVE"
                                  source={`Open-Meteo: ${item.weather_forecast.weather_desc || 'Forecast'}`}
                                  timestamp={item.weather_forecast.fetched_at}
                                />
                              )}
                            </div>

                            <h4
                              className={`text-lg font-serif ${
                                isDone ? 'line-through text-zinc-500' : 'text-safari-cream font-medium'
                              }`}
                            >
                              {item.place}
                            </h4>

                            {isDisrupted && (
                              <div className="mt-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
                                ⚠ Meteorological Disruption: {item.disruption_reason || 'Rain probability > 70%'}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-mono text-safari-cream">
                            ₹{(item.actual_cost !== undefined ? item.actual_cost : item.cost_estimate).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] font-mono uppercase text-zinc-500">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compact Map Preview & Concierge Banner */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-5 rounded-2xl bg-[#141210] border border-[#26231E] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-safari-copper">
                    Live Route Overview
                  </span>
                  <Badge type="LIVE" source="OSRM & CartoDB Dark" />
                </div>
                <LeafletMap items={itineraryItems} className="h-64 rounded-xl overflow-hidden" />
              </div>

              {/* Concierge Floating CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C1813] to-[#12100E] border border-safari-amber/40 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-safari-amber">
                  <Bot className="w-5 h-5" />
                  <span className="font-serif text-lg text-safari-cream font-medium">
                    Personal Travel Concierge
                  </span>
                </div>
                <p className="text-xs text-safari-muted leading-relaxed">
                  Have questions about altitude acclimatization, local photography spots, or need to tweak timings?
                </p>
                <button
                  onClick={() => setShowChatDrawer(true)}
                  className="w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Concierge Chat</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Map View Full */}
        {activeTab === 'map' && (
          <div className="p-6 rounded-2xl bg-[#141210] border border-[#26231E] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif text-safari-cream">
                  OSRM Mountain Transit Route
                </h3>
                <p className="text-xs text-safari-muted mt-0.5">
                  Real road polylines calculated via Open Source Routing Machine engine.
                </p>
              </div>
              <Badge
                type="LIVE"
                source="OSRM Direct Routing Engine"
                timestamp={lastCheckedAt}
              />
            </div>

            <LeafletMap items={itineraryItems} className="h-[550px] rounded-xl overflow-hidden" />
          </div>
        )}

        {/* Tab 3: Budget Intelligence */}
        {activeTab === 'budget' && (
          <BudgetTracker
            trip={trip}
            items={itineraryItems}
            onUpdateItemCost={handleUpdateItemCost}
            onApplyProposal={handleApplyBudgetProposal}
          />
        )}

        {/* Tab 4: Group Planning & Debt Settlement */}
        {activeTab === 'group' && (
          <div className="space-y-10">
            {/* Preferences submission */}
            <div className="p-6 rounded-2xl bg-[#141210] border border-[#26231E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xl font-serif text-safari-cream">
                  Group Member Preferences
                </h4>
                <p className="text-xs text-safari-muted mt-0.5">
                  Submit individual budget bounds, dietary requirements, and journey pacing.
                </p>
              </div>
              <button
                onClick={() => setShowPrefsModal(true)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber text-black shadow-md"
              >
                Submit My Preferences
              </button>
            </div>

            {/* Ranked-choice voting */}
            <RankedChoiceVoting
              destinations={SEED_DESTINATIONS}
              votes={votes}
              isOwner={trip.owner_id === currentUser.id}
              isLocked={isVotingLocked}
              currentUserId={currentUser.id}
              onCastBallot={(rank) => {
                const newVote: DestinationVote = {
                  trip_id: trip.id,
                  user_id: currentUser.id,
                  ranking: rank,
                  submitted_at: new Date().toISOString()
                };
                setVotes((prev) => [...prev.filter((v) => v.user_id !== currentUser.id), newVote]);
              }}
              onLockResults={() => setIsVotingLocked(true)}
            />

            {/* Minimal-transactions debt settlement */}
            <DebtSettlementView
              tripId={trip.id}
              members={members}
              expenses={expenses}
              onAddExpense={(exp) => setExpenses((prev) => [exp, ...prev])}
            />

            {/* Proposals & comments */}
            <ProposalsAndComments
              tripId={trip.id}
              isOwner={trip.owner_id === currentUser.id}
              currentUser={{ id: currentUser.id, name: currentUser.name }}
              proposals={proposals}
              comments={comments}
              onApproveProposal={(propId) => {
                setProposals((prev) =>
                  prev.map((p) => (p.id === propId ? { ...p, status: 'approved' } : p))
                );
              }}
              onRejectProposal={(propId) => {
                setProposals((prev) =>
                  prev.map((p) => (p.id === propId ? { ...p, status: 'rejected' } : p))
                );
              }}
              onAddProposal={(prop) => setProposals((prev) => [prop, ...prev])}
              onAddComment={(cmt) => setComments((prev) => [...prev, cmt])}
            />
          </div>
        )}

      </main>

      {/* Floating AI Concierge Trigger Button */}
      <button
        onClick={() => setShowChatDrawer(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-safari-amber hover:bg-safari-amber-hover text-black shadow-[0_4px_24px_rgba(245,166,91,0.35)] transition-all transform active:scale-90 flex items-center gap-2 group"
        title="Open Concierge Chat"
      >
        <Sparkles className="w-5 h-5" />
        <span className="hidden sm:inline font-mono text-xs font-semibold uppercase tracking-wider pr-1">
          AI Concierge
        </span>
      </button>

      {/* Dynamic Replan Diff Modal */}
      <PlanDiffModal
        isOpen={showReplanModal}
        alternatives={replanAlternatives}
        isLoading={isReplanning}
        errorMessage={replanError}
        onAcceptAlternative={handleAcceptAlternative}
        onDismiss={() => setShowReplanModal(false)}
        onRetry={handleTriggerReplan}
      />

      {/* Member Preferences Modal */}
      <MemberPreferencesModal
        isOpen={showPrefsModal}
        initialPreferences={memberPrefs.find((p) => p.user_id === currentUser.id)}
        onSave={(pref) => {
          setMemberPrefs((prev) => [...prev.filter((p) => p.user_id !== currentUser.id), pref]);
        }}
        onClose={() => setShowPrefsModal(false)}
      />

      {/* AI Assistant Chat Drawer with Tool Calling */}
      <ChatAssistantDrawer
        isOpen={showChatDrawer}
        trip={trip}
        items={itineraryItems}
        onClose={() => setShowChatDrawer(false)}
        onApplyAction={handleApplyAssistantAction}
      />

      {/* Packing List Modal */}
      <PackingListModal
        isOpen={showPackingModal}
        trip={trip}
        items={itineraryItems}
        currentUserId={currentUser.id}
        onClose={() => setShowPackingModal(false)}
      />

      {/* Booking Assistance Modal */}
      <BookingAssistanceModal
        isOpen={showBookingModal}
        trip={trip}
        items={itineraryItems}
        onClose={() => setShowBookingModal(false)}
      />

      {/* Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={showNotifModal}
        userId={currentUser.id}
        onClose={() => setShowNotifModal(false)}
      />

    </div>
  );
};
