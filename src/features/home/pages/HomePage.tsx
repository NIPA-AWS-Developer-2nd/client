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
import { deviceDetection, formatLevel } from "../../../shared/utils";
import { useHomeData } from "../hooks";
import { useHomeStore } from "../../../shared/store/homeStore";
import { homeApi } from "../api/homeApi";
import { HomeSkeleton } from "../components/HomeSkeleton";
import { useAlert } from "../../../shared/hooks/useAlert";
import mainBannerImage from "../../../assets/images/main-banner_800x300.png";
import {
  PageContainer,
  ContentContainer,
  ErrorContainer,
  ErrorText,
  RetryButton,
  BannerSection,
  BannerImage,
  Section,
  SectionTitle,
  SectionContent,
  HotMeetingCard,
  HotMeetingImageSection,
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
  MyMeetingStatus,
  HostBadge,
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
} from "./HomePage/HomePage.styles";

type MyMeetingTab = "recruiting" | "ready" | "active" | "completed";

// Type definitions for HomePage
interface ActivityLogType {
  id: string;
  type: string;
  createdAt: string;
}

interface HotMeetingType {
  id: string;
  title: string;
  scheduledAt: string;
  location?: string;
  maxParticipants: number;
  currentParticipants: number;
  likesCount: number;
  participants?: ParticipantType[];
  mission?: {
    title?: string;
    difficulty?: string;
    basePoints?: number;
    thumbnailUrl?: string;
  };
  region?: {
    id: string;
    districtName: string;
    city: string;
  };
  host?: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
    level: number;
    points?: number;
    mbti?: string;
    bio?: string;
  };
}

interface ParticipantType {
  profileImageUrl?: string;
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [activeTab, setActiveTab] = React.useState<MyMeetingTab>("recruiting");
  const [expandedTabs, setExpandedTabs] = React.useState<Set<MyMeetingTab>>(
    new Set()
  );

  const { data, loading, error, refetch } = useHomeData({ limit: 10 });
  const alert = useAlert();

  const {
    setHomeData,
    setMeetingDetail,
    setLoadingMeetingId,
    setMeetingError,
    getUnifiedMyMeetings,
  } = useHomeStore();

  // 현재 로그인 사용자 id를 가능한 소스에서 시도 추출
  const myIdFromData =
    (data as { currentUser?: { id: string } })?.currentUser?.id ??
    (data as { user?: { id: string } })?.user?.id ??
    (data as { me?: { id: string } })?.me?.id ??
    undefined;

  // 스토어의 통합 "내 모임" 사용 (meJoined/status가 보정됨)
  const myMeetingsUnified = useHomeStore((s) =>
    s.getUnifiedMyMeetings(myIdFromData)
  );

