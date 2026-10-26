import { Provider, Dish, MenuPackage, Review, SpecialCombo } from './types';

const img = (seed: string, w = 900, h = 560) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

let dishId = 0;
const d = (name: string, category: string, price: number, veg: boolean, popular = false, image?: string): Dish => {
  dishId += 1;
  return {
    id: `dish-${dishId}`,
    name,
    category,
    price,
    veg,
    popular,
    image: image || img(`dish-${name.toLowerCase().replace(/\s+/g, '-')}`, 400, 300),
  };
};

let reviewId = 0;
const r = (
  customerName: string,
  avatarColor: string,
  rating: number,
  date: string,
  eventType: string,
  comment: string,
  breakdown?: Review['breakdown']
): Review => {
  reviewId += 1;
  return { id: `rev-${reviewId}`, customerName, avatarColor, rating, date, eventType, comment, breakdown };
};

const avatarColors = ['#5B2C6F', '#0C6E67', '#C9971F', '#3763E0', '#DC3958', '#3049A6'];

// ---------------------------------------------------------------------------
// CATERING PROVIDERS
// ---------------------------------------------------------------------------

const sriAnnapoornaMenu = [
  {
    name: 'Rice & Curries',
    dishes: [
      d('Steamed Rice', 'Rice & Curries', 0, true),
      d('Sambar', 'Rice & Curries', 0, true, true),
      d('Rasam', 'Rice & Curries', 0, true),
      d('Vegetable Kurma', 'Rice & Curries', 60, true, true),
      d('Poriyal (Mixed Veg)', 'Rice & Curries', 40, true),
    ],
  },
  {
    name: 'Biriyani',
    dishes: [
      d('Vegetable Biriyani', 'Biriyani', 120, true, true),
      d('Chicken Biriyani', 'Biriyani', 180, false, true),
      d('Mutton Biriyani', 'Biriyani', 260, false),
    ],
  },
  {
    name: 'Non-Vegetarian',
    dishes: [
      d('Chicken 65', 'Non-Vegetarian', 150, false, true),
      d('Fish Fry', 'Non-Vegetarian', 170, false),
      d('Mutton Chukka', 'Non-Vegetarian', 220, false),
    ],
  },
  {
    name: 'Sweets & Desserts',
    dishes: [
      d('Payasam', 'Sweets & Desserts', 50, true, true),
      d('Gulab Jamun', 'Sweets & Desserts', 45, true),
      d('Rava Kesari', 'Sweets & Desserts', 35, true),
    ],
  },
  {
    name: 'Drinks',
    dishes: [
      d('Buttermilk', 'Drinks', 20, true, true),
      d('Filter Coffee', 'Drinks', 25, true),
    ],
  },
];

const sriAnnapoornaPackages: MenuPackage[] = [
  {
    id: 'pkg-annapoorna-classic',
    name: 'Classic Wedding Package',
    pricePerPerson: 320,
    minGuests: 150,
    includes: ['Rice + 3 curries', 'Biriyani (veg or chicken)', '2 sweets', 'Buttermilk', 'Live counter (1)'],
    veg: false,
  },
  {
    id: 'pkg-annapoorna-premium',
    name: 'Premium Function Package',
    pricePerPerson: 480,
    minGuests: 100,
    includes: ['Full course meal', 'Mutton biriyani', '3 starters', 'Dessert counter', 'Welcome drink'],
    veg: false,
  },
  {
    id: 'pkg-annapoorna-veg',
    name: 'Pure Veg Temple Function',
    pricePerPerson: 220,
    minGuests: 50,
    includes: ['Rice + 4 curries', 'Vegetable biriyani', 'Payasam', 'Buttermilk'],
    veg: true,
  },
];

