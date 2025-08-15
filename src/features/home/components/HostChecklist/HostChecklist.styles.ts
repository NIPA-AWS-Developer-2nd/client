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

export const ChecklistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ChecklistCard = styled.div<{ 
  $isMobile: boolean;
  $priority: 'high' | 'medium' | 'low';
}>`
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-left: 4px solid ${({ theme, $priority }) => {
    switch ($priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.border.light;
    }
  }};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${responsive.mobile(css`
    padding: 16px;
  `)}
`;

export const ChecklistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const PriorityBadge = styled.div<{ 
  $priority: 'high' | 'medium' | 'low';
  $isMobile: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: ${({ $isMobile }) => ($isMobile ? '4px 8px' : '6px 12px')};
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '13px')};
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, $priority }) => {
    switch ($priority) {
      case 'high':
        return theme.colors.error + '20';
      case 'medium':
        return theme.colors.warning + '20';
      case 'low':
        return theme.colors.success + '20';
      default:
        return theme.colors.text.disabled + '20';
    }
  }};
  color: ${({ theme, $priority }) => {
    switch ($priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.text.disabled;
    }
  }};

  ${responsive.mobile(css`
    padding: 4px 8px;
    font-size: 12px;
  `)}
`;

export const ChecklistTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;

  ${responsive.mobile(css`
    font-size: 16px;
  `)}
`;

export const ChecklistDescription = styled.p<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 16px;
  line-height: 1.5;

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const ChecklistMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
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
  color: ${({ theme }) => theme.colors.background.primary};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
    transform: translateX(2px);
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