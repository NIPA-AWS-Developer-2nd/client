import React from "react";
import styled from "styled-components";
import appleLogoImg from "../../assets/images/apple-logo.png";
import kakaoLogoImg from "../../assets/images/kakao-logo.svg";
import googleLogoImg from "../../assets/images/google-logo.png";

interface SocialLoginButtonProps {
  provider: "apple" | "kakao" | "google";
  onClick: () => void;
  disabled?: boolean;
}

const Button = styled.button<{ $provider: "apple" | "kakao" | "google"; $disabled?: boolean }>`
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

  ${({ $provider, theme }) => {
    switch ($provider) {
      case "apple":
        return `
          background-color: #000000;
          color: #FFFFFF;
          &:hover:not(:disabled) {
            background-color: #1a1a1a;
          }
          &:active {
            background-color: #333333;
          }
        `;
      case "kakao":
        return `
          background-color: #FEE500;
          color: #000000;
          &:hover:not(:disabled) {
            background-color: #FDD700;
          }
          &:active {
            background-color: #F9C800;
          }
        `;
      case "google":
        return `
          background-color: #FFFFFF;
          color: #000000;
          border: 1px solid ${theme.colors.border};
          &:hover:not(:disabled) {
            background-color: #F8F9FA;
          }
          &:active {
            background-color: #F1F3F4;
          }
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

const Icon = styled.img<{ $provider: "apple" | "kakao" | "google" }>`
  width: 20px;
  height: 20px;
  object-fit: contain;
  
  ${({ $provider }) => 
    $provider === "apple" 
      ? "filter: invert(1) brightness(100%);" 
      : ""
  }
`;

const getProviderText = (provider: "apple" | "kakao" | "google") => {
  switch (provider) {
    case "apple":
      return "Apple로 계속하기";
    case "kakao":
      return "카카오로 계속하기";
    case "google":
      return "Google로 계속하기";
    default:
      return "";
  }
};

const getProviderIcon = (provider: "apple" | "kakao" | "google") => {
  switch (provider) {
    case "apple":
      return appleLogoImg;
    case "kakao":
      return kakaoLogoImg;
    case "google":
      return googleLogoImg;
    default:
      return "";
  }
};

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
      {getProviderText(provider)}
    </Button>
  );
};