import styled, { css } from 'styled-components';
import { responsive } from '../../../../shared/styles/mixins';

export const PageContainer = styled.div<{ $isMobile: boolean }>`
  height: 100%;
  background: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ContentContainer = styled.div<{ $isMobile: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '24px')};
  min-height: 0;

  ${responsive.mobile(css`
    padding: 16px;
  `)}
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const InfoContent = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '20px' : '24px')};

  ${responsive.mobile(css`
    gap: 20px;
  `)}
`;

export const ChatContent = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const VerificationContent = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ComingSoon = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;

  ${responsive.mobile(css`
    font-size: 16px;
  `)}
`;

export const Section = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const SectionTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  ${responsive.mobile(css`
    font-size: 16px;
  `)}
`;

export const MeetingTitle = styled.h1<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '20px' : '24px')};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
  line-height: 1.3;

  ${responsive.mobile(css`
    font-size: 20px;
  `)}
`;

export const MeetingDescription = styled.p<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 20px 0;
  line-height: 1.5;

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const InfoGrid = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  ${responsive.mobile(css`
    gap: 12px;
  `)}
`;

export const InfoItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const ParticipantList = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  ${responsive.mobile(css`
    gap: 12px;
  `)}
`;

export const ParticipantItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  ${responsive.mobile(css`
    gap: 12px;
    padding: 12px;
  `)}
`;

export const ParticipantAvatar = styled.img<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '40px' : '48px')};
  height: ${({ $isMobile }) => ($isMobile ? '40px' : '48px')};
  border-radius: 50%;
  object-fit: cover;

  ${responsive.mobile(css`
    width: 40px;
    height: 40px;
  `)}
`;

export const ParticipantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ParticipantName = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const ParticipantMeta = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '13px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  ${responsive.mobile(css`
    font-size: 12px;
  `)}
`;

export const CurrentUserBadge = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '10px' : '11px')};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-left: 6px;
  background: ${({ theme }) => theme.colors.primary}10;
  padding: 2px 6px;
  border-radius: 4px;

  ${responsive.mobile(css`
    font-size: 10px;
  `)}
`;

export const LocationText = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  ${responsive.mobile(css`
    font-size: 14px;
    padding: 12px;
  `)}
`;

export const LocationCard = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? '12px 14px' : '12px 14px')};
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${responsive.mobile(css`
    padding: 12px 14px;
  `)}
`;

export const LocationCardMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const LocationCardTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

export const LocationCardContent = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2px;
`;

export const LocationCardSubtext = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const MapFrame = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  aspect-ratio: ${({ $isMobile }) => ($isMobile ? "16 / 10" : "16 / 7")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: 12px;
  background-color: ${({ theme }) => theme.colors.gray100};
  overflow: hidden;

  ${responsive.mobile(css`
    aspect-ratio: 16 / 10;
  `)}
`;

export const MapButton = styled.button<{ $isMobile: boolean }>`
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  ${responsive.mobile(css`
    font-size: 14px;
    padding: 12px;
  `)}
`;

export const PrecautionsList = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '10px')};

  ${responsive.mobile(css`
    gap: 8px;
  `)}
`;

export const PrecautionItem = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
  padding-left: 8px;

  ${responsive.mobile(css`
    font-size: 13px;
  `)}
`;

export const BottomTabBar = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: ${({ $isMobile }) => ($isMobile ? '8px 0 calc(8px + env(safe-area-inset-bottom))' : '12px 0')};
  z-index: 100;
  flex-shrink: 0;
  min-height: ${({ $isMobile }) => ($isMobile ? '64px' : '72px')};

  ${responsive.mobile(css`
    padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
    min-height: calc(64px + env(safe-area-inset-bottom));
  `)}
`;

export const TabButton = styled.button<{ $active: boolean; $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ $isMobile }) => ($isMobile ? '8px 16px' : '12px 20px')};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex: 1;
  max-width: 100px;

  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.text.secondary};

  ${responsive.mobile(css`
    padding: 8px 16px;
  `)}
`;

export const TabLabel = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '11px' : '12px')};
  font-weight: 500;

  ${responsive.mobile(css`
    font-size: 11px;
  `)}
`;