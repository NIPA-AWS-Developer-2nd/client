import styled, { css, keyframes } from 'styled-components';
// import { responsive } from '../../../../shared/styles/mixins';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const PageContainer = styled.div<{ $isMobile: boolean }>`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.white};
  
  ${({ $isMobile }) => $isMobile ? css`
    padding: 0;
  ` : css`
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
  `}
`;

export const Header = styled.header<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: ${({ $isMobile }) => $isMobile ? '16px' : '0 0 20px 0'};
  border-bottom: ${({ $isMobile, theme }) => 
    $isMobile ? `1px solid ${theme.colors.border}` : 'none'
  };
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt};
  }
`;

export const HeaderTitle = styled.h1<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '18px' : '24px'};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const BalanceSection = styled.section<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => $isMobile ? '20px 16px' : '20px 0'};
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const TransactionList = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => $isMobile ? '0' : '20px 0'};
`;

export const TransactionItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ $isMobile }) => $isMobile ? '16px' : '16px 0'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const TransactionIcon = styled.div<{ 
  $color: 'positive' | 'negative' | 'neutral' 
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  
  ${({ $color, theme }) => {
    switch ($color) {
      case 'positive':
        return css`
          background: ${theme.colors.successLight};
          color: ${theme.colors.success};
        `;
      case 'negative':
        return css`
          background: ${theme.colors.errorLight};
          color: ${theme.colors.error};
        `;
      default:
        return css`
          background: ${theme.colors.backgroundAlt};
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

export const TransactionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TransactionTitle = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '14px' : '15px'};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

export const TransactionSubtitle = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '12px' : '13px'};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TransactionDate = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '11px' : '12px'};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

export const TransactionAmount = styled.div<{ 
  $color: 'positive' | 'negative' | 'neutral';
  $isMobile: boolean;
}>`
  font-size: ${({ $isMobile }) => $isMobile ? '15px' : '16px'};
  font-weight: 700;
  white-space: nowrap;
  
  ${({ $color, theme }) => {
    switch ($color) {
      case 'positive':
        return css`color: ${theme.colors.success};`;
      case 'negative':
        return css`color: ${theme.colors.error};`;
      default:
        return css`color: ${theme.colors.text};`;
    }
  }}
`;

export const LoadMoreButton = styled.button<{ $isMobile: boolean }>`
  width: 100%;
  padding: 16px;
  margin: ${({ $isMobile }) => $isMobile ? '0' : '20px 0'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

export const EmptyState = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ $isMobile }) => $isMobile ? '60px 20px' : '80px 20px'};
  text-align: center;
`;

export const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyText = styled.p<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => $isMobile ? '14px' : '15px'};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;