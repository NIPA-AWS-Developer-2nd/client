import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { BrandingContent } from "./BrandingContent";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { SPLASH_CONFIG } from "../../constants";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SplashContainer = styled.div<{ $isFadingOut: boolean }>`
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
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 48px 32px;

  /* 페이드아웃 애니메이션 */
  animation: ${({ $isFadingOut }) =>
    $isFadingOut
      ? css`
          ${fadeOut} ${SPLASH_CONFIG.fadeOutDuration}ms ease-in-out forwards
        `
      : "none"};
`;

const SplashContent = styled.div`
  /* 페이드인 애니메이션 */
  > * {
    animation: ${css`
      ${fadeIn} 0.8s ease-in-out
    `};
  }

  > *:nth-child(1) {
    animation-delay: 0.2s;
    animation-fill-mode: both;
  }
  > *:nth-child(2) {
    animation-delay: 0.4s;
    animation-fill-mode: both;
  }
  > *:nth-child(3) {
    animation-delay: 0.6s;
    animation-fill-mode: both;
  }
  > *:nth-child(4) {
    animation-delay: 0.8s;
    animation-fill-mode: both;
  }
  > *:nth-child(5) {
    animation-delay: 1s;
    animation-fill-mode: both;
  }
`;

const LoadingSpinner = styled.div`
  margin-top: 48px;
  animation: ${css`
    ${fadeIn} 0.8s ease-in-out 1.2s both
  `};
`;

const SpinnerRing = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${({ theme }) => theme.colors.gray700};
  border-top: 3px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  animation: ${css`
    ${rotate} 1s linear infinite
  `};
  margin: 0 auto;
`;

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration: _duration = SPLASH_CONFIG.duration,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [forceTimeout, setForceTimeout] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = useMemo(() => location.pathname, [location.pathname]);

  // 5초 후에 강제로 로딩을 끝내는 타이머
  useEffect(() => {
    const forceTimeoutTimer = setTimeout(() => {
      setForceTimeout(true);
    }, 5000);

    return () => clearTimeout(forceTimeoutTimer);
  }, []);

  useEffect(() => {
    if (isLoading && !forceTimeout) return;

    // 로딩이 완료되면 최소 1초 후 페이드아웃 시작
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1000);

    const completeTimer = setTimeout(() => {
      if (isAuthenticated) {
        onComplete();
      } else {
        // 로그인되지 않은 경우 /login으로 리다이렉트
        if (!hasRedirected && pathname !== "/login") {
          setHasRedirected(true);
          navigate("/login", { replace: true });
        }
      }
    }, 1000 + SPLASH_CONFIG.fadeOutDuration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [
    onComplete,
    isAuthenticated,
    isLoading,
    navigate,
    forceTimeout,
    hasRedirected,
    pathname,
  ]);

  return (
    <SplashContainer $isFadingOut={isFadingOut}>
      <SplashContent>
        <BrandingContent variant="splash" logoVariant="black" />
        <LoadingSpinner>
          <SpinnerRing />
        </LoadingSpinner>
      </SplashContent>
    </SplashContainer>
  );
};
