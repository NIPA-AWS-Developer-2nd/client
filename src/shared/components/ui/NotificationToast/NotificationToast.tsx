import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNotificationStore } from '../../../store/notificationStore';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  width: 100%;

  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`;

const ToastItem = styled.div<{ $type: 'success' | 'error' | 'warning' | 'info'; $isExiting?: boolean }>`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border-left: 4px solid ${({ theme, $type }) => {
    switch ($type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.primary;
      default: return theme.colors.text.secondary;
    }
  }};
  animation: ${({ $isExiting }) => $isExiting ? slideOut : slideIn} 0.3s ease-out;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(-4px);
  }
`;

const ToastHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ToastTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.4;
`;

const ToastMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background.primary};
  }
`;

const ToastFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface NotificationToastProps {
  className?: string;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ className }) => {
  const { inAppNotifications, removeNotification } = useNotificationStore();

  if (inAppNotifications.length === 0) {
    return null;
  }

  return (
    <ToastContainer className={className}>
      {inAppNotifications.map((notification) => (
        <ToastItem
          key={notification.id}
          $type={notification.type}
          onClick={() => removeNotification(notification.id)}
        >
          <ToastHeader>
            <ToastTitle>{notification.title}</ToastTitle>
            <CloseButton
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              aria-label="알림 닫기"
            >
              ✕
            </CloseButton>
          </ToastHeader>
          <ToastMessage>{notification.message}</ToastMessage>
          {notification.action && (
            <ToastFooter>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  notification.action?.onClick();
                  removeNotification(notification.id);
                }}
              >
                {notification.action.label}
              </ActionButton>
            </ToastFooter>
          )}
        </ToastItem>
      ))}
    </ToastContainer>
  );
};