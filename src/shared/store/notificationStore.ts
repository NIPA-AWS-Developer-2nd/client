import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: Date;
}

interface NotificationSettings {
  enabled: boolean;
  meetingReminders: boolean;
  missionUpdates: boolean;
  systemNotices: boolean;
  friendRequests: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface NotificationStore {
  inAppNotifications: InAppNotification[];
  settings: NotificationSettings;
  unreadCount: number;
  isPermissionGranted: boolean;
  isSubscribed: boolean;

  addNotification: (notification: Omit<InAppNotification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  setPermissionGranted: (granted: boolean) => void;
  setSubscribed: (subscribed: boolean) => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  meetingReminders: true,
  missionUpdates: true,
  systemNotices: true,
  friendRequests: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

export const useNotificationStore = create<NotificationStore>()(
  devtools((set, get) => ({
    inAppNotifications: [],
    settings: defaultSettings,
    unreadCount: 0,
    isPermissionGranted: false,
    isSubscribed: false,

    addNotification: (notification) => {
      const newNotification: InAppNotification = {
        ...notification,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      };

      set((state) => ({
        inAppNotifications: [...state.inAppNotifications, newNotification],
      }));

      if (notification.duration !== 0) {
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(newNotification.id);
        }, duration);
      }
    },

    removeNotification: (id) => {
      set((state) => ({
        inAppNotifications: state.inAppNotifications.filter(
          (notification) => notification.id !== id
        ),
      }));
    },

    clearAllNotifications: () => {
      set({ inAppNotifications: [] });
    },

    updateSettings: (newSettings) => {
      set((state) => ({
        settings: { ...state.settings, ...newSettings },
      }));
      
      const updatedSettings = { ...get().settings, ...newSettings };
      localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
    },

    setPermissionGranted: (granted) => {
      set({ isPermissionGranted: granted });
    },

    setSubscribed: (subscribed) => {
      set({ isSubscribed: subscribed });
    },

    setUnreadCount: (count) => {
      set({ unreadCount: Math.max(0, count) });
    },

    incrementUnreadCount: () => {
      set((state) => ({ unreadCount: state.unreadCount + 1 }));
    },

    decrementUnreadCount: () => {
      set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) }));
    },
  }), { 
    name: 'notification-store',
  })
);

export const loadNotificationSettings = (): NotificationSettings => {
  try {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load notification settings:', error);
  }
  return defaultSettings;
};

export const initializeNotificationStore = () => {
  const settings = loadNotificationSettings();
  useNotificationStore.getState().updateSettings(settings);
};