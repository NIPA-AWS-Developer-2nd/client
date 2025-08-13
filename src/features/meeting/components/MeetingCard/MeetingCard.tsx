import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Calendar, MapPin, Clock } from "lucide-react";
import type { Meeting } from "../../../../types";
import * as S from "./MeetingCard.styles";

interface MeetingCardProps {
  meeting: Meeting;
}

// Mock 데이터
// TODO: API 연결
const mockMeetingData = {
  preferredTraits: ["적극적인", "유머러스한"],
  neutralTraits: ["조용한", "신중한"],
  participants: [
    {
      id: "1",
      nickname: "러닝마니아",
      level: 3,
      profileImageUrl:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg",
    },
    {
      id: "2",
      nickname: "건강지킴이",
      level: 2,
      profileImageUrl:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg",
    },
    {
      id: "3",
      nickname: "운동러버",
      level: 4,
      profileImageUrl:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg",
    },
  ],
};

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/meetings/${meeting.id}`);
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "쉬움";
      case "medium":
        return "보통";
      case "hard":
        return "어려움";
      default:
        return difficulty;
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
    <S.NewCard onClick={handleClick}>
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
      </S.PrimaryBlock>

      {/* 두 번째 블록: 호스트 정보 */}
      <S.HostBlock>
        <S.HostTitle>호스트 정보</S.HostTitle>
        <S.HostSection>
          <S.HostAvatarWrapper>
            <S.HostAvatar
              src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"
              alt={meeting.host?.nickname}
            />
            <S.CrownIcon>
              <Crown size={12} fill="currentColor" />
            </S.CrownIcon>
          </S.HostAvatarWrapper>
          <S.HostInfo>
            <S.HostName>{meeting.host?.nickname || "호스트"}</S.HostName>
            <S.HostLevel>Lv.{meeting.host?.level || 1}</S.HostLevel>
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
          현재 참가자 ({mockMeetingData.participants.length}/8명)
        </S.ParticipantsTitle>
        <S.ParticipantAvatars>
          {mockMeetingData.participants.slice(0, 4).map((participant) => (
            <S.ParticipantAvatar
              key={participant.id}
              src={participant.profileImageUrl}
              alt={participant.nickname}
              title={`${participant.nickname} (Lv.${participant.level})`}
            />
          ))}
          {(meeting.currentParticipants || 0) > 4 && (
            <S.MoreParticipants>
              +{(meeting.currentParticipants || 0) - 4}
            </S.MoreParticipants>
          )}
        </S.ParticipantAvatars>
      </S.ParticipantsBlock>
    </S.NewCard>
  );
};

export default MeetingCard;
