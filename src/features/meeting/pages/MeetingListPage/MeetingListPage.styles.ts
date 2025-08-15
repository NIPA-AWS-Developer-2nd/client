import styled from 'styled-components';

export const Container = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
`;

export const HeaderSection = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px 24px")};
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  margin-bottom: 16px;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const LocationBadge = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    color: white;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

export const Title = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '32px' : '42px'};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 12px;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.text.primary} 0%, 
    ${({ theme }) => theme.colors.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '16px' : '18px'};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 32px;
  font-weight: 500;
`;

export const FilterSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ $isMobile }) => $isMobile ? '16px' : '24px'};
  margin: 0 ${({ $isMobile }) => $isMobile ? '16px' : '24px'};
  margin-bottom: 24px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const FilterTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '16px' : '18px'};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FilterGroup = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const FilterLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
`;

export const FilterChips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterChip = styled.button<{ $active?: boolean; $variant?: 'status' | 'category' | 'difficulty' }>`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 2px solid ${({ theme, $active, $variant }) => {
    if ($active) {
      switch ($variant) {
        case 'status': return theme.colors.success;
        case 'category': return theme.colors.primary;
        case 'difficulty': return theme.colors.warning;
        default: return theme.colors.primary;
      }
    }
    return theme.colors.border;
  }};
  background-color: ${({ theme, $active, $variant }) => {
    if ($active) {
      switch ($variant) {
        case 'status': return theme.colors.success + '10';
        case 'category': return theme.colors.primary + '10';
        case 'difficulty': return theme.colors.warning + '10';
        default: return theme.colors.primary + '10';
      }
    }
    return theme.colors.surface;
  }};
  color: ${({ theme, $active, $variant }) => {
    if ($active) {
      switch ($variant) {
        case 'status': return theme.colors.success;
        case 'category': return theme.colors.primary;
        case 'difficulty': return theme.colors.warning;
        default: return theme.colors.primary;
      }
    }
    return theme.colors.text.secondary;
  }};
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const SearchBar = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 14px 48px 14px 20px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 15px;
  background-color: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 20px;
`;

export const ContentSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl} 0 0;
  margin-top: 0;
  padding: ${({ $isMobile }) => $isMobile ? '24px 16px' : '32px 24px'};
  min-height: 60vh;
`;

export const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '20px' : '24px'};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const WeekInfo = styled.span<{ $isMobile?: boolean }>`
  padding: 4px 12px;
  background: ${({ theme }) => theme.colors.primary + '10'};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
`;

export const MeetingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }
`;

export const EmptyState = styled.div<{ $isMobile?: boolean }>`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ $isMobile }) => $isMobile ? '60px 20px' : '80px 40px'};
  text-align: center;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.gray50} 0%, 
    ${({ theme }) => theme.colors.white} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  margin: 20px 0;
`;

export const EmptyIcon = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => $isMobile ? '100px' : '120px'};
  height: ${({ $isMobile }) => $isMobile ? '100px' : '120px'};
  margin-bottom: 24px;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}10 0%, 
    ${({ theme }) => theme.colors.primary}20 100%);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isMobile }) => $isMobile ? '40px' : '48px'};
  color: ${({ theme }) => theme.colors.primary};
  border: 3px solid ${({ theme }) => theme.colors.primary}20;
`;

export const EmptyTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '20px' : '24px'};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 12px;
`;

export const EmptyDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '14px' : '16px'};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: 24px;
  max-width: 400px;
`;

export const CreateButton = styled.button<{ $isMobile?: boolean }>`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary} 0%, 
    ${({ theme }) => theme.colors.primaryLight} 100%);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ $isMobile }) => $isMobile ? '14px 28px' : '16px 32px'};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ $isMobile }) => $isMobile ? '15px' : '16px'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}40;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${({ theme }) => theme.colors.primary}50;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LoadMoreButton = styled.button<{ $isMobile?: boolean }>`
  grid-column: 1 / -1;
  padding: ${({ $isMobile }) => $isMobile ? '14px 28px' : '16px 32px'};
  margin: 32px auto 0;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ExtraFilters = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ $isMobile }) => $isMobile ? '12px 16px' : '16px 24px'};
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const FilterOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  label {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: pointer;
    user-select: none;
    
    &:hover {
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }
`;

export const SortOptions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  select {
    padding: 8px 12px;
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    border-radius: 8px;
    background: white;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.primary};
    cursor: pointer;
    outline: none;
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const SortDirectionButton = styled.button<{ $isDescending: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:active {
    transform: scale(0.98);
  }
`;

export const ResultInfo = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => $isMobile ? '8px 0' : '12px 0'};
  font-size: ${({ $isMobile }) => $isMobile ? '14px' : '16px'};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: 16px;
  
  span {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FloatingActionButton = styled.button<{ $isMobile?: boolean }>`
  position: fixed;
  bottom: ${({ $isMobile }) => $isMobile ? '20px' : '32px'};
  right: ${({ $isMobile }) => $isMobile ? '20px' : '32px'};
  width: ${({ $isMobile }) => $isMobile ? '56px' : '64px'};
  height: ${({ $isMobile }) => $isMobile ? '56px' : '64px'};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary} 0%, 
    ${({ theme }) => theme.colors.primaryLight} 100%);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  box-shadow: 0 8px 32px ${({ theme }) => theme.colors.primary}60;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isMobile }) => $isMobile ? '24px' : '28px'};
  font-weight: 300;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 12px 40px ${({ theme }) => theme.colors.primary}70;
  }

  &:active {
    transform: scale(1.05) rotate(90deg);
  }
`;

export const FilterNotice = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.primary + '10'};
  border: 1px solid ${({ theme }) => theme.colors.primary + '30'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: 0 ${({ $isMobile }) => $isMobile ? '16px' : '24px'};
  margin-bottom: 16px;
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  color: ${({ theme }) => theme.colors.primary};
  
  button {
    padding: 4px 12px;
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.primary + '30'};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: white;
    }
  }
`;

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

export const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PageNumber = styled.button<{ $active?: boolean; $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 14px")};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};

  &:hover:not(:disabled) {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.gray50};
  }
`;