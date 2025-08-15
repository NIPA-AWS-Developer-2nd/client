import React, { useState } from "react";
import {
  X,
  // Zap,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { deviceDetection } from "../../../../shared/utils";
import { useAlert } from "../../../../shared/components/common";
// import { PointBalance } from "../../../point/components/PointBalance";
import { meetingApi } from "../../api/meetingApi";
import { pointApi } from "../../../point/api/pointApi";
// import AITicketIcon from "../../../../assets/images/ai-ticket.svg";
import * as S from "./MeetingJoinModal.styles";

interface MeetingJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingData: {
    id: string;
    title: string;
    requiredPoints: number;
    currentParticipants: number;
    maxParticipants: number;
    scheduledAt: string;
    isHost: boolean;
  };
  onSuccess?: () => void;
}

export const MeetingJoinModal: React.FC<MeetingJoinModalProps> = ({
  isOpen,
  onClose,
  meetingData,
  onSuccess,
}) => {
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [loading, setLoading] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(0);
  const { success, error } = useAlert();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 모달이 열릴 때 현재 포인트 가져오기
  React.useEffect(() => {
    if (isOpen) {
      fetchCurrentPoints();
    }
  }, [isOpen]);

  const fetchCurrentPoints = async () => {
    try {
      console.log("🔍 포인트 조회 시작...");
      const balance = await pointApi.getPointBalance();
      console.log("✅ 포인트 조회 성공:", balance);
      setCurrentPoints(balance.points);
    } catch (err) {
      console.error("❌ 포인트 조회 실패:", err);
      console.log("기본값 0P 설정");
      setCurrentPoints(0);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "날짜 정보 없음";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "날짜 정보 없음";

    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric", 
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleJoin = async () => {
    console.log("handleJoin 함수 호출됨", {
      meetingId: meetingData.id,
      currentPoints,
      requiredPoints: meetingData.requiredPoints,
    });

    // 포인트 부족 검사
    if (currentPoints < meetingData.requiredPoints) {
      error(`포인트가 부족합니다.`);
      return;
    }

    try {
      setLoading(true);
      console.log("API 호출 시작");
      const response = await meetingApi.joinMeeting(meetingData.id);
      console.log("API 응답:", response);

      if (response.success) {
        success(response.message, "모임 참여 완료");
        onClose();
        onSuccess?.();
      } else {
        error(response.message || "모임 참여에 실패했습니다.");
      }
    } catch (err: unknown) {
      console.error("참여하기 에러:", err);
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      error(errorMessage || "모임 참여에 실패했습니다.");
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
          <S.Title $isMobile={isMobile}>모임 참여</S.Title>
          <S.CloseButton onClick={onClose}>
            <X size={20} />
          </S.CloseButton>
        </S.Header>

        {/* 모임 정보 */}
        <S.Content>
          <S.MeetingInfo $isMobile={isMobile}>
            <S.MeetingTitle $isMobile={isMobile}>
              {meetingData.title}
            </S.MeetingTitle>

            <S.InfoGrid>
              <S.InfoItem>
                <Calendar size={16} />
                <span>{formatDate(meetingData.scheduledAt)}</span>
              </S.InfoItem>
              <S.InfoItem>
                <Users size={16} />
                <span>
                  {meetingData.currentParticipants}/
                  {meetingData.maxParticipants}명
                </span>
              </S.InfoItem>
            </S.InfoGrid>
          </S.MeetingInfo>

          {/* 포인트 정보 */}
          <S.PaymentSection $isMobile={isMobile}>
            <S.SectionTitle $isMobile={isMobile}>참여비 정보</S.SectionTitle>

            <S.PaymentInfo>
              <S.PaymentItem>
                <S.PaymentLabel>필요한 포인트</S.PaymentLabel>
                <S.PaymentValue $color="error">
                  -{meetingData.requiredPoints.toLocaleString()}P
                </S.PaymentValue>
              </S.PaymentItem>

              <S.Divider />

              <S.CurrentBalance>
                <S.PaymentLabel>현재 보유 포인트</S.PaymentLabel>
                <S.PaymentValue
                  $color={
                    currentPoints >= meetingData.requiredPoints
                      ? "success"
                      : "error"
                  }
                >
                  {currentPoints.toLocaleString()}P
                </S.PaymentValue>
              </S.CurrentBalance>
            </S.PaymentInfo>

            {/* 안내 메시지 */}
            <S.InfoBox $isMobile={isMobile}>
              <AlertTriangle size={16} />
              <S.InfoText $isMobile={isMobile}>
                참여비는 보증금으로 차감되며, 모임 완료 시 돌려받습니다.
              </S.InfoText>
            </S.InfoBox>

            <S.BenefitsList $isMobile={isMobile}>
              <S.BenefitItem>
                <CheckCircle size={14} />
                <span>
                  모임 완료 시 총{" "}
                  {(meetingData.requiredPoints * 2).toLocaleString()}P 획득
                </span>
              </S.BenefitItem>
              <S.BenefitItem>
                <AlertTriangle size={14} />
                <span>모집 마감 6시간 전까지 취소 시 전액 환불</span>
              </S.BenefitItem>
              <S.BenefitItem>
                <AlertTriangle size={14} />
                <span>마감 6시간 이내 취소 시 50% 환불</span>
              </S.BenefitItem>
            </S.BenefitsList>
          </S.PaymentSection>
        </S.Content>

        {/* 버튼 */}
        <S.ButtonContainer>
          <S.CancelButton onClick={onClose} disabled={loading}>
            취소
          </S.CancelButton>
          <S.JoinButton onClick={handleJoin} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spinning" />
                참여 중...
              </>
            ) : (
              `${meetingData.requiredPoints.toLocaleString()}P로 참여하기`
            )}
          </S.JoinButton>
        </S.ButtonContainer>
      </S.Modal>
    </S.Overlay>
  );
};
