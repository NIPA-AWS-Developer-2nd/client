import styled, { css } from "styled-components";
import { responsive } from "../../../../shared/styles/mixins";

export const PageContainer = styled.div<{ $isMobile: boolean }>`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ $isMobile }) => ($isMobile ? "0 0 60px 0" : "0 0 80px 0")};
  display: flex;
  flex-direction: column;

  ${responsive.mobile(css`
    padding: 0 0 60px 0;
  `)}
`;

export const Header = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "24px")};
  background: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  position: sticky;
  top: 0;
  z-index: 10;

  ${responsive.mobile(css`
    padding: 16px;
  `)}
`;

export const Title = styled.h1<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};

  ${responsive.mobile(css`
    font-size: 20px;
  `)}
`;

export const RefreshButton = styled.button<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}10;
  }

  ${responsive.mobile(css`
    width: 32px;
    height: 32px;
  `)}
`;

export const RefreshIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  transition: color 0.2s ease;

  ${RefreshButton}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ContentContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "24px")};

  ${responsive.mobile(css`
    gap: 16px;
    padding: 16px;
  `)}
`;

// Banner Components - Full width banner
export const BannerSection = styled.div<{ $isMobile: boolean }>`
  width: calc(100% + ${({ $isMobile }) => ($isMobile ? "32px" : "48px")});
  margin-left: ${({ $isMobile }) => ($isMobile ? "-16px" : "-24px")};
  margin-right: ${({ $isMobile }) => ($isMobile ? "-16px" : "-24px")};
  margin-top: ${({ $isMobile }) => ($isMobile ? "-12px" : "-16px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  
  ${responsive.mobile(css`
    width: calc(100% + 32px);
    margin-left: -16px;
    margin-right: -16px;
    margin-top: -12px;
    margin-bottom: 16px;
  `)}
`;

export const BannerImage = styled.img<{ $isMobile: boolean }>`
  width: 100%;
  height: auto;
  min-height: ${({ $isMobile }) => ($isMobile ? "120px" : "140px")};
  object-fit: contain;
  border-radius: ${({ theme, $isMobile }) => $isMobile ? '0' : theme.borderRadius.lg};
  opacity: 0.9;

  ${responsive.mobile(css`
    min-height: 120px;
  `)}
`;

export const LoadingContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: ${({ $isMobile }) => ($isMobile ? "32px 16px" : "48px 24px")};

  ${responsive.mobile(css`
    padding: 32px 16px;
  `)}
`;

export const LoadingText = styled.p<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const ErrorContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 200px;
  padding: ${({ $isMobile }) => ($isMobile ? "32px 16px" : "48px 24px")};
  text-align: center;

  ${responsive.mobile(css`
    padding: 32px 16px;
  `)}
`;

export const ErrorText = styled.p<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.error};

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const RetryButton = styled.button<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "10px 16px" : "12px 20px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.background.primary};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
  }

  ${responsive.mobile(css`
    padding: 10px 16px;
    font-size: 14px;
  `)}
`;

// New Section Components
export const Section = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);

  ${responsive.mobile(css`
    padding: 20px;
  `)}
`;

export const SectionTitle = styled.h2<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};

  ${responsive.mobile(css`
    font-size: 18px;
    margin-bottom: 16px;
  `)}
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// Hot Meeting Card Components - 모바일에서는 세로형, 데스크톱에서는 가로형
export const HotMeetingCard = styled.div<{ $isMobile: boolean }>`
  position: relative;
  display: flex;
  flex-direction: ${({ $isMobile }) => ($isMobile ? "column" : "row")};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: ${({ $isMobile }) => ($isMobile ? "auto" : "220px")};

  ${responsive.mobile(css`
    flex-direction: column;
    min-height: auto;
  `)}
`;

export const HotMeetingImageSection = styled.div<{
  $backgroundImage?: string;
  $isMobile: boolean;
}>`
  position: relative;
  width: ${({ $isMobile }) => ($isMobile ? "100%" : "140px")};
  height: ${({ $isMobile }) => ($isMobile ? "160px" : "220px")};
  flex-shrink: 0;
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage
      ? `url(${$backgroundImage})`
      : "linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  /* 어둠 오버레이 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
    z-index: 1;
  }

  /* 자식 요소들이 오버레이 위에 표시되도록 */
  > * {
    position: relative;
    z-index: 2;
  }

  ${responsive.mobile(css`
    width: 100%;
    height: 160px;
  `)}
`;

export const HotMeetingImage = styled.img`
  display: none; /* 배경 이미지로 사용하므로 숨김 */
`;

export const HotMeetingInfo = styled.div<{ $isMobile: boolean }>`
  flex: 1;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 12px" : "20px 16px")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;

  ${responsive.mobile(css`
    padding: 16px 12px;
  `)}
`;

export const HotMeetingHeader = styled.div`
  margin-bottom: 12px;
`;

export const HotMeetingTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${responsive.mobile(css`
    font-size: 16px;
  `)}
