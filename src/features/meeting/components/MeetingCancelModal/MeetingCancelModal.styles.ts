import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const Modal = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
  
  ${({ $isMobile }) => $isMobile ? css`
    width: 100%;
    max-width: 400px;
    margin: 0 16px;
  ` : css`
    width: 520px;
    max-width: 90vw;
  `}
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h2<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '18px' : '20px'};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Content = styled.div`
  padding: 24px;
`;

export const MeetingInfo = styled.div<{ $isMobile: boolean }>`
  margin-bottom: 24px;
`;

export const MeetingTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '16px' : '18px'};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

export const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ReasonSection = styled.div<{ $isMobile: boolean }>`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => $isMobile ? '15px' : '16px'};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ReasonInput = styled.textarea<{ $isMobile: boolean }>`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => $isMobile ? '14px' : '15px'};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CharacterCount = styled.div<{ $isMobile: boolean }>`
  text-align: right;
  font-size: ${({ $isMobile }) => $isMobile ? '11px' : '12px'};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 4px;
`;

export const PolicySection = styled.div<{ $isMobile: boolean }>`
  margin-bottom: 20px;
`;

export const PolicyInfo = styled.div<{ $color: 'success' | 'warning' | 'error' }>`
  border: 1px solid ${({ theme, $color }) => {
    switch ($color) {
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      default: return theme.colors.border;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $color }) => {
    switch ($color) {
      case 'success': return theme.colors.successLight;
      case 'warning': return theme.colors.warningLight;
      case 'error': return theme.colors.errorLight;
      default: return theme.colors.background;
    }
  }};
  margin-bottom: 12px;
`;

export const PolicyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const PolicyLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PolicyValue = styled.span<{ $positive?: boolean; $negative?: boolean }>`
  font-size: 15px;
  font-weight: 700;
  
  ${({ $positive, $negative, theme }) => {
    if ($positive) return `color: ${theme.colors.success};`;
    if ($negative) return `color: ${theme.colors.error};`;
    return `color: ${theme.colors.text};`;
  }}
`;

export const PolicyBox = styled.div<{ 
  $color: 'success' | 'warning' | 'error';
  $isMobile: boolean;
}>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $color }) => {
    switch ($color) {
      case 'success': return theme.colors.successLight;
      case 'warning': return theme.colors.warningLight;
      case 'error': return theme.colors.errorLight;
      default: return theme.colors.backgroundAlt;
    }
  }};
  border: 1px solid ${({ theme, $color }) => {
    switch ($color) {
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      default: return theme.colors.border;
    }
  }};
  
  svg {
    color: ${({ theme, $color }) => {
      switch ($color) {
        case 'success': return theme.colors.success;
        case 'warning': return theme.colors.warning;
        case 'error': return theme.colors.error;
        default: return theme.colors.textSecondary;
      }
    }};
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

export const PolicyText = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '12px' : '13px'};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
`;

export const FinalWarningBox = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.errorLight};
  border: 2px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  svg {
    color: ${({ theme }) => theme.colors.error};
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

export const FinalWarningText = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '13px' : '14px'};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
  font-weight: 500;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const BackButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.textSecondary};
    color: ${({ theme }) => theme.colors.text};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  font-size: 14px;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.errorDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;