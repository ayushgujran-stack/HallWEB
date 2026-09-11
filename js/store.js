// VenueLuxe Central Data Store & State Management
// Complete reactive schema with localStorage persistence

const STORAGE_KEYS = {
  USERS: 'venueluxe_users',
  CURRENT_ROLE: 'venueluxe_current_role',
  CURRENT_USER: 'venueluxe_current_user',
  HALLS: 'venueluxe_halls',
  BOOKINGS: 'venueluxe_bookings',
  REVIEWS: 'venueluxe_reviews',
  FAVORITES: 'venueluxe_favorites',
  NOTIFICATIONS: 'venueluxe_notifications',
  AUDIT_LOGS: 'venueluxe_audit_logs',
  REPORTS: 'venueluxe_reports',
  SETTINGS: 'venueluxe_settings'
};

// Initial Seed Data
const INITIAL_USERS = [
  {
    id: 'cust-1',
    name: 'Ayush Poojary',
    email: 'ayush@example.com',
    phone: '+91 98450 12345',
    role: 'customer',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    created_at: '2025-01-10'
  },
  {
    id: 'owner-1',
    name: 'Vikram Hegde',
    email: 'vikram.hegde@monarchpalace.com',
    phone: '+91 82582 29988',
    whatsapp: '+91 82582 29988',
    role: 'owner',
    business_name: 'Regal Horizons Hospitality Group',
    verified: true,
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    created_at: '2024-11-05'
  },
  {
    id: 'admin-1',
    name: 'Super Admin Authority',
    email: 'admin@venueluxe.com',
    phone: '+91 80000 00001',
    role: 'admin',
    profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    created_at: '2024-01-01'
  }
];