`;

export const HotMeetingBadges = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

export const DifficultyBadge = styled.span<{ $difficulty: string }>`
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  ${({ $difficulty, theme }) => {
    switch ($difficulty?.toLowerCase()) {
      case "very_easy":
        return `
          color: ${theme.colors.success};
          background: ${theme.colors.success}15;
          border: 1px solid ${theme.colors.success}30;
        `;
      case "easy":
        return `
          color: ${theme.colors.info};
          background: ${theme.colors.info}15;
          border: 1px solid ${theme.colors.info}30;
        `;
      case "medium":
        return `
          color: ${theme.colors.warning};
          background: ${theme.colors.warning}15;
          border: 1px solid ${theme.colors.warning}30;
        `;
      case "hard":
        return `
          color: ${theme.colors.danger};
          background: ${theme.colors.danger}15;
          border: 1px solid ${theme.colors.danger}30;
        `;
      case "very_hard":
        return `
          color: ${theme.colors.errorDark};
          background: ${theme.colors.errorDark}15;
          border: 1px solid ${theme.colors.errorDark}30;
        `;
      default:
        return `
          color: ${theme.colors.text.secondary};
          background: ${theme.colors.card};
          border: 1px solid ${theme.colors.border.light};
        `;
    }
  }}
`;

export const PointBadge = styled.span<{ $point: number }>`
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid;
  ${({ $point, theme }) => {
    if ($point < 500) {
      return `
        color: ${theme.colors.text.secondary};
        background: ${theme.colors.card};
        border-color: ${theme.colors.border.light};
      `;
    } else if ($point < 1000) {
      return `
        color: ${theme.colors.info};
        background: ${theme.colors.info}15;
        border-color: ${theme.colors.info}40;
      `;
    } else if ($point < 1500) {
      return `
        color: ${theme.colors.success};
        background: ${theme.colors.success}15;
        border-color: ${theme.colors.success}40;
      `;
    } else if ($point < 2000) {
      return `
        color: #8B5CF6;
        background: #8B5CF615;
        border-color: #8B5CF640;
      `;
    } else {
      return `
        color: ${theme.colors.primary};
        background: ${theme.colors.primary}15;
        border-color: ${theme.colors.primary}40;
      `;
    }
  }}
`;

export const HotMeetingMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: auto;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MetaIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
`;

export const MetaText = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};

  ${responsive.mobile(css`
    font-size: 12px;
  `)}
`;

export const LikesContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ff6b6b;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
`;

// My Meeting Card Components
export const MyMeetingCard = styled.div<{ $isMobile: boolean; $isExpanded?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme, $isExpanded }) => 
    $isExpanded 
      ? `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`
      : theme.borderRadius.md
  };
  cursor: pointer;
  border: 1px solid ${({ theme, $isExpanded }) => 
    $isExpanded ? theme.colors.border.light : 'transparent'
  };
  border-bottom: ${({ $isExpanded }) => $isExpanded ? 'none' : '1px solid transparent'};
  margin-bottom: ${({ $isExpanded }) => $isExpanded ? '0' : '12px'};
  transition: all 0.2s ease;

  /* 마지막 카드는 margin-bottom 제거 */
  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray200};
    border-color: ${({ theme }) => theme.colors.primary}30;
  }

  ${responsive.mobile(css`
    padding: 12px;
  `)}
`;

export const MyMeetingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const MyMeetingStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${responsive.mobile(css`
    gap: 6px;
  `)}
`;

export const HostBadge = styled.span<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: ${({ $isMobile }) => ($isMobile ? "4px 8px" : "5px 10px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  ${responsive.mobile(css`
    padding: 4px 8px;
    font-size: 12px;
    gap: 3px;
  `)}
`;

export const StatusBadge = styled.span<{ $color: string; $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "5px 10px" : "7px 12px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 700;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid;
  ${({ $color, theme }) => {
    switch ($color) {
      case "primary":
        return `
          color: ${theme.colors.primary};
          background: ${theme.colors.primary}15;
          border-color: ${theme.colors.primary}40;
        `;
      case "success":
        return `
          color: ${theme.colors.success};
          background: ${theme.colors.success}15;
          border-color: ${theme.colors.success}40;
        `;
      case "warning":
        return `
          color: ${theme.colors.warning};
          background: ${theme.colors.warning}15;
          border-color: ${theme.colors.warning}40;
        `;
      case "disabled":
        return `
          color: ${theme.colors.text.disabled};
          background: ${theme.colors.card};
          border-color: ${theme.colors.border.light};
        `;
      default:
        return `
          color: ${theme.colors.text.secondary};
          background: ${theme.colors.card};
          border-color: ${theme.colors.border.light};
          background: ${theme.colors.gray100};
        `;
    }
  }}

  ${responsive.mobile(css`
    padding: 5px 10px;
    font-size: 13px;
  `)}
`;

// Activity Card Components
export const ActivityCard = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  ${responsive.mobile(css`
    gap: 12px;
    padding: 12px;
  `)}
`;

export const ActivityIcon = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  background: ${({ theme }) => theme.colors.primary}15;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;

  ${responsive.mobile(css`
    width: 32px;
    height: 32px;
  `)}
`;

export const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ActivityTitle = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const ActivityTime = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};

  ${responsive.mobile(css`
    font-size: 12px;
  `)}
`;

// Common Components
export const EmptyState = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $isMobile }) => ($isMobile ? "32px 16px" : "40px 24px")};
  text-align: center;

  ${responsive.mobile(css`
    padding: 32px 16px;
  `)}