const provider1: Provider = {
  id: 'prov-sri-annapoorna',
  name: 'Sri Annapoorna Caterers',
  category: 'catering',
  tagline: 'Traditional Tamil catering for weddings & functions',
  coverImage: img('annapoorna-cover'),
  logoColor: '#5B2C6F',
  district: 'Salem',
  areas: ['Fairlands', 'Hasthampatti', 'Suramangalam', 'Junction'],
  distanceKm: 3.2,
  rating: 4.7,
  reviewCount: 312,
  startingPrice: 220,
  pricingModel: 'per_person',
  minCapacity: 50,
  maxCapacity: 1500,
  availability: 'available',
  verified: true,
  veg: 'both',
  description:
    'Sri Annapoorna Caterers has been serving weddings, temple functions and corporate events across Salem district for over 18 years. Known for authentic Tamil flavours, generous portions and reliable on-time service for large gatherings.',
  menuCategories: sriAnnapoornaMenu,
  packages: sriAnnapoornaPackages,
  portfolio: [img('annapoorna-1'), img('annapoorna-2'), img('annapoorna-3'), img('annapoorna-4')],
  reviews: [
    r('Kavitha R.', avatarColors[0], 5, '2 weeks ago', 'Wedding', 'Excellent food quality for our 400-guest wedding. Sambar and biriyani were outstanding. Staff was punctual and well organised.', { quality: 5, communication: 5, value: 4, timeliness: 5 }),
    r('Muthuraj S.', avatarColors[1], 4, '1 month ago', 'House Function', 'Good taste, slightly delayed setup by 30 minutes but food quality made up for it.', { quality: 5, communication: 4, value: 4, timeliness: 3 }),
    r('Deepa V.', avatarColors[2], 5, '2 months ago', 'Temple Function', 'Very affordable for the pure-veg package. Would book again for our next family function.', { quality: 5, communication: 5, value: 5, timeliness: 5 }),
  ],
  responseTime: 'Usually responds within 2 hours',
  yearsActive: 18,
  contactNumber: '9843210001',
};

const meenakshiMenu = [
  {
    name: 'Rice & Curries',
    dishes: [
      d('Steamed Rice', 'Rice & Curries', 0, true),
      d('Sambar', 'Rice & Curries', 0, true),
      d('Rasam', 'Rice & Curries', 0, true, true),
      d('Kootu', 'Rice & Curries', 45, true),
    ],
  },
  {
    name: 'Biriyani',
    dishes: [
      d('Seeraga Samba Biriyani (Veg)', 'Biriyani', 140, true, true),
      d('Chicken Dum Biriyani', 'Biriyani', 190, false, true),
    ],
  },
  {
    name: 'Non-Vegetarian',
    dishes: [
      d('Pepper Chicken', 'Non-Vegetarian', 160, false),
      d('Prawn Roast', 'Non-Vegetarian', 210, false, true),
    ],
  },
  {
    name: 'Sweets & Desserts',
    dishes: [
      d('Semiya Payasam', 'Sweets & Desserts', 40, true, true),
      d('Jangiri', 'Sweets & Desserts', 45, true),
    ],
  },
  {
    name: 'Drinks',
    dishes: [d('Rose Milk', 'Drinks', 30, true, true), d('Panagam', 'Drinks', 20, true)],
  },
];

const provider2: Provider = {
  id: 'prov-meenakshi-catering',
  name: 'Meenakshi Catering Services',
  category: 'catering',
  tagline: 'Premium multi-cuisine catering with live counters',
  coverImage: img('meenakshi-cover'),
  logoColor: '#0C6E67',
  district: 'Salem',
  areas: ['Ammapet', 'Shevapet', 'Alagapuram'],
  distanceKm: 6.8,
  rating: 4.5,
  reviewCount: 198,
  startingPrice: 280,
  pricingModel: 'per_person',
  minCapacity: 100,
  maxCapacity: 2000,
  availability: 'partial',
  verified: true,
  veg: 'both',
  description:
    'Meenakshi Catering Services specialises in large-scale weddings and corporate events with live cooking counters, multi-cuisine menus and dedicated event coordinators for functions above 500 guests.',
  menuCategories: meenakshiMenu,
  packages: [
    {
      id: 'pkg-meenakshi-royal',
      name: 'Royal Wedding Spread',
      pricePerPerson: 550,
      minGuests: 300,
      includes: ['5 live counters', 'Multi-cuisine buffet', 'Dessert bar', 'Dedicated coordinator'],
      veg: false,
    },
    {
      id: 'pkg-meenakshi-corporate',
      name: 'Corporate Lunch Package',
      pricePerPerson: 260,
      minGuests: 50,
      includes: ['Box meal or buffet', 'Veg + non-veg options', 'On-time delivery'],
      veg: false,
    },
  ],
  portfolio: [img('meenakshi-1'), img('meenakshi-2'), img('meenakshi-3')],
  reviews: [
    r('Arun Prakash', avatarColors[3], 4, '3 weeks ago', 'Corporate Event', 'Professional setup for our office annual day. Slightly pricier but worth it for 500+ guests.', { quality: 4, communication: 5, value: 3, timeliness: 5 }),
    r('Priya S.', avatarColors[4], 5, '1 month ago', 'Wedding', 'The live counters were a huge hit at our wedding. Highly recommend for big functions.', { quality: 5, communication: 4, value: 4, timeliness: 4 }),
  ],
  responseTime: 'Usually responds within 4 hours',
  yearsActive: 11,
  contactNumber: '9843210002',
};

