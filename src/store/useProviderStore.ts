import { create } from 'zustand';
import { Provider, SpecialCombo } from '../data/types';
import { providers as defaultProviders } from '../data/providers';
import { providersApi } from '../api/providersApi';

export type AvailabilityType = 'available' | 'blocked' | 'booked';

interface ProviderStoreState {
  providers: Provider[];
  combos: SpecialCombo[];
  calendars: Record<string, Record<string, AvailabilityType>>;
  loading: boolean;
  error: string | null;

  fetchSpecialCombos: () => Promise<void>;
  fetchProviders: (params?: { category?: string; district?: string }) => Promise<void>;
  fetchCalendar: (providerId: string, year?: number, month?: number) => Promise<Record<string, AvailabilityType>>;
  addSpecialCombo: (combo: SpecialCombo) => void;
  removeSpecialCombo: (comboId: string) => void;
  setDateStatus: (providerId: string, dateStr: string, status: AvailabilityType) => void;
  toggleDateStatus: (providerId: string, dateStr: string) => void;
  getCalendarForProvider: (providerId: string) => Record<string, AvailabilityType>;
  getAvailableDatesForProvider: (providerId: string) => string[];
}

export const useProviderStore = create<ProviderStoreState>((set, get) => ({
  providers: defaultProviders,
  combos: [],
  calendars: {},
  loading: false,
  error: null,

  fetchSpecialCombos: async () => {
    try {
      set({ loading: true, error: null });
      const cloudCombos = await providersApi.getSpecialCombos();
      if (Array.isArray(cloudCombos) && cloudCombos.length > 0) {
        set({ combos: cloudCombos, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err: any) {
      console.warn('[useProviderStore] fetchSpecialCombos error:', err.message);
      set({ loading: false, error: err.message });
    }
  },

  fetchProviders: async (params) => {
    try {
      set({ loading: true, error: null });
      const cloudProviders = await providersApi.getProviders(params);
      if (Array.isArray(cloudProviders) && cloudProviders.length > 0) {
        set({ providers: cloudProviders, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err: any) {
      console.warn('[useProviderStore] fetchProviders error:', err.message);
      set({ loading: false, error: err.message });
    }
  },

  fetchCalendar: async (providerId: string, year?: number, month?: number) => {
    try {
      const res = await providersApi.getProviderCalendar(providerId, year, month);
      if (res && res.dates) {
        set((state) => ({
          calendars: {
            ...state.calendars,
            [providerId]: res.dates,
          },
        }));
        return res.dates;
      }
    } catch (err: any) {
      console.warn('[useProviderStore] fetchCalendar error:', err.message);
    }
    return get().calendars[providerId] || {};
  },

  addSpecialCombo: (combo) => {
    set((state) => ({
      combos: [combo, ...state.combos],
    }));
    providersApi.createSpecialCombo(combo).catch((err: any) => {
      console.warn('[useProviderStore] createSpecialCombo cloud sync error:', err.message);
    });
  },

  removeSpecialCombo: (comboId) =>
    set((state) => ({
      combos: state.combos.filter((c) => c.id !== comboId),
    })),

  setDateStatus: (providerId, dateStr, status) =>
    set((state) => {
      const existing = state.calendars[providerId] || {};
      return {
        calendars: {
          ...state.calendars,
          [providerId]: {
            ...existing,
            [dateStr]: status,
          },
        },
      };
    }),

  toggleDateStatus: (providerId, dateStr) =>
    set((state) => {
      const existing = state.calendars[providerId] || {};
      const current = existing[dateStr] || 'blocked';
      let next: AvailabilityType = 'available';
      if (current === 'available') next = 'booked';
      else if (current === 'booked') next = 'blocked';
      else next = 'available';

      return {
        calendars: {
          ...state.calendars,
          [providerId]: {
            ...existing,
            [dateStr]: next,
          },
        },
      };
    }),

  getCalendarForProvider: (providerId) => {
    return get().calendars[providerId] || {};
  },

  getAvailableDatesForProvider: (providerId) => {
    const cal = get().calendars[providerId] || {};
    return Object.keys(cal).filter((d) => cal[d] === 'available');
  },
}));
