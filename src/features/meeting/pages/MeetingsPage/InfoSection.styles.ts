import styled from "styled-components";

export const InfoSection = styled.section<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const InfoGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  margin-bottom: 16px;
`;

export const InfoItem = styled.div<{ $isMobile?: boolean }>`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const InfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const InfoValue = styled.div<{
  $isMobile?: boolean;
  $isToday?: boolean;
  $type?: string;
}>`
  font-weight: 600;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme, $type }) => {
    if ($type === "today") return theme.colors.primary;
    if ($type === "started") return theme.colors.success;
    if ($type === "completed") return theme.colors.text.secondary;
    return theme.colors.text.primary;
  }};

  ${({ $isToday, $type, theme }) =>
    $isToday &&
    $type === "today" &&
    `
      background: ${theme.colors.primary}10;
      padding: 4px 8px;
      border-radius: ${theme.borderRadius.sm};
      border: 1px solid ${theme.colors.primary}20;
      font-weight: 700;
    `}

  ${({ $type, theme }) =>
    $type === "started" &&
    `
      background: ${theme.colors.success}10;
      padding: 4px 8px;
      border-radius: ${theme.borderRadius.sm};
      border: 1px solid ${theme.colors.success}20;
      font-weight: 700;
    `}
`;

export const InfoLabel = styled.div<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
`;

export const LocationItem = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const LocationIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const LocationText = styled.div`
  flex: 1;
`;

export const LocationLabel = styled.div<{ $isMobile?: boolean }>`
  font-weight: 500;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

export const LocationAddress = styled.div<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
`;

export const RewardInfo = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.success};
`;

export const RewardText = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
`;

export const MapSection = styled.div<{ $isMobile?: boolean }>`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const MapContainer = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  height: ${({ $isMobile }) => ($isMobile ? "160px" : "200px")};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }
`;

export const MapPlaceholder = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  gap: 8px;
`;

export const MapText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const MapSubText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const MapButton = styled.button<{ $isMobile?: boolean }>`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 16px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}E6;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;