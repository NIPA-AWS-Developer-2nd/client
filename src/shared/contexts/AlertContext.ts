import { createContext } from "react";
import type { AlertType } from "../components/common/AlertModal";

export interface AlertOptions {
  type?: AlertType;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  hideAlert: () => void;
  // 간편 메서드들
  alert: (message: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  confirm: (message: string, title?: string) => Promise<boolean>;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);