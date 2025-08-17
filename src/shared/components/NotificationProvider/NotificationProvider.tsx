import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationPermissionModal } from '../ui/NotificationPermissionModal';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const {
    showPermissionModal,
    handlePermissionAccept,
    handlePermissionDecline
  } = useNotifications();

  return (
    <>
      {children}
      <NotificationPermissionModal
        isOpen={showPermissionModal}
        onClose={handlePermissionDecline}
        onAccept={handlePermissionAccept}
        onDecline={handlePermissionDecline}
      />
    </>
  );
};