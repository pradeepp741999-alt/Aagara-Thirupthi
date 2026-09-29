import { create } from 'zustand';
import { EnquiryItem } from '../data/types';

interface CartState {
  providerId: string | null;
  items: EnquiryItem[];
  startCart: (providerId: string) => void;
  toggleDish: (dishId: string, name: string, price: number) => void;
  selectPackage: (pkgId: string, name: string, pricePerPerson: number, guestCount: number) => void;
  clearPackage: () => void;
  setQty: (dishId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  isDishSelected: (dishId: string) => boolean;
}

export const useCartStore = create<CartState>((set, get) => ({
  providerId: null,
  items: [],
  startCart: (providerId) => {
    if (get().providerId !== providerId) {
      set({ providerId, items: [] });
    }
  },
  toggleDish: (dishId, name, price) =>
    set((s) => {
      const exists = s.items.find((it) => it.dishId === dishId);
      if (exists) {
        return { items: s.items.filter((it) => it.dishId !== dishId) };
      }
      return { items: [...s.items.filter((it) => !it.packageId), { dishId, name, price, qty: 1 }] };
    }),
  selectPackage: (pkgId, name, pricePerPerson, guestCount) =>
    set(() => ({
      items: [{ packageId: pkgId, name, price: pricePerPerson, qty: guestCount }],
    })),
  clearPackage: () => set({ items: [] }),
  setQty: (dishId, qty) =>
    set((s) => ({
      items: s.items.map((it) => (it.dishId === dishId ? { ...it, qty: Math.max(1, qty) } : it)),
    })),
  clearCart: () => set({ items: [], providerId: null }),
  total: () => get().items.reduce((sum, it) => sum + it.price * it.qty, 0),
  isDishSelected: (dishId) => get().items.some((it) => it.dishId === dishId),
}));
