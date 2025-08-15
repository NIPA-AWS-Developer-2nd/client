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

export const ContentGrid = styled.div<{ $isMobile: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => 
    $isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))'};
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  ${responsive.mobile(css`
    grid-template-columns: 1fr;
    gap: 12px;
  `)}
`;

export const ContentCard = styled.div<{ $isMobile: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }

  ${responsive.mobile(css`
    gap: 12px;
    padding: 12px;
  `)}
`;

export const ContentImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: cover;
  flex-shrink: 0;

  ${responsive.mobile(css`
    width: 50px;
    height: 50px;
  `)}
`;

export const ContentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
`;

export const ContentTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const ContentMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MetaIcon = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
`;

export const MetaText = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '13px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  ${responsive.mobile(css`
    font-size: 12px;
  `)}
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