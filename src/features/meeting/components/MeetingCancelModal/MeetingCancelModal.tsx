import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle,
  Clock,
  Loader2,
  Users,
  MessageSquare
} from 'lucide-react';
import { deviceDetection } from '../../../../shared/utils';
import { useAlert } from '../../../../shared/components/common';
import { meetingApi } from '../../api/meetingApi';
import * as S from './MeetingCancelModal.styles';

interface MeetingCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingData: {
    id: string;
    title: string;
    currentParticipants: number;
    recruitUntil: string;
    totalPaidPoints: number;
  };
  onSuccess?: () => void;
}

export const MeetingCancelModal: React.FC<MeetingCancelModalProps> = ({
  isOpen,
  onClose,
  meetingData,
  onSuccess,
}) => {
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const { success, error } = useAlert();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPenaltyInfo = () => {
    const now = new Date();
    const recruitUntil = new Date(meetingData.recruitUntil);
    const timeDiff = recruitUntil.getTime() - now.getTime();
    const hoursUntilDeadline = timeDiff / (1000 * 60 * 60);

    if (hoursUntilDeadline > 1) {
      return {
        hasHostPenalty: false,
        penaltyAmount: 0,
        refundToParticipants: meetingData.totalPaidPoints,
        timeCategory: hoursUntilDeadline > 12 ? '12시간 전' : '1시간 전',
        description: '참여자들에게 전액 환불되며, 호스트 패널티는 없습니다.',
        color: 'success' as const,
      };
    } else {
      return {
        hasHostPenalty: true,
        penaltyAmount: meetingData.totalPaidPoints,
        refundToParticipants: meetingData.totalPaidPoints,
        timeCategory: '1시간 전 이후',
        description: '참여자들에게 전액 환불되지만, 호스트에게 환불액만큼 패널티가 부과됩니다.',
        color: 'error' as const,
      };
    }
  };

  const penaltyInfo = getPenaltyInfo();

  const formatTimeUntilDeadline = () => {
    const now = new Date();
    const recruitUntil = new Date(meetingData.recruitUntil);
    const timeDiff = recruitUntil.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      return '모집 마감됨';
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분 후 마감`;
    } else {
      return `${minutes}분 후 마감`;
    }
  };

  const handleCancel = async () => {
    if (!reason.trim()) {
      error('취소 사유를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      const response = await meetingApi.cancelMeeting(meetingData.id, reason.trim());
      
      if (response.success) {
        success(response.message, '모임 취소 완료');
        onClose();
        onSuccess?.();
      } else {
        error(response.message || '모임 취소에 실패했습니다.');
      }
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      error(errorMessage || '모임 취소에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal $isMobile={isMobile} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <S.Header>
          <S.Title $isMobile={isMobile}>모임 취소</S.Title>
          <S.CloseButton onClick={onClose}>
            <X size={20} />
          </S.CloseButton>
        </S.Header>

        {/* 컨텐츠 */}
        <S.Content>
          <S.MeetingInfo $isMobile={isMobile}>
            <S.MeetingTitle $isMobile={isMobile}>
              {meetingData.title}
            </S.MeetingTitle>
            
            <S.InfoGrid>
              <S.InfoItem>
                <Clock size={16} />
                <span>{formatTimeUntilDeadline()}</span>
              </S.InfoItem>
              <S.InfoItem>
                <Users size={16} />
                <span>{meetingData.currentParticipants}명 참여 중</span>
              </S.InfoItem>
            </S.InfoGrid>
          </S.MeetingInfo>

          {/* 취소 사유 입력 */}
          <S.ReasonSection $isMobile={isMobile}>
            <S.SectionTitle $isMobile={isMobile}>
              <MessageSquare size={16} />
              취소 사유
            </S.SectionTitle>
            <S.ReasonInput
              $isMobile={isMobile}
              placeholder="참여자들에게 전달할 취소 사유를 입력해주세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={200}
            />
            <S.CharacterCount $isMobile={isMobile}>
              {reason.length}/200
            </S.CharacterCount>
          </S.ReasonSection>

          {/* 환불/패널티 정보 */}
          <S.PolicySection $isMobile={isMobile}>
            <S.SectionTitle $isMobile={isMobile}>
              환불 및 패널티 정책 ({penaltyInfo.timeCategory})
            </S.SectionTitle>
            
            <S.PolicyInfo $color={penaltyInfo.color}>
              <S.PolicyItem>
                <S.PolicyLabel>참여자 환불</S.PolicyLabel>
                <S.PolicyValue $positive>
                  +{penaltyInfo.refundToParticipants.toLocaleString()}P
                </S.PolicyValue>
              </S.PolicyItem>
              
              {penaltyInfo.hasHostPenalty && (
                <S.PolicyItem>
                  <S.PolicyLabel>호스트 패널티</S.PolicyLabel>
                  <S.PolicyValue $negative>
                    -{penaltyInfo.penaltyAmount.toLocaleString()}P
                  </S.PolicyValue>
                </S.PolicyItem>
              )}
            </S.PolicyInfo>

            <S.PolicyBox $color={penaltyInfo.color} $isMobile={isMobile}>
              <AlertTriangle size={16} />
              <S.PolicyText $isMobile={isMobile}>
                {penaltyInfo.description}
              </S.PolicyText>
            </S.PolicyBox>
          </S.PolicySection>

          {/* 최종 경고 */}
          <S.FinalWarningBox $isMobile={isMobile}>
            <AlertTriangle size={16} />
            <S.FinalWarningText $isMobile={isMobile}>
              모임을 취소하면 되돌릴 수 없습니다. 참여자들에게 알림이 전송되며, 정책에 따라 포인트가 처리됩니다.
            </S.FinalWarningText>
          </S.FinalWarningBox>
        </S.Content>

        {/* 버튼 */}
        <S.ButtonContainer>
          <S.BackButton onClick={onClose} disabled={loading}>
            돌아가기
          </S.BackButton>
          <S.CancelButton 
            onClick={handleCancel} 
            disabled={loading || !reason.trim()}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spinning" />
                취소 중...
              </>
            ) : (
              '모임 취소'
            )}
          </S.CancelButton>
        </S.ButtonContainer>
      </S.Modal>
    </S.Overlay>
  );
};