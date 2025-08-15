import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  MapPin,
  Calendar,
  // Clock,
  Users,
  Crown,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { MyMeetingDetail } from "../../types";
import { homeApi } from "../../api/homeApi";
import { deviceDetection } from "../../../../shared/utils";
import * as S from "./MyMeetingDetailModal.styles";

interface MyMeetingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
}

export const MyMeetingDetailModal: React.FC<MyMeetingDetailModalProps> = ({
  isOpen,
  onClose,
  meetingId,
}) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [meetingDetail, setMeetingDetail] = useState<MyMeetingDetail | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && meetingId) {
      fetchMeetingDetail();
    }
  }, [isOpen, meetingId, fetchMeetingDetail]);

  const fetchMeetingDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await homeApi.getMyMeetingDetail(meetingId);
      setMeetingDetail(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "모임 정보를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "오후" : "오전";
    const displayHours = hours > 12 ? hours - 12 : hours || 12;

    if (minutes === 0) {
      return `${month}월 ${day}일 (${weekday}) ${period} ${displayHours}시`;
    }
    return `${month}월 ${day}일 (${weekday}) ${period} ${displayHours}시 ${minutes}분`;
  };

  const handleParticipantClick = (participantId: string) => {
    navigate(`/user/${participantId}`);
    onClose();
  };

  const handleChatRoomClick = () => {
    if (meetingDetail?.chatRoomId) {
      // 채팅방 이동 로직 (추후 구현)
      console.log("채팅방으로 이동:", meetingDetail.chatRoomId);
    }
  };

  const handleMapClick = () => {
    if (meetingDetail?.mission?.location) {
      // 네이버 지도 연결 (추후 구현)
      const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(
        meetingDetail.mission.location
      )}`;
      window.open(naverMapUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent $isMobile={isMobile} onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader $isMobile={isMobile}>
          <S.ModalTitle $isMobile={isMobile}>모임 상세 정보</S.ModalTitle>
          <S.CloseButton onClick={onClose}>
            <X size={isMobile ? 20 : 24} />
          </S.CloseButton>
        </S.ModalHeader>

        <S.ModalBody $isMobile={isMobile}>
          {loading && (
            <S.LoadingContainer $isMobile={isMobile}>
              모임 정보를 불러오는 중...
            </S.LoadingContainer>
          )}

          {error && (
            <S.ErrorContainer $isMobile={isMobile}>{error}</S.ErrorContainer>
          )}

          {meetingDetail && (
            <>
              {/* 모임 기본 정보 */}
              <S.Section $isMobile={isMobile}>
                <S.MeetingInfo $isMobile={isMobile}>
                  <S.MeetingTitle $isMobile={isMobile}>
                    {meetingDetail.title}
                  </S.MeetingTitle>
                  {meetingDetail.description && (
                    <S.MeetingDescription $isMobile={isMobile}>
                      {meetingDetail.description}
                    </S.MeetingDescription>
                  )}

                  <S.InfoGrid $isMobile={isMobile}>
                    <S.InfoItem $isMobile={isMobile}>
                      <Calendar size={isMobile ? 16 : 18} />
                      <span>{formatDateTime(meetingDetail.scheduledAt)}</span>
                    </S.InfoItem>

                    <S.InfoItem $isMobile={isMobile}>
                      <MapPin size={isMobile ? 16 : 18} />
                      <span>
                        {meetingDetail.region?.districtName}{" "}
                        {meetingDetail.region?.city}
                      </span>
                    </S.InfoItem>

                    <S.InfoItem $isMobile={isMobile}>
                      <Users size={isMobile ? 16 : 18} />
                      <span>
                        {meetingDetail.currentParticipants}/
                        {meetingDetail.maxParticipants}명
                      </span>
                    </S.InfoItem>
                  </S.InfoGrid>
                </S.MeetingInfo>
              </S.Section>

              {/* 참가자 정보 */}
              <S.Section $isMobile={isMobile}>
                <S.SectionTitle $isMobile={isMobile}>
                  참가자 ({meetingDetail.currentParticipants}명)
                </S.SectionTitle>
                <S.ParticipantGrid $isMobile={isMobile}>
                  {meetingDetail.participants.map((participant, index) => (
                    <S.ParticipantCard
                      key={`${participant.id}-${index}`}
                      $isMobile={isMobile}
                      onClick={() => handleParticipantClick(participant.id)}
                    >
                      <S.ParticipantAvatarWrapper>
                        <S.ParticipantAvatar
                          src={
                            participant.profileImageUrl ||
                            "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"
                          }
                          alt={participant.nickname}
                          $isMobile={isMobile}
                        />
                        {participant.isHost && (
                          <S.CrownIcon $isMobile={isMobile}>
                            <Crown size={isMobile ? 8 : 10} />
                          </S.CrownIcon>
                        )}
                      </S.ParticipantAvatarWrapper>

                      <S.ParticipantInfo $isMobile={isMobile}>
                        <S.ParticipantName $isMobile={isMobile}>
                          {participant.nickname}
                        </S.ParticipantName>
                        <S.ParticipantMeta $isMobile={isMobile}>
                          <span>Lv.{participant.level}</span>
                          {participant.mbti && <span>{participant.mbti}</span>}
                        </S.ParticipantMeta>
                      </S.ParticipantInfo>
                    </S.ParticipantCard>
                  ))}
                </S.ParticipantGrid>
              </S.Section>

              {/* 장소 정보 */}
              {meetingDetail.mission?.location && (
                <S.Section $isMobile={isMobile}>
                  <S.SectionTitle $isMobile={isMobile}>
                    모임 장소
                  </S.SectionTitle>
                  <S.LocationInfo $isMobile={isMobile}>
                    <S.LocationText
                      $isMobile={isMobile}
                      onClick={handleMapClick}
                      style={{ cursor: "pointer" }}
                    >
                      <MapPin size={isMobile ? 14 : 16} />
                      {meetingDetail.mission.location}
                    </S.LocationText>
                  </S.LocationInfo>
                </S.Section>
              )}

              {/* 주의사항 */}
              {meetingDetail.mission?.precautions &&
                meetingDetail.mission.precautions.length > 0 && (
                  <S.Section $isMobile={isMobile}>
                    <S.SectionTitle $isMobile={isMobile}>
                      <AlertTriangle size={isMobile ? 16 : 18} />
                      주의사항
                    </S.SectionTitle>
                    <S.PrecautionsList $isMobile={isMobile}>
                      {meetingDetail.mission.precautions.map(
                        (precaution, index) => (
                          <S.PrecautionItem key={index} $isMobile={isMobile}>
                            • {precaution}
                          </S.PrecautionItem>
                        )
                      )}
                    </S.PrecautionsList>
                  </S.Section>
                )}

              {/* 단체 채팅방 */}
              <S.Section $isMobile={isMobile}>
                <S.ChatButton
                  $isMobile={isMobile}
                  onClick={handleChatRoomClick}
                >
                  <MessageCircle size={isMobile ? 16 : 18} />
                  단체 채팅방 입장하기
                </S.ChatButton>
              </S.Section>
            </>
          )}
        </S.ModalBody>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};
