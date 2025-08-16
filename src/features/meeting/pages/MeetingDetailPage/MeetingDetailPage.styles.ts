import styled, { css } from "styled-components";

/* ---- Design tokens (재사용) ------------------------------------------ */
const card = css`
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
`;

const subtleCard = css`
  background: ${({ theme }) => theme?.colors?.gray100 ?? "#F3F4F6"};
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
`;

const pill = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
`;

/* ---- Page & Header ---------------------------------------------------- */
export const PageContainer = styled.div<{ $isMobile: boolean }>`
  position: relative;
  min-height: 100vh;
  background: ${({ theme }) => theme?.colors?.white ?? "#FFFFFF"};
  padding: ${({ $isMobile }) =>
    $isMobile ? "16px 20px 100px" : "24px 40px 24px"};
  max-width: 800px;
  margin: 0 auto;
`;

export const Header = styled.header<{ $isMobile: boolean }>`
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 16px" : "14px 20px")};
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border ?? "#E5E7EB"};
`;

export const BackButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  background: ${({ theme }) => theme?.colors?.gray100 ?? "#F3F4F6"};
  color: ${({ theme }) => theme?.colors?.text?.primary ?? "#111827"};
  cursor: pointer;
  transition: 0.18s ease;
  &:hover {
    background: ${({ theme }) => theme?.colors?.gray200 ?? "#E5E7EB"};
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionButton = styled.button<{ $liked?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.18s ease;
  background: ${({ $liked, theme }) =>
    $liked
      ? theme?.colors?.primary ?? "#6366F1"
      : theme?.colors?.gray100 ?? "#F3F4F6"};
  color: ${({ $liked, theme }) =>
    $liked
      ? theme?.colors?.white ?? "#fff"
      : theme?.colors?.text?.secondary ?? "#6B7280"};
  &:hover {
    filter: brightness(0.98);
  }
`;

/* ---- Hero (카드화) ---------------------------------------------------- */
export const HeroSection = styled.section<{ $isMobile: boolean }>`
  ${card};
  margin: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")} auto 8px;
  max-width: 1120px;
  overflow: hidden;
  position: relative;
  height: ${({ $isMobile }) => ($isMobile ? "240px" : "280px")};
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
`;

export const HeroOverlay = styled.div<{ $empty?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 18px;
  color: #fff;
  background: ${({ $empty }) =>
    $empty
      ? "linear-gradient(180deg, rgba(17,24,39,0.06), rgba(17,24,39,0.12))"
      : "linear-gradient(180deg, rgba(17,24,39,0) 0%, rgba(17,24,39,0.55) 70%)"};
  align-items: ${({ $empty }) => ($empty ? "center" : "flex-start")};
`;

export const StatusBadge = styled.div<{ $color: string; $bgColor: string }>`
  ${pill};
  color: ${({ $color }) => $color};
  background-color: ${({ $bgColor }) => $bgColor};
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 12px;
  font-weight: 600;
`;

export const CountdownBadge = styled.div<{ $urgent?: boolean }>`
  ${pill};
  color: ${({ $urgent }) => ($urgent ? "#DC2626" : "#2563EB")};
  background: ${({ $urgent }) => ($urgent ? "#FEE2E2" : "#DBEAFE")};
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 12px;
  font-weight: 600;
`;

export const HeroTitle = styled.h1<{ $isMobile: boolean }>`
  margin: 6px 0 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme?.colors?.text?.primary ?? "#111827"};
  letter-spacing: -0.02em;
`;

/* ---- Quick Info (카드) ------------------------------------------------ */
export const QuickInfoStrip = styled.div<{ $isMobile: boolean }>`
  ${card};
  margin: 8px auto;
  max-width: 1120px;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px 16px")};
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const InfoChip = styled.div<{ $highlight?: boolean }>`
  ${pill};
  background: ${({ $highlight, theme }) =>
    $highlight
      ? theme?.colors?.primary ?? "#6366F1"
      : theme?.colors?.gray100 ?? "#F3F4F6"};
  color: ${({ $highlight, theme }) =>
    $highlight
      ? theme?.colors?.white ?? "#fff"
      : theme?.colors?.text?.primary ?? "#111827"};
  border: 1px solid
    ${({ $highlight }) => ($highlight ? "transparent" : "#E5E7EB")};
`;
export const InfoIcon = styled.span`
  display: flex;
  align-items: center;
`;

