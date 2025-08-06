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

// 컨테이너 스타일들
const PageContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
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

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userStats = {
    points: 1250,
    completedMissions: 8,
    activeMeetings: 3,
  };

  const recentActivities = [
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