const veluCateringMenu = [
  {
    name: 'Rice & Curries',
    dishes: [
      d('Steamed Rice', 'Rice & Curries', 0, true),
      d('Sambar', 'Rice & Curries', 0, true),
      d('Rasam', 'Rice & Curries', 0, true),
      d('Vegetable Curry', 'Rice & Curries', 35, true, true),
    ],
  },
  {
    name: 'Biriyani',
    dishes: [d('Vegetable Biriyani', 'Biriyani', 100, true, true), d('Chicken Biriyani', 'Biriyani', 160, false, true)],
  },
  {
    name: 'Sweets & Desserts',
    dishes: [d('Payasam', 'Sweets & Desserts', 30, true, true)],
  },
  {
    name: 'Drinks',
    dishes: [d('Buttermilk', 'Drinks', 15, true)],
  },
];

const provider3: Provider = {
  id: 'prov-velu-catering',
  name: 'Velu Catering & Events',
  category: 'catering',
  tagline: 'Budget-friendly catering for small & mid-size functions',
  coverImage: img('velu-cover'),
  logoColor: '#C9971F',
  district: 'Salem',
  areas: ['Kondalampatti', 'Five Roads'],
  distanceKm: 4.5,
  rating: 4.3,
  reviewCount: 87,
  startingPrice: 150,
  pricingModel: 'per_person',
  minCapacity: 30,
  maxCapacity: 400,
  availability: 'available',
  verified: false,
  veg: 'both',
  description:
    'Velu Catering & Events is a family-run caterer ideal for birthday functions, engagements and small gatherings, offering honest pricing with no compromise on taste.',
  menuCategories: veluCateringMenu,
  packages: [
    {
      id: 'pkg-velu-basic',
      name: 'Simple Function Package',
      pricePerPerson: 180,
      minGuests: 30,
      includes: ['Rice + 2 curries', 'Biriyani', 'Payasam'],
      veg: false,
    },
  ],
  portfolio: [img('velu-1'), img('velu-2')],
  reviews: [
    r('Ganesan K.', avatarColors[5], 4, '2 weeks ago', 'Birthday', 'Good value for money, food was tasty for our small get-together.', { quality: 4, communication: 4, value: 5, timeliness: 4 }),
  ],
  responseTime: 'Usually responds within 6 hours',
  yearsActive: 6,
  contactNumber: '9843210003',
};

const rajaBhavanMenu = [
  {
    name: 'Rice & Curries',
    dishes: [d('Steamed Rice', 'Rice & Curries', 0, true), d('Sambar', 'Rice & Curries', 0, true, true), d('Rasam', 'Rice & Curries', 0, true)],
  },
  {
    name: 'Biriyani',
    dishes: [d('Mushroom Biriyani', 'Biriyani', 130, true), d('Chicken Biriyani', 'Biriyani', 175, false, true), d('Mutton Biriyani', 'Biriyani', 250, false, true)],
  },
  {
    name: 'Non-Vegetarian',
    dishes: [d('Chicken 65', 'Non-Vegetarian', 140, false, true), d('Mutton Sukka', 'Non-Vegetarian', 230, false)],
  },
  {
    name: 'Sweets & Desserts',
    dishes: [d('Badam Halwa', 'Sweets & Desserts', 55, true, true), d('Ice Cream', 'Sweets & Desserts', 40, true)],
  },
];