/* ---- Live Status (카드) ----------------------------------------------- */
export const LiveStatusSection = styled.section<{ $isMobile: boolean }>`
  ${card};
  margin: 8px auto;
  max-width: 1120px;
  padding: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
`;

export const ProgressContainer = styled.div`
  margin-bottom: 8px;
`;
export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 6px;
  background: ${({ theme }) => theme?.colors?.gray100 ?? "#f3f4f6"};
  overflow: hidden;
`;
export const ProgressFill = styled.div<{ $rate: number; $warning?: boolean }>`
  height: 100%;
  width: ${({ $rate }) => Math.min($rate, 100)}%;
  background: ${({ $warning, theme }) =>
    $warning ? "#F59E0B" : theme?.colors?.primary ?? "#6366F1"};
  transition: width 0.25s ease;
`;
export const StatusText = styled.p<{ $warning?: boolean; $isMobile: boolean }>`
  margin: 0;
  font-weight: 700;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ $warning, theme }) =>
    $warning ? "#DC2626" : theme?.colors?.text?.primary ?? "#111827"};
`;
export const UrgencyIndicator = styled.div<{ $isMobile: boolean }>`
  ${pill};
  background: #fff7ed;
  color: #9a3412;
  border: 1px solid #fed7aa;
  margin-top: 6px;
`;

/* ---- Content Wrapper -------------------------------------------------- */
export const ContentSection = styled.section<{ $isMobile: boolean }>`
  margin: ${({ $isMobile }) => ($isMobile ? "0 0 24px 0" : "0 0 32px 0")};
  padding: 0;
`;

export const StorySection = styled.div<{
  $isMobile: boolean;
  $isHeader?: boolean;
}>`
  ${card};
  padding: ${({ $isMobile, $isHeader }) =>
    $isHeader
      ? $isMobile
        ? "0 0 20px 0"
        : "0 0 24px 0"
      : $isMobile
      ? "20px"
      : "24px"};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.divider ?? "#E5E7EB"};
  background: ${({ $isHeader, theme }) =>
    $isHeader ? "transparent" : theme?.colors?.white ?? "#FFFFFF"};
  border-radius: ${({ $isHeader }) => ($isHeader ? "0" : "12px")};
  box-shadow: ${({ $isHeader }) =>
    $isHeader
      ? "none"
      : "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)"};
`;

export const SectionTitle = styled.h2<{ $isMobile: boolean }>`
  margin: 0 0 10px;
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme?.colors?.text?.primary ?? "#111827"};
`;

export const Description = styled.p<{ $isMobile: boolean }>`
  margin: 0 0 14px;
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? "#4b5563"};
  line-height: 1.7;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
`;

/* ---- Host (카드 내부의 서브 카드 느낌) ------------------------------- */
export const HostCard = styled.div<{ $isMobile: boolean }>`
  ${subtleCard};
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "10px" : "12px")};
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
`;

export const HostAvatar = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "40px" : "48px")};
  height: ${({ $isMobile }) => ($isMobile ? "40px" : "48px")};
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme?.colors?.primary ?? "#6366F1"};
  color: #fff;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const HostInfo = styled.div`
  flex: 1;
`;
export const HostName = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text?.primary ?? "#111827"};
  margin-bottom: 2px;
`;
export const HostLevel = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? "#6b7280"};
  font-weight: 600;
`;

/* ---- Community -------------------------------------------------------- */
export const CommunitySection = styled.div<{ $isMobile: boolean }>`
  ${card};
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  background: ${({ theme }) => theme?.colors?.white ?? "#FFFFFF"};
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
`;

export const ParticipantsGrid = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 4px;
  justify-content: flex-end;

  /* 스크롤바 숨기기 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* 겹치게 하기 위한 spacing */
  > * {
    margin-right: ${({ $isMobile }) => ($isMobile ? "-4px" : "-6px")};
  }

  > *:last-child {
    margin-right: 0;
  }
`;

