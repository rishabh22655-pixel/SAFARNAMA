import { Destination, DepartureWindow, Activity } from '../types';

export const SEED_DESTINATIONS: Destination[] = [
  {
    id: 'dest-bali',
    name: 'Bali — Tegalalang',
    region: 'SOUTHEAST ASIA',
    tagline: 'Sunrise over the rice terraces, mist first and then the light.',
    price_per_day: 7800,
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    lat: -8.4333,
    lng: 115.2833,
    description: 'Ancient emerald contours carved into volcanic slopes. At dawn, woodsmoke blends with moisture rising from the rainforest canopy.'
  },
  {
    id: 'dest-ooty',
    name: 'Ooty — The Nilgiris',
    region: 'SOUTH INDIA',
    tagline: 'The blue toy train climbing out of the fog at walking pace.',
    price_per_day: 4200,
    image_url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    lat: 11.4102,
    lng: 76.6950,
    description: 'Colonial switchbacks, eucalyptus-scented drizzle, and tea garden ridges framed by old steam whistles echoing across valleys.'
  },
  {
    id: 'dest-kedarnath',
    name: 'Kedarnath · 3,583 m',
    region: 'NORTH INDIA',
    tagline: 'Pilgrims arrive before the light does. Stone, snow and a bell.',
    price_per_day: 6100,
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    lat: 30.7352,
    lng: 79.0669,
    description: 'Thousand-year-old grey schist temple perched before the colossal Kedarnath peak. Heavy bronze bells ring in sub-zero alpine air.'
  },
  {
    id: 'dest-mussoorie',
    name: "Mussoorie — Camel's Back",
    region: 'NORTH INDIA',
    tagline: 'Switchbacks in pine and a sea of clouds parked below the ridge.',
    price_per_day: 3900,
    image_url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    lat: 30.4598,
    lng: 78.0644,
    description: 'Deodar slopes meeting golden hour fog. Cobblestone walks tracing the spine of the ridge above the Doon Valley.'
  },
  {
    id: 'dest-offbeat',
    name: 'Offbeat India',
    region: 'WESTERN GHATS · HIMALAYA · COLD DESERT',
    tagline: 'A hidden waterfall, a market before dawn, a fire under the Milky Way.',
    price_per_day: 5400,
    image_url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
    lat: 14.9981,
    lng: 74.8074,
    description: 'Unmarked dirt trails, bioluminescent moss along secret cascades, and canvas tents illuminated under crystal winter constellations.'
  }
];

export const SEED_DEPARTURE_WINDOWS: DepartureWindow[] = [
  // Bali
  {
    id: 'win-bali-1',
    destination_id: 'dest-bali',
    title: 'Spring Canopy Window',
    start_date: '2027-05-10',
    end_date: '2027-05-16',
    nights: 6,
    seat_cap: 8,
    seats_taken: 5
  },
  {
    id: 'win-bali-2',
    destination_id: 'dest-bali',
    title: 'Autumn Mist Window',
    start_date: '2027-09-14',
    end_date: '2027-09-20',
    nights: 6,
    seat_cap: 8,
    seats_taken: 8 // FULL!
  },

  // Ooty
  {
    id: 'win-ooty-1',
    destination_id: 'dest-ooty',
    title: 'Monsoon Break Window',
    start_date: '2027-04-18',
    end_date: '2027-04-23',
    nights: 5,
    seat_cap: 10,
    seats_taken: 4
  },
  {
    id: 'win-ooty-2',
    destination_id: 'dest-ooty',
    title: 'Nilgiri Frost Window',
    start_date: '2027-10-12',
    end_date: '2027-10-17',
    nights: 5,
    seat_cap: 10,
    seats_taken: 9
  },

  // Kedarnath
  {
    id: 'win-kedar-1',
    destination_id: 'dest-kedarnath',
    title: 'Spring Portal Window',
    start_date: '2027-05-24',
    end_date: '2027-05-30',
    nights: 6,
    seat_cap: 8,
    seats_taken: 3
  },
  {
    id: 'win-kedar-2',
    destination_id: 'dest-kedarnath',
    title: 'Clear Peak Autumn Window',
    start_date: '2027-10-02',
    end_date: '2027-10-08',
    nights: 6,
    seat_cap: 8,
    seats_taken: 7
  },

  // Mussoorie
  {
    id: 'win-muss-1',
    destination_id: 'dest-mussoorie',
    title: 'Pre-Monsoon Ridge Window',
    start_date: '2027-06-06',
    end_date: '2027-06-11',
    nights: 5,
    seat_cap: 12,
    seats_taken: 6
  },
  {
    id: 'win-muss-2',
    destination_id: 'dest-mussoorie',
    title: 'Winterline Sunset Window',
    start_date: '2027-11-08',
    end_date: '2027-11-13',
    nights: 5,
    seat_cap: 12,
    seats_taken: 10
  },

  // Offbeat India
  {
    id: 'win-offbeat-1',
    destination_id: 'dest-offbeat',
    title: 'Monsoon Ghats Run',
    start_date: '2027-07-15',
    end_date: '2027-07-22',
    nights: 7,
    seat_cap: 6,
    seats_taken: 2
  },
  {
    id: 'win-offbeat-2',
    destination_id: 'dest-offbeat',
    title: 'Cold Desert Starfire',
    start_date: '2027-12-18',
    end_date: '2027-12-25',
    nights: 7,
    seat_cap: 6,
    seats_taken: 6 // FULL!
  }
];

