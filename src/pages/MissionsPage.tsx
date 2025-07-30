import React from "react";
import styled from "styled-components";
import { Clock, Users, BarChart3, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deviceDetection } from "../utils/deviceDetection";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
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

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.gray50};
  }
`;

const MissionCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const MissionInfo = styled.div`
  flex: 1;
  margin-right: 16px;
`;

const MissionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const MissionDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

const PointBadge = styled.div<{ $isMobile?: boolean }>`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.success},
    ${({ theme }) => theme.colors.success}E6
  );
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 16px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
  text-align: center;
  min-width: ${({ $isMobile }) => ($isMobile ? "70px" : "80px")};
`;

const MissionMeta = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const MetaItem = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ $isMobile }) => ($isMobile ? "8px" : "10px")};
  text-align: center;
`;

const MetaIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MetaValue = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const MetaLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
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

export const MissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [activeFilter, setActiveFilter] = React.useState("all");

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filters = [
    { id: "all", label: "전체" },
    { id: "food", label: "음식" },
    { id: "sports", label: "운동" },
    { id: "culture", label: "문화" },
    { id: "social", label: "사교" },
  ];

  const missions = [
    {
      id: 1,
      title: "송파구 맛집 3곳 방문하기",
      description:
        "송파구 내 인기 맛집 3곳을 방문하고 인증 사진을 업로드하세요.",
      category: "food",
      points: 500,
      duration: "2시간",
      difficulty: "쉬움",
      participants: "4-6명",
    },
    {
      id: 2,
      title: "한강공원 러닝 5km 완주",
      description: "한강공원에서 5km 러닝을 완주하고 기록을 인증하세요.",
      category: "sports",
      points: 800,
      duration: "1시간",
      difficulty: "보통",
      participants: "3-8명",
    },
    {
      id: 3,
      title: "롯데월드 어트랙션 체험",
      description:
        "롯데월드에서 5개 이상의 어트랙션을 체험하고 사진을 공유하세요.",
      category: "culture",
      points: 1200,
      duration: "4시간",
      difficulty: "어려움",
      participants: "4-10명",
    },
  ];

  const filteredMissions =
    activeFilter === "all"
      ? missions
      : missions.filter((mission) => mission.category === activeFilter);

  const handleMissionClick = (missionId: number) => {
    navigate(`/mission/${missionId}`);
  };

  return (
    <PageContainer $isMobile={isMobile}>
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

      {filteredMissions.length > 0 ? (
        filteredMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            $isMobile={isMobile}
            onClick={() => handleMissionClick(mission.id)}
          >
            <MissionHeader>
              <MissionInfo>
                <MissionTitle $isMobile={isMobile}>
                  {mission.title}
                </MissionTitle>
                <MissionDescription $isMobile={isMobile}>
                  {mission.description}
                </MissionDescription>
              </MissionInfo>
              <PointBadge $isMobile={isMobile}>+{mission.points}P</PointBadge>
            </MissionHeader>

            <MissionMeta $isMobile={isMobile}>
              <MetaItem $isMobile={isMobile}>
                <MetaIcon>
                  <Clock size={isMobile ? 14 : 16} />
                </MetaIcon>
                <MetaValue $isMobile={isMobile}>{mission.duration}</MetaValue>
                <MetaLabel $isMobile={isMobile}>예상 시간</MetaLabel>
              </MetaItem>
              <MetaItem $isMobile={isMobile}>
                <MetaIcon>
                  <Users size={isMobile ? 14 : 16} />
                </MetaIcon>
                <MetaValue $isMobile={isMobile}>
                  {mission.participants}
                </MetaValue>
                <MetaLabel $isMobile={isMobile}>참여 인원</MetaLabel>
              </MetaItem>
              <MetaItem $isMobile={isMobile}>
                <MetaIcon>
                  <BarChart3 size={isMobile ? 14 : 16} />
                </MetaIcon>
                <MetaValue $isMobile={isMobile}>{mission.difficulty}</MetaValue>
                <MetaLabel $isMobile={isMobile}>난이도</MetaLabel>
              </MetaItem>
            </MissionMeta>
          </MissionCard>
        ))
      ) : (
        <EmptyState $isMobile={isMobile}>
          <EmptyIcon $isMobile={isMobile}>
            <Search size={isMobile ? 48 : 64} />
          </EmptyIcon>
          <EmptyText $isMobile={isMobile}>
            {filters.find(f => f.id === activeFilter)?.label} 카테고리에 미션이 없습니다.
          </EmptyText>
        </EmptyState>
      )}
    </PageContainer>
  );
};