const provider4: Provider = {
  id: 'prov-raja-bhavan',
  name: 'Raja Bhavan Caterers',
  category: 'catering',
  tagline: 'Full-service catering with décor add-ons',
  coverImage: img('raja-cover'),
  logoColor: '#DC3958',
  district: 'Namakkal',
  areas: ['Namakkal Town', 'Rasipuram'],
  distanceKm: 28,
  rating: 4.6,
  reviewCount: 154,
  startingPrice: 240,
  pricingModel: 'per_person',
  minCapacity: 80,
  maxCapacity: 1200,
  availability: 'enquire',
  verified: true,
  veg: 'both',
  description:
    'Raja Bhavan Caterers serves Salem and surrounding districts, travelling to customer event locations with a full catering + basic décor combo for weddings and receptions.',
  menuCategories: rajaBhavanMenu,
  packages: [
    {
      id: 'pkg-raja-combo',
      name: 'Catering + Décor Combo',
      pricePerPerson: 420,
      minGuests: 150,
      includes: ['Full course meal', 'Basic stage backdrop', 'Entrance decoration'],
      veg: false,
    },
  ],
  portfolio: [img('raja-1'), img('raja-2'), img('raja-3')],
  reviews: [
    r('Suresh Kumar', avatarColors[0], 5, '1 month ago', 'Reception', 'Travelled from Namakkal to our Salem venue without any issues. Great combo package.', { quality: 5, communication: 4, value: 5, timeliness: 4 }),
  ],
  responseTime: 'Usually responds within 5 hours',
  yearsActive: 9,
  contactNumber: '9843210004',
};

const gramaViruthuMenu = [
  {
    name: 'Rice & Curries',
    dishes: [d('Steamed Rice', 'Rice & Curries', 0, true), d('Sambar', 'Rice & Curries', 0, true), d('Rasam', 'Rice & Curries', 0, true, true), d('Poriyal', 'Rice & Curries', 30, true)],
  },
  {
    name: 'Sweets & Desserts',
    dishes: [d('Payasam', 'Sweets & Desserts', 35, true, true)],
  },
  {
    name: 'Drinks',
    dishes: [d('Buttermilk', 'Drinks', 15, true, true)],
  },
];

const provider5: Provider = {
  id: 'prov-grama-viruthu',
  name: 'Grama Viruthu Sappadu',
  category: 'catering',
  tagline: 'Authentic pure-veg banana leaf meals',
  coverImage: img('grama-cover'),
  logoColor: '#1A9E63',
  district: 'Salem',
  areas: ['Yercaud Foothills', 'Junction'],
  distanceKm: 9.1,
  rating: 4.9,
  reviewCount: 240,
  startingPrice: 130,
  pricingModel: 'per_person',
  minCapacity: 30,
  maxCapacity: 600,
  availability: 'available',
  verified: true,
  veg: 'veg',
  description:
    'Grama Viruthu Sappadu specialises in traditional South Indian banana-leaf meals for temple functions, satsangs and pure-vegetarian family gatherings.',
  menuCategories: gramaViruthuMenu,
  packages: [
    {
      id: 'pkg-grama-traditional',
      name: 'Traditional Sapadu',
      pricePerPerson: 150,
      minGuests: 25,
      includes: ['Rice + 5 curries', 'Payasam', 'Buttermilk', 'Banana leaf service'],
      veg: true,
    },
  ],
  portfolio: [img('grama-1'), img('grama-2'), img('grama-3')],
  reviews: [
    r('Lakshmi N.', avatarColors[2], 5, '3 weeks ago', 'Temple Function', 'Best pure-veg caterer we have used. Authentic taste and very hygienic.', { quality: 5, communication: 5, value: 5, timeliness: 5 }),
    r('Bala Murugan', avatarColors[1], 5, '2 months ago', 'House Function', 'Wonderful banana leaf meal, guests were impressed.', { quality: 5, communication: 5, value: 5, timeliness: 4 }),
  ],
  responseTime: 'Usually responds within 1 hour',
  yearsActive: 14,
  contactNumber: '9843210005',
};

// ---------------------------------------------------------------------------
// DECORATION PROVIDERS
// ---------------------------------------------------------------------------

