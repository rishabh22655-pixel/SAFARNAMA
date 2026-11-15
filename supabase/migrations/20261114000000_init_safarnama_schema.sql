-- ==========================================================
-- PROJECT: Safarnama ("New Journey Beyond Travelling")
-- Database Migration: Complete Schema & Row-Level Security (RLS)
-- ==========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS public.destinations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    tagline TEXT NOT NULL,
    price_per_day NUMERIC NOT NULL CHECK (price_per_day > 0),
    image_url TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DEPARTURE WINDOWS TABLE (Fixed seasonal windows + strict seat capacity)
CREATE TABLE IF NOT EXISTS public.departure_windows (
    id TEXT PRIMARY KEY,
    destination_id TEXT NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    nights INTEGER NOT NULL CHECK (nights > 0),
    seat_cap INTEGER NOT NULL CHECK (seat_cap > 0),
    seats_taken INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT chk_seat_capacity CHECK (seats_taken <= seat_cap),
    CONSTRAINT chk_window_dates CHECK (end_date > start_date),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACTIVITIES TABLE (4-6 per destination, outdoor flag, category, pricing)
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    destination_id TEXT NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    duration_hours NUMERIC NOT NULL CHECK (duration_hours > 0),
    category TEXT NOT NULL,
    outdoor BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    is_editable_seed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRIPS TABLE
CREATE TABLE IF NOT EXISTS public.trips (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    destination_ids TEXT[] NOT NULL DEFAULT '{}',
    departure_window_ids TEXT[] NOT NULL DEFAULT '{}',
    activity_ids TEXT[] NOT NULL DEFAULT '{}',
    travellers_count INTEGER NOT NULL DEFAULT 2 CHECK (travellers_count >= 1),
    budget NUMERIC NOT NULL DEFAULT 50000 CHECK (budget >= 0),
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'active', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ITINERARY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.itinerary_items (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day INTEGER NOT NULL CHECK (day >= 1),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    place TEXT NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    category TEXT NOT NULL CHECK (category IN ('transport', 'accommodation', 'activity', 'food', 'scenic')),
    outdoor BOOLEAN NOT NULL DEFAULT FALSE,
    cost_estimate NUMERIC NOT NULL DEFAULT 0,
    actual_cost NUMERIC,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'disrupted', 'replaced', 'done')),
    disruption_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ALERTS TABLE (Meteorological & budget notices with live badge source)
CREATE TABLE IF NOT EXISTS public.alerts (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    item_id TEXT,
    type TEXT NOT NULL CHECK (type IN ('weather_disruption', 'budget_warning', 'schedule_conflict', 'system')),
    severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
    title TEXT NOT NULL,
    reason TEXT NOT NULL,
    data_source TEXT NOT NULL,
    badge_type TEXT NOT NULL DEFAULT 'LIVE' CHECK (badge_type IN ('LIVE', 'ESTIMATE', 'USER-ENTERED')),
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ITINERARY REVISIONS TABLE (Snapshots for undo support)
CREATE TABLE IF NOT EXISTS public.itinerary_revisions (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TRIP MEMBERS TABLE (Group consensus)
CREATE TABLE IF NOT EXISTS public.trip_members (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'declined')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(trip_id, user_id)
);

-- 9. MEMBER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.member_preferences (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    budget_min NUMERIC NOT NULL,
    budget_max NUMERIC NOT NULL,
    interests TEXT[] NOT NULL DEFAULT '{}',
    pace TEXT NOT NULL DEFAULT 'moderate' CHECK (pace IN ('relaxed', 'moderate', 'intense')),
    dietary TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(trip_id, user_id)
);

-- 10. DESTINATION VOTES TABLE (Ranked-choice ballots)
CREATE TABLE IF NOT EXISTS public.destination_votes (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    ranking TEXT[] NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(trip_id, user_id)
);

-- 11. CHANGE PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.change_proposals (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    proposer_id TEXT NOT NULL,
    proposer_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    proposed_changes JSONB DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ITINERARY COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.itinerary_comments (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    item_id TEXT,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. EXPENSES TABLE (Debt Settlement)
CREATE TABLE IF NOT EXISTS public.expenses (
    id TEXT PRIMARY KEY,
    trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    paid_by TEXT NOT NULL,
    paid_by_name TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL CHECK (category IN ('transport', 'accommodation', 'food', 'activities', 'buffer')),
    split_type TEXT NOT NULL DEFAULT 'equal' CHECK (split_type IN ('equal', 'custom')),
    shares JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departure_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Catalog tables: Public read
CREATE POLICY "Public read for destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Public read for departure windows" ON public.departure_windows FOR SELECT USING (true);
CREATE POLICY "Public read for activities" ON public.activities FOR SELECT USING (true);

-- Trips: Owner and members read/write
CREATE POLICY "Users can view their own trips or joined trips" ON public.trips
    FOR SELECT USING (
        auth.uid()::text = owner_id OR 
        EXISTS (SELECT 1 FROM public.trip_members WHERE trip_members.trip_id = trips.id AND trip_members.user_id = auth.uid()::text)
    );

CREATE POLICY "Trip owners can insert trips" ON public.trips
    FOR INSERT WITH CHECK (auth.uid()::text = owner_id);

CREATE POLICY "Trip owners can update trips" ON public.trips
    FOR UPDATE USING (auth.uid()::text = owner_id);

-- Itinerary items policy
CREATE POLICY "Trip members can read itinerary items" ON public.itinerary_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = itinerary_items.trip_id 
            AND (trips.owner_id = auth.uid()::text OR EXISTS (SELECT 1 FROM public.trip_members WHERE trip_members.trip_id = trips.id AND trip_members.user_id = auth.uid()::text))
        )
    );

CREATE POLICY "Trip owners can modify itinerary items" ON public.itinerary_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = itinerary_items.trip_id AND trips.owner_id = auth.uid()::text
        )
    );

-- Expenses policy
CREATE POLICY "Trip members can view expenses" ON public.expenses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = expenses.trip_id 
            AND (trips.owner_id = auth.uid()::text OR EXISTS (SELECT 1 FROM public.trip_members WHERE trip_members.trip_id = trips.id AND trip_members.user_id = auth.uid()::text))
        )
    );

CREATE POLICY "Trip members can insert expenses" ON public.expenses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = expenses.trip_id 
            AND (trips.owner_id = auth.uid()::text OR EXISTS (SELECT 1 FROM public.trip_members WHERE trip_members.trip_id = trips.id AND trip_members.user_id = auth.uid()::text))
        )
    );

-- Strict booking atomic transaction procedure
CREATE OR REPLACE FUNCTION public.hold_seat_in_window(p_window_id TEXT, p_seats INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    v_cap INTEGER;
    v_taken INTEGER;
BEGIN
    SELECT seat_cap, seats_taken INTO v_cap, v_taken
    FROM public.departure_windows
    WHERE id = p_window_id
    FOR UPDATE;

    IF (v_taken + p_seats) <= v_cap THEN
        UPDATE public.departure_windows
        SET seats_taken = seats_taken + p_seats
        WHERE id = p_window_id;
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Departure window is sold out or exceeds seat capacity.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
