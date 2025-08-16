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
  
  ${({ $isMobile }) => $isMobile ? css`
    width: 100%;
    max-width: 400px;
    margin: 0 16px;
  ` : css`
    width: 480px;
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

export const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const RefundSection = styled.div<{ $isMobile: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 20px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  margin-bottom: 16px;
`;

export const SectionTitle = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '15px' : '16px'};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

export const RefundInfo = styled.div<{ $color: 'success' | 'warning' | 'error' }>`
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

export const RefundItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const RefundLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const RefundValue = styled.span<{ $positive?: boolean; $negative?: boolean }>`
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

export const WarningBox = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.errorLight};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  svg {
    color: ${({ theme }) => theme.colors.error};
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

export const WarningText = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '12px' : '13px'};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CancelButton = styled.button`
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

export const LeaveButton = styled.button`
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