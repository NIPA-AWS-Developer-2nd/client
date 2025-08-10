import React from "react";
import styled from "styled-components";
import {
  Clock,
  Users,
  BarChart3,
  Search,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Palette,
  Coffee,
  Dumbbell,
  Gamepad2,
  Camera,
  ShoppingBag,
  Music,
  Heart,
  Plane,
  Cat,
  type LucideIcon,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import type { Difficulty } from "../../../../types";
import { getCategoryLabel } from "../../../../data/categories";
import { useMissionStore } from "../../../../shared/store/missionStore";

// Lucide 아이콘 매핑
const getIconComponent = (iconName: string | null): LucideIcon | null => {
  if (!iconName) return null;
  
  const iconMap: Record<string, LucideIcon> = {
    Utensils,
    Palette,
    Coffee,
    Dumbbell,
    Gamepad2,
    Camera,
    ShoppingBag,
    Music,
    Heart,
    Plane,
    Cat,
  };
  
  return iconMap[iconName] || null;
};

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
  ${({ $isMobile }) =>
    $isMobile &&
    `
    padding: 16px;
  `}
`;

const FilterSection = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
`;

const FilterHeader = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  width: 100%;
`;

const FilterTabs = styled.div<{ $isMobile?: boolean }>`
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

const FilterTab = styled.button<{ $isActive: boolean; $isMobile?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: ${({ $isMobile }) => ($isMobile ? "10px 16px" : "12px 20px")};
  background: linear-gradient(
    135deg,
    ${({ $isActive, theme }) => $isActive ? theme.colors.primary : theme.colors.gray50},
    ${({ $isActive, theme }) => $isActive ? theme.colors.primary : theme.colors.white}
  );
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary + "30" : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.primary + "30"};
    background: linear-gradient(
      135deg,
      ${({ $isActive, theme }) => $isActive ? theme.colors.primary : theme.colors.primary + "05"},
      ${({ $isActive, theme }) => $isActive ? theme.colors.primary : theme.colors.white}
    );
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

const AdditionalFilters = styled.div<{ $isMobile?: boolean }>`
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

const FilterGroup = styled.div<{ $isMobile?: boolean }>`
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

const FilterLabel = styled.label`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  white-space: nowrap;
`;

const FilterSelect = styled.select`
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

const FilterActionsWrapper = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: ${({ $isMobile }) => ($isMobile ? "center" : "flex-end")};
  margin-top: ${({ $isMobile }) => ($isMobile ? "16px" : "12px")};
  width: 100%;
`;

const ResetFiltersButton = styled.button<{ $isMobile?: boolean }>`
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

const MissionCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "16px")};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
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

const getPointBadgeColor = (
  point: number,
  isDark: boolean = false
): { background: string; shadow: string } => {
  if (point < 300) {
    // 가장 쉬운 미션
    return {
      background: isDark
        ? "linear-gradient(135deg, #E5E7EB, #D1D5DB)"
        : "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
      shadow: "rgba(156, 163, 175, 0.3)",
    };
  } else if (point < 600) {
    return {
      // 쉬운 미션
      background: isDark
        ? "linear-gradient(135deg, #3B82F6, #1D4ED8, #1E40AF)"
        : "linear-gradient(135deg, #60A5FA, #3B82F6, #2563EB)",
      shadow: "rgba(59, 130, 246, 0.4)",
    };
  } else if (point < 1000) {
    // 보통 미션
    return {
      background: isDark
        ? "linear-gradient(135deg, #10B981, #047857, #065F46)"
        : "linear-gradient(135deg, #34D399, #10B981, #059669)",
      shadow: "rgba(34, 197, 94, 0.4)",
    };
  } else if (point < 1500) {
    // 어려운 미션
    return {
      background: isDark
        ? "linear-gradient(135deg, #8B5CF6, #7C3AED, #6D28D9)"
        : "linear-gradient(135deg, #A78BFA, #8B5CF6, #7C3AED)",
      shadow: "rgba(139, 92, 246, 0.4)",
    };
  } else {
    // 가장 어려운 미션
    return {
      background: isDark
        ? "linear-gradient(135deg, #F59E0B, #D97706, #B45309)"
        : "linear-gradient(135deg, #FBB040, #F59E0B, #EF8A0D)",
      shadow: "rgba(251, 146, 60, 0.4)",
    };
  }
};

const PointBadgeOverlay = styled.div<{ $isMobile?: boolean; $point: number }>`
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

const MissionContent = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "16px")};
`;

const MissionHeader = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "12px")};
`;