const INITIAL_HALLS = [
  {
    id: 'hall-grand-monarch',
    owner_id: 'owner-1',
    name: 'The Grand Monarch Palace & Banquet Hall',
    slug: 'the-grand-monarch-palace-karkala',
    description: 'Forged with classical Renaissance proportions and modernized with silent VRF centralized climate control, The Grand Monarch Palace stands as Udupi & Karkala’s premier destination for weddings, celebrations, and state conventions with uninterrupted sightlines across the 24-foot clear hall.',
    hall_type: 'Wedding Palace & Convention',
    area: 'Bypass Road, Near City Center',
    city: 'Karkala',
    state: 'Karnataka',
    pincode: '574104',
    address: 'Opposite Highland Estate, Bypass Highway, Karkala 574104',
    latitude: 13.2185,
    longitude: 74.9983,
    distance_km: 1.8,
    size_sqft: 13300,
    length_ft: 140,
    width_ft: 95,
    ceiling_height_ft: 24,
    seating_capacity: 800,
    maximum_capacity: 1800,
    ac_status: 'Central AC (VRF)',
    indoor_outdoor: 'Indoor + Garden Lawn',
    parking_cars: 250,
    dining_seats: 450,
    has_valet: true,
    has_kitchen: true,
    has_generator: true,
    generator_kva: '120 kVA Silent DG',
    has_sound_system: true,
    has_stage: true,
    stage_dimensions: '40 × 20 ft hardwood stage',
    green_rooms: 4,
    elevators: 2,
    rating: 5.0,
    reviews_count: 94,
    pricing: {
      morning: 85000,
      afternoon: 60000,
      evening: 95000,
      night: 75000,
      full_day: 210000
    },
    public_availability: true,
    privacy_settings: {
      show_availability: true,
      show_phone: true,
      show_whatsapp: true,
      show_email: true
    },
    status: 'LIVE', // LIVE, PENDING_APPROVAL, DRAFT, SUSPENDED, REJECTED
    verification_badge: 'Verified Luxury Hall',
    cover_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    images: {
      main: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      dining: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      courtyard: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
      suite: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      exterior: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    facilities: [
      'Central AC (VRF)', 'Separate 450-seat AC Dining', 'Industrial Stainless Kitchen',
      '250+ Car Parking & Valet', 'Elevated 40×20 ft Hardwood Stage', 'Line-Array Audio & 4K LED Screen',
      '4 Deluxe AC Green Suites', 'Dual Otis Passenger Elevators', '100% Silent DG Backup (120 kVA)',
      'Wheelchair Ramp Access', '24/7 CCTV & Security', 'Dedicated Pooja & Mandap Area', 'High-Speed Guest Wi-Fi'
    ],
    contact: {
      owner_name: 'Vikram Hegde',
      phone: '+91 82582 29988',
      whatsapp: '+91 82582 29988',
      email: 'reservations@monarchpalace.com',
      alternate_phone: '+91 82582 29989'
    },
    created_at: '2024-11-15'
  },
  {
    id: 'hall-grand-royal-imperial',
    owner_id: 'owner-1',
    name: 'Grand Royal Imperial Palace',
    slug: 'grand-royal-imperial-palace-karkala',
    description: 'Double-height illuminated ballroom with Austrian crystal chandeliers, floral wedding stage, Italian marble flooring, and formal round-table guest settings bathed in warm ambient amber glow.',
    hall_type: 'Wedding Hall & Ballroom',
    area: 'Market Road, Near Venkataramana Temple',
    city: 'Karkala',
    state: 'Karnataka',
    pincode: '574104',
    address: 'Near Old Bus Stand, Market Road, Karkala 574104',
    latitude: 13.2140,
    longitude: 74.9920,
    distance_km: 3.2,
    size_sqft: 11000,
    length_ft: 120,
    width_ft: 90,
    ceiling_height_ft: 22,
    seating_capacity: 850,
    maximum_capacity: 1500,
    ac_status: 'Central AC',
    indoor_outdoor: 'Indoor Auditorium',
    parking_cars: 200,
    dining_seats: 400,
    has_valet: true,
    has_kitchen: true,
    has_generator: true,
    generator_kva: '100 kVA',
    has_sound_system: true,
    has_stage: true,
    stage_dimensions: '36 × 18 ft',
    green_rooms: 3,
    elevators: 2,
    rating: 4.9,
    reviews_count: 78,
    pricing: {
      morning: 75000,
      afternoon: 50000,
      evening: 85000,
      night: 70000,
      full_day: 180000
    },
    public_availability: true,
    privacy_settings: {
      show_availability: true,
      show_phone: true,
      show_whatsapp: true,
      show_email: true
    },
    status: 'LIVE',
    verification_badge: 'Verified Luxury Hall',
    cover_image: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
    images: {
      main: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
      dining: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
    },
    facilities: ['Central AC', '400-seat Dining Hall', 'Valet Parking (200 cars)', 'Pro Acoustics', 'Green Suites', 'Backup Power'],
    contact: {
      owner_name: 'Rajesh Shenoy',
      phone: '+91 94481 44556',
      whatsapp: '+91 94481 44556',
      email: 'info@grandroyalkarkala.com'
    },
    created_at: '2024-10-12'
  },
  {
    id: 'hall-heritage-crystal-lawn',
    owner_id: 'owner-1',
    name: 'Heritage Crystal Banquet & Lawn',
    slug: 'heritage-crystal-lawn-mangalore',
    description: 'A serene open-air garden lawn and air-conditioned banquet hall reception layout in coastal Mangalore with festoon canopy lighting, manicured green lawns, wooden pergola mandap, and illuminated fountains.',
    hall_type: 'Reception Hall & Open Lawn',
    area: 'Kuntalpady / Airport Road',
    city: 'Mangalore',
    state: 'Karnataka',
    pincode: '575015',
    address: 'Near Kenjar Junction, Airport Road, Mangalore 575015',
    latitude: 12.9610,
    longitude: 74.8820,
    distance_km: 4.8,
    size_sqft: 18000,
    length_ft: 160,
    width_ft: 110,
    ceiling_height_ft: 20,
    seating_capacity: 600,
    maximum_capacity: 1200,
    ac_status: 'Hall AC + Open Lawn',
    indoor_outdoor: 'Both Indoor & Outdoor',
    parking_cars: 180,
    dining_seats: 350,
    has_valet: true,
    has_kitchen: true,
    has_generator: true,
    generator_kva: '80 kVA',
    has_sound_system: true,
    has_stage: true,
    stage_dimensions: '30 × 16 ft pergola stage',
    green_rooms: 2,
    elevators: 1,
    rating: 4.8,
    reviews_count: 52,
    pricing: {
      morning: 55000,
      afternoon: 40000,
      evening: 75000,
      night: 65000,
      full_day: 150000
    },
    public_availability: true,
    privacy_settings: {
      show_availability: true,
      show_phone: true,
      show_whatsapp: true,
      show_email: true
    },
    status: 'LIVE',
    verification_badge: 'Verified Luxury Hall',
    cover_image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    images: {
      main: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80'
    },
    facilities: ['Lawn Lighting', 'Indoor AC Hall', 'Catering Area', '180 Parking Slots', 'Lawn Stage', 'Audio Backup'],
    contact: {
      owner_name: 'Dinesh Shetty',
      phone: '+91 98440 88211',
      whatsapp: '+91 98440 88211',
      email: 'events@heritagecrystal.com'
    },
    created_at: '2024-09-20'
  },
  {
    id: 'hall-sapphire-convention',
    owner_id: 'owner-1',
    name: 'Sapphire Convention Center & AV Suite',
    slug: 'sapphire-convention-center-manipal',
    description: 'Modern flagship auditorium and multi-tier convention arena with architectural wood slat acoustic paneling, cinematic 4K LED video wall, tiered theater seating, and commercial expo pavilion.',
    hall_type: 'Convention Center & Auditorium',
    area: 'Tiger Circle / End Point Road',
    city: 'Manipal',
    state: 'Karnataka',
    pincode: '576104',
    address: 'End Point Road, Near Technology Campus, Manipal 576104',
    latitude: 13.3525,
    longitude: 74.7865,
    distance_km: 8.1,
    size_sqft: 24000,
    length_ft: 200,
    width_ft: 120,
    ceiling_height_ft: 30,
    seating_capacity: 1200,
    maximum_capacity: 2500,
    ac_status: 'Climate Zoned Central AC',
    indoor_outdoor: 'Indoor Auditorium & Expo Hall',
    parking_cars: 500,
    dining_seats: 700,
    has_valet: true,
    has_kitchen: true,
    has_generator: true,
    generator_kva: '200 kVA Dual DG',
    has_sound_system: true,
    has_stage: true,
    stage_dimensions: '50 × 25 ft motorized theatrical stage',
    green_rooms: 6,
    elevators: 4,
    rating: 4.95,
    reviews_count: 110,
    pricing: {
      morning: 110000,
      afternoon: 80000,
      evening: 140000,
      night: 100000,
      full_day: 280000
    },
    public_availability: true,
    privacy_settings: {
      show_availability: true,
      show_phone: true,
      show_whatsapp: true,
      show_email: true
    },
    status: 'LIVE',
    verification_badge: 'Verified Convention Center',
    cover_image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    images: {
      main: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80'
    },
    facilities: ['LED Video Wall', 'Zone Climate AC', '500 Car Parking', '6 Green Suites', 'Broadcast Ready AV', 'Industrial Kitchen'],
    contact: {
      owner_name: 'Dr. Sudhir Rao',
      phone: '+91 82025 70011',
      whatsapp: '+91 82025 70011',
      email: 'booking@sapphiremanipal.com'
    },
    created_at: '2024-08-05'
  },
  {
    id: 'hall-golden-palm-community',
    owner_id: 'owner-1',
    name: 'Golden Palm Traditional Community Hall',
    slug: 'golden-palm-community-hall-karkala',
    description: 'Traditional South Indian architecture with carved wooden pillars, spacious natural ventilation dining pavilion, temple-style sanctum backdrop, ceiling fan arrays, and serene lakeside surroundings.',
    hall_type: 'Community Hall & Cultural Space',
    area: 'Anekere Lake Promenade',
    city: 'Karkala',
    state: 'Karnataka',
    pincode: '574104',
    address: 'Near Anekere Jain Basadi, Lake Promenade, Karkala 574104',
    latitude: 13.2080,
    longitude: 74.9890,
    distance_km: 1.1,
    size_sqft: 8500,
    length_ft: 100,
    width_ft: 85,
    ceiling_height_ft: 18,
    seating_capacity: 450,
    maximum_capacity: 800,
    ac_status: 'Non-AC (Natural Lake Breeze)',
    indoor_outdoor: 'Covered Pavilion',
    parking_cars: 80,
    dining_seats: 300,
    has_valet: false,
    has_kitchen: true,
    has_generator: true,
    generator_kva: '40 kVA',
    has_sound_system: true,
    has_stage: true,
    stage_dimensions: '25 × 15 ft teak stage',
    green_rooms: 2,
    elevators: 0,
    rating: 4.7,
    reviews_count: 36,
    pricing: {
      morning: 32000,
      afternoon: 22000,
      evening: 38000,
      night: 28000,
      full_day: 75000
    },
    public_availability: false,
    privacy_settings: {
      show_availability: false,
      show_phone: true,
      show_whatsapp: true,
      show_email: true
    },
    status: 'LIVE',
    verification_badge: 'Heritage Verified',
    cover_image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
    images: {
      main: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80'
    },
    facilities: ['Lakeside Breeze', 'Traditional Teak Stage', 'Dining Hall (300)', 'Kitchen with Steam Boiler', 'Generator Backup'],
    contact: {
      owner_name: 'Ananth Pai',
      phone: '+91 82582 24500',
      whatsapp: '+91 82582 24500',
      email: 'goldenpalm.karkala@gmail.com'
    },
    created_at: '2024-07-18'
  },
  {
    id: 'hall-ocean-pearl-beachfront',
    owner_id: 'owner-1',
    name: 'Ocean Pearl Seaside Resort & Lawn',
    slug: 'ocean-pearl-beachfront-mangalore',
    description: 'Dramatic open-air seaside event lawn along Panambur beach at twilight with illuminated fairy lights canopy, palm trees, grand waterfront stage, and private beach wedding cabanas.',
    hall_type: 'Party Hall & Beachfront Lawn',
    area: 'Panambur Beach Road',
    city: 'Mangalore',
    state: 'Karnataka',
    pincode: '575010',
    address: 'Panambur Coastal Way, Mangalore 575010',
    latitude: 12.9460,
    longitude: 74.8050,
    distance_km: 6.5,
    size_sqft: 22000,
    length_ft: 180,
    width_ft: 120,
    ceiling_height_ft: 0,
    seating_capacity: 700,
    maximum_capacity: 1600,
    ac_status: 'Beach Breeze + AC Lounge',
    indoor_outdoor: 'Outdoor Seaside Lawn',
    parking_cars: 220,
    dining_seats: 400,
    has_valet: true,
    has_kitchen: true,
    has_generator: true,
    generator_kva: '100 kVA',
    has_sound_system: true,
    has_stage: true,
    stage_dimensions: '40 × 20 ft ocean stage',
    green_rooms: 3,
    elevators: 0,
    rating: 4.88,
    reviews_count: 64,
    pricing: {
      morning: 70000,
      afternoon: 55000,
      evening: 125000,
      night: 110000,
      full_day: 240000
    },
    public_availability: true,
    privacy_settings: {
      show_availability: true,
      show_phone: true,
      show_whatsapp: true,
      show_email: true
    },
    status: 'LIVE',
    verification_badge: 'Seaside Premier',
    cover_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    images: {
      main: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    },
    facilities: ['Beach Access', 'Fairy Light Canopy', 'Cabana Lounges', 'Waterfront Stage', '220 Car Parking', 'Bar & Dining Setup'],
    contact: {
      owner_name: 'Gautam Alva',
      phone: '+91 99001 77334',
      whatsapp: '+91 99001 77334',
      email: 'alva@oceanpearlresort.com'
    },
    created_at: '2024-06-14'
  },
  {
    id: 'hall-crystal-atrium-pending',
    owner_id: 'owner-1',
    name: 'Crystal Atrium Ballroom & Lawns',
    slug: 'crystal-atrium-ballroom-udupi',
    description: 'New luxury glass conservatory venue with soaring 28-ft skylight ceiling, ambient motorized blackout drapes, and water cascade garden perimeter. Submitted for platform certification.',
    hall_type: 'Reception Hall & Conservatory',
    area: 'Santhekatte / NH66 Corridor',
    city: 'Udupi',
    state: 'Karnataka',
    pincode: '576105',
    address: 'Near Robosoft Junction, Santhekatte, Udupi 576105',
    latitude: 13.3760,
    longitude: 74.7520,
    distance_km: 12.0,
    size_sqft: 15500,
    length_ft: 150,
    width_ft: 100,
    ceiling_height_ft: 28,
    seating_capacity: 750,
    maximum_capacity: 1400,
    ac_status: 'Central HVAC',
    indoor_outdoor: 'Glass Atrium & Lawn',
    parking_cars: 240,
    dining_seats: 400,
    has_valet: true,
    has_kitchen: true,
    has_generator: true,
    generator_kva: '125 kVA',
    has_sound_system: true,
    has_stage: true,
    stage_dimensions: '36 × 20 ft marble stage',
    green_rooms: 4,
    elevators: 2,
    rating: 0,
    reviews_count: 0,
    pricing: {
      morning: 90000,
      afternoon: 65000,
      evening: 115000,
      night: 85000,
      full_day: 230000
    },
    public_availability: true,
    privacy_settings: {
      show_availability: true,
      show_phone: true,
      show_whatsapp: true,
      show_email: true
    },
    status: 'PENDING_APPROVAL',
    verification_badge: 'Pending Verification',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    images: {
      main: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
    },
    facilities: ['Glass Conservatory Skylights', '240 Valet Slots', 'Central HVAC', '4 Luxury Green Suites', 'Water Cascade Garden', 'Dual 125 kVA Genset'],
    contact: {
      owner_name: 'Vikram Hegde',
      phone: '+91 82582 29988',
      whatsapp: '+91 82582 29988',
      email: 'crystal.atrium@monarchpalace.com'
    },
    created_at: '2025-02-14'
  }
];

// Initial Bookings
const INITIAL_BOOKINGS = [
  {
    id: 'BK-78901',
    hall_id: 'hall-grand-monarch',
    hall_name: 'The Grand Monarch Palace',
    customer_id: 'cust-1',
    customer_name: 'Ayush Poojary',
    customer_phone: '+91 98450 12345',
    customer_email: 'ayush@example.com',
    event_type: 'Wedding & Reception',
    date: '2025-11-20',
    slot: 'Evening (4PM - 11PM)',
    guests: 650,
    notes: 'Bride & groom family arrivals at 3 PM. Require stage floral mandap access by 11 AM.',
    amount: 95000,
    status: 'ACCEPTED', // PENDING, ACCEPTED, CONFIRMED, REJECTED, CANCELLED, COMPLETED
    created_at: '2025-02-10'
  },
  {
    id: 'BK-78902',
    hall_id: 'hall-grand-monarch',
    hall_name: 'The Grand Monarch Palace',
    customer_id: 'cust-2',
    customer_name: 'Dr. Meera Alva',
    customer_phone: '+91 88841 90022',
    customer_email: 'meera.alva@gmail.com',
    event_type: 'Silver Jubilee Gala',
    date: '2025-12-02',
    slot: 'Night (7PM - 1AM)',
    guests: 600,
    notes: 'Require VIP dining hall arrangement and banquet buffet setup.',
    amount: 75000,
    status: 'CONFIRMED',
    created_at: '2025-01-28'
  },
  {
    id: 'BK-78903',
    hall_id: 'hall-grand-royal-imperial',
    hall_name: 'Grand Royal Imperial Palace',
    customer_id: 'cust-3',
    customer_name: 'Kavitha & Rohan Kamath',
    customer_phone: '+91 98860 44332',
    customer_email: 'rohan.kamath@outlook.com',
    event_type: 'Grand Wedding Muhurtham',
    date: '2025-11-28',
    slot: 'Morning (7AM - 2PM)',
    guests: 800,
    notes: 'Traditional South Canara vegetarian breakfast and lunch dining service.',
    amount: 75000,
    status: 'PENDING',
    created_at: '2025-02-15'
  }
];

// Initial Reviews
const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    hall_id: 'hall-grand-monarch',
    customer_name: 'Anirudh & Deepa Rao',
    rating: 5,
    date: 'January 2025',
    verified: true,
    text: 'We celebrated our daughter’s wedding at The Grand Monarch Palace. The uninterrupted 24-ft ceiling clearance and silent air conditioning were exceptional. All 1,200 attendees moved smoothly between the main auditorium and the AC dining hall.'
  },
  {
    id: 'rev-2',
    hall_id: 'hall-grand-monarch',
    customer_name: 'Suresh Bhat',
    rating: 5,
    date: 'December 2024',
    verified: true,
    text: 'Top notch acoustics and massive valet parking. The owner Vikram was proactive and helped coordinate the backup generator seamlessly. Highly recommended!'
  },
  {
    id: 'rev-3',
    hall_id: 'hall-grand-royal-imperial',
    customer_name: 'Pooja Nayak',
    rating: 5,
    date: 'November 2024',
    verified: true,
    text: 'Grand chandeliers and magnificent stage backdrop. Photos turned out extraordinary in the warm amber lighting.'
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    admin_name: 'Super Admin Authority',
    action: 'Approved Venue',
    affected_record: 'The Grand Monarch Palace',
    date: '2024-11-16 10:30 AM',
    details: 'Fire safety certificate verified. Status updated to LIVE.'
  },
  {
    id: 'log-2',
    admin_name: 'Super Admin Authority',
    action: 'Approved Venue',
    affected_record: 'Grand Royal Imperial Palace',
    date: '2024-10-14 03:15 PM',
    details: 'Compliance documentation certified.'
  },
  {
    id: 'log-3',
    admin_name: 'Super Admin Authority',
    action: 'New Listing Submitted',
    affected_record: 'Crystal Atrium Ballroom & Lawns',
    date: '2025-02-14 09:00 AM',
    details: 'Owner Vikram Hegde submitted new hall for review. Pending inspection.'
  }
];

