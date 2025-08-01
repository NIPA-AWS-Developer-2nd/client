import React from "react";
import styled from "styled-components";
import appleLogoImg from "../../assets/images/apple-logo.png";
import kakaoLogoImg from "../../assets/images/kakao-logo.svg";
import googleLogoImg from "../../assets/images/google-logo.png";
import naverLogoImg from "../../assets/images/naver-logo.png";

interface SocialLoginButtonProps {
  provider: "apple" | "kakao" | "google" | "naver";
  onClick: () => void;
  disabled?: boolean;
}

const Button = styled.button<{ $provider: "apple" | "kakao" | "google" | "naver"; $disabled?: boolean }>`
  width: 100%;
  height: 56px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    padding: 10px 6px;
  }

  ${({ $provider, theme }) => {
    switch ($provider) {
      case "apple":
        return `
          background-color: #000000;
          color: #FFFFFF;
        `;
      case "kakao":
        return `
          background-color: #FEE500;
          color: #000000;
        `;
      case "google":
        return `
          background-color: #FFFFFF;
          color: #000000;
          border: 1px solid ${theme.colors.border};
        `;
      case "naver":
        return `
          background-color: #45b649;
          color: #FFFFFF;
        `;
      default:
        return "";
    }
  }}

  @media (hover: none) and (pointer: coarse) {
    &:hover:not(:active) {
      background-color: inherit !important;
    }
  }
`;

const Icon = styled.img<{ $provider: "apple" | "kakao" | "google" | "naver" }>`
  width: 20px;
  height: 20px;
  object-fit: contain;
  transition: filter 0.2s ease;
  
  ${({ $provider }) => 
    $provider === "apple" 
      ? "filter: invert(1) brightness(100%);" 
      : ""
  }

  @media (max-width: 768px) {
    width: ${({ $provider }) => $provider === "naver" ? "28px" : "20px"};
    height: ${({ $provider }) => $provider === "naver" ? "28px" : "20px"};
  }
`;

const getProviderText = (provider: "apple" | "kakao" | "google" | "naver") => {
  switch (provider) {
    case "apple":
      return "Apple로 계속하기";
    case "kakao":
      return "카카오로 계속하기";
    case "google":
      return "Google로 계속하기";
    case "naver":
      return "네이버로 계속하기";
    default:
      return "";
  }
};

const getProviderIcon = (provider: "apple" | "kakao" | "google" | "naver") => {
  switch (provider) {
    case "apple":
      return appleLogoImg;
    case "kakao":
      return kakaoLogoImg;
    case "google":
      return googleLogoImg;
    case "naver":
      return naverLogoImg;
    default:
      return "";
  }
};

const ButtonText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onClick,
  disabled = false,
}) => {
  return (
    <Button
      $provider={provider}
      $disabled={disabled}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon 
        src={getProviderIcon(provider)} 
        alt={`${provider} logo`} 
        $provider={provider}
      />
      <ButtonText>{getProviderText(provider)}</ButtonText>
    </Button>
  );
};