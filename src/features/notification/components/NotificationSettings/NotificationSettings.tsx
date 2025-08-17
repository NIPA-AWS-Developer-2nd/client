import React from 'react';
import styled from 'styled-components';
import { useNotifications } from '../../../../shared/hooks/useNotifications';
import { useNotificationStore } from '../../../../shared/store/notificationStore';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 24px;
  margin: 16px;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 20px 0;
`;

const Section = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.label`
  flex: 1;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const SettingTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const SettingDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const Toggle = styled.input`
  appearance: none;
  width: 48px;
  height: 24px;
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:checked {
    background: ${({ theme }) => theme.colors.primary};
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.background.primary};
    top: 2px;
    left: 2px;
    transition: transform 0.2s ease;
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  &:checked::before {
    transform: translateX(24px);
  }
`;

const StatusBadge = styled.div<{ $status: 'granted' | 'denied' | 'default' | 'subscribed' }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'granted':
      case 'subscribed':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'denied':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      default:
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
    }
  }}
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${({ $variant, theme }) => $variant === 'primary' ? `
    background: ${theme.colors.primary};
    color: ${theme.colors.background.primary};
    
    &:hover {
      background: ${theme.colors.primaryDark};
      transform: translateY(-1px);
    }
  ` : `
    background: transparent;
    color: ${theme.colors.text.secondary};
    border: 1px solid ${theme.colors.border.primary};
    
    &:hover {
      background: ${theme.colors.background.tertiary};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
`;

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className }) => {
  const { 
    permissionState, 
    isSubscribed, 
    isLoading, 
    subscribe, 
    unsubscribe,
    requestPermission 
  } = useNotifications();
  
  const { settings, updateSettings, addNotification } = useNotificationStore();

  const handleToggleSetting = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleSubscribe = async () => {
    try {
      const success = await subscribe();
      if (success) {
        addNotification({
          title: '알림 구독 완료',
          message: '푸시 알림을 받을 준비가 되었습니다.',
          type: 'success',
        });
      }
    } catch (error) {
      addNotification({
        title: '구독 실패',
        message: '알림 구독에 실패했습니다. 다시 시도해주세요.',
        type: 'error',
      });
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const success = await unsubscribe();
      if (success) {
        addNotification({
          title: '알림 구독 해제',
          message: '푸시 알림 구독이 해제되었습니다.',
          type: 'info',
        });
      }
    } catch (error) {
      addNotification({
        title: '구독 해제 실패',
        message: '구독 해제에 실패했습니다. 다시 시도해주세요.',
        type: 'error',
      });
    }
  };

  const getPermissionStatus = () => {
    if (permissionState.permission === 'granted' && isSubscribed) {
      return { status: 'subscribed' as const, text: '구독 중' };
    }
    if (permissionState.permission === 'granted') {
      return { status: 'granted' as const, text: '허용됨' };
    }
    if (permissionState.permission === 'denied') {
      return { status: 'denied' as const, text: '차단됨' };
    }
    return { status: 'default' as const, text: '대기 중' };
  };

  const permissionStatus = getPermissionStatus();

  return (
    <Container className={className}>
      <Title>알림 설정</Title>

      <Section>
        <SectionTitle>푸시 알림 상태</SectionTitle>
        <SettingItem>
          <SettingLabel>
            <SettingTitle>알림 권한</SettingTitle>
            <SettingDescription>
              브라우저에서 알림을 받기 위한 권한 상태입니다.
            </SettingDescription>
          </SettingLabel>
          <StatusBadge $status={permissionStatus.status}>
            {permissionStatus.text}
          </StatusBadge>
        </SettingItem>

        {permissionState.permission === 'granted' && (
          <ButtonGroup>
            {!isSubscribed ? (
              <Button 
                $variant="primary" 
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                알림 구독하기
              </Button>
            ) : (
              <Button 
                $variant="secondary" 
                onClick={handleUnsubscribe}
                disabled={isLoading}
              >
                구독 해제
              </Button>
            )}
          </ButtonGroup>
        )}

        {permissionState.permission === 'default' && (
          <ButtonGroup>
            <Button 
              $variant="primary" 
              onClick={requestPermission}
              disabled={isLoading}
            >
              알림 권한 요청
            </Button>
          </ButtonGroup>
        )}
      </Section>

      <Section>
        <SectionTitle>알림 유형</SectionTitle>
        
        <SettingItem>
          <SettingLabel htmlFor="meetingReminders">
            <SettingTitle>미팅 알림</SettingTitle>
            <SettingDescription>
              예정된 미팅의 시작 전 알림을 받습니다.
            </SettingDescription>
          </SettingLabel>
          <Toggle
            id="meetingReminders"
            type="checkbox"
            checked={settings.meetingReminders}
            onChange={() => handleToggleSetting('meetingReminders')}
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel htmlFor="missionUpdates">
            <SettingTitle>미션 업데이트</SettingTitle>
            <SettingDescription>
              미션 완료, 새로운 미션 등의 알림을 받습니다.
            </SettingDescription>
          </SettingLabel>
          <Toggle
            id="missionUpdates"
            type="checkbox"
            checked={settings.missionUpdates}
            onChange={() => handleToggleSetting('missionUpdates')}
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel htmlFor="systemNotices">
            <SettingTitle>시스템 공지</SettingTitle>
            <SettingDescription>
              앱 업데이트, 점검 등의 시스템 공지를 받습니다.
            </SettingDescription>
          </SettingLabel>
          <Toggle
            id="systemNotices"
            type="checkbox"
            checked={settings.systemNotices}
            onChange={() => handleToggleSetting('systemNotices')}
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel htmlFor="friendRequests">
            <SettingTitle>친구 요청</SettingTitle>
            <SettingDescription>
              새로운 친구 요청 및 수락 알림을 받습니다.
            </SettingDescription>
          </SettingLabel>
          <Toggle
            id="friendRequests"
            type="checkbox"
            checked={settings.friendRequests}
            onChange={() => handleToggleSetting('friendRequests')}
          />
        </SettingItem>
      </Section>

      <Section>
        <SectionTitle>알림 방식</SectionTitle>
        
        <SettingItem>
          <SettingLabel htmlFor="soundEnabled">
            <SettingTitle>소리 알림</SettingTitle>
            <SettingDescription>
              알림 도착 시 소리로 알려드립니다.
            </SettingDescription>
          </SettingLabel>
          <Toggle
            id="soundEnabled"
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={() => handleToggleSetting('soundEnabled')}
          />
        </SettingItem>

        <SettingItem>
          <SettingLabel htmlFor="vibrationEnabled">
            <SettingTitle>진동 알림</SettingTitle>
            <SettingDescription>
              모바일에서 알림 도착 시 진동으로 알려드립니다.
            </SettingDescription>
          </SettingLabel>
          <Toggle
            id="vibrationEnabled"
            type="checkbox"
            checked={settings.vibrationEnabled}
            onChange={() => handleToggleSetting('vibrationEnabled')}
          />
        </SettingItem>
      </Section>
    </Container>
  );
};