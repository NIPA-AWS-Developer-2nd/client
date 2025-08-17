import React from "react";
import styled from "styled-components";
import { Clock, Users, BarChart3, CheckCircle } from "lucide-react";
import type { Mission } from "../../../../features/home/types/home.types";
import type { MissionWithDetails } from "../../../../shared/store/missionStore";
import { getCategoryLabel } from "../../../../data/categories";
// import AITicketIcon from "../../../../assets/images/ai-ticket.svg";

interface MissionCardProps {
  mission: Mission | MissionWithDetails;
  isMobile?: boolean;
  onClick?: () => void;
  isClickable?: boolean;
}

const MissionCard = styled.div<{ $isMobile?: boolean; $isCompleted?: boolean; $isClickable?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  overflow: hidden;
  position: relative;
  ${({ $isCompleted, theme }) => 
    $isCompleted && `
      border: 2px solid ${theme.colors.primary};
      color: ${theme.colors.primary};
    `}
  transition: ${({ theme }) => theme.transitions.fast};
  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "default")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
  ${({ $isMobile }) =>
    !$isMobile &&
    `
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  `}
`;

const MissionThumbnail = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  width: 100%;
  height: ${({ $isMobile }) => ($isMobile ? "180px" : "160px")};
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MissionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PointBadgeOverlay = styled.div<{ $isMobile?: boolean; $point: number }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: ${({ $isMobile }) => ($isMobile ? "6px 10px" : "8px 12px")};
  border-radius: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  font-weight: 800;
  color: white;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  ${({ $point }) => {
    if ($point < 500) {
      return `
        background: linear-gradient(135deg, #F3F4F6, #E5E7EB);
        box-shadow: 0 2px 8px rgba(156, 163, 175, 0.3);
        color: #6B7280;
      `;
    } else if ($point < 1000) {
      return `
        background: linear-gradient(135deg, #DBEAFE, #93C5FD, #60A5FA);
        box-shadow: 0 2px 8px rgba(147, 197, 253, 0.4);
      `;
    } else if ($point < 1500) {
      return `
        background: linear-gradient(135deg, #D1FAE5, #86EFAC, #4ADE80);
        box-shadow: 0 2px 8px rgba(134, 239, 172, 0.4);
      `;
    } else if ($point < 2000) {
      return `
        background: linear-gradient(135deg, #E0E7FF, #C4B5FD, #A78BFA);
        box-shadow: 0 2px 8px rgba(196, 181, 253, 0.4);
      `;
    } else {
      return `
        background: linear-gradient(135deg, #FED7AA, #FDBA74, #FB923C);
        box-shadow: 0 2px 8px rgba(253, 215, 170, 0.4);
      `;
    }
  }}
`;

const CompletedBadge = styled.div<{ $isMobile?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 20px" : "16px 24px")};
  border-radius: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  border: 2px solid white;
`;

const MissionContent = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const MissionHeader = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const CategoryTags = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const CategoryTag = styled.span<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "3px 8px" : "4px 10px")};
  border-radius: ${({ $isMobile }) => ($isMobile ? "10px" : "12px")};
  background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
  color: #666666;
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  font-weight: 600;
`;

const MissionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const MissionDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
  margin: 0;
`;

const MissionMeta = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const MetaItem = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "4px" : "6px")};
  padding: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const MetaIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
`;

const MetaValue = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MetaLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

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

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "very_easy":
      return "#22c55e"; // green-500
    case "easy":
      return "#10b981"; // emerald-500
    case "medium":
      return "#f59e0b"; // amber-500
    case "hard":
      return "#ef4444"; // red-500
    case "very_hard":
      return "#dc2626"; // red-600
    default:
      return "#6b7280"; // gray-500
  }
};

// Helper function to normalize mission data
const normalizeMissionData = (mission: Mission | MissionWithDetails) => {
  // Check if it's MissionWithDetails (from store) by checking for 'point' property
  const isMissionWithDetails = 'point' in mission;
  
  return {
    basePoints: isMissionWithDetails ? (mission as MissionWithDetails).point : (mission as Mission).basePoints,
    estimatedDuration: isMissionWithDetails ? (mission as MissionWithDetails).duration : (mission as Mission).estimatedDuration,
    participants: mission.participants,
    difficulty: mission.difficulty,
    category: isMissionWithDetails 
      ? (mission as MissionWithDetails).category[0] || 'general' // Take first category from array
      : (mission as Mission).category?.name || 'general',
    isCompleted: 'isCompleted' in mission ? mission.isCompleted : false,
    thumbnailUrl: mission.thumbnailUrl,
    title: mission.title,
    description: mission.description,
  };
};

export const MissionCardComponent: React.FC<MissionCardProps> = ({
  mission,
  isMobile = false,
  onClick,
  isClickable = true,
}) => {
  const normalizedMission = normalizeMissionData(mission);

  return (
    <MissionCard
      $isMobile={isMobile}
      $isCompleted={normalizedMission.isCompleted}
      $isClickable={isClickable}
      onClick={isClickable ? onClick : undefined}
    >
      <MissionThumbnail $isMobile={isMobile}>
        <MissionImage
          src={normalizedMission.thumbnailUrl}
          alt={normalizedMission.title}
          loading="lazy"
          onError={(e) => {
            console.log("Image failed to load:", normalizedMission.thumbnailUrl);
            e.currentTarget.style.display = "none";
          }}
        />
        <PointBadgeOverlay $isMobile={isMobile} $point={normalizedMission.basePoints || 0}>
          +{normalizedMission.basePoints || 0}P
        </PointBadgeOverlay>
        {normalizedMission.isCompleted && (
          <CompletedBadge $isMobile={isMobile}>
            <CheckCircle size={isMobile ? 16 : 18} />
            CLEAR!
          </CompletedBadge>
        )}
      </MissionThumbnail>
      <MissionContent $isMobile={isMobile}>
        <MissionHeader $isMobile={isMobile}>
          <CategoryTags>
            {normalizedMission.category && (
              <CategoryTag $isMobile={isMobile}>
                {getCategoryLabel(normalizedMission.category)}
              </CategoryTag>
            )}
          </CategoryTags>
          <MissionTitle $isMobile={isMobile}>
            {normalizedMission.title}
          </MissionTitle>
          <MissionDescription $isMobile={isMobile}>
            {normalizedMission.description}
          </MissionDescription>
        </MissionHeader>
        <MissionMeta $isMobile={isMobile}>
          <MetaItem $isMobile={isMobile}>
            <MetaIcon>
              <Clock size={isMobile ? 14 : 16} />
            </MetaIcon>
            <MetaValue $isMobile={isMobile}>
              {normalizedMission.estimatedDuration || 0}분
            </MetaValue>
            <MetaLabel $isMobile={isMobile}>예상 시간</MetaLabel>
          </MetaItem>
          <MetaItem $isMobile={isMobile}>
            <MetaIcon>
              <Users size={isMobile ? 14 : 16} />
            </MetaIcon>
            <MetaValue $isMobile={isMobile}>
              {normalizedMission.participants || 0}명
            </MetaValue>
            <MetaLabel $isMobile={isMobile}>참여 인원</MetaLabel>
          </MetaItem>
          <MetaItem $isMobile={isMobile}>
            <MetaIcon
              style={{ color: getDifficultyColor(normalizedMission.difficulty || 'medium') }}
            >
              <BarChart3 size={isMobile ? 14 : 16} />
            </MetaIcon>
            <MetaValue $isMobile={isMobile}>
              {getDifficultyText(normalizedMission.difficulty || 'medium')}
            </MetaValue>
            <MetaLabel $isMobile={isMobile}>난이도</MetaLabel>
          </MetaItem>
        </MissionMeta>
      </MissionContent>
    </MissionCard>
  );
};