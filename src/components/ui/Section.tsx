import React from "react";
import styled from "styled-components";

interface SectionProps {
  children: React.ReactNode;
  isMobile?: boolean;
  className?: string;
}

interface SectionTitleProps {
  children: React.ReactNode;
  isMobile?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ children, isMobile, className }) => (
  <SectionContainer $isMobile={isMobile} className={className}>
    {children}
  </SectionContainer>
);

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, isMobile, icon, className }) => (
  <SectionTitleContainer $isMobile={isMobile} className={className}>
    {icon}
    {children}
  </SectionTitleContainer>
);

const SectionContainer = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SectionTitleContainer = styled.h3<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
`;