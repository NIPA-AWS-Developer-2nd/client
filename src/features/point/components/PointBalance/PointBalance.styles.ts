import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Container = styled.div<{ 
  $isMobile: boolean; 
  $size: 'sm' | 'md' | 'lg';
  $clickable: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${({ $size }) => 
    $size === 'sm' ? '6px' : 
    $size === 'md' ? '8px' : '10px'
  };
  padding: ${({ $size }) => 
    $size === 'sm' ? '4px 8px' : 
    $size === 'md' ? '6px 12px' : '8px 16px'
  };
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  ${({ $clickable }) => $clickable && css`
    cursor: pointer;
  `}

  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

export const IconWrapper = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Content = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $size }) => $size === 'sm' ? '1px' : '2px'};
`;

export const Label = styled.span<{ 
  $isMobile: boolean; 
  $size: 'sm' | 'md' | 'lg';
}>`
  font-size: ${({ $isMobile, $size }) => {
    if ($size === 'sm') return $isMobile ? '10px' : '11px';
    if ($size === 'md') return $isMobile ? '11px' : '12px';
    return $isMobile ? '12px' : '13px';
  }};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  line-height: 1.2;
`;

export const Points = styled.span<{ 
  $isMobile: boolean; 
  $size: 'sm' | 'md' | 'lg';
}>`
  font-size: ${({ $isMobile, $size }) => {
    if ($size === 'sm') return $isMobile ? '13px' : '14px';
    if ($size === 'md') return $isMobile ? '15px' : '16px';
    return $isMobile ? '17px' : '18px';
  }};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  line-height: 1.2;
`;