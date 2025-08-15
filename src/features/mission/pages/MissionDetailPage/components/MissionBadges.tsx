import React from "react";
import styled from "styled-components";
import type { MissionBadgesProps } from "../types";
import { getCategoryLabel } from "../../../../../data/categories";

const MissionBadgesContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const DifficultyBadge = styled.div<{ $difficulty: string }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 12px;
  font-weight: 600;
  background: ${({ $difficulty }) => {
    switch ($difficulty?.toLowerCase()) {
      case "very_easy":
      case "매우 쉬움":
        return "#22C55E"; // 녹색 - 매우 쉬움
      case "easy":
      case "쉬움":
        return "#10B981"; // 청녹색 - 쉬움
      case "medium":
      case "보통":
        return "#F59E0B"; // 노란색 - 보통
      case "hard":
      case "어려움":
        return "#EF4444"; // 빨간색 - 어려움
      case "very_hard":
      case "매우 어려움":
        return "#B91C1C"; // 진한 빨간색 - 매우 어려움
      default:
        return "#6B7280";
    }
  }};
  color: white;
`;

const CategoryBadge = styled.div`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 12px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  backdrop-filter: blur(8px);
`;

const getDifficultyText = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "very_easy": return "매우 쉬움";
    case "easy": return "쉬움";
    case "medium": return "보통";
    case "hard": return "어려움";
    case "very_hard": return "매우 어려움";
    // 백엔드 enum 대응
    case "매우 쉬움": return "매우 쉬움";
    case "쉬움": return "쉬움";
    case "보통": return "보통";
    case "어려움": return "어려움";
    case "매우 어려움": return "매우 어려움";
    default: 
      console.warn('Unknown difficulty value:', difficulty);
      return difficulty || "보통";
  }
};

export const MissionBadges: React.FC<MissionBadgesProps> = ({
  difficulty,
  categories,
}) => {
  return (
    <MissionBadgesContainer>
      <DifficultyBadge $difficulty={difficulty}>
        {getDifficultyText(difficulty)}
      </DifficultyBadge>
      {categories.map((cat, index) => (
        <CategoryBadge key={index}>{getCategoryLabel(cat)}</CategoryBadge>
      ))}
    </MissionBadgesContainer>
  );
};