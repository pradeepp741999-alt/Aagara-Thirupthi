import { create } from 'zustand';
import { Enquiry, EnquiryItem } from '../data/types';
import { enquiryApi } from '../api/enquiryApi';

interface EnquiryState {
  enquiries: Enquiry[];
  loading: boolean;
  error: string | null;

  fetchEnquiries: (status?: string) => Promise<void>;
  submitEnquiry: (input: {
    providerId: string;
    providerName: string;
    category: Enquiry['category'];
    eventType: string;
    eventDate: string;
    eventEndDate?: string;
    location: string;
    guestCount: number;
    makeupPersonsCount?: number;
    simultaneousStyling?: boolean;
    backupArtistAssigned?: boolean;
    items: EnquiryItem[];
    notes?: string;
  }) => Promise<Enquiry>;
  markReviewed: (enquiryId: string) => void;
  updateStatus: (enquiryId: string, status: Enquiry['status']) => Promise<void>;
  getById: (id: string) => Enquiry | undefined;
}

export const useEnquiryStore = create<EnquiryState>((set, get) => ({
  enquiries: [],
  loading: false,
  error: null,

  fetchEnquiries: async (status) => {
    try {
      set({ loading: true, error: null });
      const cloudEnquiries = await enquiryApi.getEnquiries(status);
      if (Array.isArray(cloudEnquiries)) {
        set({ enquiries: cloudEnquiries, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err: any) {
      console.warn('[useEnquiryStore] fetchEnquiries error:', err.message);
      set({ loading: false, error: err.message });
    }
  },

  submitEnquiry: async (input) => {
    const estimatedTotal = input.items.reduce((sum, it) => sum + it.price * it.qty, 0);

    const localEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      providerId: input.providerId,
      providerName: input.providerName,
      category: input.category,
      createdAt: new Date().toISOString().slice(0, 10),
      eventType: input.eventType,
      eventDate: input.eventDate,
      eventEndDate: input.eventEndDate,
      location: input.location,
      guestCount: input.guestCount,
      makeupPersonsCount: input.makeupPersonsCount,
      simultaneousStyling: input.simultaneousStyling,
      backupArtistAssigned: input.backupArtistAssigned,
      items: input.items,
      estimatedTotal,
      notes: input.notes,
      status: 'submitted',
    };

    // Optimistically add to store
    set((s) => ({ enquiries: [localEnquiry, ...s.enquiries] }));

    // Send to cloud backend
    try {
      const remote = await enquiryApi.createEnquiry({
        providerId: input.providerId,
        category: input.category,
        eventType: input.eventType,
        eventDate: input.eventDate,
        eventEndDate: input.eventEndDate,
        location: input.location,
        guestCount: input.guestCount,
        makeupPersonsCount: input.makeupPersonsCount,
        simultaneousStyling: input.simultaneousStyling,
        backupArtistAssigned: input.backupArtistAssigned,
        items: input.items.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
        notes: input.notes,
      });

      if (remote && remote.id) {
        // Replace with cloud enquiry object
        set((s) => ({
          enquiries: s.enquiries.map((e) => (e.id === localEnquiry.id ? { ...localEnquiry, ...remote } : e)),
        }));
        return { ...localEnquiry, ...remote };
      }
    } catch (err: any) {
      console.warn('[useEnquiryStore] submitEnquiry cloud sync warning:', err.message);
    }

    return localEnquiry;
  },

  markReviewed: (enquiryId) =>
    set((s) => ({
      enquiries: s.enquiries.map((e) => (e.id === enquiryId ? { ...e, hasReview: true } : e)),
    })),

  updateStatus: async (enquiryId, status) => {
    set((s) => ({
      enquiries: s.enquiries.map((e) => (e.id === enquiryId ? { ...e, status } : e)),
    }));

    try {
      await enquiryApi.updateEnquiryStatus(enquiryId, status);
    } catch (err: any) {
      console.warn('[useEnquiryStore] updateStatus cloud sync warning:', err.message);
    }
  },

  getById: (id) => get().enquiries.find((e) => e.id === id),
}));
