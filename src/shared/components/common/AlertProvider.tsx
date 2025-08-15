import React, { useState, useCallback, ReactNode } from "react";
import { AlertModal } from "./AlertModal";
import type { AlertType } from "./AlertModal";
import { 
  AlertContext, 
  type AlertContextType, 
  type AlertOptions, 
  type ConfirmOptions 
} from "../../contexts/AlertContext";

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    type: AlertType;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm?: () => void;
    showCancel: boolean;
    resolvePromise?: (value: boolean) => void;
  }>({
    isOpen: false,
    type: "info",
    title: "알림",
    message: "",
    confirmText: "확인",
    cancelText: "취소",
    showCancel: false,
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      isOpen: true,
      type: options.type || "info",
      title: options.title || "알림",
      message: options.message,
      confirmText: options.confirmText || "확인",
      cancelText: options.cancelText || "취소",
      onConfirm: options.onConfirm,
      showCancel: options.showCancel || false,
    });
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        type: "warning",
        title: options.title || "확인",
        message: options.message,
        confirmText: options.confirmText || "확인",
        cancelText: options.cancelText || "취소",
        showCancel: true,
        resolvePromise: resolve,
        onConfirm: () => {
          resolve(true);
          setAlertState(prev => ({ ...prev, isOpen: false }));
        },
      });
    });
  }, []);

  const hideAlert = useCallback(() => {
    if (alertState.resolvePromise) {
      alertState.resolvePromise(false);
    }
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }, [alertState]);

  const handleModalClose = useCallback(() => {
    if (alertState.resolvePromise) {
      alertState.resolvePromise(false);
    }
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }, [alertState]);

  const handleConfirm = useCallback(() => {
    if (alertState.onConfirm) {
      alertState.onConfirm();
    }
    if (alertState.resolvePromise) {
      alertState.resolvePromise(true);
    }
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }, [alertState]);

  // 간편 메서드들
  const alert = useCallback((message: string) => {
    showAlert({ message });
  }, [showAlert]);

  const success = useCallback((message: string, title?: string) => {
    showAlert({ type: "success", title: title || "성공", message });
  }, [showAlert]);

  const error = useCallback((message: string, title?: string) => {
    showAlert({ type: "error", title: title || "오류", message });
  }, [showAlert]);

  const warning = useCallback((message: string, title?: string) => {
    showAlert({ type: "warning", title: title || "경고", message });
  }, [showAlert]);

  const info = useCallback((message: string, title?: string) => {
    showAlert({ type: "info", title: title || "정보", message });
  }, [showAlert]);

  const confirm = useCallback(async (message: string, title?: string): Promise<boolean> => {
    return showConfirm({ message, title });
  }, [showConfirm]);

  const contextValue: AlertContextType = {
    showAlert,
    showConfirm,
    hideAlert,
    alert,
    success,
    error,
    warning,
    info,
    confirm,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={handleModalClose}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={handleConfirm}
        showCancel={alertState.showCancel}
      />
    </AlertContext.Provider>
  );
};