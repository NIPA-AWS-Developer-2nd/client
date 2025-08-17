import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Calendar, MapPin, Clock, Heart } from "lucide-react";
import type { Meeting } from "../../../../types";
import { meetingApiService } from "../../../../shared/services/meetingApi";
import { AlertModal } from "../../../../shared/components/common";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useLocationVerification } from "../../../../shared/hooks";
import { useAlert } from "../../../../shared/hooks/useAlert";
import { formatLevel } from "../../../../shared/utils";
import * as S from "./MeetingCard.styles";

interface MeetingCardProps {
  meeting: Meeting;
  onLikeUpdate?: (meetingId: string, newLikesCount: number, isLiked: boolean) => void;
}

// Mock 데이터 - 선호 특성 (추후 API에서 가져올 예정)
// TODO: API 연결
const mockMeetingData = {
  preferredTraits: ["적극적인", "유머러스한"],
  neutralTraits: ["조용한", "신중한"],
};

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onLikeUpdate }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isVerified: isLocationVerified, isLoading: isLocationLoading } = useLocationVerification();
  const { warning } = useAlert();
  const [likesCount, setLikesCount] = useState(meeting.likesCount || 0);
  const [isLiked, setIsLiked] = useState(meeting.isLiked || false);
  const [isLiking, setIsLiking] = useState(false);
  const [showAlreadyLikedModal, setShowAlreadyLikedModal] = useState(false);

  const handleClick = () => {
    // 로딩 중이면 아무 작업도 하지 않음
    if (isLocationLoading) {
      return;
    }
    
    // 지역 인증 체크
    if (!isLocationVerified) {
      warning("지역 인증이 필요합니다.", "모임 상세");
      return;
    }

    // URL에서 현재 위치가 미션 상세페이지인지 확인
    const currentPath = window.location.pathname;
    const isFromMission = currentPath.includes('/missions/');
    
    if (isFromMission) {
      navigate(`/meetings/${meeting.id}?from=mission`);
    } else {
      navigate(`/meetings/${meeting.id}`);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    if (isLiking) return;

    // 이미 좋아요를 눌렀다면 모달 표시
    if (isLiked) {
      setShowAlreadyLikedModal(true);
      return;
    }

    try {
      setIsLiking(true);
      const result = await meetingApiService.toggleLike(meeting.id);
      
      setLikesCount(result.likesCount);
      setIsLiked(result.isLiked);
      
      // 부모 컴포넌트에 업데이트 알림
      onLikeUpdate?.(meeting.id, result.likesCount, result.isLiked);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleHostClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    // 로딩 중이면 아무 작업도 하지 않음
    if (isLocationLoading) {
      return;
    }
    
    // 지역 인증 체크
    if (!isLocationVerified) {
      warning("지역 인증이 필요합니다.", "사용자 프로필");
      return;
    }
    
    // 본인 프로필은 클릭하지 않도록 방지
    if (meeting.host?.userId && meeting.host.userId !== user?.id) {
      navigate(`/user/${meeting.host.userId}`);
    }
  };

  const handleParticipantClick = (e: React.MouseEvent, participantId: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    // 로딩 중이면 아무 작업도 하지 않음
    if (isLocationLoading) {
      return;
    }
    
    // 지역 인증 체크
    if (!isLocationVerified) {
      warning("지역 인증이 필요합니다.", "사용자 프로필");
      return;
    }
    
    // 본인 프로필은 클릭하지 않도록 방지
    if (participantId && participantId !== user?.id) {
      navigate(`/user/${participantId}`);
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "very_easy":
        return "매우 쉬움";
      case "easy":
        return "쉬움";
      case "medium":
        return "보통";
      case "hard":
        return "어려움";
      case "very_hard":
        return "매우 어려움";
      // 백엔드 enum 대응
      case "매우 쉬움":
        return "매우 쉬움";
      case "쉬움":
        return "쉬움";
      case "보통":
        return "보통";
      case "어려움":
        return "어려움";
      case "매우 어려움":
        return "매우 어려움";
      default:
        console.warn('Unknown difficulty value:', difficulty);
        return difficulty || "보통";
    }
  };

  const formatScheduleDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "오후" : "오전";
    const displayHours = hours > 12 ? hours - 12 : hours || 12;

    // MM월 DD일 (요일) 오후 HH시 MM분 시작
    // 00분이면 분 정보 생략
    if (minutes === 0) {
      return `${month}월 ${day}일 (${weekday}) ${period} ${displayHours}시 시작`;
    }
    return `${month}월 ${day}일 (${weekday}) ${period} ${displayHours}시 ${minutes}분 시작`;
  };

  const getTimeRemaining = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    // 이미 마감된 경우
    if (diff <= 0) {
      return { text: "마감", urgent: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    // 1분 미만인 경우
    if (days === 0 && hours === 0 && minutes === 0) {
      return { text: "곧 마감", urgent: true };
    }

    // 긴급 상태 판단 (하루 미만 또는 6시간 미만)
    const urgent = days === 0 && hours < 6;

    // 표시 형식 결정
    if (days > 0) {
      if (hours > 0) {
        return { text: `${days}일 ${hours}시간 남음`, urgent: false };
      }
      return { text: `${days}일 남음`, urgent: false };
    }

    if (hours > 0) {
      if (minutes > 0) {
        return { text: `${hours}시간 ${minutes}분 남음`, urgent };
      }
      return { text: `${hours}시간 남음`, urgent };
    }

    return { text: `${minutes}분 남음`, urgent: true };
  };

  return (
    <S.NewCard onClick={handleClick} $status={meeting.status}>
      {/* 첫 번째 블록: 미션 정보와 일정 정보 */}
      <S.PrimaryBlock $backgroundImage={meeting.mission?.thumbnailUrl}>
        <S.MissionHeader>
          <S.MissionTitle>
            {meeting.mission?.title || "미션 정보 없음"}
          </S.MissionTitle>
          <S.MissionMeta>
            <S.CategoryBadge>
              {meeting.mission?.category?.name || "카테고리"}
            </S.CategoryBadge>
            <S.DifficultyBadge
              $difficulty={meeting.mission?.difficulty || "medium"}
            >
              {getDifficultyText(meeting.mission?.difficulty || "medium")}
            </S.DifficultyBadge>
            <S.PointBadge $point={meeting.mission?.basePoints || 100}>
              +{meeting.mission?.basePoints || 100}P
            </S.PointBadge>
          </S.MissionMeta>
        </S.MissionHeader>

        <S.MeetingInfoSection>
          <S.MeetingInfoItem>
            <Calendar size={14} />
            <span>{formatScheduleDateTime(meeting.scheduledAt)}</span>
          </S.MeetingInfoItem>
          <S.MeetingInfoItem>
            <MapPin size={14} />
            <span>
              {" "}
              {meeting.mission?.district?.districtName || "지역 미정"}{" "}
              {meeting.mission?.location || ""}
            </span>
          </S.MeetingInfoItem>
          <S.MeetingInfoItem>
            <Clock size={14} />
            <S.DeadlineContainer>
              <span>모집 마감까지</span>
              <S.DeadlineText
                $urgent={getTimeRemaining(meeting.recruitUntil).urgent}
              >
                {getTimeRemaining(meeting.recruitUntil).text}
              </S.DeadlineText>
            </S.DeadlineContainer>
          </S.MeetingInfoItem>
        </S.MeetingInfoSection>

        {/* 좋아요 버튼 - 썸네일 오른쪽 하단 */}
        <S.LikesOverlay onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
          <Heart 
            size={16} 
            fill={isLiked ? "#ff8b55" : "#ffffff"} 
            color={isLiked ? "#ff8b55" : "#ffffff"} 
          />
          <S.LikesCountOverlay>{likesCount}</S.LikesCountOverlay>
        </S.LikesOverlay>
      </S.PrimaryBlock>

      {/* 두 번째 블록: 호스트 정보 */}
      <S.HostBlock>
        <S.HostTitle>호스트 정보</S.HostTitle>
        <S.HostSection>
          <S.HostAvatarWrapper 
            onClick={handleHostClick}
            style={{ 
              cursor: (meeting.host?.userId && meeting.host.userId !== user?.id) ? 'pointer' : 'default' 
            }}
          >
            <S.HostAvatar
              src={meeting.host?.profileImageUrl || "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"}
              alt={meeting.host?.nickname}
            />
            <S.CrownIcon>
              <Crown size={12} fill="currentColor" />
            </S.CrownIcon>
          </S.HostAvatarWrapper>
          <S.HostInfo>
            <div>
              <S.HostName 
                onClick={handleHostClick}
                style={{ 
                  cursor: (meeting.host?.userId && meeting.host.userId !== user?.id) ? 'pointer' : 'default' 
                }}
              >
                {meeting.host?.nickname || "호스트"}
              </S.HostName>
              <S.HostLevel>{formatLevel(meeting.host?.level, meeting.host?.points)}</S.HostLevel>
            </div>
            {meeting.host?.mbti && (
              <S.HostMbti>{meeting.host.mbti}</S.HostMbti>
            )}
          </S.HostInfo>
        </S.HostSection>
      </S.HostBlock>

      {/* 세 번째 블록: 선호 특성 */}
      <S.PreferenceBlock>
        <S.PreferenceSection>
          <S.PreferenceTitle>함께하고 싶어요</S.PreferenceTitle>
          <S.PreferenceTags>
            {mockMeetingData.preferredTraits.map((trait, index) => (
              <S.PreferredTag key={index}>#{trait}</S.PreferredTag>
            ))}
          </S.PreferenceTags>
        </S.PreferenceSection>

        <S.PreferenceSection>
          <S.NeutralTitle>무관해요</S.NeutralTitle>
          <S.PreferenceTags>
            {mockMeetingData.neutralTraits.map((trait, index) => (
              <S.NeutralTag key={`neutral-${index}`}>#{trait}</S.NeutralTag>
            ))}
          </S.PreferenceTags>
        </S.PreferenceSection>
      </S.PreferenceBlock>

      {/* 네 번째 블록: 참가자 리스트 */}
      <S.ParticipantsBlock>
        <S.ParticipantsTitle>
          현재 참가자 ({meeting.currentParticipants || 0}/{meeting.mission?.participants || 0}명)
        </S.ParticipantsTitle>
        
        {/* 참가자 아바타 표시 */}
        <S.ParticipantAvatars>
          {meeting.participantProfiles && meeting.participantProfiles.length > 0 ? (
            <>
              {meeting.participantProfiles.slice(0, 4).map((participant) => (
                <S.ParticipantAvatar
                  key={participant.id}
                  src={participant.profileImageUrl || "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"}
                  alt={participant.nickname}
                  title={participant.nickname}
                  onClick={(e) => handleParticipantClick(e, participant.id)}
                  style={{ 
                    cursor: (participant.id && participant.id !== user?.id) ? 'pointer' : 'default' 
                  }}
                />
              ))}
              {meeting.currentParticipants && meeting.currentParticipants > 4 && (
                <S.MoreParticipants>
                  +{meeting.currentParticipants - 4}
                </S.MoreParticipants>
              )}
            </>
          ) : (
            /* 참가자가 없을 때 빈 상태 */
            <span style={{ fontSize: '13px', color: '#6b7280' }}>
              첫 번째 참가자가 되어보세요!
            </span>
          )}
        </S.ParticipantAvatars>
      </S.ParticipantsBlock>

      {/* 이미 좋아요를 눌렀을 때 표시되는 모달 */}
      <AlertModal
        isOpen={showAlreadyLikedModal}
        onClose={() => setShowAlreadyLikedModal(false)}
        type="info"
        title="좋아요 알림"
        message="이미 좋아요를 눌렀습니다."
        confirmText="확인"
      />
    </S.NewCard>
  );
};

export default MeetingCard;
