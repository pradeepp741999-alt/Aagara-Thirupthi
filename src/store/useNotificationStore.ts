import { create } from 'zustand';
import { AppNotification } from '../data/types';
import { notificationApi } from '../api/notificationApi';

interface NotificationState {
  notifications: AppNotification[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  unreadCount: () => number;
  markAllRead: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    try {
      set({ loading: true });
      const cloudNotifs = await notificationApi.getNotifications();
      if (Array.isArray(cloudNotifs)) {
        set({ notifications: cloudNotifs, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err: any) {
      console.warn('[useNotificationStore] fetchNotifications warning:', err.message);
      set({ loading: false });
    }
  },

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  markAllRead: async () => {
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
    try {
      await notificationApi.markAllAsRead();
    } catch (err: any) {
      console.warn('[useNotificationStore] markAllRead cloud sync warning:', err.message);
    }
  },

  markRead: async (id: string) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
    try {
      await notificationApi.markAsRead(id);
    } catch (err: any) {
      console.warn('[useNotificationStore] markRead cloud sync warning:', err.message);
    }
  },
}));