const decoProvider1: Provider = {
  id: 'prov-royal-decors',
  name: 'Royal Stage Decors',
  category: 'decoration',
  tagline: 'Grand stage & entrance decoration for weddings',
  coverImage: img('royal-decor-cover'),
  logoColor: '#3763E0',
  district: 'Salem',
  areas: ['Hasthampatti', 'Fairlands'],
  distanceKm: 4.0,
  rating: 4.8,
  reviewCount: 176,
  startingPrice: 15000,
  pricingModel: 'package',
  minCapacity: 0,
  maxCapacity: 0,
  availability: 'available',
  verified: true,
  veg: 'both',
  description:
    'Royal Stage Decors creates themed stage backdrops, floral entrances and mandap decoration for weddings, receptions and engagements across Salem district.',
  menuCategories: [],
  packages: [
    { id: 'pkg-royal-classic', name: 'Classic Floral Stage', pricePerPerson: 0, minGuests: 0, includes: ['Floral backdrop', 'Entrance arch', 'Stage lighting'], veg: true },
    { id: 'pkg-royal-premium', name: 'Premium Theme Décor', pricePerPerson: 0, minGuests: 0, includes: ['Custom theme backdrop', 'LED name display', 'Mandap decoration', 'Entrance + walkway'], veg: true },
  ],
  portfolio: [img('royal-decor-1'), img('royal-decor-2'), img('royal-decor-3'), img('royal-decor-4')],
  reviews: [
    r('Nithya S.', avatarColors[3], 5, '2 weeks ago', 'Wedding', 'Absolutely stunning stage decoration, exactly like the reference photos we shared.', { quality: 5, communication: 5, value: 4, timeliness: 5 }),
  ],
  responseTime: 'Usually responds within 3 hours',
  yearsActive: 8,
  contactNumber: '9843210006',
};

const decoProvider2: Provider = {
  id: 'prov-flora-events',
  name: 'Flora Events Décor',
  category: 'decoration',
  tagline: 'Fresh flower décor for functions of all sizes',
  coverImage: img('flora-cover'),
  logoColor: '#0C6E67',
  district: 'Salem',
  areas: ['Ammapet', 'Suramangalam'],
  distanceKm: 7.5,
  rating: 4.5,
  reviewCount: 92,
  startingPrice: 8000,
  pricingModel: 'package',
  minCapacity: 0,
  maxCapacity: 0,
  availability: 'available',
  verified: true,
  veg: 'both',
  description: 'Flora Events Décor offers fresh flower arrangements and simple elegant setups suited for birthdays, engagements and house functions.',
  menuCategories: [],
  packages: [{ id: 'pkg-flora-basic', name: 'Basic Function Décor', pricePerPerson: 0, minGuests: 0, includes: ['Entrance flowers', 'Backdrop', 'Table décor'], veg: true }],
  portfolio: [img('flora-1'), img('flora-2')],
  reviews: [r('Vignesh R.', avatarColors[4], 4, '1 month ago', 'Birthday', 'Nice fresh flowers, arrived on time for setup.', { quality: 4, communication: 4, value: 4, timeliness: 5 })],
  responseTime: 'Usually responds within 4 hours',
  yearsActive: 5,
  contactNumber: '9843210007',
};

const decoProvider3: Provider = {
  id: 'prov-shubham-decor',
  name: 'Shubham Decorations',
  category: 'decoration',
  tagline: 'Corporate & temple function décor specialists',
  coverImage: img('shubham-cover'),
  logoColor: '#C9971F',
  district: 'Namakkal',
  areas: ['Namakkal Town'],
  distanceKm: 30,
  rating: 4.4,
  reviewCount: 61,
  startingPrice: 6000,
  pricingModel: 'package',
  minCapacity: 0,
  maxCapacity: 0,
  availability: 'partial',
  verified: false,
  veg: 'both',
  description: 'Shubham Decorations focuses on corporate branding backdrops and traditional temple function décor with quick turnaround.',
  menuCategories: [],
  packages: [{ id: 'pkg-shubham-corp', name: 'Corporate Branding Backdrop', pricePerPerson: 0, minGuests: 0, includes: ['Branded backdrop', 'Standees', 'Stage flowers'], veg: true }],
  portfolio: [img('shubham-1'), img('shubham-2')],
  reviews: [r('Divya M.', avatarColors[5], 4, '3 weeks ago', 'Corporate Event', 'Good for the price, simple and clean branding setup.', { quality: 4, communication: 4, value: 5, timeliness: 4 })],
  responseTime: 'Usually responds within 6 hours',
  yearsActive: 4,
  contactNumber: '9843210008',
};

// ---------------------------------------------------------------------------
// AUDIO / SOUND PROVIDERS
// ---------------------------------------------------------------------------

