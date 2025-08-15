import styled, { css } from 'styled-components';
import { responsive } from '../../../../shared/styles/mixins';

export const Container = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '24px')};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${responsive.mobile(css`
    padding: 16px;
  `)}
`;

export const SectionTitle = styled.h2<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '18px' : '20px')};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};

  ${responsive.mobile(css`
    font-size: 18px;
    margin-bottom: 16px;
  `)}
`;

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ActivityCard = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${responsive.mobile(css`
    padding: 16px;
  `)}
`;

export const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const ActivityTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
  margin-right: 12px;

  ${responsive.mobile(css`
    font-size: 16px;
  `)}
`;

export const ActivityStatus = styled.span<{ 
  $color: 'primary' | 'success' | 'warning' | 'disabled';
  $isMobile: boolean;
}>`
  padding: ${({ $isMobile }) => ($isMobile ? '4px 8px' : '6px 12px')};
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '13px')};
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, $color }) => {
    switch ($color) {
      case 'primary':
        return theme.colors.primary + '20';
      case 'success':
        return theme.colors.success + '20';
      case 'warning':
        return theme.colors.warning + '20';
      case 'disabled':
        return theme.colors.text.disabled + '20';
      default:
        return theme.colors.text.disabled + '20';
    }
  }};
  color: ${({ theme, $color }) => {
    switch ($color) {
      case 'primary':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'disabled':
        return theme.colors.text.disabled;
      default:
        return theme.colors.text.disabled;
    }
  }};

  ${responsive.mobile(css`
    padding: 4px 8px;
    font-size: 12px;
  `)}
`;

export const ActivityContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ActivityMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const MetaIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
`;

export const MetaText = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  ${responsive.mobile(css`
    font-size: 13px;
  `)}
`;

export const ActionButton = styled.button<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ $isMobile }) => ($isMobile ? '8px 12px' : '10px 16px')};
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background.primary};
  }

  ${responsive.mobile(css`
    padding: 8px 12px;
    font-size: 13px;
  `)}
`;

export const ActionIcon = styled.div`
  display: flex;
  align-items: center;
`;

export const EmptyState = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ $isMobile }) => ($isMobile ? '32px 16px' : '48px 24px')};
  text-align: center;

  ${responsive.mobile(css`
    padding: 32px 16px;
  `)}
`;

export const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.disabled};
  margin-bottom: 16px;
`;

export const EmptyText = styled.p<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;