const INITIAL_REPORTS = [
  {
    id: 'rep-1',
    hall_id: 'hall-grand-royal-imperial',
    hall_name: 'Grand Royal Imperial Palace',
    reporter_name: 'Girish Kotian',
    reason: 'Incorrect Parking Capacity',
    details: 'Listed 200 cars, but during peak evening slots only about 160 fit before street parking is required.',
    date: '2025-02-05',
    status: 'PENDING'
  }
];

// Slot Availability Matrix Builder
// Generates shift status for dates
function getInitialSlotMatrix() {
  const dates = ['2025-11-17', '2025-11-18', '2025-11-19', '2025-11-20', '2025-11-21', '2025-11-22', '2025-11-23'];
  const slots = ['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'];
  const matrix = {};

  // default slot statuses
  dates.forEach(d => {
    matrix[d] = {
      'Morning': { status: 'available', price: 85000 },
      'Afternoon': { status: 'available', price: 60000 },
      'Evening': { status: 'available', price: 95000 },
      'Night': { status: 'available', price: 75000 },
      'Full Day': { status: 'available', price: 210000 }
    };
  });

  // some realistic overrides
  if (matrix['2025-11-17']) {
    matrix['2025-11-17']['Morning'].status = 'booked';
    matrix['2025-11-17']['Afternoon'].status = 'booked';
    matrix['2025-11-17']['Full Day'].status = 'blocked';
  }
  if (matrix['2025-11-19']) {
    matrix['2025-11-19']['Morning'].status = 'booked';
    matrix['2025-11-19']['Afternoon'].status = 'booked';
    matrix['2025-11-19']['Evening'].status = 'booked';
    matrix['2025-11-19']['Night'].status = 'booked';
    matrix['2025-11-19']['Full Day'].status = 'booked';
  }
  if (matrix['2025-11-20']) {
    matrix['2025-11-20']['Evening'].status = 'pending';
  }
  if (matrix['2025-11-22']) {
    matrix['2025-11-22']['Morning'].status = 'booked';
    matrix['2025-11-22']['Afternoon'].status = 'booked';
    matrix['2025-11-22']['Evening'].status = 'booked';
    matrix['2025-11-22']['Night'].status = 'booked';
    matrix['2025-11-22']['Full Day'].status = 'booked';
  }

  return matrix;
}