export const SEED_ACTIVITIES: Activity[] = [
  // Bali
  {
    id: 'act-bali-1',
    destination_id: 'dest-bali',
    name: 'Sunrise Rice Terrace Trek & Mist Photography',
    price: 1800,
    duration_hours: 3.5,
    category: 'photography',
    outdoor: true,
    description: 'Golden dawn walk along the high ridge trail before the tourists arrive.',
    is_editable_seed: true
  },
  {
    id: 'act-bali-2',
    destination_id: 'dest-bali',
    name: 'Campuhan Ridge Silent Walk',
    price: 900,
    duration_hours: 2,
    category: 'nature',
    outdoor: true,
    description: 'Gentle morning hike between two sacred rivers overlooking jungle ravines.',
    is_editable_seed: true
  },
  {
    id: 'act-bali-3',
    destination_id: 'dest-bali',
    name: 'Mount Batur Volcanic Rim Dawn Ascent',
    price: 3200,
    duration_hours: 5,
    category: 'adventure',
    outdoor: true,
    description: 'Pre-dawn summit trek to watch the sun ignite the caldera and crater lake.',
    is_editable_seed: true
  },
  {
    id: 'act-bali-4',
    destination_id: 'dest-bali',
    name: 'Tirta Empul Sacred Water Ritual',
    price: 1400,
    duration_hours: 2.5,
    category: 'cultural',
    outdoor: false,
    description: 'Traditional purification blessing with an elder priest in stone spring pools.',
    is_editable_seed: true
  },
  {
    id: 'act-bali-5',
    destination_id: 'dest-bali',
    name: 'Ubud Artisan Coffee & Balinese Kitchen Masterclass',
    price: 2200,
    duration_hours: 3,
    category: 'culinary',
    outdoor: false,
    description: 'Slow-roasting organic beans and cooking wild herb sambals in an open bamboo pavilion.',
    is_editable_seed: true
  },

  // Ooty
  {
    id: 'act-ooty-1',
    destination_id: 'dest-ooty',
    name: 'Historic Nilgiri Mountain Toy Train Journey',
    price: 1500,
    duration_hours: 3,
    category: 'cultural',
    outdoor: false,
    description: 'Wooden heritage carriage through 16 tunnels and 250 stone bridges.',
    is_editable_seed: true
  },
  {
    id: 'act-ooty-2',
    destination_id: 'dest-ooty',
    name: 'Avalanche Lake Silent Pine Forest Trail',
    price: 1200,
    duration_hours: 4,
    category: 'nature',
    outdoor: true,
    description: 'Remote high-altitude lake surrounded by dense rhododendron and shola forests.',
    is_editable_seed: true
  },
  {
    id: 'act-ooty-3',
    destination_id: 'dest-ooty',
    name: 'Glenmorgan Tea Estate Harvest & Cupping',
    price: 1600,
    duration_hours: 2.5,
    category: 'culinary',
    outdoor: true,
    description: 'Hand-plucking two leaves and a bud followed by private vintage tea cupping.',
    is_editable_seed: true
  },
  {
    id: 'act-ooty-4',
    destination_id: 'dest-ooty',
    name: 'Toda Tribal Heritage & Sacred Groves Walk',
    price: 1800,
    duration_hours: 3,
    category: 'cultural',
    outdoor: true,
    description: 'Meeting indigenous Toda artisans and visiting barrel-vaulted thatch dwellings.',
    is_editable_seed: true
  },
  {
    id: 'act-ooty-5',
    destination_id: 'dest-ooty',
    name: 'Pykara Waterfalls & Whispering Woods Trek',
    price: 1100,
    duration_hours: 3.5,
    category: 'adventure',
    outdoor: true,
    description: 'Trekking through protected sanctuary lands towards cascading river falls.',
    is_editable_seed: true
  },

  // Kedarnath
  {
    id: 'act-kedar-1',
    destination_id: 'dest-kedarnath',
    name: 'Dawn Aarti & Kedarnath Sanctum Stone Viewing',
    price: 1200,
    duration_hours: 2,
    category: 'spiritual',
    outdoor: false,
    description: 'Echoing conch shells and butter lamps at 4:30 AM inside the 8th-century granite temple.',
    is_editable_seed: true
  },
  {
    id: 'act-kedar-2',
    destination_id: 'dest-kedarnath',
    name: 'Chorabari Glacier & Gandhi Sarovar High Altitude Trek',
    price: 3400,
    duration_hours: 6,
    category: 'adventure',
    outdoor: true,
    description: 'Challenging high moraine hike to the emerald glacial lake beneath Kedardome.',
    is_editable_seed: true
  },
  {
    id: 'act-kedar-3',
    destination_id: 'dest-kedarnath',
    name: 'Vasuki Tal Alpine Tarn Guided Crossing',
    price: 4500,
    duration_hours: 7,
    category: 'adventure',
    outdoor: true,
    description: 'Technical alpine trek to a pristine turquoise lake surrounded by jagged ice walls.',
    is_editable_seed: true
  },
  {
    id: 'act-kedar-4',
    destination_id: 'dest-kedarnath',
    name: 'Mandakini Riverhead Meditation & Sound Recording',
    price: 900,
    duration_hours: 2,
    category: 'spiritual',
    outdoor: true,
    description: 'Capturing the roar of glacial meltwaters and guided mindfulness on river rocks.',
    is_editable_seed: true
  },
  {
    id: 'act-kedar-5',
    destination_id: 'dest-kedarnath',
    name: 'High Himalayan Stargazing & Campfire Storytelling',
    price: 1500,
    duration_hours: 3,
    category: 'nature',
    outdoor: true,
    description: 'Crystal clear night skies at 3,500m around wood charcoal with local mountaineers.',
    is_editable_seed: true
  },

  // Mussoorie
  {
    id: 'act-muss-1',
    destination_id: 'dest-mussoorie',
    name: "Camel's Back Fog Ridge Sunrise Walk",
    price: 800,
    duration_hours: 2,
    category: 'nature',
    outdoor: true,
    description: 'Quiet promenade along the natural rock formation with deodars emerging through fog.',
    is_editable_seed: true
  },
  {
    id: 'act-muss-2',
    destination_id: 'dest-mussoorie',
    name: 'Landour Sisters Bazaar Heritage Walk & Bake Tasting',
    price: 1400,
    duration_hours: 3,
    category: 'culinary',
    outdoor: false,
    description: 'Artisanal cheese tasting, fresh cinnamon buns, and visiting vintage post offices.',
    is_editable_seed: true
  },
  {
    id: 'act-muss-3',
    destination_id: 'dest-mussoorie',
    name: 'Jabarkhet Nature Reserve Guided Canopy Hike',
    price: 1600,
    duration_hours: 3.5,
    category: 'adventure',
    outdoor: true,
    description: 'Private conservation forest walk tracking Himalayan flora, pheasants and orchids.',
    is_editable_seed: true
  },
  {
    id: 'act-muss-4',
    destination_id: 'dest-mussoorie',
    name: 'George Everest Cloud-Peak Sunset Expedition',
    price: 1200,
    duration_hours: 2.5,
    category: 'nature',
    outdoor: true,
    description: 'Panoramic views of Aglar River valley and the snowclad Himalayan ranges.',
    is_editable_seed: true
  },
  {
    id: 'act-muss-5',
    destination_id: 'dest-mussoorie',
    name: "Pari Tibba (Witch's Hill) Twilight Ghost Trek",
    price: 1700,
    duration_hours: 3,
    category: 'adventure',
    outdoor: true,
    description: 'Eerie, burnt-oak ridge famous in Ruskin Bond tales, explored with storm lanterns.',
    is_editable_seed: true
  },

  // Offbeat India
  {
    id: 'act-off-1',
    destination_id: 'dest-offbeat',
    name: 'Western Ghats Bioluminescent Forest Night Trail',
    price: 2800,
    duration_hours: 3,
    category: 'adventure',
    outdoor: true,
    description: 'Walking beneath canopy trees glowing with natural fungal luminescence during damp monsoons.',
    is_editable_seed: true
  },
  {
    id: 'act-off-2',
    destination_id: 'dest-offbeat',
    name: 'Silent Waterfall Abseiling & Canyon Plunge',
    price: 3600,
    duration_hours: 4.5,
    category: 'adventure',
    outdoor: true,
    description: 'Rappelling down secluded granite cataracts into deep emerald plunge pools.',
    is_editable_seed: true
  },
  {
    id: 'act-off-3',
    destination_id: 'dest-offbeat',
    name: 'Cold Desert High-Pass Milky Way Stargazing',
    price: 2400,
    duration_hours: 3,
    category: 'nature',
    outdoor: true,
    description: 'Telescopic observation of spiral nebulae from a high plateau above 4,000 meters.',
    is_editable_seed: true
  },
  {
    id: 'act-off-4',
    destination_id: 'dest-offbeat',
    name: 'Dawn Spice Market & Heritage Foraging',
    price: 1500,
    duration_hours: 2.5,
    category: 'culinary',
    outdoor: false,
    description: 'Smelling wild black pepper, wild cardamom pods, and learning indigenous herb uses.',
    is_editable_seed: true
  },
  {
    id: 'act-off-5',
    destination_id: 'dest-offbeat',
    name: 'Nomadic Tribe Hearth Gathering & Folk Stories',
    price: 1800,
    duration_hours: 3,
    category: 'cultural',
    outdoor: false,
    description: 'Traditional shepherd hearth songs, butter tea, and ancient oral migration histories.',
    is_editable_seed: true
  }
];
