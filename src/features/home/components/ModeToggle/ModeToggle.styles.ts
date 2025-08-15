import styled, { css } from 'styled-components';
import { responsive } from '../../../../shared/styles/mixins';

export const ToggleContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '12px')};
`;

export const ModeLabel = styled.span<{ $active: boolean; $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.text.secondary};
  transition: all 0.2s ease;
  
  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const ToggleButton = styled.button<{ $isMobile: boolean }>`
  position: relative;
  width: ${({ $isMobile }) => ($isMobile ? '48px' : '56px')};
  height: ${({ $isMobile }) => ($isMobile ? '24px' : '28px')};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ $isMobile }) => ($isMobile ? '12px' : '14px')};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }

  ${responsive.mobile(css`
    width: 48px;
    height: 24px;
    border-radius: 12px;
  `)}
`;

export const ToggleSlider = styled.div<{ $active: boolean; $isMobile: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $active, $isMobile }) => 
    $active ? ($isMobile ? '26px' : '30px') : '2px'};
  width: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  height: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  background-color: ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.text.secondary};
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ${responsive.mobile(css`
    width: 16px;
    height: 16px;
  `)}
`;