export const ParticipantSlot = styled.div<{
  $host?: boolean;
  $isMobile: boolean;
}>`
  min-width: ${({ $isMobile }) => ($isMobile ? "40px" : "44px")};
  width: ${({ $isMobile }) => ($isMobile ? "40px" : "44px")};
  height: ${({ $isMobile }) => ($isMobile ? "40px" : "44px")};
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  background: ${({ $host, theme }) =>
    $host
      ? theme?.colors?.primary ?? "#6366F1"
      : theme?.colors?.gray400 ?? "#9CA3AF"};
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
`;

export const EmptySlot = styled.div<{ $isMobile: boolean }>`
  min-width: ${({ $isMobile }) => ($isMobile ? "40px" : "44px")};
  width: ${({ $isMobile }) => ($isMobile ? "40px" : "44px")};
  height: ${({ $isMobile }) => ($isMobile ? "40px" : "44px")};
  border-radius: 9999px;
  border: 1px dashed ${({ theme }) => theme?.colors?.border ?? "#E5E7EB"};
  background: ${({ theme }) => theme?.colors?.gray100 ?? "#F3F4F6"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? "#9CA3AF"};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
`;

/* ---- Member List Styles ---------------------------------------------- */
export const MemberItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ $isMobile }) => ($isMobile ? "8px 0" : "10px 0")};
`;

export const MemberAvatar = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  border-radius: 50%;
  background: ${({ theme }) => theme?.colors?.gray100 ?? "#F3F4F6"};
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? "#6B7280"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const MemberName = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme?.colors?.text?.primary ?? "#111827"};
`;

export const MemberDetails = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? "#6B7280"};
`;

export const MemberLevel = styled.span`
  font-weight: 500;
`;

export const MemberMBTI = styled.span`
  padding: 2px 6px;
  background: ${({ theme }) => theme?.colors?.gray100 ?? "#F3F4F6"};
  border-radius: 4px;
  font-weight: 600;
  font-size: 10px;
`;

export const HostBadge = styled.div<{ $isMobile: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  height: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  border-radius: 50%;
  background: ${({ theme }) => theme?.colors?.primary ?? "#6366F1"};
  color: white;
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  font-weight: 600;
`;

/* ---- Details grid (카드들) ------------------------------------------- */
export const DetailsGrid = styled.div<{ $isMobile: boolean }>`
  display: grid;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  grid-auto-flow: row dense;
  grid-template-columns: 1fr;

  @media (min-width: 960px) {
    grid-template-columns: repeat(12, 1fr);
  }
`;

export const DetailCard = styled.div<{ $isMobile: boolean; $col?: number }>`
  ${card};
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  margin-bottom: 0;
  background: ${({ theme }) => theme?.colors?.white ?? "#FFFFFF"};
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);

  /* mobile은 항상 한 줄 */
  grid-column: span 12;

  @media (min-width: 960px) {
    grid-column: span ${({ $col }) => $col ?? 6};
  }
`;

export const MapFrame = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  aspect-ratio: ${({ $isMobile }) => ($isMobile ? "16 / 10" : "16 / 7")};
  border-radius: 10px;
  margin-top: 12px;
  background-color: #f3f4f6;
  overflow: hidden;
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text?.primary ?? "#111827"};
  margin-bottom: 10px;
  svg {
    color: ${({ theme }) => theme?.colors?.primary ?? "#6366F1"};
  }
`;

export const DetailContent = styled.div`
  padding: 0;
  &[as="button"] {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    cursor: pointer;
  }
`;

export const LocationInfo = styled.div`
  ${subtleCard};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
`;

export const LocationMain = styled.div`
  flex: 1;
  min-width: 0;
`;
export const LocationName = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? "#6b7280"};
  margin-bottom: 2px;
`;
export const LocationAddress = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? "#6b7280"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const ViewMapBtn = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${({ theme }) => theme?.colors?.gray100 ?? "#f3f4f6"};
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? "#6b7280"};
`;

/* ---- Trait tags ------------------------------------------------------- */
export const TraitTags = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ $isMobile }) => ($isMobile ? "6px" : "8px")};
`;
export const TraitTag = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ $isMobile }) => ($isMobile ? "6px 10px" : "8px 12px")};
  border-radius: 9999px;
  background: ${({ theme }) => theme?.colors?.gray100 ?? "#f3f4f6"};
  color: ${({ theme }) => theme?.colors?.text?.primary ?? "#374151"};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 600;