const CategoryTags = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const CategoryTag = styled.span<{ $isMobile?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $isMobile }) => ($isMobile ? "10px 16px" : "12px 20px")};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.gray50},
    ${({ theme }) => theme.colors.white}
  );
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}30;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary}05,
      ${({ theme }) => theme.colors.white}
    );
  }
`;

const MissionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.3;
`;

const MissionDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const MissionMeta = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const MetaItem = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
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

const PaginationContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  margin-top: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  padding: ${({ $isMobile }) => ($isMobile ? "16px 0" : "20px 0")};
`;

const PaginationButton = styled.button<{
  $isMobile?: boolean;
  $isActive?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  height: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  padding: ${({ $isMobile }) => ($isMobile ? "8px" : "10px 12px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.white};
  color: ${({ $isActive, $disabled, theme }) =>
    $disabled
      ? theme.colors.text.disabled
      : $isActive
      ? theme.colors.white
      : theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: ${({ $isActive }) => ($isActive ? "600" : "500")};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.gray100};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const MissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());

  // URL에서 초기 상태 읽기
  const getInitialFilter = (key: string, defaultValue: string) => {
    return searchParams.get(key) || defaultValue;
  };

  const [activeFilter, setActiveFilter] = React.useState(() =>
    getInitialFilter("category", "all")
  );
  const [currentPage, setCurrentPage] = React.useState(() =>
    parseInt(getInitialFilter("page", "1"))
  );

  // 추가 필터 상태
  const [difficultyFilter, setDifficultyFilter] = React.useState<string>(() =>
    getInitialFilter("difficulty", "all")
  );
  const [participantsFilter, setParticipantsFilter] = React.useState<string>(
    () => getInitialFilter("participants", "all")
  );
  const [durationFilter, setDurationFilter] = React.useState<string>(() =>
    getInitialFilter("duration", "all")
  );
  const [pointFilter, setPointFilter] = React.useState<string>(() =>
    getInitialFilter("point", "all")
  );

  const MISSIONS_PER_PAGE = 5;

  // URL 파라미터 업데이트 함수
  const updateURLParams = React.useCallback(
    (updates: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === "all" || (key === "page" && value === "1")) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Zustand 스토어 사용
  const {
    missions: allMissions,
    categories,
    isLoadingMissions,
    isLoadingCategories,
    error,
    fetchMissions,
    fetchCategories,
    getFilteredMissions,
    clearError,
  } = useMissionStore();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 필터링된 미션 목록 (클라이언트 사이드 필터링)
  const filteredMissions = React.useMemo(() => {
    return getFilteredMissions({
      category: activeFilter,
      difficulty: difficultyFilter,
      participants: participantsFilter,
      duration: durationFilter,
      point: pointFilter,
    });
  }, [
    getFilteredMissions,
    activeFilter,
    difficultyFilter,
    participantsFilter,
    durationFilter,
    pointFilter,
  ]);

  // 페이지네이션된 미션 목록
  const paginatedMissions = React.useMemo(() => {
    const startIndex = (currentPage - 1) * MISSIONS_PER_PAGE;
    const endIndex = startIndex + MISSIONS_PER_PAGE;
    return filteredMissions.slice(startIndex, endIndex);
  }, [filteredMissions, currentPage]);

  // 총 페이지 수
  const totalPages = Math.ceil(filteredMissions.length / MISSIONS_PER_PAGE);

  // 초기 데이터 로드
  React.useEffect(() => {
    fetchMissions();
    fetchCategories();
  }, [fetchMissions, fetchCategories]);

  // 에러 표시
  React.useEffect(() => {
    if (error) {
      console.error('미션 스토어 에러:', error);
      // 5초 후 에러 자동 클리어
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);





  // 필터 변경 시 첫 페이지로 이동 (URL도 업데이트)
  React.useEffect(() => {
    setCurrentPage(1);
    // 페이지 파라미터만 삭제하고 다른 파라미터는 유지
    if (searchParams.has("page")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("page");
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeFilter,
    difficultyFilter,
    participantsFilter,
    durationFilter,
    pointFilter,
  ]);

  const handleCardClick = (missionId: string) => {
    navigate(`/missions/${missionId}`);
  };

  const handleResetFilters = () => {
    setDifficultyFilter("all");
    setParticipantsFilter("all");
    setDurationFilter("all");
    setPointFilter("all");
    // URL에서 필터 파라미터들만 제거
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("difficulty");
    newParams.delete("participants");
    newParams.delete("duration");
    newParams.delete("point");
    setSearchParams(newParams, { replace: true });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 1) {
      // 첫 페이지일 경우 page 파라미터 제거
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("page");
      setSearchParams(newParams, { replace: true });
    } else {
      updateURLParams({ page: page.toString() });
    }
    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
    // 대안: document.documentElement도 함께 스크롤
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // 페이지네이션 버튼 생성
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = isMobile ? 5 : 7;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    return buttons;
  };

  const getDifficultyText = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "쉬움";
      case "MEDIUM":
        return "보통";
      case "HARD":
        return "어려움";
      default:
        return "보통";
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "#10B981";
      case "MEDIUM":
        return "#F59E0B";
      case "HARD":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  return (
    <PageContainer $isMobile={isMobile}>
      <FilterSection $isMobile={isMobile}>
        <FilterHeader $isMobile={isMobile}>
          <FilterTabs $isMobile={isMobile}>
            {isLoadingCategories ? (
              // 로딩 중일 때 스켈레톤 표시
              Array(5).fill(0).map((_, index) => (
                <div key={index} style={{ 
                  width: '80px', 
                  height: '36px', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '12px',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
              ))
            ) : (
              categories.map((filter) => {
                const IconComponent = getIconComponent(filter.icon);
                return (
                  <FilterTab
                    key={filter.id}
                    $isActive={activeFilter === filter.id}
                    $isMobile={isMobile}
                    onClick={() => {
                      setActiveFilter(filter.id);
                      updateURLParams({ category: filter.id });
                    }}
                  >
                    {IconComponent && <IconComponent size={isMobile ? 14 : 14} />}
                    {filter.label}
                  </FilterTab>
                );
              })
            )}
          </FilterTabs>
        </FilterHeader>

        <AdditionalFilters $isMobile={isMobile}>
          <FilterGroup $isMobile={isMobile}>
            <FilterLabel>난이도</FilterLabel>
            <FilterSelect
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                updateURLParams({ difficulty: e.target.value });
              }}
            >
              <option value="all">전체</option>
              <option value="EASY">쉬움</option>
              <option value="MEDIUM">보통</option>
              <option value="HARD">어려움</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup $isMobile={isMobile}>
            <FilterLabel>참여인원</FilterLabel>
            <FilterSelect
              value={participantsFilter}
              onChange={(e) => {
                setParticipantsFilter(e.target.value);
                updateURLParams({ participants: e.target.value });
              }}
            >
              <option value="all">전체</option>
              <option value="medium">4-6명</option>
              <option value="large">7명 이상</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup $isMobile={isMobile}>
            <FilterLabel>예상시간</FilterLabel>
            <FilterSelect
              value={durationFilter}
              onChange={(e) => {
                setDurationFilter(e.target.value);
                updateURLParams({ duration: e.target.value });
              }}
            >
              <option value="all">전체</option>
              <option value="short">90분 이하</option>
              <option value="medium">90-180분</option>
              <option value="long">180분 초과</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup $isMobile={isMobile}>
            <FilterLabel>포인트</FilterLabel>
            <FilterSelect
              value={pointFilter}
              onChange={(e) => {
                setPointFilter(e.target.value);
                updateURLParams({ point: e.target.value });
              }}
            >
              <option value="all">전체</option>
              <option value="low">400P 미만</option>
              <option value="medium">400-799P</option>
              <option value="high">800P 이상</option>
            </FilterSelect>
          </FilterGroup>

          {(difficultyFilter !== "all" ||
            participantsFilter !== "all" ||
            durationFilter !== "all" ||
            pointFilter !== "all") && (
            <FilterActionsWrapper $isMobile={isMobile}>
              <ResetFiltersButton
                $isMobile={isMobile}
                onClick={handleResetFilters}
              >
                필터 초기화
              </ResetFiltersButton>
            </FilterActionsWrapper>
          )}
        </AdditionalFilters>
      </FilterSection>

      {isLoadingMissions ? (
        // 로딩 중일 때 스켈레톤 표시
        Array(MISSIONS_PER_PAGE).fill(0).map((_, index) => (
          <div key={index} style={{
            background: 'white',
            borderRadius: '12px',
            marginBottom: isMobile ? '16px' : '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
            maxWidth: !isMobile ? '800px' : 'auto',
            marginLeft: !isMobile ? 'auto' : '0',
            marginRight: !isMobile ? 'auto' : '0',
          }}>
            {/* 썸네일 스켈레톤 */}
            <div style={{
              width: '100%',
              height: isMobile ? '180px' : '160px',
              backgroundColor: '#f3f4f6',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            <div style={{ padding: isMobile ? '16px' : '16px' }}>
              {/* 제목 스켈레톤 */}
              <div style={{
                width: '70%',
                height: '20px',
                backgroundColor: '#f3f4f6',
                marginBottom: '8px',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              {/* 설명 스켈레톤 */}
              <div style={{
                width: '100%',
                height: '16px',
                backgroundColor: '#f3f4f6',
                marginBottom: '16px',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              {/* 메타 정보 스켈레톤 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: isMobile ? '12px' : '16px'
              }}>
                {Array(3).fill(0).map((_, metaIndex) => (
                  <div key={metaIndex} style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    padding: isMobile ? '8px' : '10px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '14px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : paginatedMissions.length > 0 ? (
        <>
          {paginatedMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              $isMobile={isMobile}
              onClick={() => handleCardClick(mission.id)}
            >
              <MissionThumbnail $isMobile={isMobile}>
                <MissionImage
                  src={mission.thumbnailUrl}
                  alt={mission.title}
                  loading="lazy"
                  onError={(e) => {
                    console.log("Image failed to load:", mission.thumbnailUrl);
                    e.currentTarget.style.display = "none";
                  }}
                />
                <PointBadgeOverlay $isMobile={isMobile} $point={mission.point}>
                  +{mission.point}P
                </PointBadgeOverlay>
              </MissionThumbnail>

              <MissionContent $isMobile={isMobile}>
                <MissionHeader $isMobile={isMobile}>
                  <CategoryTags>
                    {mission.category.map((cat, index) => (
                      <CategoryTag key={index} $isMobile={isMobile}>
                        {getCategoryLabel(cat)}
                      </CategoryTag>
                    ))}
                  </CategoryTags>
                  <MissionTitle $isMobile={isMobile}>
                    {mission.title}
                  </MissionTitle>
                  <MissionDescription $isMobile={isMobile}>
                    {mission.description}
                  </MissionDescription>
                </MissionHeader>

                <MissionMeta $isMobile={isMobile}>
                  <MetaItem $isMobile={isMobile}>
                    <MetaIcon>
                      <Clock size={isMobile ? 14 : 16} />
                    </MetaIcon>
                    <MetaValue $isMobile={isMobile}>
                      {mission.duration}분
                    </MetaValue>
                    <MetaLabel $isMobile={isMobile}>예상 시간</MetaLabel>
                  </MetaItem>
                  <MetaItem $isMobile={isMobile}>
                    <MetaIcon>
                      <Users size={isMobile ? 14 : 16} />
                    </MetaIcon>
                    <MetaValue $isMobile={isMobile}>
                      {mission.minParticipants}-{mission.maxParticipants}명
                    </MetaValue>
                    <MetaLabel $isMobile={isMobile}>참여 인원</MetaLabel>
                  </MetaItem>
                  <MetaItem $isMobile={isMobile}>
                    <MetaIcon
                      style={{ color: getDifficultyColor(mission.difficulty) }}
                    >
                      <BarChart3 size={isMobile ? 14 : 16} />
                    </MetaIcon>
                    <MetaValue $isMobile={isMobile}>
                      {getDifficultyText(mission.difficulty)}
                    </MetaValue>
                    <MetaLabel $isMobile={isMobile}>난이도</MetaLabel>
                  </MetaItem>
                </MissionMeta>
              </MissionContent>
            </MissionCard>
          ))}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <PaginationContainer $isMobile={isMobile}>
              <PaginationButton
                $isMobile={isMobile}
                $disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={isMobile ? 16 : 18} />
              </PaginationButton>

              {getPaginationButtons().map((pageNum) => (
                <PaginationButton
                  key={pageNum}
                  $isMobile={isMobile}
                  $isActive={currentPage === pageNum}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </PaginationButton>
              ))}

              <PaginationButton
                $isMobile={isMobile}
                $disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={isMobile ? 16 : 18} />
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      ) : (
        <EmptyState $isMobile={isMobile}>
          <EmptyIcon $isMobile={isMobile}>
            <Search size={isMobile ? 48 : 64} />
          </EmptyIcon>
          <EmptyText $isMobile={isMobile}>
            {categories.find((f) => f.id === activeFilter)?.label} 카테고리에
            미션이 없습니다.
          </EmptyText>
        </EmptyState>
      )}
    </PageContainer>
  );
};
