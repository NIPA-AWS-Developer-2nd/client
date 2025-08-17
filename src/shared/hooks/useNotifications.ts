import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { 
  PushNotificationManager, 
  type NotificationPermissionState, 
  type PushSubscriptionData 
} from '../utils/pushNotifications';
import { apiUrl } from '../utils/api';

interface UseNotificationsReturn {
  permissionState: NotificationPermissionState;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  subscription: PushSubscriptionData | null;
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  showLocalNotification: (title: string, options?: NotificationOptions) => Promise<void>;
  clearError: () => void;
  setupAutoSubscription: () => Promise<boolean>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>({
    permission: 'default',
    isSupported: false,
    isPushSupported: false,
    isServiceWorkerSupported: false,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null);
  const [pushManager] = useState(() => PushNotificationManager.getInstance());
  
  const { isAuthenticated, user } = useAuth();

  const updatePermissionState = useCallback(() => {
    const state = pushManager.getPermissionState();
    setPermissionState(state);
  }, [pushManager]);

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const currentSubscription = await pushManager.getSubscription();
      setSubscription(currentSubscription);
      setIsSubscribed(!!currentSubscription);
    } catch (err) {
      console.error('Failed to check subscription status:', err);
      setIsSubscribed(false);
      setSubscription(null);
    }
  }, [pushManager]);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        setIsLoading(true);
        await pushManager.initialize();
        updatePermissionState();
        await checkSubscriptionStatus();
      } catch (err) {
        console.error('Failed to initialize notifications:', err);
        setError('알림 시스템 초기화에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeNotifications();
  }, [pushManager, updatePermissionState, checkSubscriptionStatus]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!permissionState.isSupported) {
      setError('이 브라우저는 알림을 지원하지 않습니다.');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const permission = await pushManager.requestPermission();
      updatePermissionState();
      
      if (permission === 'granted') {
        return true;
      } else if (permission === 'denied') {
        setError('알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
      } else {
        setError('알림 권한 요청이 취소되었습니다.');
      }
      return false;
    } catch (err) {
      console.error('Failed to request permission:', err);
      setError('알림 권한 요청에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [pushManager, permissionState.isSupported, updatePermissionState]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      setError('로그인이 필요합니다.');
      return false;
    }

    if (permissionState.permission !== 'granted') {
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        return false;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const subscriptionData = await pushManager.subscribe();
      if (!subscriptionData) {
        setError('푸시 알림 구독에 실패했습니다.');
        return false;
      }

      const response = await fetch(apiUrl('/notifications/subscribe'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscriptionData,
          browser: navigator.userAgent.includes('Chrome') ? 'chrome' : 'other',
        }),
      });

      if (!response.ok) {
        throw new Error('서버에 구독 정보 저장 실패');
      }

      setSubscription(subscriptionData);
      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error('Failed to subscribe:', err);
      setError('푸시 알림 구독에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, permissionState.permission, pushManager, requestPermission]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) {
      return true;
    }

    try {
      setIsLoading(true);
      setError(null);

      const unsubscribed = await pushManager.unsubscribe();
      if (!unsubscribed) {
        setError('푸시 알림 구독 해제에 실패했습니다.');
        return false;
      }

      if (isAuthenticated) {
        try {
          await fetch(apiUrl('/notifications/unsubscribe'), {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              endpoint: subscription.endpoint,
            }),
          });
        } catch (err) {
          console.warn('Failed to notify server about unsubscription:', err);
        }
      }

      setSubscription(null);
      setIsSubscribed(false);
      return true;
    } catch (err) {
      console.error('Failed to unsubscribe:', err);
      setError('푸시 알림 구독 해제에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription, pushManager, isAuthenticated]);

  const showLocalNotification = useCallback(async (
    title: string,
    options: NotificationOptions = {}
  ): Promise<void> => {
    if (permissionState.permission !== 'granted') {
      throw new Error('알림 권한이 필요합니다.');
    }

    try {
      await pushManager.showLocalNotification(title, options);
    } catch (err) {
      console.error('Failed to show local notification:', err);
      throw new Error('로컬 알림 표시에 실패했습니다.');
    }
  }, [pushManager, permissionState.permission]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 자동 구독 설정 함수
  const setupAutoSubscription = useCallback(async (): Promise<boolean> => {
    // 이미 구독되어 있다면 스킵
    if (isSubscribed) {
      return true;
    }

    // 로그인되어 있지 않다면 스킵
    if (!isAuthenticated || !user?.id) {
      return false;
    }

    // 알림이 지원되지 않는다면 스킵
    if (!permissionState.isSupported || !permissionState.isPushSupported) {
      console.log('이 브라우저는 푸시 알림을 지원하지 않습니다.');
      return false;
    }

    try {
      // 이미 권한이 거부된 경우는 조용히 스킵
      if (permissionState.permission === 'denied') {
        console.log('알림 권한이 거부되어 있습니다.');
        return false;
      }

      // 권한 요청 (아직 요청하지 않은 경우만)
      if (permissionState.permission === 'default') {
        const permissionGranted = await requestPermission();
        if (!permissionGranted) {
          return false;
        }
      }

      // 구독 진행
      const success = await subscribe();
      return success;
    } catch (err) {
      console.error('자동 구독 설정 실패:', err);
      return false;
    }
  }, [isSubscribed, isAuthenticated, user, permissionState, requestPermission, subscribe]);

  // 로그인 상태 변경시 자동 구독 시도
  useEffect(() => {
    if (!isAuthenticated && isSubscribed) {
      unsubscribe();
    } else if (isAuthenticated && !isSubscribed) {
      // 로그인 후 약간의 지연을 두고 자동 구독 시도
      const timer = setTimeout(() => {
        setupAutoSubscription();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isSubscribed, unsubscribe, setupAutoSubscription]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSubscriptionStatus();
        updatePermissionState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkSubscriptionStatus, updatePermissionState]);

  return {
    permissionState,
    isSubscribed,
    isLoading,
    error,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    showLocalNotification,
    clearError,
    setupAutoSubscription,
  };
};