import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Calendar,
  MapPin,
  Users,
  ShoppingBag,
  Zap,
  Check,
  Gift,
} from "lucide-react";
import { deviceDetection } from "../../../../shared/utils";
import { HomeSkeleton } from "../../components/HomeSkeleton";
import { useHomeData } from "../../hooks/useHomeData";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAlert } from "../../../../shared/components/common";
import { useLocationVerification } from "../../../../shared/hooks";
import { createLocationGuard } from "../../../../shared/utils/navigationGuards";

// 컨테이너 스타일들
const PageContainer = styled.div<{ $isMobile?: boolean }>`
  max-width: 100%;
  margin: 0 auto;
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "0")};
`;

const BannerContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  border-radius: ${({ $isMobile, theme }) => ($isMobile ? "0" : theme.borderRadius.lg)};
  overflow: hidden;
  position: relative;
  height: ${({ $isMobile }) => ($isMobile ? "150px" : "200px")};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.gray400}
  );
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const QuickActionsCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const QuickActionsTitle = styled.h2<{ $isMobile?: boolean }>`
  margin: 0 0 16px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const QuickActionsGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)"};
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const ActionButton = styled.button<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 12px" : "20px 16px")};
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }
`;

const ActionIcon = styled.div<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionText = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  font-weight: 500;
  text-align: center;
