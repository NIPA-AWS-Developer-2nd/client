import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Users,
  MapPin,
  Calendar,
  Clock,
  Zap,
  ArrowRight,
  Activity,
  Flame,
  Target,
  Crown,
} from "lucide-react";
import { deviceDetection } from "../../../shared/utils";
import { useHomeData } from "../hooks";
import { useHomeStore } from "../../../shared/store/homeStore";
import { homeApi } from "../api/homeApi";
import {
  PageContainer,
  ContentContainer,
  LoadingContainer,
  LoadingText,
  ErrorContainer,
  ErrorText,
  RetryButton,
  Section,
  SectionTitle,
  SectionContent,
  HotMeetingCard,
  HotMeetingImageSection,
  // HotMeetingImage,
  HotMeetingInfo,
  HotMeetingHeader,
  HotMeetingTitle,
  HotMeetingBadges,
  DifficultyBadge,
  PointBadge,
  HotMeetingMeta,
  MetaItem,
  MetaIcon,
  MetaText,
  LikesContainer,
  MyMeetingCard,
  MyMeetingHeader,
  // MyMeetingStatus,
  StatusBadge,
  ActivityCard,
  ActivityIcon,
  ActivityContent,
  ActivityTitle,
  ActivityTime,
  EmptyState,
  EmptyText,
  ViewMoreButton,
  TabContainer,
  TabButton,
  TabContent,
  HostSection,
  HostAvatarWrapper,
  HostAvatar,
  HostCrown,
  HostInfo,
  HostMainInfo,
  HostName,
  HostLevel,
  HostMbti,
  HostBio,
  ParticipantsSection,
  ParticipantsTitle,
  ParticipantAvatars,
  ParticipantAvatar,
  MoreParticipants,
  RegionTag,
  // DetailButton,
} from "./HomePage/HomePage.styles";

