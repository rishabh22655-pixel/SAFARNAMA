-- ==========================================================
-- PROJECT: Safarnama
-- Seed Data: Destinations, Departure Windows & Activities
-- ==========================================================

-- 1. SEED DESTINATIONS
INSERT INTO public.destinations (id, name, region, tagline, price_per_day, image_url, lat, lng, description)
VALUES
(
    'dest-bali',
    'Bali — Tegalalang',
    'SOUTHEAST ASIA',
    'Sunrise over the rice terraces, mist first and then the light.',
    7800,
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    -8.4333,
    115.2833,
    'Ancient emerald contours carved into volcanic slopes. At dawn, woodsmoke blends with moisture rising from the rainforest canopy.'
),
(
    'dest-ooty',
    'Ooty — The Nilgiris',
    'SOUTH INDIA',
    'The blue toy train climbing out of the fog at walking pace.',
    4200,
    'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    11.4102,
    76.6950,
    'Colonial switchbacks, eucalyptus-scented drizzle, and tea garden ridges framed by old steam whistles echoing across valleys.'
),
(
    'dest-kedarnath',
    'Kedarnath · 3,583 m',
    'NORTH INDIA',
    'Pilgrims arrive before the light does. Stone, snow and a bell.',
    6100,
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    30.7352,
    79.0669,
    'Thousand-year-old grey schist temple perched before the colossal Kedarnath peak. Heavy bronze bells ring in sub-zero alpine air.'
),
(
    'dest-mussoorie',
    'Mussoorie — Camel''s Back',
    'NORTH INDIA',
    'Switchbacks in pine and a sea of clouds parked below the ridge.',
    3900,
    'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    30.4598,
    78.0644,
    'Deodar slopes meeting golden hour fog. Cobblestone walks tracing the spine of the ridge above the Doon Valley.'
),
(
    'dest-offbeat',
    'Offbeat India',
    'WESTERN GHATS · HIMALAYA · COLD DESERT',
    'A hidden waterfall, a market before dawn, a fire under the Milky Way.',
    5400,
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
    14.9981,
    74.8074,
    'Unmarked dirt trails, bioluminescent moss along secret cascades, and canvas tents illuminated under crystal winter constellations.'
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED DEPARTURE WINDOWS (2 yearly windows per destination)
INSERT INTO public.departure_windows (id, destination_id, title, start_date, end_date, nights, seat_cap, seats_taken)
VALUES
-- Bali
('win-bali-1', 'dest-bali', 'Spring Canopy Window', '2027-05-10', '2027-05-16', 6, 8, 5),
('win-bali-2', 'dest-bali', 'Autumn Mist Window', '2027-09-14', '2027-09-20', 6, 8, 8), -- Full

-- Ooty
('win-ooty-1', 'dest-ooty', 'Monsoon Break Window', '2027-04-18', '2027-04-23', 5, 10, 4),
('win-ooty-2', 'dest-ooty', 'Nilgiri Frost Window', '2027-10-12', '2027-10-17', 5, 10, 9),

-- Kedarnath
('win-kedar-1', 'dest-kedarnath', 'Spring Portal Window', '2027-05-24', '2027-05-30', 6, 8, 3),
('win-kedar-2', 'dest-kedarnath', 'Clear Peak Autumn Window', '2027-10-02', '2027-10-08', 6, 8, 7),

-- Mussoorie
('win-muss-1', 'dest-mussoorie', 'Pre-Monsoon Ridge Window', '2027-06-06', '2027-06-11', 5, 12, 6),
('win-muss-2', 'dest-mussoorie', 'Winterline Sunset Window', '2027-11-08', '2027-11-13', 5, 12, 10),

-- Offbeat India
('win-offbeat-1', 'dest-offbeat', 'Monsoon Ghats Run', '2027-07-15', '2027-07-22', 7, 6, 2),
('win-offbeat-2', 'dest-offbeat', 'Cold Desert Starfire', '2027-12-18', '2027-12-25', 7, 6, 6) -- Full
ON CONFLICT (id) DO NOTHING;

-- 3. SEED ACTIVITIES (4-6 per destination, editable flag, outdoor boolean)
INSERT INTO public.activities (id, destination_id, name, price, duration_hours, category, outdoor, description, is_editable_seed)
VALUES
-- Bali
('act-bali-1', 'dest-bali', 'Sunrise Rice Terrace Trek & Mist Photography', 1800, 3.5, 'photography', true, 'Golden dawn walk along the high ridge trail before tourists arrive.', true),
('act-bali-2', 'dest-bali', 'Campuhan Ridge Silent Walk', 900, 2.0, 'nature', true, 'Gentle morning hike between two sacred rivers overlooking jungle ravines.', true),
('act-bali-3', 'dest-bali', 'Mount Batur Volcanic Rim Dawn Ascent', 3200, 5.0, 'adventure', true, 'Pre-dawn summit trek to watch the sun ignite the caldera and crater lake.', true),
('act-bali-4', 'dest-bali', 'Tirta Empul Sacred Water Ritual', 1400, 2.5, 'cultural', false, 'Traditional purification blessing with an elder priest in stone spring pools.', true),
('act-bali-5', 'dest-bali', 'Ubud Artisan Coffee & Balinese Kitchen Masterclass', 2200, 3.0, 'culinary', false, 'Slow-roasting organic beans and cooking wild herb sambals in an open bamboo pavilion.', true),

-- Ooty
('act-ooty-1', 'dest-ooty', 'Historic Nilgiri Mountain Toy Train Journey', 1500, 3.0, 'cultural', false, 'Wooden heritage carriage through 16 tunnels and 250 stone bridges.', true),
('act-ooty-2', 'dest-ooty', 'Avalanche Lake Silent Pine Forest Trail', 1200, 4.0, 'nature', true, 'Remote high-altitude lake surrounded by dense rhododendron and shola forests.', true),
('act-ooty-3', 'dest-ooty', 'Glenmorgan Tea Estate Harvest & Cupping', 1600, 2.5, 'culinary', true, 'Hand-plucking two leaves and a bud followed by private vintage tea cupping.', true),
('act-ooty-4', 'dest-ooty', 'Toda Tribal Heritage & Sacred Groves Walk', 1800, 3.0, 'cultural', true, 'Meeting indigenous Toda artisans and visiting barrel-vaulted thatch dwellings.', true),
('act-ooty-5', 'dest-ooty', 'Pykara Waterfalls & Whispering Woods Trek', 1100, 3.5, 'adventure', true, 'Trekking through protected sanctuary lands towards cascading river falls.', true),

-- Kedarnath
('act-kedar-1', 'dest-kedarnath', 'Dawn Aarti & Kedarnath Sanctum Stone Viewing', 1200, 2.0, 'spiritual', false, 'Echoing conch shells and butter lamps at 4:30 AM inside the 8th-century granite temple.', true),
('act-kedar-2', 'dest-kedarnath', 'Chorabari Glacier & Gandhi Sarovar High Altitude Trek', 3400, 6.0, 'adventure', true, 'Challenging high moraine hike to the emerald glacial lake beneath Kedardome.', true),
('act-kedar-3', 'dest-kedarnath', 'Vasuki Tal Alpine Tarn Guided Crossing', 4500, 7.0, 'adventure', true, 'Technical alpine trek to a pristine turquoise lake surrounded by jagged ice walls.', true),
('act-kedar-4', 'dest-kedarnath', 'Mandakini Riverhead Meditation & Sound Recording', 900, 2.0, 'spiritual', true, 'Capturing the roar of glacial meltwaters and guided mindfulness on river rocks.', true),
('act-kedar-5', 'dest-kedarnath', 'High Himalayan Stargazing & Campfire Storytelling', 1500, 3.0, 'nature', true, 'Crystal clear night skies at 3,500m around wood charcoal with local mountaineers.', true),

-- Mussoorie
('act-muss-1', 'dest-mussoorie', 'Camel''s Back Fog Ridge Sunrise Walk', 800, 2.0, 'nature', true, 'Quiet promenade along the natural rock formation with deodars emerging through fog.', true),
('act-muss-2', 'dest-mussoorie', 'Landour Sisters Bazaar Heritage Walk & Bake Tasting', 1400, 3.0, 'culinary', false, 'Artisanal cheese tasting, fresh cinnamon buns, and visiting vintage post offices.', true),
('act-muss-3', 'dest-mussoorie', 'Jabarkhet Nature Reserve Guided Canopy Hike', 1600, 3.5, 'adventure', true, 'Private conservation forest walk tracking Himalayan flora, pheasants and orchids.', true),
('act-muss-4', 'dest-mussoorie', 'George Everest Cloud-Peak Sunset Expedition', 1200, 2.5, 'nature', true, 'Panoramic views of Aglar River valley and the snowclad Himalayan ranges.', true),
('act-muss-5', 'dest-mussoorie', 'Pari Tibba (Witch''s Hill) Twilight Ghost Trek', 1700, 3.0, 'adventure', true, 'Eerie, burnt-oak ridge famous in Ruskin Bond tales, explored with storm lanterns.', true),

-- Offbeat India
('act-off-1', 'dest-offbeat', 'Western Ghats Bioluminescent Forest Night Trail', 2800, 3.0, 'adventure', true, 'Walking beneath canopy trees glowing with natural fungal luminescence during damp monsoons.', true),
('act-off-2', 'dest-offbeat', 'Silent Waterfall Abseiling & Canyon Plunge', 3600, 4.5, 'adventure', true, 'Rappelling down secluded granite cataracts into deep emerald plunge pools.', true),
('act-off-3', 'dest-offbeat', 'Cold Desert High-Pass Milky Way Stargazing', 2400, 3.0, 'nature', true, 'Telescopic observation of spiral nebulae from a high plateau above 4,000 meters.', true),
('act-off-4', 'dest-offbeat', 'Dawn Spice Market & Heritage Foraging', 1500, 2.5, 'culinary', false, 'Smelling wild black pepper, wild cardamom pods, and learning indigenous herb uses.', true),
('act-off-5', 'dest-offbeat', 'Nomadic Tribe Hearth Gathering & Folk Stories', 1800, 3.0, 'cultural', false, 'Traditional shepherd hearth songs, butter tea, and ancient oral migration histories.', true)
ON CONFLICT (id) DO NOTHING;
