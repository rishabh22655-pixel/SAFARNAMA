export type BadgeType = 'LIVE' | 'ESTIMATE' | 'USER-ENTERED';

export interface DataBadgeInfo {
  type: BadgeType;
  source?: string;
  timestamp?: string;
  basis?: string;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  tagline: string;
  price_per_day: number;
  image_url: string;
  lat: number;
  lng: number;
  description?: string;
}

export interface DepartureWindow {
  id: string;
  destination_id: string;
  title: string;
  start_date: string;
  end_date: string;
  nights: number;
  seat_cap: number;
  seats_taken: number;
}

export interface Activity {
  id: string;
  destination_id: string;
  name: string;
  price: number;
  duration_hours: number;
  category: 'adventure' | 'cultural' | 'nature' | 'photography' | 'culinary' | 'spiritual';
  outdoor: boolean;
  description?: string;
  is_editable_seed?: boolean;
}

export type ItineraryItemStatus = 'planned' | 'disrupted' | 'replaced' | 'done';

export interface ItineraryItem {
  id: string;
  trip_id: string;
  day: number;
  start_time: string;
  end_time: string;
  place: string;
  lat: number;
  lng: number;
  category: 'transport' | 'accommodation' | 'activity' | 'food' | 'scenic';
  outdoor: boolean;
  cost_estimate: number;
  actual_cost?: number;
  cost_badge?: BadgeType;
  status: ItineraryItemStatus;
  disruption_reason?: string;
  weather_forecast?: {
    precipitation_prob?: number;
    wind_gusts?: number;
    temperature?: number;
    weather_desc?: string;
    is_disruptive?: boolean;
    fetched_at?: string;
  };
}

export interface Alert {
  id: string;
  trip_id: string;
  type: 'weather_disruption' | 'budget_warning' | 'schedule_conflict' | 'system';
  severity: 'warning' | 'critical' | 'info';
  title: string;
  reason: string;
  data_source: string;
  badge_type: BadgeType;
  created_at: string;
  resolved: boolean;
  item_id?: string;
}

export interface ItineraryRevision {
  id: string;
  trip_id: string;
  created_at: string;
  description: string;
  snapshot: {
    items: ItineraryItem[];
    total_cost: number;
  };
}

export interface TripMember {
  id: string;
  trip_id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'owner' | 'member';
  status: 'active' | 'invited' | 'declined';
  joined_at: string;
}

export interface MemberPreferences {
  user_id: string;
  user_name: string;
  budget_min: number;
  budget_max: number;
  interests: string[];
  pace: 'relaxed' | 'moderate' | 'intense';
  dietary: string;
  submitted_at: string;
}

export interface DestinationVote {
  trip_id: string;
  user_id: string;
  ranking: string[]; // destination IDs in order of preference
  submitted_at: string;
}

export interface ItineraryComment {
  id: string;
  trip_id: string;
  item_id?: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
}

export interface ChangeProposal {
  id: string;
  trip_id: string;
  proposer_id: string;
  proposer_name: string;
  title: string;
  description: string;
  proposed_changes: Partial<ItineraryItem>[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Expense {
  id: string;
  trip_id: string;
  title: string;
  paid_by: string;
  paid_by_name: string;
  amount: number;
  category: 'transport' | 'accommodation' | 'food' | 'activities' | 'buffer';
  split_type: 'equal' | 'custom';
  shares: Record<string, number>; // user_id -> share amount
  created_at: string;
}

export interface DebtSettlement {
  from_user_id: string;
  from_name: string;
  to_user_id: string;
  to_name: string;
  amount: number;
}

export interface Trip {
  id: string;
  name: string;
  owner_id: string;
  invite_code: string;
  destination_ids: string[];
  departure_window_ids: string[];
  activity_ids: string[];
  travellers_count: number;
  budget: number;
  status: 'planning' | 'confirmed' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
  // Computed & live properties
  destinations?: Destination[];
  departure_windows?: DepartureWindow[];
  activities?: Activity[];
  itinerary_items?: ItineraryItem[];
  alerts?: Alert[];
  members?: TripMember[];
  expenses?: Expense[];
}

export interface PackingItem {
  id: string;
  trip_id: string;
  user_id: string;
  item_name: string;
  category: 'clothing' | 'gear' | 'documents' | 'toiletries' | 'tech';
  packed: boolean;
  weather_reason?: string;
}

export interface NotificationSetting {
  user_id: string;
  departure_reminders: boolean;
  packing_reminders: boolean;
  weather_alerts: boolean;
  schedule_changes: boolean;
  email_notifications: boolean;
  in_app_notifications: boolean;
}
