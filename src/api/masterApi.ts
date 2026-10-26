import { api } from './client';
import { ServiceCategory, District } from '../data/types';

export const masterApi = {
  getOnboarding: () => {
    return api.get<{ slides: any[] }>('/app/onboarding');
  },

  getCategories: () => {
    return api.get<ServiceCategory[]>('/categories');
  },

  getCategoryDetails: () => {
    return api.get<any[]>('/categories/details');
  },

  getDistricts: () => {
    return api.get<District[]>('/districts');
  },

  getEventTypes: (category?: string) => {
    return api.get<{ eventTypes: string[]; services?: string[] }>('/config/event-types', { category });
  },

  getFiltersMeta: () => {
    return api.get<any>('/providers/filters-meta');
  },

  getFaqs: () => {
    return api.get<any[]>('/support/faqs');
  },
};