`;

const StatsCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StatsTitle = styled.h2<{ $isMobile?: boolean }>`
  margin: 0 0 16px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatsGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RecentActivityCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const ActivityTitle = styled.h2<{ $isMobile?: boolean }>`
  margin: 0 0 16px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const ActivityTime = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const HomePage: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const navigate = useNavigate();
  const { data: homeData, loading, error } = useHomeData();
  const { user: _user } = useAuth();
  const { warning } = useAlert();
  const { isVerified: isLocationVerified, isLoading: isLocationLoading } =
    useLocationVerification();

  // 디버깅용 로그
  React.useEffect(() => {
    console.log("🏠 HomePage - 위치 인증 상태:", {
      isLocationVerified,
      isLocationLoading,
    });
  }, [isLocationVerified, isLocationLoading]);

  // 지역 인증 가드 생성
  const locationGuard = createLocationGuard({
    isLocationVerified,
    isLocationLoading,
    showWarning: warning,
    navigate,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 로딩 상태일 때 스켈레톤 표시
  if (loading) {
    return <HomeSkeleton />;
  }

  // 에러 상태일 때 에러 메시지 표시
  if (error) {
    return (
      <PageContainer $isMobile={isMobile}>
        <div>데이터를 불러오는데 실패했습니다: {error}</div>
      </PageContainer>
    );
  }

  // 실제 데이터가 있으면 사용하고, 없으면 기본값 사용
  const userStats = {
    points: 1250,
    completedMissions: 8,
    activeMeetings:
      homeData?.myMeetings?.filter((m) => m.status === "active").length || 3,
  };

  // 실제 활동 로그 데이터 사용 (최대 3개)
  const recentActivities = homeData?.activityLogs?.slice(0, 3).map((log) => {
    const getActivityIcon = (type: string) => {
      switch (type) {
        case "meeting_joined":
          return Users;
        case "meeting_created":
          return Check;
        case "photo_verification_approved":
          return Gift;
        default:
          return Check;
      }
    };

    const getActivityText = (log: (typeof homeData.activityLogs)[0]) => {
      switch (log.type) {
        case "meeting_joined":
          return `${log.meeting?.title || "모임"}에 참여했습니다`;
        case "meeting_created":
          return `${log.meeting?.title || "모임"}을 생성했습니다`;
        case "photo_verification_approved":
          return "사진 인증이 승인되었습니다";
        default:
          return "활동을 완료했습니다";
      }
    };

    const getTimeAgo = (createdAt: string) => {
      const now = new Date();
      const created = new Date(createdAt);
      const diffInMinutes = Math.floor(
        (now.getTime() - created.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
      } else if (diffInMinutes < 60 * 24) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours}시간 전`;
      } else {
        const days = Math.floor(diffInMinutes / (60 * 24));
        return `${days}일 전`;
      }
    };

    return {
      icon: getActivityIcon(log.type),
      text: getActivityText(log),
      time: getTimeAgo(log.createdAt),
    };
  }) || [
    {
      icon: Check,
      text: "카페에서 새로운 친구 만나기 미션 완료",
      time: "2시간 전",
    },
    {
      icon: Users,
      text: "주말 등산 모임에 참여했습니다",
      time: "1일 전",
    },
    {
      icon: Gift,
      text: "포인트로 커피 쿠폰을 구매했습니다",
      time: "3일 전",
    },
  ];

  return (
    <PageContainer $isMobile={isMobile}>
      <QuickActionsCard $isMobile={isMobile}>
        <QuickActionsTitle $isMobile={isMobile}>빠른 실행</QuickActionsTitle>
        <QuickActionsGrid $isMobile={isMobile}>
          <ActionButton $isMobile={isMobile} onClick={locationGuard.toMissions}>
            <ActionIcon $isMobile={isMobile}>
              <Zap size={isMobile ? 20 : 24} />
            </ActionIcon>
            <ActionText $isMobile={isMobile}>미션 찾기</ActionText>
          </ActionButton>
          <ActionButton $isMobile={isMobile} onClick={locationGuard.toMeetings}>
            <ActionIcon $isMobile={isMobile}>
              <Calendar size={isMobile ? 20 : 24} />
            </ActionIcon>
            <ActionText $isMobile={isMobile}>모임 참여</ActionText>
          </ActionButton>
          <ActionButton $isMobile={isMobile}>
            <ActionIcon $isMobile={isMobile}>
              <MapPin size={isMobile ? 20 : 24} />
            </ActionIcon>
            <ActionText $isMobile={isMobile}>내 근처</ActionText>
          </ActionButton>
          <ActionButton
            $isMobile={isMobile}
            onClick={() => navigate("/market")}
          >
            <ActionIcon $isMobile={isMobile}>
              <ShoppingBag size={isMobile ? 20 : 24} />
            </ActionIcon>
            <ActionText $isMobile={isMobile}>포인트 사용</ActionText>
          </ActionButton>
        </QuickActionsGrid>
      </QuickActionsCard>

      <StatsCard $isMobile={isMobile}>
        <StatsTitle $isMobile={isMobile}>내 활동 현황</StatsTitle>
        <StatsGrid $isMobile={isMobile}>
          <StatItem>
            <StatValue $isMobile={isMobile}>
              {userStats.points.toLocaleString()}P
            </StatValue>
            <StatLabel $isMobile={isMobile}>보유 포인트</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue $isMobile={isMobile}>
              {userStats.completedMissions}
            </StatValue>
            <StatLabel $isMobile={isMobile}>완료 미션</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue $isMobile={isMobile}>
              {userStats.activeMeetings}
            </StatValue>
            <StatLabel $isMobile={isMobile}>참여 모임</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsCard>

      <BannerContainer $isMobile={isMobile}>
        배너 영역 테스트 - 최근 활동 위
      </BannerContainer>

      <RecentActivityCard $isMobile={isMobile}>
        <ActivityTitle $isMobile={isMobile}>최근 활동</ActivityTitle>
        <ActivityList>
          {recentActivities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <ActivityItem key={index}>
                <ActivityIcon $isMobile={isMobile}>
                  <IconComponent size={isMobile ? 16 : 18} />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText $isMobile={isMobile}>
                    {activity.text}
                  </ActivityText>
                  <ActivityTime $isMobile={isMobile}>
                    {activity.time}
                  </ActivityTime>
                </ActivityContent>
              </ActivityItem>
            );
          })}
        </ActivityList>
      </RecentActivityCard>
    </PageContainer>
  );
};
