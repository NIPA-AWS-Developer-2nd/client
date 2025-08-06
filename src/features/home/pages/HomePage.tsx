import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  ShoppingBag,
  Zap,
  Check,
  Gift,
} from "lucide-react";
import { deviceDetection } from "../../../shared/utils";
import { mockUserStats, mockRecentActivities } from "../../../data";
import {
  PageContainer,
  QuickActionsCard,
  QuickActionsTitle,
  QuickActionsGrid,
  ActionButton,
  ActionIcon,
  ActionText,
  StatsCard,
  StatsTitle,
  StatsGrid,
  StatItem,
  StatValue,
  StatLabel,
  RecentActivityCard,
  ActivityTitle,
  ActivityList,
  ActivityItem,
  ActivityIcon,
  ActivityContent,
  ActivityText,
  ActivityTime
} from "./HomePage/HomePage.styles";

export const HomePage: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // TODO: Replace with API call to fetch user stats
  const userStats = mockUserStats;

  // TODO: Replace with API call to fetch recent activities
  const recentActivities = mockRecentActivities.map(activity => ({
    ...activity,
    icon: activity.type === 'mission_complete' ? Check : 
          activity.type === 'meeting_joined' ? Users : Gift
  }));

  return (
    <PageContainer>
      <QuickActionsCard $isMobile={isMobile}>
        <QuickActionsTitle $isMobile={isMobile}>빠른 실행</QuickActionsTitle>
        <QuickActionsGrid $isMobile={isMobile}>
          <ActionButton
            $isMobile={isMobile}
            onClick={() => navigate("/missions")}
          >
            <ActionIcon $isMobile={isMobile}>
              <Zap size={isMobile ? 20 : 24} />
            </ActionIcon>
            <ActionText $isMobile={isMobile}>미션 찾기</ActionText>
          </ActionButton>
          <ActionButton
            $isMobile={isMobile}
            onClick={() => navigate("/meetings")}
          >
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
