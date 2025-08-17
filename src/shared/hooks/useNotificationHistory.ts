import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiUrl } from '../utils/api';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'meeting_reminder' | 'mission_complete' | 'system_notice' | 'friend_request';
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  sent: number;
  failed: number;
}

interface UseNotificationHistoryReturn {
  notifications: NotificationItem[];
  stats: NotificationStats | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  fetchNotifications: (page?: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearError: () => void;
}

export const useNotificationHistory = (): UseNotificationHistoryReturn => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { isAuthenticated } = useAuth();
  const ITEMS_PER_PAGE = 20;

  const fetchNotifications = useCallback(async (page = 1): Promise<void> => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        apiUrl(`/notifications/my?page=${page}&limit=${ITEMS_PER_PAGE}`),
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('알림 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      
      if (page === 1) {
        setNotifications(data.data.notifications);
      } else {
        setNotifications(prev => [...prev, ...data.data.notifications]);
      }
      
      setCurrentPage(page);
      setHasMore(data.data.notifications.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err instanceof Error ? err.message : '알림 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchStats = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await fetch(apiUrl('/notifications/stats'), {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('알림 통계를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch notification stats:', err);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`/notifications/${notificationId}/read`), {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('알림을 읽음으로 처리하는데 실패했습니다.');
      }

      fetchStats();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      setError(err instanceof Error ? err.message : '알림 읽음 처리에 실패했습니다.');
    }
  }, [isAuthenticated, fetchStats]);

  const deleteNotification = useCallback(async (notificationId: string): Promise<void> => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`/notifications/${notificationId}`), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('알림을 삭제하는데 실패했습니다.');
      }

      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      fetchStats();
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setError(err instanceof Error ? err.message : '알림 삭제에 실패했습니다.');
    }
  }, [isAuthenticated, fetchStats]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications(1);
      fetchStats();
    } else {
      setNotifications([]);
      setStats(null);
      setCurrentPage(1);
      setHasMore(true);
    }
  }, [isAuthenticated, fetchNotifications, fetchStats]);

  // Service Worker에서 새 알림 메시지 수신 시 목록 갱신
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NEW_NOTIFICATION') {
        console.log('새 알림 수신, 목록 갱신:', event.data);
        // 새 알림이 왔을 때 목록을 다시 가져옴
        fetchNotifications(1);
        fetchStats();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      };
    }
  }, [isAuthenticated, fetchNotifications, fetchStats]);

  return {
    notifications,
    stats,
    isLoading,
    error,
    hasMore,
    currentPage,
    fetchNotifications,
    fetchStats,
    markAsRead,
    deleteNotification,
    clearError,
  };
};