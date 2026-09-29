import { Enquiry, AppNotification, CustomerProfile } from './types';

// Seed enquiries so the "My Enquiries / Bookings" screen has realistic
// content immediately, spanning several statuses from the doc's workflow.
export const seedEnquiries: Enquiry[] = [
  {
    id: 'enq-1001',
    providerId: 'prov-sri-annapoorna',
    providerName: 'Sri Annapoorna Caterers',
    category: 'catering',
    createdAt: '2026-08-18',
    eventType: 'Wedding',
    eventDate: '2026-11-14',
    location: 'Fairlands, Salem',
    guestCount: 400,
    items: [
      { name: 'Classic Wedding Package', price: 320, qty: 400 },
    ],
    estimatedTotal: 128000,
    notes: 'Need both veg and non-veg counters, function starts 11 AM.',
    status: 'provider_responded',
    providerQuote: 124000,
    providerMessage: 'We can do this for ₹1,24,000 including 2 live counters. Available on your date — please confirm by Aug 30 to lock the booking.',
  },
  {
    id: 'enq-1002',
    providerId: 'prov-royal-decors',
    providerName: 'Royal Stage Decors',
    category: 'decoration',
    createdAt: '2026-08-20',
    eventType: 'Wedding',
    eventDate: '2026-11-14',
    location: 'Fairlands, Salem',
    guestCount: 400,
    items: [{ name: 'Premium Theme Décor', price: 28000, qty: 1 }],
    estimatedTotal: 28000,
    notes: 'Looking for a peacock theme stage backdrop.',
    status: 'provider_reviewing',
  },
  {
    id: 'enq-1003',
    providerId: 'prov-grama-viruthu',
    providerName: 'Grama Viruthu Sappadu',
    category: 'catering',
    createdAt: '2026-07-02',
    eventType: 'Temple Function',
    eventDate: '2026-07-20',
    location: 'Yercaud Foothills, Salem',
    guestCount: 120,
    items: [{ name: 'Traditional Sapadu', price: 150, qty: 120 }],
    estimatedTotal: 18000,
    status: 'completed',
    providerQuote: 17500,
    hasReview: false,
  },
  {
    id: 'enq-1004',
    providerId: 'prov-soundwave',
    providerName: 'SoundWave Event Audio',
    category: 'audio',
    createdAt: '2026-06-10',
    eventType: 'Birthday',
    eventDate: '2026-06-22',
    location: 'Junction, Salem',
    guestCount: 80,
    items: [{ name: 'Basic Function Audio', price: 5000, qty: 1 }],
    estimatedTotal: 5000,
    status: 'completed',
    providerQuote: 5000,
    hasReview: true,
  },
];

export const seedNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Provider responded to your enquiry',
    message: 'Sri Annapoorna Caterers sent a quotation of ₹1,24,000 for your wedding enquiry.',
    time: '2 hours ago',
    read: false,
    type: 'enquiry',
  },
  {
    id: 'notif-2',
    title: 'Enquiry under review',
    message: 'Royal Stage Decors is reviewing your decoration enquiry.',
    time: '1 day ago',
    read: false,
    type: 'enquiry',
  },
  {
    id: 'notif-3',
    title: 'Rate your recent booking',
    message: 'How was your experience with SoundWave Event Audio? Share a review.',
    time: '3 days ago',
    read: true,
    type: 'review',
  },
  {
    id: 'notif-4',
    title: 'Booking completed',
    message: 'Your booking with Grama Viruthu Sappadu was marked completed.',
    time: '1 month ago',
    read: true,
    type: 'booking',
  },
];

export const defaultProfile: CustomerProfile = {
  name: '',
  mobile: '',
  whatsapp: '',
  district: 'Salem',
  location: '',
  avatarColor: '#5B2C6F',
};

export const eventTypes = [
  'Wedding', 'Birthday', 'Engagement', 'Reception', 'Corporate Event',
  'Family Function', 'Temple Function', 'House Function', 'Small Gathering', 'Large-Scale Event',
];
