import React from "react";
import styled from "styled-components";
import { BrandingContent } from "../../../components/common";
import { SocialLoginButton } from "./SocialLoginButton";
import { useAuth } from "../hooks/useAuth";

const LoginContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 48px 32px 32px 32px;
  z-index: 9999;
`;

const LoginContent = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const BrandingWrapper = styled.div`
  margin-bottom: 64px;
`;

const LoginButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }
`;

const TermsText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 1.5;
  max-width: 320px;
  margin: 0;
`;

const TermsLink = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  cursor: pointer;
`;

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login, testLogin, isLoading, isAuthenticated, user } = useAuth();

  const handleSocialLogin = async (provider: "kakao" | "google" | "naver") => {
    try {
      console.log(`Starting ${provider} login...`);
      await login(provider);
      console.log(`${provider} login completed`);
      onLoginSuccess?.();
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      // TODO: 에러 토스트 표시
    }
  };

  const handleTestLogin = async () => {
    try {
      console.log("Starting test login...");
      await testLogin();
      console.log("Test login completed");
      onLoginSuccess?.();
    } catch (error) {
      console.error("Test login failed:", error);
      // TODO: 에러 토스트 표시
    }
  };

  // 이미 로그인된 경우 홈으로 리다이렉트
  if (isAuthenticated && user) {
    window.location.href = "/";
    return null;
  }

  return (
    <LoginContainer>
      <LoginContent>
        <BrandingWrapper>
          <BrandingContent variant="splash" />
        </BrandingWrapper>

        <LoginButtonsContainer>
          <SocialLoginButton
            provider="test"
            onClick={handleTestLogin}
            disabled={isLoading}
          />
          <SocialLoginButton
            provider="kakao"
            onClick={() => handleSocialLogin("kakao")}
            disabled={isLoading}
          />
          <SocialLoginButton
            provider="naver"
            onClick={() => handleSocialLogin("naver")}
            disabled={isLoading}
          />
          <SocialLoginButton
            provider="google"
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
          />
        </LoginButtonsContainer>
      </LoginContent>

      <TermsText>
        로그인 시 <TermsLink>이용약관</TermsLink> 및{" "}
        <TermsLink>개인정보처리방침</TermsLink>에 동의하게 됩니다.
      </TermsText>
    </LoginContainer>
  );
};