`;

export const EmptyText = styled.p<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.secondary};

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const ViewMoreButton = styled.button<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}08;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  margin-top: 8px;

  ${responsive.mobile(css`
    padding: 12px;
    font-size: 14px;
  `)}
`;

// Tab Components for My Meetings Section
export const TabContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 4px;
`;

export const TabButton = styled.button<{ $active: boolean; $isMobile: boolean }>`
  flex: 1;
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 16px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ $active, theme }) =>
    $active
      ? css`
          background: ${theme.colors.white};
          color: ${theme.colors.primary};
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        `
      : css`
          background: transparent;
          color: ${theme.colors.text.secondary};
        `}

  ${responsive.mobile(css`
    padding: 8px 12px;
    font-size: 13px;
  `)}
`;

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 120px;
`;

// 호스트 정보 섹션
export const HostSection = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  margin-top: 12px;
  padding: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  ${responsive.mobile(css`
    gap: 8px;
    margin-top: 8px;
    padding: 8px;
  `)}
`;

export const HostAvatarWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

export const HostAvatar = styled.img<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "36px" : "42px")};
  height: ${({ $isMobile }) => ($isMobile ? "36px" : "42px")};
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  border: 2px solid ${({ theme }) => theme.colors.white};

  ${responsive.mobile(css`
    width: 36px;
    height: 36px;
  `)}
`;

export const HostCrown = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  top: ${({ $isMobile }) => ($isMobile ? "-4px" : "-6px")};
  right: ${({ $isMobile }) => ($isMobile ? "-2px" : "-2px")};
  width: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  height: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ $isMobile }) => ($isMobile ? "8px" : "10px")};

  ${responsive.mobile(css`
    top: -4px;
    right: -2px;
    width: 16px;
    height: 16px;
    font-size: 8px;
  `)}
`;

export const HostInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const HostMainInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
`;

export const HostName = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${responsive.mobile(css`
    font-size: 13px;
  `)}
`;

export const HostLevel = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  padding: 2px 6px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;

  ${responsive.mobile(css`
    font-size: 10px;
  `)}
`;

export const HostMbti = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  padding: 2px 6px;
  background: ${({ theme }) => theme.colors.primary}15;
  border-radius: 8px;

  ${responsive.mobile(css`
    font-size: 10px;
  `)}
`;

export const HostBio = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${responsive.mobile(css`
    font-size: 11px;
  `)}
`;

export const RegionInfo = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;

  ${responsive.mobile(css`
    font-size: 11px;
  `)}
`;

// 참가자 아바타 섹션
export const ParticipantsSection = styled.div<{ $isMobile: boolean }>`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  ${responsive.mobile(css`
    margin-top: 8px;
    padding-top: 8px;
  `)}
`;

export const ParticipantsTitle = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;

  ${responsive.mobile(css`
    font-size: 12px;
    margin-bottom: 6px;
  `)}
`;

export const ParticipantAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ParticipantAvatar = styled.img<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
  height: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  border: 2px solid ${({ theme }) => theme.colors.white};

  ${responsive.mobile(css`
    width: 24px;
    height: 24px;
  `)}
`;

export const MoreParticipants = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
  height: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  font-weight: 600;

  ${responsive.mobile(css`
    width: 24px;
    height: 24px;
    font-size: 10px;
  `)}
`;

// 지역 태그 스타일
export const RegionTag = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  top: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  right: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  background: linear-gradient(135deg, rgba(255, 139, 85, 0.95) 0%, rgba(255, 158, 110, 0.95) 100%);
  color: white;
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 700;
  padding: ${({ $isMobile }) => ($isMobile ? "5px 10px" : "7px 12px")};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(255, 139, 85, 0.3);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
  
  /* 특별한 미션 구분 효과 */
  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, #ff8b55, #ffaa7a, #ff6b35);
    border-radius: inherit;
    z-index: -1;
    opacity: 0.8;
  }

  ${responsive.mobile(css`
    top: 8px;
    right: 8px;
    font-size: 12px;
    padding: 5px 10px;
  `)}
`;

export const DetailButton = styled.button<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
  height: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
  background: ${({ theme }) => theme.colors.gray100};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 50%;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}15;
    border-color: ${({ theme }) => theme.colors.primary}30;
    color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
  }

  ${responsive.mobile(css`
    width: 24px;
    height: 24px;
  `)}
`;
