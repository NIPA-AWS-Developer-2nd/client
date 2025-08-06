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
    switch ($difficulty) {
      case "EASY":
        return "#10B981";
      case "MEDIUM":
        return "#F59E0B";
      case "HARD":
        return "#EF4444";
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
  switch (difficulty) {
    case "EASY": return "쉬움";
    case "MEDIUM": return "보통";
    case "HARD": return "어려움";
    default: return "보통";
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