class Store {
  constructor() {
    this.init();
  }

  init() {
    const cachedHalls = localStorage.getItem(STORAGE_KEYS.HALLS);
    if (!cachedHalls) {
      this.resetToDefaults();
    } else {
      // Automatic data upgrade: replace obsolete or broken lh3 URLs with verified high-res imagery
      if (cachedHalls.includes('lh3.googleusercontent.com')) {
        try {
          const halls = JSON.parse(cachedHalls);
          const upgraded = halls.map(h => {
            const match = INITIAL_HALLS.find(ih => ih.id === h.id);
            if (match) {
              return {
                ...h,
                cover_image: match.cover_image,
                images: match.images
              };
            }
            return h;
          });
          localStorage.setItem(STORAGE_KEYS.HALLS, JSON.stringify(upgraded));
        } catch (e) {
          this.resetToDefaults();
        }
      }
    }
  }

  getPlaceholderImage(title = 'VenueLuxe Palace') {
    const cleanTitle = String(title).replace(/[<>&"]/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <defs>
        <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1F2937"/>
          <stop offset="50%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#0B0F17"/>
        </linearGradient>
        <linearGradient id="accentG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C2783E"/>
          <stop offset="100%" stop-color="#A65B2B"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bgG)"/>
      <circle cx="400" cy="200" r="70" fill="none" stroke="url(#accentG)" stroke-width="2" opacity="0.6"/>
      <path d="M370 230 L400 160 L430 230 Z M385 230 L400 195 L415 230 Z" fill="none" stroke="url(#accentG)" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M360 240 L440 240" stroke="url(#accentG)" stroke-width="2"/>
      <text x="400" y="315" font-family="'Playfair Display', serif" font-size="22" font-weight="600" fill="#FAF8F5" text-anchor="middle" letter-spacing="1">${cleanTitle}</text>
      <text x="400" y="345" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#A65B2B" text-anchor="middle" letter-spacing="2">VENUELUXE PREMIER ESTATE</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, 'customer');
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.HALLS, JSON.stringify(INITIAL_HALLS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['hall-grand-monarch', 'hall-sapphire-convention']));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([
      { id: 'notif-1', title: 'Booking Accepted', message: 'Your booking request for The Grand Monarch Palace has been accepted by Vikram Hegde.', date: 'Just now', unread: true, link: '#/customer' },
      { id: 'notif-2', title: 'Special Festive Dates', message: 'November wedding slots are now open for direct holding.', date: '1 day ago', unread: false, link: '#/search' }
    ]));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    localStorage.setItem('venueluxe_slot_matrix', JSON.stringify(getInitialSlotMatrix()));
  }

