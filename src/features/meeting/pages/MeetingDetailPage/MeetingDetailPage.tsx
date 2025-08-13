import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Meeting } from "../../../../types";
import * as S from "./MeetingDetailPage.styles";

const MeetingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);
  const [currentUserId] = useState("user1");

  const mockMeeting: Meeting = {
    id: "01HQXXX001",
    missionId: "mission1",
    hostUserId: "user1",
    status: "recruiting",
    recruitUntil: new Date(Date.now() + 86400000 * 2).toISOString(),
    scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentParticipants: 3,
    mission: {
      id: "mission1",
      title: "한강 러닝 크루 함께해요",
      description:
        "한강에서 함께 러닝하실 분들 모집합니다!\n\n초보자도 환영이며, 각자의 페이스에 맞춰 달릴 예정입니다.\n러닝 후에는 간단한 스트레칭과 함께 시원한 음료를 마시며 이야기 나누는 시간도 가질 예정이에요.\n\n운동화와 편한 복장으로 오시면 됩니다!",
      minParticipants: 2,
      maxParticipants: 8,
      estimatedDuration: 120,
      minimumDuration: 90,
      basePoints: 100,
      photoVerificationGuide: "러닝 전후 단체 사진, 한강 배경 인증샷",
      sampleImageUrls: [],
      categoryId: 1,
      difficulty: "easy",
      thumbnailUrl: "https://via.placeholder.com/800x450",
      precautions: ["운동화 필수", "물 준비", "날씨 확인 필수"],
      districtId: "11680",
      location: "반포한강공원 달빛광장",
      hashtags: ["러닝", "한강", "운동", "건강", "주말"],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: { id: 1, name: "운동", slug: "sports", isActive: true },
      district: {
        id: "11680",
        regionCode: "11680",
        districtName: "강남구",
        city: "서울",
        isActive: true,
      },
    },
    host: {
      id: "user1",
      nickname: "러닝매니아",
      profileImageUrl: "https://via.placeholder.com/100",
      points: 1200,
      level: 3,
      bio: "매주 한강에서 러닝하고 있어요!",
    },
    participants: [
      {
        id: 1,
        meetingId: "01HQXXX001",
        userId: "user1",
        isHost: true,
        status: "joined",
        joinedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        user: {
          id: "user1",
          nickname: "러닝매니아",
          profileImageUrl: "https://via.placeholder.com/100",
          points: 1200,
          level: 3,
        },
      },
      {
        id: 2,
        meetingId: "01HQXXX001",
        userId: "user2",
        isHost: false,
        status: "joined",
        joinedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        user: {
          id: "user2",
          nickname: "건강러",
          profileImageUrl: "https://via.placeholder.com/100",
          points: 800,
          level: 2,
        },
      },
      {
        id: 3,
        meetingId: "01HQXXX001",
        userId: "user3",
        isHost: false,
        status: "joined",
        joinedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        user: {
          id: "user3",
          nickname: "초보러너",
          profileImageUrl: "https://via.placeholder.com/100",
          points: 200,
          level: 1,
        },
      },
    ],
  };

  const loadMeetingDetail = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMeeting(mockMeeting);

      const isUserParticipant =
        mockMeeting.participants?.some((p) => p.userId === currentUserId) ||
        false;
      setIsParticipant(isUserParticipant);
    } catch (error) {
      console.error("Failed to load meeting detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeetingDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleJoin = async () => {
    try {
      console.log("Joining meeting:", id);
      setIsParticipant(true);
    } catch (error) {
      console.error("Failed to join meeting:", error);
    }
  };

  const handleLeave = async () => {
    try {
      console.log("Leaving meeting:", id);
      setIsParticipant(false);
    } catch (error) {
      console.error("Failed to leave meeting:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: meeting?.mission?.title,
        text: meeting?.mission?.description,
        url: window.location.href,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    const period = hours >= 12 ? "오후" : "오전";
    const displayHours = hours > 12 ? hours - 12 : hours || 12;

    return `${year}년 ${month}월 ${day}일 (${dayOfWeek}) ${period} ${displayHours}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDeadline = (dateString: string) => {
    const now = new Date();
    const deadline = new Date(dateString);
    const diff = deadline.getTime() - now.getTime();

    if (diff < 0) return "마감됨";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}일 ${hours}시간 남음`;
    if (hours > 0) return `${hours}시간 남음`;
    return "곧 마감";
  };

  const getStatusText = (status: Meeting["status"]) => {
    switch (status) {
      case "recruiting":
        return "모집중";
      case "active":
        return "진행중";
      case "completed":
        return "완료";
      case "cancelled":
        return "취소됨";
      default:
        return status;
    }
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

  const isHost = meeting?.hostUserId === currentUserId;
  const isFull =
    meeting && meeting.currentParticipants >= meeting.mission.maxParticipants;
  const canJoin = meeting?.status === "recruiting" && !isParticipant && !isFull;
  const canLeave = meeting?.status === "recruiting" && isParticipant && !isHost;

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (!meeting) {
    return <div>모임을 찾을 수 없습니다.</div>;
  }

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={handleBack}>←</S.BackButton>
        <S.HeaderTitle>모임 상세</S.HeaderTitle>
        <S.HeaderActions>
          <S.IconButton onClick={handleShare}>📤</S.IconButton>
        </S.HeaderActions>
      </S.Header>

      <S.Content>
        <S.MainContent>
          <S.ImageSection>
            <S.StatusBadge $status={meeting.status}>
              {getStatusText(meeting.status)}
            </S.StatusBadge>
            <S.MainImage
              src={meeting.mission?.thumbnailUrl || "/default-mission.jpg"}
              alt={meeting.mission?.title}
            />
          </S.ImageSection>

          <S.InfoSection>
            <S.TitleSection>
              <S.CategoryBadge>
                {meeting.mission?.category?.name}
              </S.CategoryBadge>
              <S.Title>{meeting.mission?.title}</S.Title>
              <S.MetaInfo>
                <S.MetaItem>
                  📍 {meeting.mission?.district?.districtName} ·{" "}
                  {meeting.mission?.location}
                </S.MetaItem>
                <S.MetaItem>📅 {formatDate(meeting.scheduledAt)}</S.MetaItem>
                <S.MetaItem>
                  ⏰ 약 {Math.floor(meeting.mission?.estimatedDuration / 60)}
                  시간
                </S.MetaItem>
              </S.MetaInfo>
            </S.TitleSection>

            <S.HostSection>
              <S.HostAvatar
                src={meeting.host?.profileImageUrl || "/default-avatar.png"}
                alt={meeting.host?.nickname}
              />
              <S.HostInfo>
                <S.HostLabel>호스트</S.HostLabel>
                <S.HostName>{meeting.host?.nickname}</S.HostName>
              </S.HostInfo>
            </S.HostSection>

            <S.Section>
              <S.SectionTitle>미션 소개</S.SectionTitle>
              <S.Description>{meeting.mission?.description}</S.Description>
            </S.Section>

            <S.Section>
              <S.SectionTitle>미션 정보</S.SectionTitle>
              <S.InfoGrid>
                <S.InfoCard>
                  <S.InfoCardLabel>난이도</S.InfoCardLabel>
                  <S.InfoCardValue>
                    {getDifficultyText(meeting.mission?.difficulty)}
                  </S.InfoCardValue>
                </S.InfoCard>
                <S.InfoCard>
                  <S.InfoCardLabel>참여 인원</S.InfoCardLabel>
                  <S.InfoCardValue>
                    {meeting.mission?.minParticipants}~
                    {meeting.mission?.maxParticipants}명
                  </S.InfoCardValue>
                </S.InfoCard>
                <S.InfoCard>
                  <S.InfoCardLabel>기본 포인트</S.InfoCardLabel>
                  <S.InfoCardValue>
                    {meeting.mission?.basePoints}P
                  </S.InfoCardValue>
                </S.InfoCard>
                <S.InfoCard>
                  <S.InfoCardLabel>최소 참여시간</S.InfoCardLabel>
                  <S.InfoCardValue>
                    {meeting.mission?.minimumDuration}분
                  </S.InfoCardValue>
                </S.InfoCard>
                <S.InfoCard>
                  <S.InfoCardLabel>모집 마감</S.InfoCardLabel>
                  <S.InfoCardValue>
                    {formatDeadline(meeting.recruitUntil)}
                  </S.InfoCardValue>
                </S.InfoCard>
                <S.InfoCard>
                  <S.InfoCardLabel>인증 방법</S.InfoCardLabel>
                  <S.InfoCardValue>사진 인증</S.InfoCardValue>
                </S.InfoCard>
              </S.InfoGrid>
            </S.Section>

            {meeting.mission?.precautions &&
              meeting.mission.precautions.length > 0 && (
                <S.Section>
                  <S.SectionTitle>주의사항</S.SectionTitle>
                  <S.PrecautionList>
                    {meeting.mission.precautions.map((precaution, index) => (
                      <S.PrecautionItem key={index}>
                        {precaution}
                      </S.PrecautionItem>
                    ))}
                  </S.PrecautionList>
                </S.Section>
              )}

            {meeting.mission?.hashtags &&
              meeting.mission.hashtags.length > 0 && (
                <S.Section>
                  <S.SectionTitle>태그</S.SectionTitle>
                  <S.HashtagList>
                    {meeting.mission.hashtags.map((tag, index) => (
                      <S.Hashtag key={index}>#{tag}</S.Hashtag>
                    ))}
                  </S.HashtagList>
                </S.Section>
              )}

            <S.Section>
              <S.SectionTitle>인증 가이드</S.SectionTitle>
              <S.Description>
                {meeting.mission?.photoVerificationGuide}
              </S.Description>
            </S.Section>
          </S.InfoSection>
        </S.MainContent>

        <S.Sidebar>
          <S.ParticipantSection>
            <S.ParticipantHeader>
              <S.ParticipantTitle>참여자</S.ParticipantTitle>
              <S.ParticipantCount>
                {meeting.currentParticipants}/{meeting.mission?.maxParticipants}
                명
              </S.ParticipantCount>
            </S.ParticipantHeader>
            <S.ParticipantList>
              {meeting.participants?.map((participant) => (
                <S.ParticipantItem key={participant.id}>
                  <S.ParticipantAvatar
                    src={
                      participant.user?.profileImageUrl || "/default-avatar.png"
                    }
                    alt={participant.user?.nickname}
                  />
                  <S.ParticipantInfo>
                    <S.ParticipantName>
                      {participant.user?.nickname}
                      {participant.isHost && (
                        <S.ParticipantBadge> (호스트)</S.ParticipantBadge>
                      )}
                    </S.ParticipantName>
                  </S.ParticipantInfo>
                </S.ParticipantItem>
              ))}
            </S.ParticipantList>
          </S.ParticipantSection>

          {meeting.status === "recruiting" && (
            <S.DeadlineWarning>
              모집 마감까지 {formatDeadline(meeting.recruitUntil)}
            </S.DeadlineWarning>
          )}

          <S.ActionSection>
            {isHost ? (
              <>
                <S.PrimaryButton disabled>내가 만든 모임</S.PrimaryButton>
                <S.SecondaryButton>모임 관리</S.SecondaryButton>
              </>
            ) : (
              <>
                {canJoin && (
                  <S.PrimaryButton onClick={handleJoin}>
                    참여하기
                  </S.PrimaryButton>
                )}
                {canLeave && (
                  <S.SecondaryButton onClick={handleLeave}>
                    참여 취소
                  </S.SecondaryButton>
                )}
                {isParticipant && !canLeave && (
                  <S.PrimaryButton disabled>참여중</S.PrimaryButton>
                )}
                {isFull && !isParticipant && (
                  <S.PrimaryButton disabled>모집 완료</S.PrimaryButton>
                )}
                {meeting.status !== "recruiting" && (
                  <S.PrimaryButton disabled>
                    {getStatusText(meeting.status)}
                  </S.PrimaryButton>
                )}
              </>
            )}
          </S.ActionSection>
        </S.Sidebar>
      </S.Content>
    </S.Container>
  );
};

export default MeetingDetailPage;
