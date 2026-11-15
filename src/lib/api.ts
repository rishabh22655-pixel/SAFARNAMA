import { ItineraryItem, Alert } from '../types';

export interface DisruptionCheckResponse {
  items: ItineraryItem[];
  alerts: Alert[];
  source: string;
  checkedAt: string;
}

export interface ReplanAlternative {
  id: string;
  title: string;
  rationale: string;
  costDelta: number;
  tradeOffs: string;
  totalTravelMinutes?: number;
  travelTimeHours?: string;
  items: Array<{
    id: string;
    day: number;
    start_time: string;
    end_time: string;
    place: string;
    lat: number;
    lng: number;
    category: 'transport' | 'accommodation' | 'activity' | 'food' | 'scenic';
    outdoor: boolean;
    cost_estimate: number;
    action: 'keep' | 'added' | 'removed' | 'modified';
    modification_reason?: string;
  }>;
}

export interface ReplanResponse {
  alternatives: ReplanAlternative[];
  generatedAt: string;
}

export interface CheaperAlternativeProposal {
  id: string;
  type: 'shift_dates' | 'lower_tier_stay' | 'swap_activity' | 'transport_opt';
  title: string;
  description: string;
  tradeOff: string;
  targetItemId?: string;
  currentCost: number;
  proposedCost: number;
  claimedSaving: number;
  serverVerifiedSaving: number;
  savingBadge: 'LIVE';
  verifiedAt: string;
}

export async function checkWeatherDisruptions(items: ItineraryItem[]): Promise<DisruptionCheckResponse> {
  const res = await fetch('/api/check-disruptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Disruption inspection failed' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export async function requestReplan(payload: {
  disruptedItems: ItineraryItem[];
  remainingSchedule: ItineraryItem[];
  budgetLeft: number;
  groupInterests?: string[];
  fixedConstraints?: any;
}): Promise<ReplanResponse> {
  const res = await fetch('/api/replan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'AI replanning request failed' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export async function fetchCheaperAlternatives(payload: {
  items: ItineraryItem[];
  budget: number;
  categoriesBreakdown: Record<string, number>;
}): Promise<{
  analysis: string;
  proposals: CheaperAlternativeProposal[];
  source: string;
}> {
  const res = await fetch('/api/budget/cheaper-alternatives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Budget intelligence query failed' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export async function calculateMinimalSettlement(payload: {
  expenses: any[];
  memberNames: Record<string, string>;
}): Promise<{ settlements: any[]; computedAt: string }> {
  const res = await fetch('/api/settlement/compute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Settlement calculation failed' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export async function sendAssistantMessage(payload: {
  userMessage: string;
  tripContext: any;
  chatHistory: any[];
}) {
  const res = await fetch('/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Assistant communication error' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export async function generateGroupItinerary(payload: {
  preferences: any[];
  destinations: any[];
  departureWindows: any[];
}) {
  const res = await fetch('/api/group/generate-itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Group itinerary generation failed' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}