const audioProvider1: Provider = {
  id: 'prov-soundwave',
  name: 'SoundWave Event Audio',
  category: 'audio',
  tagline: 'Professional sound systems for weddings & stage events',
  coverImage: img('soundwave-cover'),
  logoColor: '#3049A6',
  district: 'Salem',
  areas: ['Fairlands', 'Junction', 'Shevapet'],
  distanceKm: 5.2,
  rating: 4.6,
  reviewCount: 134,
  startingPrice: 5000,
  pricingModel: 'package',
  minCapacity: 0,
  maxCapacity: 0,
  availability: 'available',
  verified: true,
  veg: 'both',
  description: 'SoundWave Event Audio provides line-array speaker systems, wireless mics and stage audio engineering for weddings, concerts and corporate events.',
  menuCategories: [],
  packages: [
    { id: 'pkg-sound-basic', name: 'Basic Function Audio', pricePerPerson: 0, minGuests: 0, includes: ['2 speakers', '2 wireless mics', 'Mixer + operator'], veg: true },
    { id: 'pkg-sound-stage', name: 'Full Stage Audio', pricePerPerson: 0, minGuests: 0, includes: ['Line-array system', '4 wireless mics', 'DJ console', 'Sound engineer'], veg: true },
  ],
  portfolio: [img('soundwave-1'), img('soundwave-2'), img('soundwave-3')],
  reviews: [r('Karthik B.', avatarColors[0], 5, '2 weeks ago', 'Wedding', 'Crystal clear sound throughout the event, very professional crew.', { quality: 5, communication: 5, value: 4, timeliness: 5 })],
  responseTime: 'Usually responds within 3 hours',
  yearsActive: 10,
  contactNumber: '9843210009',
};

const audioProvider2: Provider = {
  id: 'prov-echo-audio',
  name: 'Echo Audio Solutions',
  category: 'audio',
  tagline: 'Budget sound setups for small functions',
  coverImage: img('echo-cover'),
  logoColor: '#867C93',
  district: 'Salem',
  areas: ['Kondalampatti'],
  distanceKm: 6.0,
  rating: 4.2,
  reviewCount: 48,
  startingPrice: 3000,
  pricingModel: 'package',
  minCapacity: 0,
  maxCapacity: 0,
  availability: 'available',
  verified: false,
  veg: 'both',
  description: 'Echo Audio Solutions offers affordable sound system rentals for birthdays, house functions and small gatherings.',
  menuCategories: [],
  packages: [{ id: 'pkg-echo-basic', name: 'Small Function Audio', pricePerPerson: 0, minGuests: 0, includes: ['1 speaker', '1 mic'], veg: true }],
  portfolio: [img('echo-1')],
  reviews: [r('Ravi Shankar', avatarColors[1], 4, '1 month ago', 'Birthday', 'Simple setup, worked fine for our small event.', { quality: 4, communication: 3, value: 5, timeliness: 4 })],
  responseTime: 'Usually responds within 8 hours',
  yearsActive: 3,
  contactNumber: '9843210010',
};

const audioProvider3: Provider = {
  id: 'prov-decibel-pro',
  name: 'Decibel Pro Audio',
  category: 'audio',
  tagline: 'Concert-grade audio for large corporate events',
  coverImage: img('decibel-cover'),
  logoColor: '#1B1225',
  district: 'Coimbatore',
  areas: ['Coimbatore City'],
  distanceKm: 165,
  rating: 4.9,
  reviewCount: 210,
  startingPrice: 25000,
  pricingModel: 'custom',
  minCapacity: 0,
  maxCapacity: 0,
  availability: 'enquire',
  verified: true,
  veg: 'both',
  description: 'Decibel Pro Audio delivers large-scale concert and corporate event audio with international-grade equipment and a full engineering team.',
  menuCategories: [],
  packages: [{ id: 'pkg-decibel-corp', name: 'Large Corporate Setup', pricePerPerson: 0, minGuests: 0, includes: ['Line-array system', 'In-ear monitoring', 'Full engineering team'], veg: true }],
  portfolio: [img('decibel-1'), img('decibel-2')],
  reviews: [r('Anitha K.', avatarColors[2], 5, '2 months ago', 'Corporate Event', 'Top-notch equipment and crew, worth travelling from Coimbatore.', { quality: 5, communication: 5, value: 4, timeliness: 5 })],
  responseTime: 'Usually responds within 12 hours',
  yearsActive: 15,
  contactNumber: '9843210011',
};

