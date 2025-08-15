import styled, { css, keyframes } from 'styled-components';
import { responsive } from '../../../../shared/styles/mixins';

const slideDown = keyframes`
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 800px;
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    max-height: 800px;
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
`;

export const DropdownContainer = styled.div<{ $isExpanded: boolean; $isMobile: boolean }>`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-top: none;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md};
  margin: 0 0 12px 0;
  padding: ${({ $isMobile }) => ($isMobile ? '16px 20px 16px 20px' : '20px 24px 20px 24px')};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: ${({ $isExpanded }) => 
    $isExpanded ? css`${slideDown} 0.3s ease-out` : css`${slideUp} 0.3s ease-out`};
  animation-fill-mode: forwards;


  ${responsive.mobile(css`
    padding: 16px 20px;
  `)}
`;

export const LoadingContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $isMobile }) => ($isMobile ? '20px' : '24px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};

  ${responsive.mobile(css`
    padding: 20px;
    font-size: 13px;
  `)}
`;

export const ErrorContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $isMobile }) => ($isMobile ? '20px' : '24px')};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};

  ${responsive.mobile(css`
    padding: 20px;
    font-size: 13px;
  `)}
`;

export const Section = styled.div<{ $isMobile: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};

  &:last-of-type {
    margin-bottom: 0;
  }

  ${responsive.mobile(css`
    margin-bottom: 16px;
  `)}
`;

export const SectionTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 6px;

  ${responsive.mobile(css`
    font-size: 13px;
  `)}
`;

export const InfoGrid = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '10px')};

  ${responsive.mobile(css`
    gap: 8px;
  `)}
`;

export const InfoItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '13px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }

  ${responsive.mobile(css`
    font-size: 12px;
  `)}
`;

export const ParticipantList = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '10px')};

  ${responsive.mobile(css`
    gap: 8px;
  `)}
`;

export const ParticipantItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '10px')};
  padding: ${({ $isMobile }) => ($isMobile ? '8px' : '10px')};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    transform: translateX(2px);
  }

  ${responsive.mobile(css`
    gap: 8px;
    padding: 8px;
  `)}
`;

export const ParticipantAvatar = styled.img<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '32px' : '36px')};
  height: ${({ $isMobile }) => ($isMobile ? '32px' : '36px')};
  border-radius: 50%;
  object-fit: cover;

  ${responsive.mobile(css`
    width: 32px;
    height: 32px;
  `)}
`;

export const ParticipantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ParticipantName = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${responsive.mobile(css`
    font-size: 13px;
  `)}
`;

export const ParticipantMeta = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '11px' : '12px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  ${responsive.mobile(css`
    font-size: 11px;
  `)}
`;

export const LocationText = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ $isMobile }) => ($isMobile ? '8px' : '10px')};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
    color: ${({ theme }) => theme.colors.primary};
  }

  ${responsive.mobile(css`
    font-size: 13px;
    padding: 8px;
  `)}
`;

export const PrecautionsList = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '6px' : '8px')};

  ${responsive.mobile(css`
    gap: 6px;
  `)}
`;

export const PrecautionItem = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '13px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
  padding-left: 8px;

  ${responsive.mobile(css`
    font-size: 12px;
  `)}
`;

export const ChatButton = styled.button<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? '10px 16px' : '12px 20px')};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
    transform: translateY(-1px);
  }

  ${responsive.mobile(css`
    padding: 10px 16px;
    font-size: 13px;
    margin-top: 12px;
  `)}
`;