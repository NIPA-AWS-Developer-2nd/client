import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Crown,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deviceDetection } from "../../../../shared/utils";
import { useHomeStore } from "../../../../shared/store/homeStore";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useLocationVerification } from "../../../../shared/hooks";
import { useAlert } from "../../../../shared/hooks/useAlert";
import * as S from "./MyMeetingDropdown.styles";

interface MyMeetingDropdownProps {
  meetingId: string;
  isExpanded: boolean;
}

export const MyMeetingDropdown: React.FC<MyMeetingDropdownProps> = ({
  meetingId,
  isExpanded,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isVerified: isLocationVerified, isLoading: isLocationLoading } = useLocationVerification();
  const { warning } = useAlert();
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  
  const {
    getMeetingDetail,
    loadingMeetingIds,
    meetingErrors
  } = useHomeStore();

  const meetingDetail = getMeetingDetail(meetingId);
  const isLoading = loadingMeetingIds.has(meetingId);
  const error = meetingErrors.get(meetingId);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    // 본인 프로필은 클릭하지 않도록 방지
    if (participantId === user?.id) return;
    
    // 로딩 중이면 아무 작업도 하지 않음
    if (isLocationLoading) {
      return;
    }
    
    // 지역 인증 체크
    if (!isLocationVerified) {
      warning("지역 인증이 필요합니다.", "사용자 프로필");
      return;
    }
    
    navigate(`/user/${participantId}`);
  };

  const handleChatRoomClick = () => {
    console.log('🔍 모임 채널 클릭 - 상태 체크:', {
      isLocationLoading,
      isLocationVerified,
      meetingId
    });
    
    // 로딩 중이면 아무 작업도 하지 않음
    if (isLocationLoading) {
      console.log('⏳ 위치 인증 로딩 중이므로 대기');
      return;
    }
    
    // 지역 인증 체크
    if (!isLocationVerified) {
      console.log('❌ 지역 인증이 안됨 - 경고 표시');
      warning("지역 인증이 필요합니다.", "모임 채널");
      return;
    }
    
    console.log('✅ 지역 인증 통과 - 모임 채널로 이동');
    // 모임 채널로 이동
    navigate(`/meetings/${meetingId}/channel`);
  };

  const handleMapClick = () => {
    if (meetingDetail?.mission?.location) {
      const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(
        meetingDetail.mission.location
      )}`;
      window.open(naverMapUrl, "_blank");
    }
  };

  if (!isExpanded) return null;

  return (
    <S.DropdownContainer $isExpanded={isExpanded} $isMobile={isMobile}>
      {isLoading && (
        <S.LoadingContainer $isMobile={isMobile}>
          모임 정보를 불러오는 중...
        </S.LoadingContainer>
      )}

      {error && (
        <S.ErrorContainer $isMobile={isMobile}>{error}</S.ErrorContainer>
      )}

      {meetingDetail && !isLoading && (
        <>
          {/* 모임 기본 정보 */}
          <S.Section $isMobile={isMobile}>
            <S.InfoGrid $isMobile={isMobile}>
              <S.InfoItem $isMobile={isMobile}>
                <Calendar size={isMobile ? 14 : 16} />
                <span>{formatDateTime(meetingDetail.scheduledAt)}</span>
              </S.InfoItem>

              <S.InfoItem $isMobile={isMobile}>
                <MapPin size={isMobile ? 14 : 16} />
                <span>
                  {meetingDetail.region?.districtName}{" "}
                  {meetingDetail.region?.city}
                </span>
              </S.InfoItem>

              <S.InfoItem $isMobile={isMobile}>
                <Users size={isMobile ? 14 : 16} />
                <span>
                  {meetingDetail.currentParticipants}/
                  {meetingDetail.maxParticipants}명
                </span>
              </S.InfoItem>
            </S.InfoGrid>
          </S.Section>

          {/* 참가자 정보 */}
          <S.Section $isMobile={isMobile}>
            <S.SectionTitle $isMobile={isMobile}>
              참가자 ({meetingDetail.currentParticipants}명)
            </S.SectionTitle>
            <S.ParticipantList $isMobile={isMobile}>
              {meetingDetail.participants.map((participant, index) => (
                <S.ParticipantItem
                  key={`${participant.id}-${index}`}
                  $isMobile={isMobile}
                  onClick={
                    participant.id && participant.id !== user?.id
                      ? () => handleParticipantClick(participant.id!)
                      : undefined
                  }
                  style={{
                    cursor: participant.id !== user?.id ? "pointer" : "default",
                  }}
                >
                  <S.ParticipantAvatar
                    src={
                      participant.profileImageUrl ||
                      "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"
                    }
                    alt={participant.nickname}
                    $isMobile={isMobile}
                  />
                  <S.ParticipantInfo>
                    <S.ParticipantName $isMobile={isMobile}>
                      {participant.nickname}
                      {participant.isHost && <Crown size={12} />}
                    </S.ParticipantName>
                    <S.ParticipantMeta $isMobile={isMobile}>
                      Lv.{participant.level}
                      {participant.mbti && ` · ${participant.mbti}`}
                    </S.ParticipantMeta>
                  </S.ParticipantInfo>
                </S.ParticipantItem>
              ))}
            </S.ParticipantList>
          </S.Section>

          {/* 장소 정보 */}
          {meetingDetail.mission?.location && (
            <S.Section $isMobile={isMobile}>
              <S.SectionTitle $isMobile={isMobile}>모임 장소</S.SectionTitle>
              <S.LocationText
                $isMobile={isMobile}
                onClick={handleMapClick}
                style={{ cursor: "pointer" }}
              >
                <MapPin size={isMobile ? 14 : 16} />
                {meetingDetail.mission.location}
              </S.LocationText>
            </S.Section>
          )}

          {/* 주의사항 */}
          {meetingDetail.mission?.precautions &&
            meetingDetail.mission.precautions.length > 0 && (
              <S.Section $isMobile={isMobile}>
                <S.SectionTitle $isMobile={isMobile}>
                  <AlertTriangle size={isMobile ? 14 : 16} />
                  주의사항
                </S.SectionTitle>
                <S.PrecautionsList $isMobile={isMobile}>
                  {meetingDetail.mission.precautions.map(
                    (precaution: string, index: number) => (
                      <S.PrecautionItem key={index} $isMobile={isMobile}>
                        • {precaution}
                      </S.PrecautionItem>
                    )
                  )}
                </S.PrecautionsList>
              </S.Section>
            )}

          {/* 모임 채널 */}
          <S.ChatButton $isMobile={isMobile} onClick={handleChatRoomClick}>
            <MessageCircle size={isMobile ? 14 : 16} />
            모임 채널 들어가기
          </S.ChatButton>
        </>
      )}
    </S.DropdownContainer>
  );
};