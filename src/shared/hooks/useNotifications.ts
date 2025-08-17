import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import {
  PushNotificationManager,
  type NotificationPermissionState,
  type PushSubscriptionData,
} from "../utils/pushNotifications";
import { apiUrl, authFetch } from "../utils/api";
import { useAlert } from "./useAlert";

interface UseNotificationsReturn {
  permissionState: NotificationPermissionState;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  subscription: PushSubscriptionData | null;
  showPermissionModal: boolean;
  requestPermission: () => Promise<boolean>;
  requestPermissionWithModal: () => void;
  handlePermissionAccept: () => Promise<void>;
  handlePermissionDecline: () => void;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  showLocalNotification: (
    title: string,
    options?: NotificationOptions
  ) => Promise<void>;
  clearError: () => void;
  setupAutoSubscription: () => Promise<boolean>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [permissionState, setPermissionState] =
    useState<NotificationPermissionState>({
      permission: "default",
      isSupported: false,
      isPushSupported: false,
      isServiceWorkerSupported: false,
    });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(
    null
  );
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [pushManager] = useState(() => PushNotificationManager.getInstance());

  const { isAuthenticated, user } = useAuth();
  const alertService = useAlert();

  const updatePermissionState = useCallback(() => {
    const state = pushManager.getPermissionState();
    setPermissionState((prevState) => {
      // 상태가 변경된 경우에만 업데이트
      if (JSON.stringify(prevState) !== JSON.stringify(state)) {
        return state;
      }
      return prevState;
    });
  }, [pushManager]);

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const currentSubscription = await pushManager.getSubscription();
      setSubscription(currentSubscription);
      setIsSubscribed(!!currentSubscription);
    } catch (err) {
      console.error("Failed to check subscription status:", err);
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
        console.error("Failed to initialize notifications:", err);
        setError("알림 시스템 초기화에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeNotifications();

    // 권한 상태 주기적 체크 (PWA에서 권한 변경 감지) - 10초마다
    const interval = setInterval(() => {
      updatePermissionState();
      // 로그인된 상태에서만 구독 상태 확인
      if (isAuthenticated && user?.id) {
        checkSubscriptionStatus();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [pushManager, updatePermissionState, checkSubscriptionStatus, isAuthenticated, user?.id]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!permissionState.isSupported) {
      setError("이 브라우저는 알림을 지원하지 않습니다.");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const permission = await pushManager.requestPermission();
      updatePermissionState();

      if (permission === "granted") {
        return true;
      } else if (permission === "denied") {
        setError(
          "알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요."
        );
      } else {
        setError("알림 권한 요청이 취소되었습니다.");
      }
      return false;
    } catch (err) {
      console.error("Failed to request permission:", err);
      setError("알림 권한 요청에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [pushManager, permissionState.isSupported, updatePermissionState]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      setError("로그인이 필요합니다.");
      return false;
    }

    if (permissionState.permission !== "granted") {
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
        setError("푸시 알림 구독에 실패했습니다.");
        return false;
      }

      const response = await authFetch(apiUrl("/notifications/subscribe"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscriptionData,
          browser: navigator.userAgent.includes("Chrome") ? "chrome" : "other",
        }),
      });

      if (!response.ok) {
        throw new Error("서버에 구독 정보 저장 실패");
      }

      setSubscription(subscriptionData);
      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error("Failed to subscribe:", err);
      setError("푸시 알림 구독에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    user,
    permissionState.permission,
    pushManager,
    requestPermission,
  ]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) {
      return true;
    }

    try {
      setIsLoading(true);
      setError(null);

      const unsubscribed = await pushManager.unsubscribe();
      if (!unsubscribed) {
        setError("푸시 알림 구독 해제에 실패했습니다.");
        return false;
      }

      if (isAuthenticated) {
        try {
          await authFetch(apiUrl("/notifications/unsubscribe"), {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              endpoint: subscription.endpoint,
            }),
          });
        } catch (err) {
          console.warn("Failed to notify server about unsubscription:", err);
        }
      }

      setSubscription(null);
      setIsSubscribed(false);
      return true;
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
      setError("푸시 알림 구독 해제에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription, pushManager, isAuthenticated]);

  const showLocalNotification = useCallback(
    async (title: string, options: NotificationOptions = {}): Promise<void> => {
      if (permissionState.permission !== "granted") {
        throw new Error("알림 권한이 필요합니다.");
      }

      try {
        await pushManager.showLocalNotification(title, options);
      } catch (err) {
        console.error("Failed to show local notification:", err);
        throw new Error("로컬 알림 표시에 실패했습니다.");
      }
    },
    [pushManager, permissionState.permission]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 모달과 함께 권한 요청
  const requestPermissionWithModal = useCallback(() => {
    if (permissionState.permission === "default") {
      setShowPermissionModal(true);
    } else if (permissionState.permission === "granted") {
      subscribe();
    }
  }, [permissionState.permission, subscribe]);

  // 모달에서 허용 버튼 클릭 (수정: 사용자 제스처 컨텍스트 유지)
  const handlePermissionAccept = useCallback(async () => {
    setShowPermissionModal(false);
    localStorage.setItem("notificationPromptShown", "true");

    // 이미 권한이 허용된 경우 바로 구독
    if (permissionState.permission === "granted") {
      const success = await subscribe();
      if (success) {
        alertService.success("알림이 활성화되었습니다.");
      }
      return;
    }

    // 권한 요청 (사용자 제스처 컨텍스트 내에서 즉시 실행)
    const permission = await requestPermission();

    if (permission) {
      // 권한 허용됨 - 구독 진행
      const success = await subscribe();
      if (success) {
        alertService.success("알림이 활성화되었습니다.");
      } else {
        alertService.error("알림 구독에 실패했습니다. 다시 시도해주세요.");
      }
    } else if (permissionState.permission === "denied") {
      // 권한 거부됨 - 설정 가이드 제공
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const guide = isIOS
        ? "설정 > Safari > 알림에서 할사람 알림을 허용해주세요."
        : "브라우저 설정에서 알림 권한을 허용해주세요.";

      alertService.warning(
        `알림 권한이 거부되었습니다.\n${guide}`,
        "알림 설정"
      );
    }
  }, [permissionState.permission, requestPermission, subscribe, alertService]);

  // 모달에서 나중에 버튼 클릭
  const handlePermissionDecline = useCallback(() => {
    setShowPermissionModal(false);
    // 로컬 스토리지에 거부 시간 저장 (7일 후 다시 표시)
    localStorage.setItem("notificationPromptDeclined", Date.now().toString());
    localStorage.setItem("notificationPromptShown", "true");
    alertService.info("언제든지 설정에서 알림을 활성화할 수 있습니다.");
  }, [alertService]);

  // 자동 구독 설정 함수 (수정: 모달 표시로 변경)
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
      console.log("이 브라우저는 푸시 알림을 지원하지 않습니다.");
      return false;
    }

    try {
      // 이미 권한이 거부된 경우는 조용히 스킵
      if (permissionState.permission === "denied") {
        console.log("알림 권한이 거부되어 있습니다.");
        return false;
      }

      // 권한이 이미 허용된 경우 바로 구독
      if (permissionState.permission === "granted") {
        const success = await subscribe();
        return success;
      }

      // 이미 모달을 한번 보여줬는지 확인
      const modalShown = localStorage.getItem("notificationPromptShown");
      if (modalShown === "true") {
        console.log("알림 모달이 이미 표시되었습니다.");
        return false;
      }

      // 최근에 거부했는지 확인 (7일)
      const lastDeclined = localStorage.getItem("notificationPromptDeclined");
      if (lastDeclined) {
        const declinedTime = parseInt(lastDeclined);
        const weekInMs = 7 * 24 * 60 * 60 * 1000; // 7일
        if (Date.now() - declinedTime < weekInMs) {
          console.log("사용자가 최근에 알림을 거부했습니다.");
          return false;
        }
      }

      // 모달 표시 (권한이 default인 경우)
      if (permissionState.permission === "default") {
        setTimeout(() => {
          setShowPermissionModal(true);
          // 모달 표시했다고 기록
          localStorage.setItem("notificationPromptShown", "true");
        }, 2000); // 2초 후 모달 표시
        return false; // 일단 false 반환 (모달에서 사용자가 선택)
      }

      return false;
    } catch (err) {
      console.error("자동 구독 설정 실패:", err);
      return false;
    }
  }, [isSubscribed, isAuthenticated, user, permissionState, subscribe]);

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
      if (document.visibilityState === "visible") {
        checkSubscriptionStatus();
        updatePermissionState();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkSubscriptionStatus, updatePermissionState]);

  return {
    permissionState,
    isSubscribed,
    isLoading,
    error,
    subscription,
    showPermissionModal,
    requestPermission,
    requestPermissionWithModal,
    handlePermissionAccept,
    handlePermissionDecline,
    subscribe,
    unsubscribe,
    showLocalNotification,
    clearError,
    setupAutoSubscription,
  };
};
