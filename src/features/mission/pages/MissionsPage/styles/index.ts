import styled from "styled-components";

// Container Styles
export const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
  ${({ $isMobile }) =>
    $isMobile &&
    `
    padding: 16px;
  `}
`;

// Filter Section Styles
export const FilterSection = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
`;

export const FilterHeader = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  width: 100%;
`;

export const FilterTabs = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  ${({ $isMobile }) =>
    $isMobile
      ? `
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    
    &::-webkit-scrollbar {
      display: none;
    }
  `
      : `
    flex-wrap: wrap;
    gap: 8px 12px;
    max-width: 100%;
  `}
`;

export const FilterTab = styled.button<{ $isActive: boolean; $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ $isMobile }) => ($isMobile ? "8px 16px" : "8px 14px")};
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.border};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.white};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "13px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    background: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.gray50};
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid #6366f1;
    box-shadow: none;
  }
`;

export const AdditionalFilters = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  margin-top: 16px;
  flex-wrap: wrap;
  align-items: center;
  ${({ $isMobile }) =>
    $isMobile &&
    `
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  `}
`;

export const FilterGroup = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ $isMobile }) =>
    $isMobile &&
    `
    width: 100%;
    justify-content: space-between;
  `}
`;

export const FilterLabel = styled.label`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  white-space: nowrap;
`;

export const FilterSelect = styled.select`
  padding: 8px 32px 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  appearance: none;
  background-image: ${({ theme }) =>
    theme.colors.background === "#2D3748"
      ? `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`
      : `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`};
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;

  &:hover {
  }

  &:focus {
    outline: none;
  }
`;

export const FilterActionsWrapper = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: ${({ $isMobile }) => ($isMobile ? "center" : "flex-end")};
  margin-top: ${({ $isMobile }) => ($isMobile ? "16px" : "12px")};
  width: 100%;
`;

export const ResetFiltersButton = styled.button<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "10px 20px" : "8px 16px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "13px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  min-width: ${({ $isMobile }) => ($isMobile ? "120px" : "auto")};

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// Mission Card Styles
export const MissionCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "16px")};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  ${({ $isMobile }) =>
    !$isMobile &&
    `
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  `}

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

export const MissionThumbnail = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  width: 100%;
  height: ${({ $isMobile }) => ($isMobile ? "180px" : "160px")};
  background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MissionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PointBadgeOverlay = styled.div<{ $isMobile?: boolean; $point: number }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: ${({ $isMobile }) => ($isMobile ? "6px 10px" : "8px 12px")};
  background: ${({ $point, theme }) => {
    const isDark = theme.colors.background === "#2D3748";
    return getPointBadgeColor($point, isDark).background;
  }};
  color: ${({ $point }) => ($point < 300 ? "#4B5563" : "#FFFFFF")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  font-weight: 800;
  box-shadow: 0 2px 6px
    ${({ $point, theme }) => {
      const isDark = theme.colors.background === "#2D3748";
      return getPointBadgeColor($point, isDark).shadow;
    }};
  text-shadow: ${({ $point }) =>
    $point < 300 ? "none" : "0 1px 2px rgba(0, 0, 0, 0.3)"};
`;

export const MissionContent = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "16px")};
`;

export const MissionHeader = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "12px")};
`;

export const CategoryTags = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const CategoryTag = styled.span<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "2px 6px" : "4px 8px")};
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  font-weight: 500;
`;

export const MissionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

export const MissionDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
  margin: 0;
`;

export const MissionMeta = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  flex-wrap: wrap;
`;

export const MetaItem = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "10px")};
`;

export const MetaIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
`;

export const MetaValue = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const MetaLabel = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Pagination Styles
export const PaginationContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  margin-top: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  padding-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

export const PaginationButton = styled.button<{
  $isActive?: boolean;
  $isMobile?: boolean;
}>`
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 14px")};
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.border};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.white};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 500)};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};

  &:hover:not(:disabled) {
    background: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.gray50};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Empty State Styles
export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 16px;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

// Utility function for point badge color
export const getPointBadgeColor = (
  point: number,
  isDark: boolean = false
): { background: string; shadow: string } => {
  if (point < 300) {
    return {
      background: isDark
        ? "linear-gradient(135deg, #E5E7EB, #D1D5DB)"
        : "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
      shadow: "rgba(156, 163, 175, 0.3)",
    };
  } else if (point < 600) {
    return {
      background: isDark
        ? "linear-gradient(135deg, #3B82F6, #1D4ED8, #1E40AF)"
        : "linear-gradient(135deg, #60A5FA, #3B82F6, #2563EB)",
      shadow: "rgba(59, 130, 246, 0.4)",
    };
  } else if (point < 1000) {
    return {
      background: isDark
        ? "linear-gradient(135deg, #10B981, #047857, #065F46)"
        : "linear-gradient(135deg, #34D399, #10B981, #059669)",
      shadow: "rgba(34, 197, 94, 0.4)",
    };
  } else if (point < 1500) {
    return {
      background: isDark
        ? "linear-gradient(135deg, #8B5CF6, #7C3AED, #6D28D9)"
        : "linear-gradient(135deg, #A78BFA, #8B5CF6, #7C3AED)",
      shadow: "rgba(139, 92, 246, 0.4)",
    };
  } else {
    return {
      background: isDark
        ? "linear-gradient(135deg, #F59E0B, #D97706, #B45309)"
        : "linear-gradient(135deg, #FBB040, #F59E0B, #EF8A0D)",
      shadow: "rgba(251, 146, 60, 0.4)",
    };
  }
};