  // 홈 데이터가 로드되면 스토어에 저장 + 내 모임 상세 사전 로드
  React.useEffect(() => {
    if (!data) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setHomeData(data as any);

    const unified = getUnifiedMyMeetings(myIdFromData);

    if (unified.length > 0) {
      unified.forEach(async (m) => {
        try {
          setLoadingMeetingId(m.id, true);
          const response = await homeApi.getMyMeetingDetail(m.id);
          setMeetingDetail(m.id, response.data);
        } catch (err) {
          setMeetingError(
            m.id,
            err instanceof Error
              ? err.message
              : "모임 정보를 불러오는데 실패했습니다."
          );
        } finally {
          setLoadingMeetingId(m.id, false);
        }
      });
    }
  }, [
    data,
    setHomeData,
    getUnifiedMyMeetings,
    myIdFromData,
    setMeetingDetail,
    setLoadingMeetingId,
    setMeetingError,
  ]);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(deviceDetection.isMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 에러 발생 시 알림 모달 표시
  React.useEffect(() => {
    if (error) {
      alert.error(error, "정보를 불러올 수 없습니다");
    }
  }, [error, alert]);

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "recruiting":
        return "모집 중";
      case "ready":
        return "시작 대기";
      case "active":
        return "진행 중";
      case "completed":
        return "완료";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recruiting":
        return "warning"; // 주황
      case "ready":
        return "primary"; // 파랑
      case "active":
        return "success"; // 초록
      case "completed":
        return "disabled"; // 회색
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

  const toggleTabExpansion = (tab: MyMeetingTab) => {
    setExpandedTabs((prev) => {
      const next = new Set(prev);
      if (next.has(tab)) next.delete(tab);
      else next.add(tab);
      return next;
    });
  };

  // 통합 탭 판정기: 서버 status 우선 + 시간기반 보강 + 그레이스 윈도우 (외부에서도 사용 가능하도록 추출)
  const computeMeetingTab = (m: {
    status: string;
    scheduledAt: string;
    recruitUntil?: string;
  }): MyMeetingTab => {
    const raw = (m.status || "").toLowerCase();

    // 1) 서버가 completed라고 주면 그대로 신뢰 (최우선)
    if (raw === "completed") return "completed";

    // 2) 서버가 active라고 주면 그대로 신뢰
    if (raw === "active") return "active";

    // 3) 서버가 ready라고 주면 그대로 신뢰
    if (raw === "ready") return "ready";

    // 4) 서버가 recruiting라고 주면 그대로 신뢰
    if (raw === "recruiting") return "recruiting";

    // 5) 서버 상태가 없거나 알 수 없는 경우에만 시간 기반 판정
    const now = Date.now();
    const sch = m?.scheduledAt ? Date.parse(m.scheduledAt) : NaN;
    const rec = m?.recruitUntil ? Date.parse(m.recruitUntil) : NaN;

    // 그레이스: 시작 15분 전부터 "활동 진행"으로 취급 (호스트/참가자 QR/방 진입 등 UX 위해)
    // active 창: 시작 ~ 시작 + 12시간
    if (!Number.isNaN(sch)) {
      const preActiveStart = sch - 15 * 60 * 1000; // -15m
      const activeEnd = sch + 12 * 60 * 60 * 1000; // +12h
      if (now >= preActiveStart && now < activeEnd) {
        return "active";
      }
      if (now < sch) {
        // 시작 전
        if (!Number.isNaN(rec)) {
          // 모집마감전이면 recruiting, 마감~시작 전이면 ready
          return now < rec ? "recruiting" : "ready";
        }
        // recruitUntil이 없으면 시작 전은 ready로 본다
        return "ready";
      }
      // 시작 +12h 넘었으면 completed
      return "completed";
    }

    // scheduledAt이 없고 recruitUntil만 있을 때의 fallback
    if (!Number.isNaN(rec)) {
      return now < rec ? "recruiting" : "ready";
    }

    // 정보가 아예 없으면 가장 무해한 값
    return "recruiting";
  };

  const filterMeetingsByTab = (
    meetings: Array<{
      id: string;
      title: string;
      status: string;
      scheduledAt: string;
      recruitUntil?: string;
      isHost?: boolean;
      participantCount?: number;
      currentParticipants?: number;
      mission?: {
        basePoints?: number;
      };
    }>,
    tab: MyMeetingTab
  ) => {
    if (!meetings) return [];

    return meetings.filter((m) => computeMeetingTab(m) === tab);
  };

  if (loading) return <HomeSkeleton />;

  if (error) {
    return (
      <PageContainer $isMobile={isMobile}>
        <ErrorContainer $isMobile={isMobile}>
          <ErrorText $isMobile={isMobile}>
            데이터를 불러올 수 없습니다
          </ErrorText>
          <RetryButton $isMobile={isMobile} onClick={refetch}>
            다시 시도
          </RetryButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  if (!data) return null;

  return (
    <PageContainer $isMobile={isMobile}>
      <ContentContainer $isMobile={isMobile}>
        {/* 메인 배너 */}
        <BannerSection $isMobile={isMobile}>
          <BannerImage
            $isMobile={isMobile}
            src={mainBannerImage}
            alt="할사람 메인 배너"
            onClick={() => {
              // 필요시 배너 클릭 이벤트 처리
            }}
          />
        </BannerSection>

        {/* 최근 활동 */}
        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>
            <Activity
              size={isMobile ? 18 : 20}
              style={{ marginRight: "8px" }}
            />
            최근 활동
          </SectionTitle>
          <SectionContent>
            {data.activityLogs &&
            (data.activityLogs as Array<ActivityLogType>).length > 0 ? (
              (data.activityLogs as Array<ActivityLogType>)
                .slice(0, 3)
                .map((log) => (
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

        {/* 활동 진행 중인 모임 */}
        {(() => {
          const activeMeetings = filterMeetingsByTab(
            myMeetingsUnified || [],
            "active"
          );

          if (activeMeetings.length === 0) return null;

          return (
            <Section $isMobile={isMobile}>
              <SectionTitle $isMobile={isMobile}>
                <Zap size={isMobile ? 18 : 20} style={{ marginRight: "8px" }} />
                진행 중인 번개모임
              </SectionTitle>
              <SectionContent>
                {activeMeetings.map((meeting) => {
                  const computedStatus = computeMeetingTab(meeting);
                  return (
                    <MyMeetingCard
                      key={meeting.id}
                      $isMobile={isMobile}
                      onClick={() => handleMyMeetingClick(meeting.id)}
                    >
                      <MyMeetingHeader>
                        <HotMeetingTitle $isMobile={isMobile}>
                          {meeting.title}
                        </HotMeetingTitle>
                        <MyMeetingStatus>
                          {meeting.isHost && (
                            <HostBadge $isMobile={isMobile}>
                              <Crown size={isMobile ? 12 : 14} />
                              호스트
                            </HostBadge>
                          )}
                          <StatusBadge
                            $color={getStatusColor(computedStatus)}
                            $isMobile={isMobile}
                          >
                            {getStatusText(computedStatus)}
                          </StatusBadge>
                        </MyMeetingStatus>
                      </MyMeetingHeader>

                      <HotMeetingMeta>
                        <MetaItem>
                          <MetaIcon>
                            <Users size={isMobile ? 12 : 14} />
                          </MetaIcon>
                          <MetaText $isMobile={isMobile}>
                            {meeting.participantCount ??
                              meeting.currentParticipants}
                            명 참여
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
                  );
                })}
              </SectionContent>
            </Section>
          );
        })()}

        {/* 내 모임 - 탭 */}
        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>
            <Calendar
              size={isMobile ? 18 : 20}
              style={{ marginRight: "8px" }}
            />
            내 모임 현황
          </SectionTitle>
          <SectionContent>
            <TabContainer>
              <TabButton
                $active={activeTab === "recruiting"}
                $isMobile={isMobile}
                onClick={() => setActiveTab("recruiting")}
              >
                참여자 모집
              </TabButton>
              <TabButton
                $active={activeTab === "ready"}
                $isMobile={isMobile}
                onClick={() => setActiveTab("ready")}
              >
                시작 대기
              </TabButton>
              <TabButton
                $active={activeTab === "completed"}
                $isMobile={isMobile}
                onClick={() => setActiveTab("completed")}
              >
                활동 종료
              </TabButton>
            </TabContainer>

            <TabContent>
              {(() => {
                // active 탭은 제외하고 필터링 (활동 진행 중인 모임은 별도 섹션으로 분리)
                const allFiltered = filterMeetingsByTab(
                  myMeetingsUnified || [],
                  activeTab
                );
                const filtered = activeTab === "active" ? [] : allFiltered;

                if (filtered.length > 0) {
                  const isExpanded = expandedTabs.has(activeTab);
                  const displayed = isExpanded
                    ? filtered
                    : filtered.slice(0, 3);
                  const remainingCount = Math.max(filtered.length - 3, 0);

                  return (
                    <>
                      {displayed.map((meeting) => {
                        // 계산된 상태를 사용하여 UI에 표시
                        const computedStatus = computeMeetingTab(meeting);
                        return (
                          <MyMeetingCard
                            key={meeting.id}
                            $isMobile={isMobile}
                            onClick={() => handleMyMeetingClick(meeting.id)}
                          >
                            <MyMeetingHeader>
                              <HotMeetingTitle $isMobile={isMobile}>
                                {meeting.title}
                              </HotMeetingTitle>
                              <MyMeetingStatus>
                                {meeting.isHost && (
                                  <HostBadge $isMobile={isMobile}>
                                    <Crown size={isMobile ? 12 : 14} />
                                    호스트
                                  </HostBadge>
                                )}
                                <StatusBadge
                                  $color={getStatusColor(computedStatus)}
                                  $isMobile={isMobile}
                                >
                                  {getStatusText(computedStatus)}
                                </StatusBadge>
                              </MyMeetingStatus>
                            </MyMeetingHeader>

                            <HotMeetingMeta>
                              <MetaItem>
                                <MetaIcon>
                                  <Users size={isMobile ? 12 : 14} />
                                </MetaIcon>
                                <MetaText $isMobile={isMobile}>
                                  {meeting.participantCount ??
                                    meeting.currentParticipants}
                                  명 참여
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
                        );
                      })}

                      {filtered.length > 3 && !isExpanded && (
                        <ViewMoreButton
                          $isMobile={isMobile}
                          onClick={() => toggleTabExpansion(activeTab)}
                        >
                          +{remainingCount}개 더보기
                        </ViewMoreButton>
                      )}
                      {filtered.length > 3 && isExpanded && (
                        <ViewMoreButton
                          $isMobile={isMobile}
                          onClick={() => toggleTabExpansion(activeTab)}
                        >
                          접기
                        </ViewMoreButton>
                      )}
                    </>
                  );
                }

                return (
                  <EmptyState $isMobile={isMobile}>
                    <EmptyText $isMobile={isMobile}>
                      {activeTab === "recruiting" &&
                        "참여자 모집 중인 모임이 없습니다"}
                      {activeTab === "ready" &&
                        "시작 대기 중인 모임이 없습니다"}
                      {activeTab === "completed" &&
                        "활동 종료된 모임이 없습니다"}
                    </EmptyText>
                  </EmptyState>
                );
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

        {/* HOT한 번개모임 */}
        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>
            <Flame
              size={isMobile ? 18 : 20}
              style={{ marginRight: "8px", color: "#ff6b35" }}
            />
            HOT한 번개모임
          </SectionTitle>
          <SectionContent>
            {data.hotMeetings &&
            (data.hotMeetings as Array<HotMeetingType>).length > 0 ? (
              <>
                {(data.hotMeetings as Array<HotMeetingType>)
                  .slice(0, 3)
                  .map((meeting) => (
                    <HotMeetingCard
                      key={meeting.id}
                      $isMobile={isMobile}
                      onClick={() => handleHotMeetingClick(meeting.id)}
                    >
                      {/* 지역 태그 */}
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
                              {(() => {
                                const d = (
                                  meeting.mission?.difficulty || "medium"
                                ).toLowerCase();
                                switch (d) {
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
                                    return d;
                                }
                              })()}
                            </DifficultyBadge>
                            <PointBadge
                              $point={meeting.mission?.basePoints || 0}
                            >
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

                        {/* 호스트 정보 */}
                        {meeting.host && (
                          <HostSection $isMobile={isMobile}>
                            <HostAvatarWrapper>
                              <HostAvatar
                                $isMobile={isMobile}
                                src={
                                  meeting.host.profileImageUrl ||
                                  "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"
                                }
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
                                  {meeting.host.points !== undefined
                                    ? formatLevel(
                                        meeting.host.level,
                                        meeting.host.points
                                      )
                                    : `Lv.${meeting.host.level || 1}`}
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

                        {/* 참가자 아바타 */}
                        {meeting.participants &&
                          meeting.participants.length > 0 && (
                            <ParticipantsSection $isMobile={isMobile}>
                              <ParticipantsTitle $isMobile={isMobile}>
                                현재 참가자 ({meeting.currentParticipants}명)
                              </ParticipantsTitle>
                              <ParticipantAvatars>
                                {meeting.participants
                                  .slice(0, 4)
                                  .map((p: ParticipantType, idx: number) => (
                                    <ParticipantAvatar
                                      key={idx}
                                      $isMobile={isMobile}
                                      src={
                                        p.profileImageUrl ||
                                        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"
                                      }
                                      alt={`참가자 ${idx + 1}`}
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

        {/* 맞춤형 추천 */}
        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>
            <Target
              size={isMobile ? 18 : 20}
              style={{ marginRight: "8px", color: "#8b5cf6" }}
            />
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
