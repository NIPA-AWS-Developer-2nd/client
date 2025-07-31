import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { BrandingContent } from "./BrandingContent";
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
  background: ${({ theme }) => theme.colors.gray900};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 48px 32px;

  /* 페이드아웃 애니메이션 */
  animation: ${({ $isFadingOut }) =>
    $isFadingOut
      ? css`${fadeOut} ${SPLASH_CONFIG.fadeOutDuration}ms ease-in-out forwards`
      : "none"};
`;

const SplashContent = styled.div`
  /* 페이드인 애니메이션 */
  > * {
    animation: ${css`${fadeIn} 0.8s ease-in-out`};
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
  animation: ${css`${fadeIn} 0.8s ease-in-out 1.2s both`};
`;

const SpinnerRing = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${({ theme }) => theme.colors.gray700};
  border-top: 3px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  animation: ${css`${rotate} 1s linear infinite`};
  margin: 0 auto;
`;

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = SPLASH_CONFIG.duration,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration - SPLASH_CONFIG.fadeOutDuration);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <SplashContainer $isFadingOut={isFadingOut}>
      <SplashContent>
        <BrandingContent variant="splash" />
        <LoadingSpinner>
          <SpinnerRing />
        </LoadingSpinner>
      </SplashContent>
    </SplashContainer>
  );
};
