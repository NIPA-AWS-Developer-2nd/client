import React from "react";
import styled from "styled-components";

interface MetaItemProps {
  icon: React.ReactNode;
  value: string | React.ReactNode;
  label: string;
  iconColor?: string;
  isMobile?: boolean;
  className?: string;
}

export const MetaItem: React.FC<MetaItemProps> = ({ 
  icon, 
  value, 
  label, 
  iconColor, 
  isMobile, 
  className 
}) => (
  <MetaItemContainer $isMobile={isMobile} className={className}>
    <MetaIcon $color={iconColor}>
      {icon}
    </MetaIcon>
    <MetaValue $isMobile={isMobile}>
      {value}
    </MetaValue>
    <MetaLabel $isMobile={isMobile}>
      {label}
    </MetaLabel>
  </MetaItemContainer>
);

const MetaItemContainer = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px 12px" : "20px 16px")};
  text-align: center;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }
`;

const MetaIcon = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: ${({ $color, theme }) => $color || theme.colors.primary};
`;

const MetaValue = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const MetaLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;