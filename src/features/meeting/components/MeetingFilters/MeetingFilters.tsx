import React, { useState } from "react";
import styled from "styled-components";
import { ArrowUpDown } from "lucide-react";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import type { MeetingListFilters } from "../../../../types";

interface MeetingFiltersProps {
  onFiltersChange: (filters: MeetingListFilters) => void;
  initialFilters?: MeetingListFilters;
}

const FiltersContainer = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: 24px;
`;

// 검색 관련 스타일 컴포넌트는 추후 구현 예정
// const _SearchContainer = styled.div<{ $isMobile?: boolean }>`...`;
// const _SearchInputContainer = styled.div`...`;
// const _SearchInput = styled.input<{ $isMobile?: boolean }>`...`;
// const _SearchIcon = styled.div<{ $isMobile?: boolean }>`...`;
// const _ClearButton = styled.button`...`;

const SortContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
`;

const SortLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const SortSelect = styled.select<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 16px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const MeetingFilters: React.FC<MeetingFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
}) => {
  const [isMobile] = useState(deviceDetection.isMobile());
  const [filters, setFilters] = useState<MeetingListFilters>(initialFilters);
  // 검색 기능은 추후 구현 예정
  // const [_searchKeyword, _setSearchKeyword] = useState(
  //   initialFilters.searchKeyword || ""
  // );

  const handleSortChange = (sortBy: string) => {
    const newFilters = {
      ...filters,
      sortBy: sortBy as MeetingListFilters["sortBy"],
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // 검색 핸들러는 추후 구현 예정
  // const _handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   _setSearchKeyword(e.target.value);
  // };

  // const _handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const newFilters = {
  //     ...filters,
  //     searchKeyword: _searchKeyword || undefined,
  //   };
  //   setFilters(newFilters);
  //   onFiltersChange(newFilters);
  // };

  // const _handleClearSearch = () => {
  //   _setSearchKeyword("");
  //   const newFilters = { ...filters, searchKeyword: undefined };
  //   setFilters(newFilters);
  //   onFiltersChange(newFilters);
  // };

  return (
    <FiltersContainer $isMobile={isMobile}>
      <SortContainer $isMobile={isMobile}>
        <SortLabel>
          <ArrowUpDown
            size={16}
            style={{ marginRight: 4, verticalAlign: "middle" }}
          />
        </SortLabel>
        <SortSelect
          $isMobile={isMobile}
          value={filters.sortBy || "latest"}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="deadline">마감순</option>
          <option value="popular">인기순</option>
        </SortSelect>
      </SortContainer>
    </FiltersContainer>
  );
};

export default MeetingFilters;
