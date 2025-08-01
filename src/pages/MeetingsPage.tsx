import React from "react";
import styled from "styled-components";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  User as UserIcon,
  Crown,
  Rocket,
  Search,
  RotateCcw,
} from "lucide-react";
import { deviceDetection } from "../utils/deviceDetection";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
  position: relative;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray400};
  }

  /* 모바일에서 터치 스크롤 최적화 및 스크롤바 숨김 */
  @media (max-width: 1024px) {
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;

    /* 모바일에서 스크롤바 숨김 */
    &::-webkit-scrollbar {
      display: none;
    }

    /* Firefox에서도 스크롤바 숨김 */
    scrollbar-width: none;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  min-height: 100%;
`;

const StatusCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  text-align: center;
`;

const StatusIcon = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatusTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const StatusDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const FilterSection = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
`;

const FilterTabs = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterTab = styled.button<{ $isActive: boolean; $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "8px 16px" : "10px 20px")};
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.border};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.white};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  outline: none;

  /* 데스크톱에서만 hover 효과 */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ $isActive, theme }) =>
        $isActive ? theme.colors.primary : theme.colors.gray100};
      border-color: ${({ $isActive, theme }) =>
        $isActive ? theme.colors.primary : theme.colors.gray300};
    }
  }

  /* 클릭/터치 피드백 */
  &:active {
    transform: scale(0.95);
  }
`;

const MeetingCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  /* 데스크톱에서만 hover 효과 */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }
  }

  /* 클릭/터치 피드백 */
  &:active {
    transform: scale(0.98);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const MeetingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const MeetingInfo = styled.div`
  flex: 1;
`;

const MeetingTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px 0;
  line-height: 1.3;
`;

const MeetingSubtitle = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const MeetingMeta = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const MetaItem = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TimeRemaining = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "4px 8px" : "6px 10px")};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  font-weight: 600;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
`;

const HostInfo = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const HostAvatar = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  position: relative;
`;

const CrownIcon = styled.div<{ $isMobile?: boolean }>`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  width: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  height: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isMobile }) => ($isMobile ? "8px" : "9px")};
  border: 1px solid ${({ theme }) => theme.colors.white};