  // --- Role & Auth State ---
  getCurrentRole() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) || 'customer';
  }

  setCurrentRole(role) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    const users = this.getUsers();
    let targetUser = users.find(u => u.role === role) || users[0];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(targetUser));
    window.dispatchEvent(new CustomEvent('roleChanged', { detail: { role, user: targetUser } }));
  }

  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : INITIAL_USERS[0];
  }

  getUsers() {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  }

  // --- Halls State ---
  getHalls() {
    const raw = localStorage.getItem(STORAGE_KEYS.HALLS);
    return raw ? JSON.parse(raw) : INITIAL_HALLS;
  }

  // Only approved + live halls for public customer view (Requirement #25)
  getPublicHalls() {
    return this.getHalls().filter(h => h.status === 'LIVE');
  }

  getHallById(id) {
    return this.getHalls().find(h => h.id === id || h.slug === id);
  }

  saveHalls(halls) {
    localStorage.setItem(STORAGE_KEYS.HALLS, JSON.stringify(halls));
    window.dispatchEvent(new CustomEvent('hallsUpdated', { detail: halls }));
  }

  addHall(hallData) {
    const halls = this.getHalls();
    const newHall = {
      ...hallData,
      id: 'hall-' + Date.now(),
      slug: (hallData.name || 'venue').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
      status: 'PENDING_APPROVAL', // Requirement #13: When hall owner adds a hall, it MUST be PENDING APPROVAL!
      rating: 0,
      reviews_count: 0,
      created_at: new Date().toISOString().split('T')[0]
    };
    halls.unshift(newHall);
    this.saveHalls(halls);

    // Add Audit Log
    this.addAuditLog('New Listing Submitted', newHall.name, `Submitted by owner ${newHall.contact?.owner_name || 'Host'} for verification.`);

    // Add in-app notification for admin
    this.addNotification('New Venue Submission', `"${newHall.name}" was submitted for verification and requires approval.`, '#/admin');

    return newHall;
  }

  updateHall(id, updatedData) {
    const halls = this.getHalls();
    const index = halls.findIndex(h => h.id === id);
    if (index !== -1) {
      halls[index] = { ...halls[index], ...updatedData, updated_at: new Date().toISOString() };
      this.saveHalls(halls);
      this.addAuditLog('Venue Updated', halls[index].name, 'Hall parameters and details updated.');
      return halls[index];
    }
    return null;
  }

  deleteHall(id) {
    let halls = this.getHalls();
    const target = halls.find(h => h.id === id);
    halls = halls.filter(h => h.id !== id);
    this.saveHalls(halls);
    if (target) {
      this.addAuditLog('Venue Deleted', target.name, 'Hall permanently deleted by administrator.');
    }
  }

  // --- Admin Approval Workflow (Requirement #13 & #15) ---
  approveHall(id) {
    const hall = this.getHallById(id);
    if (hall) {
      this.updateHall(id, {
        status: 'LIVE',
        verification_badge: 'Verified Luxury Hall'
      });
      this.addAuditLog('Hall Approved', hall.name, 'Super Admin approved hall. Status changed from PENDING to LIVE.');
      this.addNotification('Hall Approved & Live!', `Your hall "${hall.name}" has been approved and is now publicly visible for bookings.`, '#/owner');
    }
  }

  rejectHall(id, reason = 'Compliance criteria not met.') {
    const hall = this.getHallById(id);
    if (hall) {
      this.updateHall(id, { status: 'REJECTED' });
      this.addAuditLog('Hall Rejected', hall.name, `Reason: ${reason}`);
      this.addNotification('Listing Status Update', `Your hall "${hall.name}" was not approved: ${reason}`, '#/owner');
    }
  }

  suspendHall(id, reason = 'Administrative review.') {
    const hall = this.getHallById(id);
    if (hall) {
      this.updateHall(id, { status: 'SUSPENDED' });
      this.addAuditLog('Hall Suspended', hall.name, `Suspended by Super Admin. Reason: ${reason}`);
    }
  }

  restoreHall(id) {
    const hall = this.getHallById(id);
    if (hall) {
      this.updateHall(id, { status: 'LIVE' });
      this.addAuditLog('Hall Restored', hall.name, 'Super Admin restored hall to LIVE status.');
    }
  }

  // --- Bookings State ---
  getBookings() {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return raw ? JSON.parse(raw) : INITIAL_BOOKINGS;
  }

  saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent('bookingsUpdated', { detail: bookings }));
  }

  createBooking(bookingData) {
    const bookings = this.getBookings();
    const newBooking = {
      ...bookingData,
      id: 'BK-' + Math.floor(10000 + Math.random() * 90000),
      status: 'PENDING', // Requirement #10: Do NOT automatically confirm unless approved!
      created_at: new Date().toISOString().split('T')[0]
    };
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    // Update slot matrix to pending/booked
    if (bookingData.date && bookingData.slot) {
      this.updateSlotStatus(bookingData.date, bookingData.slot, 'pending');
    }

    // Add Notification to Hall Owner
    this.addNotification('New Booking Request Received', `New booking request for "${bookingData.hall_name}" on ${bookingData.date} (${bookingData.slot}).`, '#/owner');

    return newBooking;
  }

  updateBookingStatus(id, newStatus) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      const b = bookings[index];
      b.status = newStatus;
      this.saveBookings(bookings);

      // If Confirmed, lock the slot in calendar! (Requirement #33)
      if (newStatus === 'CONFIRMED' && b.date && b.slot) {
        this.updateSlotStatus(b.date, b.slot, 'booked');
      }

      this.addNotification(
        `Booking ${newStatus}`,
        `Your reservation for "${b.hall_name}" is now marked as ${newStatus}.`,
        '#/customer'
      );
      this.addAuditLog('Booking Status Changed', `${b.id} (${b.hall_name})`, `Status changed to ${newStatus}`);
      return b;
    }
    return null;
  }

  // --- 5-Slot Availability Matrix ---
  getSlotMatrix() {
    const raw = localStorage.getItem('venueluxe_slot_matrix');
    return raw ? JSON.parse(raw) : getInitialSlotMatrix();
  }

  updateSlotStatus(date, slotName, newStatus) {
    const matrix = this.getSlotMatrix();
    if (!matrix[date]) {
      matrix[date] = {
        'Morning': { status: 'available', price: 85000 },
        'Afternoon': { status: 'available', price: 60000 },
        'Evening': { status: 'available', price: 95000 },
        'Night': { status: 'available', price: 75000 },
        'Full Day': { status: 'available', price: 210000 }
      };
    }
    // normalize slotName if needed (e.g., 'Morning (7AM - 2PM)' -> 'Morning')
    const key = Object.keys(matrix[date]).find(k => slotName.toLowerCase().startsWith(k.toLowerCase())) || 'Evening';
    if (matrix[date][key]) {
      matrix[date][key].status = newStatus;
    }
    localStorage.setItem('venueluxe_slot_matrix', JSON.stringify(matrix));
    window.dispatchEvent(new CustomEvent('slotMatrixUpdated', { detail: matrix }));
  }

  // --- Reviews State ---
  getReviews() {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return raw ? JSON.parse(raw) : INITIAL_REVIEWS;
  }

  getReviewsByHallId(hallId) {
    return this.getReviews().filter(r => r.hall_id === hallId);
  }

  addReview(reviewData) {
    const reviews = this.getReviews();
    const newReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      verified: true
    };
    reviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    // Update hall rating
    const hall = this.getHallById(reviewData.hall_id);
    if (hall) {
      const hallReviews = reviews.filter(r => r.hall_id === reviewData.hall_id);
      const avg = hallReviews.reduce((acc, cur) => acc + cur.rating, 0) / hallReviews.length;
      this.updateHall(hall.id, {
        rating: Math.round(avg * 10) / 10,
        reviews_count: hallReviews.length
      });
    }

    this.addNotification('New Review Received', `A new ${reviewData.rating}-star review was posted for your hall.`, '#/owner');
    return newReview;
  }

  // --- Favorites State ---
  getFavorites() {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  }

  isFavorite(hallId) {
    return this.getFavorites().includes(hallId);
  }

  toggleFavorite(hallId) {
    let favs = this.getFavorites();
    if (favs.includes(hallId)) {
      favs = favs.filter(id => id !== hallId);
    } else {
      favs.push(hallId);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favs }));
    return favs.includes(hallId);
  }

  // --- Notifications State ---
  getNotifications() {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return raw ? JSON.parse(raw) : [];
  }

  addNotification(title, message, link = '#') {
    const notifs = this.getNotifications();
    notifs.unshift({
      id: 'notif-' + Date.now(),
      title,
      message,
      date: 'Just now',
      unread: true,
      link
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: notifs }));
  }

  markNotificationsRead() {
    const notifs = this.getNotifications().map(n => ({ ...n, unread: false }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: notifs }));
  }

  // --- Admin Audit Log ---
  getAuditLogs() {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
  }

  addAuditLog(action, affectedRecord, details = '') {
    const logs = this.getAuditLogs();
    const now = new Date();
    const timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    logs.unshift({
      id: 'log-' + Date.now(),
      admin_name: 'Super Admin Authority',
      action,
      affected_record: affectedRecord,
      date: timeStr,
      details
    });
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }

  // --- Reports State ---
  getReports() {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : INITIAL_REPORTS;
  }

  addReport(reportData) {
    const reports = this.getReports();
    const newReport = {
      ...reportData,
      id: 'rep-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    this.addAuditLog('Report Filed', reportData.hall_name, `Reason: ${reportData.reason}`);
    this.addNotification('New Listing Flagged', `A user reported "${reportData.hall_name}": ${reportData.reason}`, '#/admin');
    return newReport;
  }

  resolveReport(id, actionTaken = 'Reviewed') {
    const reports = this.getReports();
    const rep = reports.find(r => r.id === id);
    if (rep) {
      rep.status = 'RESOLVED';
      rep.resolution = actionTaken;
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      this.addAuditLog('Report Resolved', rep.hall_name, actionTaken);
    }
  }
}

// Global store instance
window.appStore = new Store();
