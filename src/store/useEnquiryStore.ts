import { create } from 'zustand';
import { Enquiry, EnquiryItem } from '../data/types';
import { seedEnquiries } from '../data/seed';

interface EnquiryState {
  enquiries: Enquiry[];
  submitEnquiry: (input: {
    providerId: string;
    providerName: string;
    category: Enquiry['category'];
    eventType: string;
    eventDate: string;
    location: string;
    guestCount: number;
    items: EnquiryItem[];
    notes?: string;
  }) => Enquiry;
  markReviewed: (enquiryId: string) => void;
  updateStatus: (enquiryId: string, status: Enquiry['status']) => void;
  getById: (id: string) => Enquiry | undefined;
}

let counter = 2000;

export const useEnquiryStore = create<EnquiryState>((set, get) => ({
  enquiries: seedEnquiries,
  submitEnquiry: (input) => {
    counter += 1;
    const estimatedTotal = input.items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const newEnquiry: Enquiry = {
      id: `enq-${counter}`,
      providerId: input.providerId,
      providerName: input.providerName,
      category: input.category,
      createdAt: new Date().toISOString().slice(0, 10),
      eventType: input.eventType,
      eventDate: input.eventDate,
      location: input.location,
      guestCount: input.guestCount,
      items: input.items,
      estimatedTotal,
      notes: input.notes,
      status: 'submitted',
    };
    set((s) => ({ enquiries: [newEnquiry, ...s.enquiries] }));
    return newEnquiry;
  },
  markReviewed: (enquiryId) =>
    set((s) => ({
      enquiries: s.enquiries.map((e) => (e.id === enquiryId ? { ...e, hasReview: true } : e)),
    })),
  updateStatus: (enquiryId, status) =>
    set((s) => ({
      enquiries: s.enquiries.map((e) => (e.id === enquiryId ? { ...e, status } : e)),
    })),
  getById: (id) => get().enquiries.find((e) => e.id === id),
}));