const makeupProvider1: Provider = {
  id: 'prov-glam-glow',
  name: 'Glow & Glamour Bridal Studio',
  category: 'makeup',
  tagline: 'Celebrity bridal makeovers, HD & airbrush makeup in Salem',
  coverImage: img('bridal-studio-cover', 900, 560),
  logoColor: '#D946EF',
  district: 'Salem',
  areas: ['Fairlands', 'Alagapuram', 'Hasthampatti'],
  distanceKm: 2.4,
  rating: 4.8,
  reviewCount: 142,
  startingPrice: 12000,
  pricingModel: 'package',
  minCapacity: 1,
  maxCapacity: 15,
  availability: 'available',
  verified: true,
  veg: 'both',
  description:
    'Certified celebrity makeup artist specialising in South Indian bridal looks, muhurtham styling, reception glam and pre-wedding shoots with premium international products.',
  menuCategories: [
    {
      name: 'Bridal Services',
      dishes: [
        d('HD Bridal Makeover (Muhurtham)', 'Bridal Services', 15000, true, true),
        d('Airbrush Bridal Makeover', 'Bridal Services', 22000, true, true),
        d('Reception Glam Look', 'Bridal Services', 12000, true),
      ],
    },
    {
      name: 'Styling & Draping',
      dishes: [
        d('Saree Draping & Box Folding', 'Styling & Draping', 1500, true, true),
        d('Traditional Bridal Hairdo with Fresh Flowers', 'Styling & Draping', 3500, true),
        d('Pre-pleating & Ironing', 'Styling & Draping', 800, true),
      ],
    },
    {
      name: 'Family & Guest Styling',
      dishes: [
        d('Party Makeup for Guests', 'Family & Guest Styling', 3500, true),
        d('Mother of the Bride Package', 'Family & Guest Styling', 6000, true, true),
        d('Groom Styling & Hair Setting', 'Family & Guest Styling', 4000, true),
      ],
    },
  ],
  packages: [
    {
      id: 'pkg-bridal-hd',
      name: 'Signature HD Bridal Package',
      pricePerPerson: 18000,
      minGuests: 1,
      includes: ['HD Makeup', 'Bridal Hairstyling', 'Saree Draping', 'Lashes & Lenses', 'Fresh Jasmine styling'],
      veg: true,
    },
    {
      id: 'pkg-bridal-combo',
      name: 'Complete Wedding Combo (Muhurtham + Reception)',
      pricePerPerson: 32000,
      minGuests: 1,
      includes: ['2 Complete Looks', 'Touch-up Kit', 'Mother Makeover (free)', 'Airbrush Upgrade'],
      veg: true,
    },
  ],
  portfolio: [img('bridal-1'), img('bridal-2'), img('bridal-3')],
  reviews: [
    r('Priya Darshini', avatarColors[4], 5, '3 weeks ago', 'Wedding', 'The muhurtham look was magical and lasted whole day without a crease! Highly recommended.', {
      quality: 5,
      communication: 5,
      value: 5,
      timeliness: 5,
    }),
    r('Swetha R.', avatarColors[2], 5, '1 month ago', 'Reception', 'Super friendly artist, listened carefully to what I wanted and made me feel so confident.', {
      quality: 5,
      communication: 5,
      value: 4,
      timeliness: 5,
    }),
  ],
  responseTime: 'Usually responds within 1 hour',
  yearsActive: 8,
  contactNumber: '9843210012',
};

