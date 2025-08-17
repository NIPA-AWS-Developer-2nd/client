import React from 'react';
import styled from 'styled-components';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className }) => {
  const {
    permissionState,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    setupAutoSubscription,
    clearError,
  } = useNotifications();

  const handleSubscribe = async () => {
    clearError();
    const success = await subscribe();
    if (success) {
      console.log('구독 완료!');
    }
  };

  const handleUnsubscribe = async () => {
    clearError();
    const success = await unsubscribe();
    if (success) {
      console.log('구독 해제 완료!');
    }
  };

  const handleAutoSetup = async () => {
    clearError();
    const success = await setupAutoSubscription();
    if (success) {
      console.log('자동 구독 완료!');
    }
  };

  if (!permissionState.isSupported) {
    return (
      <Container className={className}>
        <Title>알림 설정</Title>
        <Message>이 브라우저는 알림을 지원하지 않습니다.</Message>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <Title>푸시 알림 설정</Title>
      
      <StatusSection>
        <StatusItem>
          <Label>알림 권한:</Label>
          <Status $type={permissionState.permission}>
            {permissionState.permission === 'granted' && '✅ 허용됨'}
            {permissionState.permission === 'denied' && '❌ 거부됨'}
            {permissionState.permission === 'default' && '⏳ 대기중'}
          </Status>
        </StatusItem>
        
        <StatusItem>
          <Label>구독 상태:</Label>
          <Status $type={isSubscribed ? 'granted' : 'denied'}>
            {isSubscribed ? '🔔 구독중' : '🔕 미구독'}
          </Status>
        </StatusItem>
      </StatusSection>

      {error && (
        <ErrorMessage>
          {error}
          <CloseButton onClick={clearError}>×</CloseButton>
        </ErrorMessage>
      )}

      <ButtonSection>
        {!isSubscribed && permissionState.permission !== 'denied' && (
          <>
            <ActionButton onClick={handleAutoSetup} disabled={isLoading}>
              {isLoading ? '설정 중...' : '🚀 자동 설정'}
            </ActionButton>
            <ActionButton onClick={handleSubscribe} disabled={isLoading} $variant="secondary">
              {isLoading ? '구독 중...' : '🔔 구독하기'}
            </ActionButton>
          </>
        )}
        
        {isSubscribed && (
          <ActionButton onClick={handleUnsubscribe} disabled={isLoading} $variant="danger">
            {isLoading ? '해제 중...' : '🔕 구독 해제'}
          </ActionButton>
        )}
        
        {permissionState.permission === 'denied' && (
          <Message>
            알림이 차단되었습니다. 브라우저 설정에서 이 사이트의 알림을 허용해주세요.
          </Message>
        )}
      </ButtonSection>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background};
`;

const Title = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatusSection = styled.div`
  margin-bottom: 16px;
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Label = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Status = styled.span<{ $type: string }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $type, theme }) => {
    switch ($type) {
      case 'granted': return theme.colors.success;
      case 'denied': return theme.colors.error;
      default: return theme.colors.warning;
    }
  }};
`;

const ErrorMessage = styled.div`
  position: relative;
  padding: 12px;
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.error}15;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'danger': return theme.colors.error;
      case 'secondary': return theme.colors.background;
      default: return theme.colors.primary;
    }
  }};
  
  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary': return theme.colors.primary;
      default: return 'white';
    }
  }};
  
  border: ${({ $variant, theme }) => 
    $variant === 'secondary' ? `1px solid ${theme.colors.primary}` : 'none'
  };

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Message = styled.p`
  margin: 8px 0 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 1.4;
`;