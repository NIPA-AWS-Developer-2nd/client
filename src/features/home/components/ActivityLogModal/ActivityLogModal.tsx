import React from 'react';
import { X } from 'lucide-react';
import type { ActivityLog } from '../../types/home.types';
import { deviceDetection } from '../../../../shared/utils';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  LogItem,
  LogIcon,
  LogContent,
  LogText,
  LogTime,
  EmptyMessage,
} from './ActivityLogModal.styles';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityLogs: ActivityLog[];
}

export const ActivityLogModal: React.FC<ActivityLogModalProps> = ({
  isOpen,
  onClose,
  activityLogs,
}) => {
  const isMobile = deviceDetection.isMobile();

  if (!isOpen) return null;

  const getLogIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'meeting_joined':
        return '👥';
      case 'meeting_created':
        return '✨';
      case 'meeting_started':
        return '🚀';
      case 'meeting_liked':
        return '❤️';
      case 'photo_verification_submitted':
        return '📸';
      case 'photo_verification_approved':
        return '✅';
      case 'photo_verification_rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  const getLogMessage = (log: ActivityLog) => {
    switch (log.type) {
      case 'meeting_joined':
        return `${log.meeting?.title || '모임'}에 참여했습니다`;
      case 'meeting_created':
        return `${log.meeting?.title || '모임'}을 생성했습니다`;
      case 'meeting_started':
        return `${log.meeting?.title || '모임'}이 시작되었습니다`;
      case 'meeting_liked':
        return `${log.meeting?.title || '모임'}을 좋아합니다`;
      case 'photo_verification_submitted':
        return `사진 인증을 제출했습니다`;
      case 'photo_verification_approved':
        return `사진 인증이 승인되었습니다`;
      case 'photo_verification_rejected':
        return `사진 인증이 거부되었습니다`;
      default:
        return '활동이 기록되었습니다';
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer $isMobile={isMobile} onClick={(e) => e.stopPropagation()}>
        <ModalHeader $isMobile={isMobile}>
          <ModalTitle $isMobile={isMobile}>최근 활동</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>
        
        <ModalContent $isMobile={isMobile}>
          {activityLogs.length === 0 ? (
            <EmptyMessage $isMobile={isMobile}>
              아직 활동 기록이 없습니다
            </EmptyMessage>
          ) : (
            activityLogs.map((log) => (
              <LogItem key={log.id} $isMobile={isMobile}>
                <LogIcon>{getLogIcon(log.type)}</LogIcon>
                <LogContent>
                  <LogText $isMobile={isMobile}>{getLogMessage(log)}</LogText>
                  <LogTime $isMobile={isMobile}>
                    {new Date(log.createdAt).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </LogTime>
                </LogContent>
              </LogItem>
            ))
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};