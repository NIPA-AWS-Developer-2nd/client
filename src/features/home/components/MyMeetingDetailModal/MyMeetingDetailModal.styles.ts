import styled, { css } from 'styled-components';
import { responsive } from '../../../../shared/styles/mixins';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
`;

export const ModalContent = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: ${({ $isMobile }) => ($isMobile ? '100%' : '600px')};
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  ${responsive.mobile(css`
    max-width: 100%;
    margin: 0;
  `)}
`;

export const ModalHeader = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  ${responsive.mobile(css`
    padding: 16px;
  `)}
`;

export const ModalTitle = styled.h2<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '18px' : '20px')};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;

  ${responsive.mobile(css`
    font-size: 18px;
  `)}
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const ModalBody = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '20px' : '24px')};

  ${responsive.mobile(css`
    padding: 16px;
    gap: 20px;
  `)}
`;

export const LoadingContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $isMobile }) => ($isMobile ? '40px 20px' : '60px 20px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};

  ${responsive.mobile(css`
    padding: 40px 20px;
    font-size: 14px;
  `)}
`;

export const ErrorContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $isMobile }) => ($isMobile ? '40px 20px' : '60px 20px')};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  text-align: center;

  ${responsive.mobile(css`
    padding: 40px 20px;
    font-size: 14px;
  `)}
`;

export const Section = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  ${responsive.mobile(css`
    gap: 12px;
  `)}
`;

export const SectionTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  ${responsive.mobile(css`
    font-size: 16px;
  `)}
`;

export const MeetingInfo = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  ${responsive.mobile(css`
    gap: 12px;
  `)}
`;

export const MeetingTitle = styled.h4<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '18px' : '20px')};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.3;

  ${responsive.mobile(css`
    font-size: 18px;
  `)}
`;

export const MeetingDescription = styled.p<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const InfoGrid = styled.div<{ $isMobile: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? '1fr' : 'repeat(3, 1fr)')};
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  ${responsive.mobile(css`
    grid-template-columns: 1fr;
    gap: 12px;
  `)}
`;

export const InfoItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }

  ${responsive.mobile(css`
    font-size: 13px;
  `)}
`;

export const ParticipantGrid = styled.div<{ $isMobile: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)')};
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  ${responsive.mobile(css`
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  `)}
`;

export const ParticipantCard = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    transform: translateY(-1px);
  }

  ${responsive.mobile(css`
    padding: 12px;
  `)}
`;

export const ParticipantAvatarWrapper = styled.div`
  position: relative;
  margin-bottom: 8px;
`;

export const ParticipantAvatar = styled.img<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '48px' : '56px')};
  height: ${({ $isMobile }) => ($isMobile ? '48px' : '56px')};
  border-radius: 50%;
  object-fit: cover;

  ${responsive.mobile(css`
    width: 48px;
    height: 48px;
  `)}
`;

export const CrownIcon = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  top: -4px;
  right: -4px;
  width: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  height: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  ${responsive.mobile(css`
    width: 16px;
    height: 16px;
  `)}
`;

export const ParticipantInfo = styled.div<{ $isMobile: boolean }>`
  text-align: center;
  width: 100%;
`;

export const ParticipantName = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${responsive.mobile(css`
    font-size: 13px;
  `)}
`;

export const ParticipantMeta = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${({ $isMobile }) => ($isMobile ? '11px' : '12px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  span {
    padding: 2px 6px;
    background: ${({ theme }) => theme.colors.gray200};
    border-radius: 8px;
  }

  ${responsive.mobile(css`
    font-size: 11px;
  `)}
`;

export const LocationInfo = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '12px')};

  ${responsive.mobile(css`
    gap: 8px;
  `)}
`;

export const LocationText = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
  transition: all 0.2s ease;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const MapButton = styled.button<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${({ $isMobile }) => ($isMobile ? '8px 16px' : '10px 20px')};
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}25;
    border-color: ${({ theme }) => theme.colors.primary}50;
  }

  ${responsive.mobile(css`
    padding: 8px 16px;
    font-size: 13px;
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

export const ChatButton = styled.button<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? '12px 20px' : '16px 24px')};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
    transform: translateY(-1px);
  }

  ${responsive.mobile(css`
    padding: 12px 20px;
    font-size: 14px;
  `)}
`;