import { Trip, Destination, DepartureWindow, Activity, ItineraryItem, Alert } from '../types';
import { SEED_DESTINATIONS, SEED_DEPARTURE_WINDOWS, SEED_ACTIVITIES } from '../data/seedData';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_PLANS_KEY = 'safarnama_saved_plans_v1';
const DRAFT_PLAN_KEY = 'safarnama_current_draft_v1';
const USER_KEY = 'safarnama_current_user_v1';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isGuest: boolean;
}

export interface PlanDraft {
  id: string;
  name: string;
  selectedDestinations: string[]; // destination IDs
  selectedWindows: Record<string, string>; // destinationId -> windowId
  selectedActivities: string[]; // activity IDs
  travellers: number;
  createdAt: string;
}

export const getInitialDraft = (): PlanDraft => {
  try {
    const raw = localStorage.getItem(DRAFT_PLAN_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse draft from localStorage', e);
  }
  return {
    id: 'draft-' + Date.now(),
    name: 'Monsoon in the Ghats',
    selectedDestinations: [],
    selectedWindows: {},
    selectedActivities: [],
    travellers: 2,
    createdAt: new Date().toISOString()
  };
};

export const saveDraft = (draft: PlanDraft) => {
  try {
    localStorage.setItem(DRAFT_PLAN_KEY, JSON.stringify(draft));
  } catch (e) {
    console.error('Failed to save draft to localStorage', e);
  }
};

export const getSavedPlans = (): Trip[] => {
  try {
    const raw = localStorage.getItem(LOCAL_PLANS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to get saved plans', e);
  }
  return [];
};

export const savePlanToStorage = async (trip: Trip, currentUser: UserSession): Promise<Trip> => {
  // Always keep in local storage first
  const existing = getSavedPlans();
  const index = existing.findIndex(t => t.id === trip.id);
  let updatedList: Trip[];
  if (index >= 0) {
    updatedList = [...existing];
    updatedList[index] = trip;
  } else {
    updatedList = [trip, ...existing];
  }
  localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(updatedList));

  // If user is logged in & Supabase is configured, write to database
  if (!currentUser.isGuest && isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('trips').upsert({
        id: trip.id,
        name: trip.name,
        owner_id: currentUser.id,
        invite_code: trip.invite_code,
        destination_ids: trip.destination_ids,
        departure_window_ids: trip.departure_window_ids,
        activity_ids: trip.activity_ids,
        travellers_count: trip.travellers_count,
        budget: trip.budget,
        status: trip.status,
        updated_at: new Date().toISOString()
      });
      if (error) {
        console.warn('Could not sync trip to Supabase (falling back to local):', error.message);
      }
    } catch (err) {
      console.warn('Supabase sync error', err);
    }
  }

  return trip;
};

export const migrateLocalPlansToAccount = async (user: UserSession): Promise<number> => {
  const localPlans = getSavedPlans();
  if (localPlans.length === 0 || !isSupabaseConfigured() || user.isGuest) {
    return 0;
  }

  let count = 0;
  for (const plan of localPlans) {
    try {
      const { error } = await supabase.from('trips').upsert({
        id: plan.id,
        name: plan.name,
        owner_id: user.id,
        invite_code: plan.invite_code || Math.random().toString(36).substring(2, 8).toUpperCase(),
        destination_ids: plan.destination_ids,
        departure_window_ids: plan.departure_window_ids,
        activity_ids: plan.activity_ids,
        travellers_count: plan.travellers_count,
        budget: plan.budget,
        status: plan.status,
        updated_at: new Date().toISOString()
      });
      if (!error) count++;
    } catch (e) {
      console.error('Migration failed for plan:', plan.id, e);
    }
  }
  return count;
};

// Current mock/guest user session manager
export const getCurrentUser = (): UserSession => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  const guestUser: UserSession = {
    id: 'guest-' + Math.random().toString(36).substring(2, 9),
    email: 'traveler@safarnama.film',
    name: 'Nomadic Explorer',
    isGuest: true
  };
  localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
  return guestUser;
};

export const setCurrentUser = (user: UserSession) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Generator for default Itinerary Items from selected destinations & windows
export const generateDefaultItineraryItems = (
  tripId: string,
  destinations: Destination[],
  windows: DepartureWindow[],
  activities: Activity[]
): ItineraryItem[] => {
  const items: ItineraryItem[] = [];
  let currentDay = 1;

  for (const dest of destinations) {
    const win = windows.find(w => w.destination_id === dest.id);
    const destActivities = activities.filter(a => a.destination_id === dest.id);
    const nights = win ? win.nights : 3;

    // Day 1: Arrival & Sunset vantage
    items.push({
      id: `item-${tripId}-${dest.id}-d1-arrival`,
      trip_id: tripId,
      day: currentDay,
      start_time: '14:00',
      end_time: '16:30',
      place: `${dest.name} — Base Camp Check-in & Heritage Briefing`,
      lat: dest.lat,
      lng: dest.lng,
      category: 'accommodation',
      outdoor: false,
      cost_estimate: Math.round(dest.price_per_day * 0.45),
      status: 'planned'
    });

    items.push({
      id: `item-${tripId}-${dest.id}-d1-scenic`,
      trip_id: tripId,
      day: currentDay,
      start_time: '17:00',
      end_time: '19:00',
      place: `${dest.name} — Golden Hour Ridge Walk`,
      lat: dest.lat + 0.005,
      lng: dest.lng + 0.005,
      category: 'scenic',
      outdoor: true,
      cost_estimate: 400,
      status: 'planned'
    });

    currentDay++;

    // Subsequent days with activities
    let actIndex = 0;
    for (let dayOffset = 2; dayOffset <= nights; dayOffset++) {
      const act1 = destActivities[actIndex % destActivities.length];
      actIndex++;
      const act2 = destActivities[actIndex % destActivities.length];
      actIndex++;

      if (act1) {
        items.push({
          id: `item-${tripId}-${dest.id}-d${currentDay}-act1`,
          trip_id: tripId,
          day: currentDay,
          start_time: '06:30',
          end_time: '10:30',
          place: `${dest.name} — ${act1.name}`,
          lat: dest.lat + 0.008,
          lng: dest.lng - 0.004,
          category: 'activity',
          outdoor: act1.outdoor,
          cost_estimate: act1.price,
          status: 'planned'
        });
      }

      items.push({
        id: `item-${tripId}-${dest.id}-d${currentDay}-food`,
        trip_id: tripId,
        day: currentDay,
        start_time: '13:00',
        end_time: '14:30',
        place: `${dest.name} — Local Foraged Lunch & Tea Gathering`,
        lat: dest.lat + 0.002,
        lng: dest.lng + 0.003,
        category: 'food',
        outdoor: false,
        cost_estimate: 850,
        status: 'planned'
      });

      if (act2 && act2.id !== act1?.id) {
        items.push({
          id: `item-${tripId}-${dest.id}-d${currentDay}-act2`,
          trip_id: tripId,
          day: currentDay,
          start_time: '16:00',
          end_time: '18:30',
          place: `${dest.name} — ${act2.name}`,
          lat: dest.lat - 0.006,
          lng: dest.lng + 0.007,
          category: 'activity',
          outdoor: act2.outdoor,
          cost_estimate: act2.price,
          status: 'planned'
        });
      }

      currentDay++;
    }
  }

  return items;
};
