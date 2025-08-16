import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { AlertTriangle, X } from "lucide-react";
import { BrandingContent } from "../../../shared/components/common";
import { SocialLoginButton } from "./SocialLoginButton";
import { TestLoginButton } from "./TestLoginButton";
import { useAuth } from "../hooks/useAuth";
import { apiUrl } from "../../../shared/utils/api";

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

const ErrorMessage = styled.div`
  position: relative;
  width: 100%;
  padding: 16px 40px 16px 16px;
  margin-bottom: 24px;
  background: ${({ theme }) => theme.colors.danger}15;
  border: 1px solid ${({ theme }) => theme.colors.danger}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
`;

const ErrorContent = styled.div`
  flex: 1;
  text-align: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 12px;
  
  &:hover {
    opacity: 0.7;
  }
`;

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");

  // URL 파라미터에서 OAuth 에러 확인
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const errorMessages: Record<string, string> = {
        'google_auth_failed': '구글 로그인 인증에 실패했습니다.',
        'google_login_failed': '서버 측에서 예상치 못한 문제가 발생하여 구글 로그인을 완료할 수 없습니다.',
        'kakao_auth_failed': '카카오 로그인 인증에 실패했습니다.',
        'kakao_login_failed': '서버 측에서 예상치 못한 문제가 발생하여 카카오 로그인을 완료할 수 없습니다.',
        'naver_auth_failed': '네이버 로그인 인증에 실패했습니다.',
        'naver_login_failed': '서버 측에서 예상치 못한 문제가 발생하여 네이버 로그인을 완료할 수 없습니다.',
      };
      
      setErrorMessage(errorMessages[error] || '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      
      // URL에서 error 파라미터 제거
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
      // 백엔드에서 쿠키를 설정하고 리다이렉트를 처리하므로 일반적인 POST 요청 사용
      const response = await fetch(apiUrl('/auth/dev-token'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: '테스트계정' }),
        credentials: 'include', // 쿠키 포함
      });

      // JSON 응답 처리
      if (response.ok) {
        const result = await response.json();
        console.log('✅ 테스트 로그인 성공:', result);
        
        // 서버에서 받은 redirectUrl로 이동
        window.location.href = result.redirectUrl || '/auth/success';
      } else {
        throw new Error('테스트 로그인 실패');
      }
    } catch (error) {
      console.error('Test login failed:', error);
      setErrorMessage('서버 측에서 예상치 못한 문제가 발생하여 테스트 로그인을 완료할 수 없습니다.');
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
          <BrandingContent variant="splash" logoVariant="black" />
        </BrandingWrapper>

        {/* 에러 메시지 표시 */}
        {errorMessage && (
          <ErrorMessage>
            <AlertTriangle size={16} />
            <ErrorContent>{errorMessage}</ErrorContent>
            <CloseButton onClick={() => setErrorMessage("")}>
              <X size={16} />
            </CloseButton>
          </ErrorMessage>
        )}

        <LoginButtonsContainer>
          <TestLoginButton
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