`;

/* ---- Requirements ----------------------------------------------------- */
export const RequirementsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
export const RequirementItem = styled.li<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "6px 0" : "8px 0")};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme?.colors?.text?.secondary ?? "#4b5563"};
  position: relative;
  padding-left: 18px;
  &::before {
    content: "•";
    position: absolute;
    left: 2px;
    color: ${({ theme }) => theme?.colors?.text?.secondary ?? "#9ca3af"};
  }
  &:not(:last-child) {
    border-bottom: 1px solid
      ${({ theme }) => theme?.colors?.divider ?? "#f3f4f6"};
  }
`;

/* ---- Mission (카드) --------------------------------------------------- */
export const MissionCard = styled.div<{ $isMobile: boolean }>`
  ${card};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  background: ${({ theme }) => theme?.colors?.gray100 ?? "#F3F4F6"};
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
`;
export const MissionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 0 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.divider ?? "#ecedee"};
  background: transparent;
  margin-bottom: 16px;
`;
export const MissionTitle = styled.h3<{ $isMobile: boolean }>`
  margin: 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text?.primary ?? "#111827"};
`;
export const RewardBadge = styled.div<{ $isMobile: boolean }>`
  ${pill};
  background: ${({ theme }) => theme?.colors?.primary ?? "#6366F1"};
  color: #fff;
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
`;
export const MissionBody = styled.div`
  padding: 0;
`;
export const ViewMissionBtn = styled.button<{ $isMobile: boolean }>`
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

/* ---- Floating CTA (카드 바) ------------------------------------------ */
export const FloatingActions = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: ${({ $isMobile }) => ($isMobile ? "calc(100% - 40px)" : "400px")};
  bottom: ${({ $isMobile }) => ($isMobile ? "4px" : "12px")};
  z-index: 50;
`;

export const ActionContainer = styled.div<{ $isMobile: boolean }>`
  ${card};
  width: 100%;
  margin: 0;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px 16px")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ $isMobile }) => ($isMobile ? "10px" : "14px")};
  border-radius: 14px;
  background: ${({ theme }) => theme?.colors?.white ?? "#FFFFFF"};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
`;

export const PriceInfo = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 800;
  color: ${({ theme }) => theme?.colors?.primary ?? "#6366F1"};
`;

export const SeatsInfo = styled.div<{ $warning?: boolean; $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ $warning }) => ($warning ? "#DC2626" : "#6B7280")};
  font-weight: ${({ $warning }) => ($warning ? 700 : 600)};
`;

export const PrimaryAction = styled.button<{
  $isMobile: boolean;
  $isCancel?: boolean;
}>`
  background: ${({ $isCancel, theme }) =>
    $isCancel ? "#EF4444" : theme?.colors?.primary ?? "#6366F1"};
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: ${({ $isMobile }) => ($isMobile ? "12px" : "8px")};
  padding: ${({ $isMobile }) => ($isMobile ? "12px 18px" : "12px 24px")};
  min-width: ${({ $isMobile }) => ($isMobile ? "150px" : "160px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "14px")};
  font-weight: 600;
  letter-spacing: -0.01em;
  transition: 0.18s ease;
  &:hover {
    filter: brightness(0.98);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

/* ---- Desktop Bottom Action Section ---------------------------------- */
export const BottomActionSection = styled.div<{ $isMobile: boolean }>`
  margin-top: ${({ $isMobile }) => ($isMobile ? "0" : "48px")};
  padding: ${({ $isMobile }) => ($isMobile ? "0" : "24px 0")};
  border-top: ${({ $isMobile }) => ($isMobile ? "none" : "1px solid #E5E7EB")};
  display: ${({ $isMobile }) => ($isMobile ? "none" : "flex")};
  justify-content: center;
  align-items: center;
`;
