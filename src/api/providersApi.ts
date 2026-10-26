import { api } from './client';
import { Provider, SpecialCombo, Dish, MenuPackage, Review } from '../data/types';

export const providersApi = {
  getProviders: (params?: { category?: string; district?: string; search?: string; page?: number; limit?: number }) => {
    return api.get<Provider[]>('/providers', params);
  },

  getNearbyProviders: (params: { district?: string; lat?: number; lng?: number }) => {
    return api.get<Provider[]>('/providers/nearby', params);
  },

  matchProviders: (requirement: any) => {
    return api.post<{ totalMatches: number; providers: Provider[] }>('/providers/match', requirement);
  },

  getProviderDetail: (providerId: string) => {
    return api.get<Provider>(`/providers/${providerId}`);
  },

  getProviderCalendar: (providerId: string, year?: number, month?: number) => {
    return api.get<{ providerId: string; dates: Record<string, 'available' | 'blocked' | 'booked'> }>(
      `/providers/${providerId}/calendar`,
      { year, month }
    );
  },

  checkAvailability: (providerId: string, startDate: string, endDate: string) => {
    return api.get<{ isAvailable: boolean; blockedDates?: string[] }>(
      `/providers/${providerId}/availability`,
      { startDate, endDate }
    );
  },

  getProviderMenu: (providerId: string) => {
    return api.get<{ category: string; dishes: Dish[] }[]>(`/providers/${providerId}/menu`);
  },

  getProviderPackages: (providerId: string) => {
    return api.get<MenuPackage[]>(`/providers/${providerId}/packages`);
  },

  getSpecialCombos: () => {
    return api.get<SpecialCombo[]>('/combos/special');
  },

  createSpecialCombo: (combo: Partial<SpecialCombo>) => {
    return api.post<SpecialCombo>('/combos/special', combo);
  },

  getProviderReviews: (providerId: string) => {
    return api.get<Review[]>(`/providers/${providerId}/reviews`);
  },
};
