import React from "react";
import styled from "styled-components";
import { BRANDING } from "../../constants";
import logoImage from "../../assets/images/halsaram-logo.png";

interface BrandingContentProps {
  variant?: "splash" | "sidebar";
  className?: string;
}

const LogoImage = styled.img<{ $variant: "splash" | "sidebar" }>`
  width: ${({ $variant }) => ($variant === "splash" ? "120px" : "80px")};
  height: ${({ $variant }) => ($variant === "splash" ? "120px" : "80px")};
  margin-bottom: ${({ $variant }) => ($variant === "splash" ? "32px" : "24px")};
  border-radius: 24px;

  @media (max-width: 768px) {
    width: ${({ $variant }) => ($variant === "splash" ? "100px" : "80px")};
    height: ${({ $variant }) => ($variant === "splash" ? "100px" : "80px")};
  }
`;

const BrandingContainer = styled.div<{ $variant: "splash" | "sidebar" }>`
  text-align: center;
  color: ${({ theme, $variant }) => 
    $variant === "splash" ? theme.colors.text.primary : "#FFFFFF"};
  max-width: 320px;
  position: relative;
`;

const BrandingTitle = styled.h1<{ $variant: "splash" | "sidebar" }>`
  font-size: ${({ $variant }) => ($variant === "splash" ? "48px" : "36px")};
  font-weight: 700;
  margin-bottom: ${({ $variant }) => ($variant === "splash" ? "24px" : "16px")};
  line-height: 1.2;
  color: ${({ theme, $variant }) => 
    $variant === "splash" ? theme.colors.text.primary : "#FFFFFF"};

  @media (max-width: 768px) {
    font-size: ${({ $variant }) => ($variant === "splash" ? "40px" : "36px")};
  }
`;

const BrandingSubtitle = styled.p<{ $variant: "splash" | "sidebar" }>`
  font-size: ${({ $variant }) => ($variant === "splash" ? "18px" : "16px")};
  margin-bottom: ${({ $variant }) => ($variant === "splash" ? "48px" : "40px")};
  opacity: ${({ $variant }) => ($variant === "splash" ? "0.9" : "0.8")};
  line-height: 1.6;
  color: ${({ theme, $variant }) => 
    $variant === "splash" ? theme.colors.text.secondary : "#D1D5DB"};
  white-space: pre-line;

  @media (max-width: 768px) {
    font-size: ${({ $variant }) => ($variant === "splash" ? "15px" : "16px")};
  }
`;

const BrandingDescription = styled.p<{ $variant: "splash" | "sidebar" }>`
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.6;
  color: ${({ theme, $variant }) => 
    $variant === "splash" ? theme.colors.text.secondary : "#9CA3AF"};
  white-space: pre-line;
`;

export const BrandingContent: React.FC<BrandingContentProps> = ({
  variant = "sidebar",
  className,
}) => {
  return (
    <BrandingContainer $variant={variant} className={className}>
      <LogoImage 
        $variant={variant} 
        src={logoImage} 
        alt="Halsaram Logo"
      />
      <BrandingTitle $variant={variant}>{BRANDING.title}</BrandingTitle>
      <BrandingSubtitle $variant={variant}>
        {BRANDING.subtitle}
      </BrandingSubtitle>
      {variant === "splash" && BRANDING.description && (
        <BrandingDescription $variant={variant}>
          {BRANDING.description}
        </BrandingDescription>
      )}
      {variant === "sidebar" && BRANDING.description && (
        <BrandingSubtitle $variant={variant}>
          {BRANDING.description}
        </BrandingSubtitle>
      )}
    </BrandingContainer>
  );
};
