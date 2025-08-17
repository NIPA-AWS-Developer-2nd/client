import React from 'react';
import styled from 'styled-components';
import { useNotifications } from '../../../../shared/hooks/useNotifications';
import { useNotificationStore } from '../../../../shared/store/notificationStore';

const Banner = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  color: ${({ theme }) => theme.colors.background.primary};
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin: 0 0 4px 0;
  color: ${({ theme }) => theme.colors.background.primary};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
  opacity: 0.9;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 80px;

  ${({ $variant, theme }) => $variant === 'primary' ? `
    background: ${theme.colors.background.primary};
    color: ${theme.colors.primary};
    
    &:hover {
      background: ${theme.colors.background.secondary};
      transform: translateY(-1px);
    }
  ` : `
    background: transparent;
    color: ${theme.colors.background.primary};
    border: 1px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid ${({ theme }) => theme.colors.background.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface NotificationPermissionBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export const NotificationPermissionBanner: React.FC<NotificationPermissionBannerProps> = ({
  onDismiss,
  className,
}) => {
  const {
    permissionState,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    clearError,
  } = useNotifications();

  const { addNotification } = useNotificationStore();

  if (!permissionState.isSupported) {
    return null;
  }

  if (permissionState.permission === 'granted' && isSubscribed) {
    return null;
  }

  if (permissionState.permission === 'denied') {
    return (
      <Banner className={className}>
        <Content>
          <Title>알림이 차단되었습니다</Title>
          <Description>
            브라우저 설정에서 알림을 허용해주세요. 중요한 미팅 알림을 놓칠 수 있습니다.
          </Description>
        </Content>
        <ButtonGroup>
          {onDismiss && (
            <Button $variant="secondary" onClick={onDismiss}>
              나중에
            </Button>
          )}
        </ButtonGroup>
      </Banner>
    );
  }

  const handleEnableNotifications = async () => {
    try {
      clearError();
      const success = await subscribe();
      
      if (success) {
        addNotification({
          title: '알림이 활성화되었습니다',
          message: '이제 중요한 알림을 받아보실 수 있습니다.',
          type: 'success',
        });
        onDismiss?.();
      }
    } catch (err) {
      addNotification({
        title: '알림 활성화 실패',
        message: error || '알림 설정에 실패했습니다. 다시 시도해주세요.',
        type: 'error',
      });
    }
  };

  const getButtonText = () => {
    if (isLoading) return '';
    if (permissionState.permission === 'default') return '알림 허용';
    if (permissionState.permission === 'granted' && !isSubscribed) return '알림 구독';
    return '알림 활성화';
  };

  return (
    <Banner className={className}>
      <Content>
        <Title>알림을 허용해보세요</Title>
        <Description>
          중요한 미팅 알림과 미션 업데이트를 놓치지 마세요. 언제든 설정에서 변경할 수 있습니다.
        </Description>
        {error && (
          <Description style={{ color: '#ffcccb', marginTop: '4px' }}>
            {error}
          </Description>
        )}
      </Content>
      <ButtonGroup>
        {onDismiss && (
          <Button $variant="secondary" onClick={onDismiss} disabled={isLoading}>
            나중에
          </Button>
        )}
        <Button
          $variant="primary"
          onClick={handleEnableNotifications}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : getButtonText()}
        </Button>
      </ButtonGroup>
    </Banner>
  );
};