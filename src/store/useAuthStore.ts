import { create } from 'zustand';
import { CustomerProfile } from '../data/types';
import { defaultProfile } from '../data/seed';

interface AuthState {
  isAuthenticated: boolean;
  hasProfile: boolean;
  mobile: string;
  profile: CustomerProfile;
  setMobile: (mobile: string) => void;
  completeLogin: () => void;
  saveProfile: (profile: Partial<CustomerProfile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasProfile: false,
  mobile: '',
  profile: defaultProfile,
  setMobile: (mobile) => set({ mobile }),
  completeLogin: () => set({ isAuthenticated: true }),
  saveProfile: (profile) =>
    set((state) => ({
      profile: { ...state.profile, ...profile },
      hasProfile: true,
    })),
  logout: () => set({ isAuthenticated: false, hasProfile: false, mobile: '', profile: defaultProfile }),
}));
