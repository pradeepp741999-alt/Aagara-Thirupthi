import { api } from './client';
import { Enquiry } from '../data/types';

export const enquiryApi = {
  createEnquiry: (payload: {
    providerId: string;
    category: string;
    eventType: string;
    eventDate: string;
    eventEndDate?: string;
    location: string;
    district?: string;
    guestCount: number;
    makeupPersonsCount?: number;
    simultaneousStyling?: boolean;
    backupArtistAssigned?: boolean;
    items: Array<{ name: string; price: number; qty: number }>;
    notes?: string;
  }) => {
    return api.post<Enquiry>('/enquiries', payload);
  },

  getEnquiries: (status?: string) => {
    return api.get<Enquiry[]>('/enquiries', { status });
  },

  getEnquirySummary: () => {
    return api.get<{ activeCount: number; awaitingResponseCount: number }>('/enquiries/summary');
  },

  getEnquiryDetail: (enquiryId: string) => {
    return api.get<Enquiry>(`/enquiries/${enquiryId}`);
  },

  updateEnquiryStatus: (enquiryId: string, status: string, reason?: string) => {
    return api.patch<Enquiry>(`/enquiries/${enquiryId}/status`, { status, reason });
  },

  submitReview: (payload: {
    enquiryId: string;
    providerId: string;
    rating: number;
    comment: string;
    ratings?: { quality: number; communication: number; value: number; punctuality: number };
    photos?: string[];
  }) => {
    return api.post<{ success: boolean; id: string }>('/reviews', payload);
  },
};
