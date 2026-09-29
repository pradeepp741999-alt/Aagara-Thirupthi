import { create } from 'zustand';
import { EventRequirement, ServiceCategoryId } from '../data/types';

export interface FilterState {
  distanceKm?: number;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  minCapacity?: number;
  vegOnly?: boolean;
  availableOnly?: boolean;
  sortBy: 'relevance' | 'rating' | 'price_low' | 'price_high' | 'distance';
}

const defaultRequirement: EventRequirement = {
  eventType: 'Wedding',
  eventDate: '',
  district: 'Salem',
  location: '',
  guestCount: 100,
  category: 'catering',
  budgetMin: 0,
  budgetMax: 0,
};

export const defaultFilters: FilterState = {
  sortBy: 'relevance',
};

interface RequirementState {
  requirement: EventRequirement;
  filters: FilterState;
  searchQuery: string;
  setCategory: (c: ServiceCategoryId) => void;
  updateRequirement: (r: Partial<EventRequirement>) => void;
  updateFilters: (f: Partial<FilterState>) => void;
  resetFilters: () => void;
  setSearchQuery: (q: string) => void;
}

export const useRequirementStore = create<RequirementState>((set) => ({
  requirement: defaultRequirement,
  filters: defaultFilters,
  searchQuery: '',
  setCategory: (c) => set((s) => ({ requirement: { ...s.requirement, category: c } })),
  updateRequirement: (r) => set((s) => ({ requirement: { ...s.requirement, ...r } })),
  updateFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
