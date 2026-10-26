import { create } from 'zustand';
import { CustomerProfile } from '../data/types';
import { authApi } from '../api/authApi';

const emptyProfile: CustomerProfile = {
  name: '',
  mobile: '',
  whatsapp: '',
  district: 'Salem',
  location: 'Fairlands',
  avatarColor: '#8B5CF6',
};

interface AuthState {
  isAuthenticated: boolean;
  hasProfile: boolean;
  token?: string;
  refreshToken?: string;
  mobile: string;
  profile: CustomerProfile;
  setMobile: (mobile: string) => void;
  setToken: (token: string, refreshToken?: string) => void;
  completeLogin: (token?: string, user?: CustomerProfile) => void;
  saveProfile: (profile: Partial<CustomerProfile>) => Promise<void>;
  updateLocation: (district: string, location: string, lat?: number, lng?: number) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  hasProfile: false,
  token: undefined,
  refreshToken: undefined,
  mobile: '',
  profile: emptyProfile,

  setMobile: (mobile) => set({ mobile }),

  setToken: (token, refreshToken) => set({ token, refreshToken, isAuthenticated: !!token }),

  completeLogin: (token, user) =>
    set({
      isAuthenticated: true,
      token: token || get().token,
      profile: user ? { ...get().profile, ...user } : get().profile,
      hasProfile: !!(user?.name || get().profile.name),
    }),

  saveProfile: async (profileUpdate) => {
    // Optimistic local update
    set((state) => ({
      profile: { ...state.profile, ...profileUpdate },
      hasProfile: true,
    }));

    // Sync to cloud backend
    try {
      if (get().token) {
        await authApi.updateProfile(profileUpdate);
      }
    } catch (e: any) {
      console.warn('[useAuthStore] saveProfile sync warning:', e.message);
    }
  },

  updateLocation: async (district, location, lat, lng) => {
    set((state) => ({
      profile: { ...state.profile, district, location },
    }));

    try {
      if (get().token) {
        await authApi.patchLocation({ district, location, lat, lng });
      }
    } catch (e: any) {
      console.warn('[useAuthStore] updateLocation sync warning:', e.message);
    }
  },

  fetchProfile: async () => {
    try {
      if (!get().token) return;
      const remote = await authApi.getProfile();
      if (remote) {
        set((state) => ({
          profile: { ...state.profile, ...remote },
          hasProfile: !!remote.name,
        }));
      }
    } catch (e: any) {
      console.warn('[useAuthStore] fetchProfile warning:', e.message);
    }
  },

  logout: async () => {
    try {
      if (get().token) {
        await authApi.logout();
      }
    } catch (e: any) {
      console.warn('[useAuthStore] logout warning:', e.message);
    }
    set({
      isAuthenticated: false,
      hasProfile: false,
      token: undefined,
      refreshToken: undefined,
      mobile: '',
      profile: emptyProfile,
    });
  },
}));