type MyMeetingTab = "upcoming" | "active" | "completed";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [activeTab, setActiveTab] = React.useState<MyMeetingTab>("upcoming");
  const { data, loading, error, refetch } = useHomeData({
    limit: 10,
  });
  
  const { 
    setHomeData,
    setMeetingDetail,
    setLoadingMeetingId,
    setMeetingError
  } = useHomeStore();

  // 홈 데이터가 로드되면 스토어에 저장하고 모든 내 모임 상세 정보 미리 가져오기
  React.useEffect(() => {
    if (data) {
      setHomeData(data);
      // 모든 내 모임 상세 정보를 미리 가져오기
      if (data.myMeetings && data.myMeetings.length > 0) {
        data.myMeetings.forEach(async (meeting) => {
          try {
            setLoadingMeetingId(meeting.id, true);
            const response = await homeApi.getMyMeetingDetail(meeting.id);
            setMeetingDetail(meeting.id, response.data);
          } catch (err) {
            setMeetingError(
              meeting.id,
              err instanceof Error ? err.message : '모임 정보를 불러오는데 실패했습니다.'
            );
          } finally {
            setLoadingMeetingId(meeting.id, false);
          }
        });
      }
    }
  }, [data, setHomeData, setMeetingDetail, setLoadingMeetingId, setMeetingError]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "오후" : "오전";
    const displayHours = hours > 12 ? hours - 12 : hours || 12;

    if (minutes === 0) {
      return `${month}/${day} ${period} ${displayHours}시`;
    }
    return `${month}/${day} ${period} ${displayHours}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const getStatusText = (status: string, isHost: boolean) => {
    switch (status) {
      case "recruiting":
        return isHost ? "모집 중" : "참여 예정";
      case "ready":
        return isHost ? "준비 완료" : "출발 준비";
      case "active":
        return isHost ? "호스트로 진행 중" : "참여 중";
      case "completed":
        return "완료";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string, _isHost: boolean) => {
    switch (status) {
      case "recruiting":
        return "warning"; // 모집 중 - 주황색
      case "ready":
        return "primary"; // 준비 완료 - 파랑색
      case "active":
        return "success"; // 활동 중 - 초록색
      case "completed":
        return "disabled"; // 완료 - 회색
      default:
        return "disabled";
    }
  };

  const handleHotMeetingClick = (meetingId: string) => {
    navigate(`/meetings/${meetingId}?from=home`);
  };

  const handleMyMeetingClick = (meetingId: string) => {
    // 바로 모임 채널로 이동
    navigate(`/meetings/${meetingId}/channel`);
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
      default:
        return difficulty || "보통";
    }
  };

  const filterMeetingsByTab = (meetings: Array<{
    id: string;
    status: string;
    scheduledAt: string;
    isHost?: boolean;
  }>, tab: MyMeetingTab) => {
    if (!meetings) return [];

    return meetings.filter((meeting) => {
      switch (tab) {
        case "upcoming":
          // 시작전: recruiting(모집 중) 또는 ready(준비 완료) 상태
          return meeting.status === "recruiting" || meeting.status === "ready";
        case "active":
          // 참여중: active 상태 (활동 중)
          return meeting.status === "active";
        case "completed":
          // 완료: completed 상태
          return meeting.status === "completed";
        default:
          return true;
      }
    });
  };

  if (loading) {
    return (
      <PageContainer $isMobile={isMobile}>
        <LoadingContainer $isMobile={isMobile}>
          <LoadingText $isMobile={isMobile}>
            데이터를 불러오는 중...
          </LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer $isMobile={isMobile}>
        <ErrorContainer $isMobile={isMobile}>
          <ErrorText $isMobile={isMobile}>{error}</ErrorText>
          <RetryButton $isMobile={isMobile} onClick={refetch}>
            다시 시도
          </RetryButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <PageContainer $isMobile={isMobile}>
      <ContentContainer $isMobile={isMobile}>
        {/* 최근 활동 섹션 - 최상단으로 이동 */}
        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>
            <Activity size={isMobile ? 18 : 20} style={{ marginRight: '8px' }} />
            최근 활동
          </SectionTitle>
          <SectionContent>
            {data.activityLogs && data.activityLogs.length > 0 ? (
              data.activityLogs.slice(0, 3).map((log) => (
                <ActivityCard key={log.id} $isMobile={isMobile}>
                  <ActivityIcon $isMobile={isMobile}>
                    <Clock size={isMobile ? 14 : 16} />
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle $isMobile={isMobile}>
                      {log.type === "meeting_joined" && "모임에 참여했습니다"}
                      {log.type === "meeting_completed" &&
                        "모임을 완료했습니다"}
                      {log.type === "mission_completed" &&
                        "미션을 완료했습니다"}
                      {log.type === "meeting_liked" &&
                        "모임에 좋아요를 눌렀습니다"}
                      {log.type === "photo_verification_submitted" &&
                        "인증 사진을 제출했습니다"}
                      {log.type === "photo_verification_approved" &&
                        "인증이 승인되었습니다"}
                      {![
                        "meeting_joined",
                        "meeting_completed",
                        "mission_completed",
                        "meeting_liked",
                        "photo_verification_submitted",
                        "photo_verification_approved",
                      ].includes(log.type) && log.type}
                    </ActivityTitle>
                    <ActivityTime $isMobile={isMobile}>
                      {new Date(log.createdAt).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </ActivityTime>
                  </ActivityContent>
                </ActivityCard>
              ))
            ) : (
              <EmptyState $isMobile={isMobile}>
                <EmptyText $isMobile={isMobile}>최근 활동이 없습니다</EmptyText>
              </EmptyState>
            )}
          </SectionContent>
        </Section>

        {/* 내 모임 섹션 - 탭 구조 */}
        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>
            <Calendar size={isMobile ? 18 : 20} style={{ marginRight: '8px' }} />
            내 모임
          </SectionTitle>
          <SectionContent>
            <TabContainer>
              <TabButton
                $active={activeTab === "upcoming"}
                $isMobile={isMobile}
                onClick={() => setActiveTab("upcoming")}
              >
                시작전
              </TabButton>
              <TabButton
                $active={activeTab === "active"}
                $isMobile={isMobile}
                onClick={() => setActiveTab("active")}
              >
                참여중
              </TabButton>
              <TabButton
                $active={activeTab === "completed"}
                $isMobile={isMobile}
                onClick={() => setActiveTab("completed")}
              >
                완료
              </TabButton>
            </TabContainer>

            <TabContent>
              {(() => {
                const filteredMeetings = filterMeetingsByTab(
                  data.myMeetings || [],
                  activeTab
                );

                if (filteredMeetings.length > 0) {
                  return (
                    <>
                      {filteredMeetings.slice(0, 3).map((meeting) => (
                        <MyMeetingCard
                          key={meeting.id}
                          $isMobile={isMobile}
                          onClick={() => handleMyMeetingClick(meeting.id)}
                        >
                          <MyMeetingHeader>
                            <HotMeetingTitle $isMobile={isMobile}>
                              {meeting.title}
                            </HotMeetingTitle>
                            <StatusBadge
                              $color={getStatusColor(
                                meeting.status,
                                meeting.isHost
                              )}
                              $isMobile={isMobile}
                            >
                              {getStatusText(meeting.status, meeting.isHost)}
                            </StatusBadge>
                          </MyMeetingHeader>
                          <HotMeetingMeta>
                            <MetaItem>
                              <MetaIcon>
                                <Users size={isMobile ? 12 : 14} />
                              </MetaIcon>
                              <MetaText $isMobile={isMobile}>
                                {meeting.participantCount}명 참여
                              </MetaText>
                            </MetaItem>
                            <MetaItem>
                              <MetaIcon>
                                <Calendar size={isMobile ? 12 : 14} />
                              </MetaIcon>
                              <MetaText $isMobile={isMobile}>
                                {formatDateTime(meeting.scheduledAt)}
                              </MetaText>
                            </MetaItem>
                            {meeting.mission?.basePoints && (
                              <MetaItem>
                                <MetaIcon>
                                  <Zap size={isMobile ? 12 : 14} />
                                </MetaIcon>
                                <MetaText $isMobile={isMobile}>
                                  {meeting.mission.basePoints}P
                                </MetaText>
                              </MetaItem>
                            )}
                          </HotMeetingMeta>
                        </MyMeetingCard>
                      ))}
                      {filteredMeetings.length > 3 && (
                        <ViewMoreButton
                          $isMobile={isMobile}
                          onClick={() =>
                            navigate(`/meetings?tab=my&status=${activeTab}`)
                          }
                        >
                          {activeTab === "upcoming" && "시작 예정 모임 더보기"}
                          {activeTab === "active" && "참여 중인 모임 더보기"}
                          {activeTab === "completed" && "완료된 모임 더보기"}
                          <ArrowRight size={isMobile ? 14 : 16} />
                        </ViewMoreButton>
                      )}
                    </>
                  );
                } else {
                  return (
                    <EmptyState $isMobile={isMobile}>
                      <EmptyText $isMobile={isMobile}>
                        {activeTab === "upcoming" &&
                          "시작 예정인 모임이 없습니다"}
                        {activeTab === "active" && "참여 중인 모임이 없습니다"}
                        {activeTab === "completed" && "완료된 모임이 없습니다"}
                      </EmptyText>
                    </EmptyState>
                  );
                }
              })()}
            </TabContent>
          </SectionContent>
        </Section>

        {/* 구분선 */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, #e5e7eb, transparent)",
            margin: isMobile ? "20px 0" : "24px 0",
          }}
        />

        {/* HOT한 번개 모임 섹션 */}
        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>
            <Flame size={isMobile ? 18 : 20} style={{ marginRight: '8px', color: '#ff6b35' }} />
            HOT한 번개 모임
          </SectionTitle>
          <SectionContent>
            {data.hotMeetings && data.hotMeetings.length > 0 ? (
              <>
                {data.hotMeetings.slice(0, 3).map((meeting) => (
                  <HotMeetingCard
                    key={meeting.id}
                    $isMobile={isMobile}
                    onClick={() => handleHotMeetingClick(meeting.id)}
                  >
                    {/* 지역 태그 - 카드 우측 상단 */}
                    {meeting.region && (
                      <RegionTag $isMobile={isMobile}>
                        <MapPin size={isMobile ? 12 : 14} />
                        {meeting.region.districtName}
                      </RegionTag>
                    )}

                    <HotMeetingImageSection
                      $backgroundImage={meeting.mission?.thumbnailUrl}
                      $isMobile={isMobile}
                    >
                      <LikesContainer
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          right: "8px",
                          background: "rgba(0, 0, 0, 0.6)",
                          borderRadius: "16px",
                          padding: "4px 8px",
                          color: "white",
                        }}
                      >
                        <Heart size={14} fill="#ff6b6b" color="#ff6b6b" />
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>
                          {meeting.likesCount}
                        </span>
                      </LikesContainer>
                    </HotMeetingImageSection>

                    <HotMeetingInfo $isMobile={isMobile}>
                      <HotMeetingHeader>
                        <HotMeetingBadges>
                          <DifficultyBadge
                            $difficulty={
                              meeting.mission?.difficulty || "medium"
                            }
                          >
                            {getDifficultyText(
                              meeting.mission?.difficulty || "medium"
                            )}
                          </DifficultyBadge>
                          <PointBadge $point={meeting.mission?.basePoints || 0}>
                            +{meeting.mission?.basePoints || 0}P
                          </PointBadge>
                        </HotMeetingBadges>
                        <HotMeetingTitle $isMobile={isMobile}>
                          {meeting.title}
                        </HotMeetingTitle>
                      </HotMeetingHeader>

                      <HotMeetingMeta>
                        <MetaItem>
                          <MetaIcon>
                            <Users size={isMobile ? 12 : 14} />
                          </MetaIcon>
                          <MetaText $isMobile={isMobile}>
                            {meeting.currentParticipants}/
                            {meeting.maxParticipants}명
                          </MetaText>
                        </MetaItem>
                        <MetaItem>
                          <MetaIcon>
                            <Calendar size={isMobile ? 12 : 14} />
                          </MetaIcon>
                          <MetaText $isMobile={isMobile}>
                            {formatDateTime(meeting.scheduledAt)}
                          </MetaText>
                        </MetaItem>
                        <MetaItem>
                          <MetaIcon>
                            <MapPin size={isMobile ? 12 : 14} />
                          </MetaIcon>
                          <MetaText $isMobile={isMobile}>
                            {meeting.location || "위치 미정"}
                          </MetaText>
                        </MetaItem>
                      </HotMeetingMeta>

                      {/* 호스트 정보 섹션 */}
                      {meeting.host && (
                        <HostSection $isMobile={isMobile}>
                          <HostAvatarWrapper>
                            <HostAvatar 
                              $isMobile={isMobile}
                              src={meeting.host.profileImageUrl || "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"}
                              alt={meeting.host.nickname}
                            />
                            <HostCrown $isMobile={isMobile}>
                              <Crown size={isMobile ? 8 : 10} />
                            </HostCrown>
                          </HostAvatarWrapper>
                          <HostInfo>
                            <HostMainInfo>
                              <HostName $isMobile={isMobile}>
                                {meeting.host.nickname}
                              </HostName>
                              <HostLevel $isMobile={isMobile}>
                                Lv.{meeting.host.level || 1}
                              </HostLevel>
                              {meeting.host.mbti && (
                                <HostMbti $isMobile={isMobile}>
                                  {meeting.host.mbti}
                                </HostMbti>
                              )}
                            </HostMainInfo>
                            {meeting.host.bio && (
                              <HostBio $isMobile={isMobile}>
                                {meeting.host.bio}
                              </HostBio>
                            )}
                          </HostInfo>
                        </HostSection>
                      )}

                      {/* 참가자 정보 섹션 */}
                      {meeting.participants && meeting.participants.length > 0 && (
                        <ParticipantsSection $isMobile={isMobile}>
                          <ParticipantsTitle $isMobile={isMobile}>
                            현재 참가자 ({meeting.currentParticipants}명)
                          </ParticipantsTitle>
                          <ParticipantAvatars>
                            {meeting.participants.slice(0, 4).map((participant, index) => (
                              <ParticipantAvatar
                                key={index}
                                $isMobile={isMobile}
                                src={participant.profileImageUrl || "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"}
                                alt={`참가자 ${index + 1}`}
                              />
                            ))}
                            {meeting.currentParticipants > 4 && (
                              <MoreParticipants $isMobile={isMobile}>
                                +{meeting.currentParticipants - 4}
                              </MoreParticipants>
                            )}
                          </ParticipantAvatars>
                        </ParticipantsSection>
                      )}
                    </HotMeetingInfo>
                  </HotMeetingCard>
                ))}
                <ViewMoreButton
                  $isMobile={isMobile}
                  onClick={() => navigate("/meetings")}
                >
                  더 많은 모임 보기
                  <ArrowRight size={isMobile ? 14 : 16} />
                </ViewMoreButton>
              </>
            ) : (
              <EmptyState $isMobile={isMobile}>
                <EmptyText $isMobile={isMobile}>
                  현재 인기 있는 번개 모임이 없습니다
                </EmptyText>
              </EmptyState>
            )}
          </SectionContent>
        </Section>

        {/* 나와 잘 맞을 것 같은 모임 섹션 - TODO: 백엔드 API 연결 필요 */}
        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>
            <Target size={isMobile ? 18 : 20} style={{ marginRight: '8px', color: '#8b5cf6' }} />
            맞춤형 추천 모임
          </SectionTitle>
          <SectionContent>
            <EmptyState $isMobile={isMobile}>
              <EmptyText $isMobile={isMobile}>
                맞춤 추천 기능을 준비 중입니다
              </EmptyText>
            </EmptyState>
          </SectionContent>
        </Section>
      </ContentContainer>
    </PageContainer>
  );
};
