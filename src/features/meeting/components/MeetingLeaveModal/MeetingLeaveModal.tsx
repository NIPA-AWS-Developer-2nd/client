import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle,
  Clock,
  Loader2,
  Info
} from 'lucide-react';
import { deviceDetection } from '../../../../shared/utils';
import { useAlert } from '../../../../shared/components/common';
import { meetingApi } from '../../api/meetingApi';
import * as S from './MeetingLeaveModal.styles';

interface MeetingLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingData: {
    id: string;
    title: string;
    paidAmount: number;
    recruitUntil: string;
  };
  onSuccess?: () => void;
}

export const MeetingLeaveModal: React.FC<MeetingLeaveModalProps> = ({
  isOpen,
  onClose,
  meetingData,
  onSuccess,
}) => {
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [loading, setLoading] = useState(false);
  const { success, error } = useAlert();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRefundInfo = () => {
    const now = new Date();
    const recruitUntil = new Date(meetingData.recruitUntil);
    const timeDiff = recruitUntil.getTime() - now.getTime();
    const hoursUntilDeadline = timeDiff / (1000 * 60 * 60);

    if (hoursUntilDeadline > 12) {
      return {
        refundRate: 100,
        refundAmount: meetingData.paidAmount,
        penaltyAmount: 0,
        timeCategory: '12시간 전',
        description: '모집 마감 12시간 전까지는 전액 환불됩니다.',
        color: 'success' as const,
      };
    } else if (hoursUntilDeadline > 1) {
      const refundAmount = Math.floor(meetingData.paidAmount * 0.5);
      return {
        refundRate: 50,
        refundAmount,
        penaltyAmount: meetingData.paidAmount - refundAmount,
        timeCategory: '1~12시간 전',
        description: '모집 마감 1~12시간 전에는 50%만 환불됩니다.',
        color: 'warning' as const,
      };
    } else {
      return {
        refundRate: 0,
        refundAmount: 0,
        penaltyAmount: meetingData.paidAmount,
        timeCategory: '1시간 전 이후',
        description: '모집 마감 1시간 전 이후에는 환불되지 않습니다.',
        color: 'error' as const,
      };
    }
  };

  const refundInfo = getRefundInfo();

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

  const handleLeave = async () => {
    try {
      setLoading(true);
      const response = await meetingApi.leaveMeeting(meetingData.id);
      
      if (response.success) {
        success(response.message, '모임 탈퇴 완료');
        onClose();
        onSuccess?.();
      } else {
        error(response.message || '모임 탈퇴에 실패했습니다.');
      }
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      error(errorMessage || '모임 탈퇴에 실패했습니다.');
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
          <S.Title $isMobile={isMobile}>모임 탈퇴</S.Title>
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
            
            <S.TimeInfo>
              <Clock size={16} />
              <span>{formatTimeUntilDeadline()}</span>
            </S.TimeInfo>
          </S.MeetingInfo>

          {/* 환불 정보 */}
          <S.RefundSection $isMobile={isMobile}>
            <S.SectionTitle $isMobile={isMobile}>
              환불 정책 ({refundInfo.timeCategory})
            </S.SectionTitle>
            
            <S.RefundInfo $color={refundInfo.color}>
              <S.RefundItem>
                <S.RefundLabel>결제한 포인트</S.RefundLabel>
                <S.RefundValue>
                  {meetingData.paidAmount.toLocaleString()}P
                </S.RefundValue>
              </S.RefundItem>
              
              {refundInfo.refundAmount > 0 && (
                <S.RefundItem>
                  <S.RefundLabel>환불 포인트 ({refundInfo.refundRate}%)</S.RefundLabel>
                  <S.RefundValue $positive>
                    +{refundInfo.refundAmount.toLocaleString()}P
                  </S.RefundValue>
                </S.RefundItem>
              )}
              
              {refundInfo.penaltyAmount > 0 && (
                <S.RefundItem>
                  <S.RefundLabel>차감 포인트</S.RefundLabel>
                  <S.RefundValue $negative>
                    -{refundInfo.penaltyAmount.toLocaleString()}P
                  </S.RefundValue>
                </S.RefundItem>
              )}
            </S.RefundInfo>

            <S.PolicyBox $color={refundInfo.color} $isMobile={isMobile}>
              <Info size={16} />
              <S.PolicyText $isMobile={isMobile}>
                {refundInfo.description}
              </S.PolicyText>
            </S.PolicyBox>
          </S.RefundSection>

          {/* 경고 메시지 */}
          <S.WarningBox $isMobile={isMobile}>
            <AlertTriangle size={16} />
            <S.WarningText $isMobile={isMobile}>
              탈퇴 후에는 다시 참여할 수 없으며, 환불 정책에 따라 포인트가 처리됩니다.
            </S.WarningText>
          </S.WarningBox>
        </S.Content>

        {/* 버튼 */}
        <S.ButtonContainer>
          <S.CancelButton onClick={onClose} disabled={loading}>
            취소
          </S.CancelButton>
          <S.LeaveButton onClick={handleLeave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spinning" />
                탈퇴 중...
              </>
            ) : (
              '모임 탈퇴'
            )}
          </S.LeaveButton>
        </S.ButtonContainer>
      </S.Modal>
    </S.Overlay>
  );
};