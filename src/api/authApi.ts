import { api } from './client';
import { CustomerProfile } from '../data/types';

export interface SendOtpResponse {
  success: boolean;
  message?: string;
  txnId?: string;
}

export interface VerifyOtpResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  isNewUser?: boolean;
  user?: CustomerProfile;
  profile?: CustomerProfile;
}

export const authApi = {
  sendOtp: (mobile: string) => {
    return api.post<SendOtpResponse>('/auth/send-otp', { mobile });
  },

  verifyOtp: (mobile: string, otp: string) => {
    return api.post<VerifyOtpResponse>('/auth/verify-otp', { mobile, otp });
  },

  refreshToken: (refreshToken: string) => {
    return api.post<{ token: string }>('/auth/refresh-token', { refresh_token: refreshToken });
  },

  logout: () => {
    return api.post<{ success: boolean }>('/auth/logout');
  },

  getProfile: () => {
    return api.get<CustomerProfile>('/user/profile');
  },

  createProfile: (data: Partial<CustomerProfile>) => {
    return api.post<CustomerProfile>('/user/profile', data);
  },

  updateProfile: (data: Partial<CustomerProfile>) => {
    return api.put<CustomerProfile>('/user/profile', data);
  },

  patchLocation: (data: { district: string; location: string; lat?: number; lng?: number }) => {
    return api.patch<CustomerProfile>('/user/location', data);
  },

  saveRequirementDraft: (data: any) => {
    return api.post('/requirements/draft', data);
  },
};
