import { api } from './client';
import { AppNotification } from '../data/types';

export const notificationApi = {
  getNotifications: () => {
    return api.get<AppNotification[]>('/notifications');
  },

  markAsRead: (id: string) => {
    return api.patch<{ success: boolean }>(`/notifications/${id}/read`);
  },

  markAllAsRead: () => {
    return api.patch<{ success: boolean }>('/notifications/mark-all-read');
  },

  getUnreadCount: () => {
    return api.get<{ unreadCount: number }>('/notifications/unread-count');
  },
};