const makeupProvider2: Provider = {
  id: 'prov-aura-artistry',
  name: 'Aura Artistry by Divya',
  category: 'makeup',
  tagline: 'Natural radiant bridal & party makeup artist',
  coverImage: img('aura-cover', 900, 560),
  logoColor: '#EC4899',
  district: 'Salem',
  areas: ['Hasthampatti', 'Junction', 'Suramangalam'],
  distanceKm: 4.1,
  rating: 4.9,
  reviewCount: 98,
  startingPrice: 9000,
  pricingModel: 'package',
  minCapacity: 1,
  maxCapacity: 10,
  availability: 'available',
  verified: true,
  veg: 'both',
  description:
    'Specialist in dewy, long-lasting glass-skin bridal looks that enhance natural beauty. We travel across Salem, Namakkal and Erode for on-venue service.',
  menuCategories: [
    {
      name: 'Bridal Packages',
      dishes: [
        d('Radiant Muhurtham Makeover', 'Bridal Packages', 12000, true, true),
        d('Engagement Dewy Look', 'Bridal Packages', 9000, true),
      ],
    },
  ],
  packages: [
    {
      id: 'pkg-aura-bridal',
      name: 'Bridal Essentials Package',
      pricePerPerson: 14000,
      minGuests: 1,
      includes: ['Bridal Makeover', 'Hairstyling', 'Saree Pre-pleating', 'Trial Session'],
      veg: true,
    },
  ],
  portfolio: [img('aura-1'), img('aura-2')],
  reviews: [
    r('Deepika V.', avatarColors[0], 5, '2 weeks ago', 'Engagement', 'Very punctual and subtle makeup just like I asked!', {
      quality: 5,
      communication: 5,
      value: 5,
      timeliness: 5,
    }),
  ],
  responseTime: 'Usually responds within 2 hours',
  yearsActive: 5,
  contactNumber: '9843210013',
};

export const providers: Provider[] = [
  provider1,
  provider2,
  provider3,
  provider4,
  provider5,
  decoProvider1,
  decoProvider2,
  decoProvider3,
  audioProvider1,
  audioProvider2,
  audioProvider3,
  makeupProvider1,
  makeupProvider2,
];

export const specialCombos: SpecialCombo[] = [
  {
    id: 'combo-wedding-feast',
    providerId: 'prov-sri-annapoorna',
    providerName: 'Sri Annapoorna Caterers',
    category: 'catering',
    name: 'Grand Wedding Feast Combo',
    description: 'Complete traditional Tamil feast with live dosa counter and 3 specialty sweets',
    includedItems: ['Welcome Drink', 'Mutton Chukka', 'Chicken Biriyani', '3 Veg Curries', 'Elaneer Payasam', 'Live Counter'],
    price: 350,
    originalPrice: 420,
    image: img('wedding-feast', 800, 500),
    validUntil: 'Valid till 31 Oct',
    badge: 'Save 17%',
  },
  {
    id: 'combo-floral-stage',
    providerId: 'prov-royal-stage',
    providerName: 'Royal Stage Decors',
    category: 'decoration',
    name: 'Royal Floral Stage + Entrance Combo',
    description: 'Fresh exotic floral backdrop + grand tunnel entrance with warm fairy lights',
    includedItems: ['24ft Floral Backdrop', 'Grand Floral Arch', 'LED Focus Lights', 'Red Carpet Walkway'],
    price: 45000,
    originalPrice: 55000,
    image: img('royal-stage', 800, 500),
    validUntil: 'Valid this wedding season',
    badge: 'Popular',
  },
  {
    id: 'combo-bridal-glam',
    providerId: 'prov-glam-glow',
    providerName: 'Glow & Glamour Bridal Studio',
    category: 'makeup',
    name: 'Muhurtham + Reception Bridal Combo',
    description: 'HD Bridal makeover for both morning Muhurtham and evening Reception',
    includedItems: ['HD Makeup (2 Looks)', 'Hairstyling & Flowers', 'Saree Draping (2 sets)', 'Complimentary Mother Makeover'],
    price: 22000,
    originalPrice: 28000,
    image: img('bridal-glam', 800, 500),
    validUntil: 'Limited weekend slots',
    badge: 'Best Value',
  },
  {
    id: 'combo-sangeet-sound',
    providerId: 'prov-soundwave',
    providerName: 'SoundWave Event Audio',
    category: 'audio',
    name: 'Sangeet DJ & Audio Blast Combo',
    description: 'High-power sound system + DJ setup for high-energy Sangeet and Reception nights',
    includedItems: ['Line-Array Speakers', 'Pioneer DJ Console', '4 Wireless Mics', 'Fog Machine + Strobe'],
    price: 18000,
    originalPrice: 22000,
    image: img('sangeet-sound', 800, 500),
    validUntil: 'Book 7 days in advance',
    badge: 'Trending',
  },
];

export const getProviderById = (id: string) => providers.find((p) => p.id === id);
export const getProvidersByCategory = (category: string) => providers.filter((p) => p.category === category);
export const getSpecialCombos = () => specialCombos;
