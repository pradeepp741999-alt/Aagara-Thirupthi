// Core domain types — mirrors the conceptual data model in the product doc
// (User, Provider, Service Category, Service, Menu, Dish, Package, Location,
// Availability, Enquiry, Booking, Rating/Review, Notification).

export type ServiceCategoryId = 'catering' | 'decoration' | 'audio';

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  tagline: string;
  icon: string; // Ionicons name
  color: string;
  comingSoon?: boolean;
}

export interface District {
  id: string;
  name: string;
  state: string;
}

export type AvailabilityStatus = 'available' | 'unavailable' | 'partial' | 'enquire';

export type PricingModel = 'per_dish' | 'per_person' | 'package' | 'custom';

export interface Dish {
  id: string;
  name: string;
  category: string; // e.g. Rice, Curries, Sweets, Non-Veg, Drinks
  price: number;
  veg: boolean;
  popular?: boolean;
}

export interface MenuPackage {
  id: string;
  name: string;
  pricePerPerson: number;
  minGuests: number;
  includes: string[];
  veg: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  avatarColor: string;
  rating: number; // 1-5
  date: string;
  eventType: string;
  comment: string;
  breakdown?: {
    quality: number;
    communication: number;
    value: number;
    timeliness: number;
  };
}

export interface Provider {
  id: string;
  name: string;
  category: ServiceCategoryId;
  tagline: string;
  coverImage: string;
  logoColor: string;
  district: string;
  areas: string[];
  distanceKm: number;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  pricingModel: PricingModel;
  minCapacity: number;
  maxCapacity: number;
  availability: AvailabilityStatus;
  verified: boolean;
  veg: 'veg' | 'non_veg' | 'both';
  description: string;
  menuCategories: { name: string; dishes: Dish[] }[];
  packages: MenuPackage[];
  portfolio: string[];
  reviews: Review[];
  responseTime: string; // e.g. "Usually responds within 2 hours"
  yearsActive: number;
  contactNumber: string; // 10-digit, shared with the customer once an enquiry is submitted
}

export interface EventRequirement {
  eventType: string;
  eventDate: string; // ISO date
  district: string;
  location: string;
  guestCount: number;
  category: ServiceCategoryId;
  budgetMin: number;
  budgetMax: number;
  notes?: string;
}

export interface EnquiryItem {
  dishId?: string;
  packageId?: string;
  name: string;
  price: number;
  qty: number;
}

export type EnquiryStatus =
  | 'submitted'
  | 'provider_reviewing'
  | 'provider_responded'
  | 'customer_reviewing'
  | 'confirmation_pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface Enquiry {
  id: string;
  providerId: string;
  providerName: string;
  category: ServiceCategoryId;
  createdAt: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount: number;
  items: EnquiryItem[];
  estimatedTotal: number;
  notes?: string;
  status: EnquiryStatus;
  providerQuote?: number;
  providerMessage?: string;
  hasReview?: boolean;
}

export interface CustomerProfile {
  name: string;
  mobile: string;
  whatsapp: string;
  altMobile?: string;
  district: string;
  location: string;
  avatarColor: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'enquiry' | 'booking' | 'review' | 'system';
}
