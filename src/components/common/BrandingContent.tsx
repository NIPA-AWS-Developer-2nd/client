import React from "react";
import styled from "styled-components";
import { BRANDING } from "../../constants";
import thunderImage from "../../assets/images/thunder.png";

interface BrandingContentProps {
  variant?: "splash" | "sidebar";
  className?: string;
}

const BrandingContainer = styled.div<{ $variant: "splash" | "sidebar" }>`
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  max-width: 320px;
  position: relative;

  /* 번개 배경 이미지 추가 */
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${({ $variant }) => ($variant === "splash" ? "450px" : "250px")};
    height: ${({ $variant }) => ($variant === "splash" ? "450px" : "250px")};
    background-image: url(${thunderImage});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: ${({ $variant }) => ($variant === "splash" ? "0.1" : "0.08")};
    filter: blur(
      ${({ $variant }) => ($variant === "splash" ? "2px" : "1.5px")}
    );
    z-index: 0;
    pointer-events: none;
  }

  /* 모든 자식 요소를 배경 위에 표시 */
  > * {
    position: relative;
    z-index: 1;
  }
`;

const BrandingTitle = styled.h1<{ $variant: "splash" | "sidebar" }>`
  font-size: ${({ $variant }) => ($variant === "splash" ? "48px" : "36px")};
  font-weight: 700;
  margin-bottom: ${({ $variant }) => ($variant === "splash" ? "24px" : "16px")};
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.white};
`;

const BrandingSubtitle = styled.p<{ $variant: "splash" | "sidebar" }>`
  font-size: ${({ $variant }) => ($variant === "splash" ? "18px" : "16px")};
  margin-bottom: ${({ $variant }) => ($variant === "splash" ? "48px" : "40px")};
  opacity: ${({ $variant }) => ($variant === "splash" ? "0.9" : "0.8")};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray300};
  white-space: pre-line;
`;

const BrandingDescription = styled.p<{ $variant: "splash" | "sidebar" }>`
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray400};
  white-space: pre-line;
`;

export const BrandingContent: React.FC<BrandingContentProps> = ({
  variant = "sidebar",
  className,
}) => {
  return (
    <BrandingContainer $variant={variant} className={className}>
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