`;

const HostSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EmptyState = styled.div<{ $isMobile?: boolean }>`
  text-align: center;
  padding: ${({ $isMobile }) => ($isMobile ? "40px 20px" : "60px 20px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyIcon = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyText = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  margin: 0;
`;

const HostName = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const JoinButton = styled.button<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "8px 16px" : "10px 20px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray700};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray300};
    cursor: not-allowed;
  }
`;

// 플로팅 새로고침 버튼
const FloatingRefreshButton = styled.button<{
  $isMobile?: boolean;
  $isRefreshing: boolean;
}>`
  position: fixed;
  bottom: ${({ $isMobile }) => ($isMobile ? "100px" : "24px")};
  right: 24px;
  width: ${({ $isMobile }) => ($isMobile ? "48px" : "56px")};
  height: ${({ $isMobile }) => ($isMobile ? "48px" : "56px")};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  transition: all 0.2s ease;

  /* 데스크톱에서는 숨김 */
  @media (min-width: 1024px) {
    display: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray400};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray400};
    cursor: not-allowed;
    transform: none;
  }

  svg {
    animation: ${({ $isRefreshing }) =>
      $isRefreshing ? "spin 1s linear infinite" : "none"};
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1024px) {
    background: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.white};
  }
`;

const getTimeRemaining = (dateStr: string, timeStr: string) => {
  const meetingDateTime = new Date(`${dateStr} ${timeStr}`);
  const now = new Date();
  const diffInMs = meetingDateTime.getTime() - now.getTime();

  if (diffInMs <= 0) return "시작됨";

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffInDays > 0) {
    if (diffInHours > 0) {
      return `${diffInDays}일 ${diffInHours}시간`;
    }
    return `${diffInDays}일`;
  }

  if (diffInHours > 0) {
    if (diffInMinutes > 0) {
      return `${diffInHours}시간 ${diffInMinutes}분`;
    }
    return `${diffInHours}시간`;
  }

  return `${diffInMinutes}분 후`;
};

export const MeetingsPage: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [activeFilter, setActiveFilter] = React.useState("recruiting");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // 새로고침 기능
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // API 호출이나 데이터 새로고침 로직
    await new Promise((resolve) => setTimeout(resolve, 1500)); // 시뮬레이션
    setIsRefreshing(false);
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filters = [
    { id: "recruiting", label: "모집중" },
    { id: "my-meetings", label: "내 모임" },
    { id: "completed", label: "완료된 모임" },
    { id: "all", label: "전체" },
  ];

  const meetings = [
    {
      id: 1,
      title: "송파구 맛집 탐방 모임",
      description: "송파구 유명 맛집 3곳을 함께 방문해요!",
      mission: "송파구 맛집 3곳 방문하기",
      host: "김모임",
      participants: "3/6명",
      date: "2024-12-01",
      time: "14:00",
      displayDate: "12월 1일",
      displayTime: "14:00",
      location: "송파구 일대",
      status: "recruiting" as const,
      points: 500,
    },
    {
      id: 2,
      title: "한강공원 러닝 모임",
      description: "함께 뛰며 건강도 챙기고 포인트도 받아요!",
      mission: "한강공원 러닝 5km 완주",
      host: "박러너",
      participants: "6/8명",
      date: "2024-12-02",
      time: "07:00",
      displayDate: "12월 2일",
      displayTime: "07:00",
      location: "한강공원 잠실대교",
      status: "recruiting" as const,
      points: 800,
    },
    {
      id: 3,
      title: "롯데월드 어트랙션 체험",
      description: "스릴 넘치는 어트랙션을 함께 즐겨요!",
      mission: "롯데월드 어트랙션 체험",
      host: "이재미",
      participants: "8/10명",
      date: "2024-12-03",
      time: "10:00",
      displayDate: "12월 3일",
      displayTime: "10:00",
      location: "롯데월드",
      status: "full" as const,
      points: 1200,
    },
    {
      id: 4,
      title: "석촌호수 산책 모임",
      description: "석촌호수를 걸으며 같이 여유로운 시간을 보내요!",
      mission: "석촌호수 둘레길 완주",
      host: "디카프리오",
      participants: "5/6명",
      date: "2024-11-10",
      time: "16:00",
      displayDate: "11월 10일",
      displayTime: "16:00",
      location: "석촌호수",
      status: "completed" as const,
      points: 300,
    },
  ];

  const filteredMeetings = meetings.filter((meeting) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "recruiting") return meeting.status === "recruiting";
    if (activeFilter === "my-meetings") return false; // 임시로 빈 결과
    if (activeFilter === "completed") return meeting.status === "completed";
    return true;
  });

  const activeMeetingsCount = meetings.filter(
    (m) => m.status === "recruiting"
  ).length;

  return (
    <PageContainer $isMobile={isMobile}>
      <ContentWrapper>
        <StatusCard $isMobile={isMobile}>
          <StatusIcon $isMobile={isMobile}>
            <Rocket size={isMobile ? 32 : 40} />
          </StatusIcon>
          <StatusTitle $isMobile={isMobile}>
            현재 {activeMeetingsCount}개의 모임이 모집 중입니다
          </StatusTitle>
          <StatusDescription $isMobile={isMobile}>
            지금 바로 참여하여 새로운 사람들과 함께 미션을 수행해보세요!
          </StatusDescription>
        </StatusCard>

        <FilterSection $isMobile={isMobile}>
          <FilterTabs $isMobile={isMobile}>
            {filters.map((filter) => (
              <FilterTab
                key={filter.id}
                $isActive={activeFilter === filter.id}
                $isMobile={isMobile}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </FilterTab>
            ))}
          </FilterTabs>
        </FilterSection>

        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} $isMobile={isMobile}>
              <MeetingHeader>
                <MeetingInfo>
                  <MeetingTitle $isMobile={isMobile}>
                    {meeting.title}
                  </MeetingTitle>
                  <MeetingSubtitle $isMobile={isMobile}>
                    {meeting.description}
                  </MeetingSubtitle>
                </MeetingInfo>
                {meeting.status === "recruiting" && (
                  <TimeRemaining $isMobile={isMobile}>
                    {getTimeRemaining(meeting.date, meeting.time)}
                  </TimeRemaining>
                )}
              </MeetingHeader>

              <MeetingMeta $isMobile={isMobile}>
                <MetaItem $isMobile={isMobile}>
                  <Calendar size={14} />
                  {meeting.displayDate}
                </MetaItem>
                <MetaItem $isMobile={isMobile}>
                  <Clock size={14} />
                  {meeting.displayTime}
                </MetaItem>
                <MetaItem $isMobile={isMobile}>
                  <MapPin size={14} />
                  {meeting.location}
                </MetaItem>
                <MetaItem $isMobile={isMobile}>
                  <Users size={14} />
                  {meeting.participants}
                </MetaItem>
                <MetaItem $isMobile={isMobile}>
                  <DollarSign size={14} />
                  {meeting.points}P 보상
                </MetaItem>
              </MeetingMeta>

              <HostInfo $isMobile={isMobile}>
                <HostSection>
                  <HostAvatar $isMobile={isMobile}>
                    <UserIcon size={isMobile ? 12 : 14} />
                    <CrownIcon $isMobile={isMobile}>
                      <Crown size={isMobile ? 6 : 7} />
                    </CrownIcon>
                  </HostAvatar>
                  <HostName $isMobile={isMobile}>{meeting.host}</HostName>
                </HostSection>
                {meeting.status === "recruiting" && (
                  <JoinButton $isMobile={isMobile}>참여하기</JoinButton>
                )}
              </HostInfo>
            </MeetingCard>
          ))
        ) : (
          <EmptyState $isMobile={isMobile}>
            <EmptyIcon $isMobile={isMobile}>
              <Search size={isMobile ? 48 : 64} />
            </EmptyIcon>
            <EmptyText $isMobile={isMobile}>
              {filters.find((f) => f.id === activeFilter)?.label} 카테고리에
              모임이 없습니다.
            </EmptyText>
          </EmptyState>
        )}
      </ContentWrapper>

      {/* 플로팅 새로고침 버튼 */}
      <FloatingRefreshButton
        $isMobile={isMobile}
        $isRefreshing={isRefreshing}
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="새로고침"
      >
        <RotateCcw size={isMobile ? 18 : 20} />
      </FloatingRefreshButton>
    </PageContainer>
  );
};
