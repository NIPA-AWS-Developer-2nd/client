import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { ChevronDown, AlertCircle } from "lucide-react";
import { GlobalStyle, theme } from "../styles";
import { InstallPrompt } from "../components/common/InstallPrompt";
import { deviceCapabilities } from "../utils/nativeFeatures";

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.light};

  /* PWA safe area support for devices with notches */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
`;

const Header = styled.header<{ $isStandalone: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 12px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  /* Adjust for standalone mode */
  ${({ $isStandalone }) =>
    $isStandalone &&
    `
    padding-top: 16px;
  `}
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageName = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 16px;
  font-weight: 300;
`;

const LocationButton = styled.button<{ $hasError?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ $hasError, theme }) => 
    $hasError ? theme.colors.verificationPendingBg : 'transparent'};
  border: none;
  color: ${({ $hasError, theme }) => 
    $hasError ? theme.colors.verificationPending : theme.colors.locationVerified};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $hasError, theme }) => 
      $hasError ? theme.colors.verificationPendingBg : theme.colors.locationVerifiedBg};
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg:last-child {
    transform: rotate(180deg);
  }
`;

const LocationText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const Main = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

const Footer = styled.footer`
  background-color: ${({ theme }) => theme.colors.dark};
  color: white;
  padding: 16px 20px;
  text-align: center;
  font-size: 14px;
`;

interface PWALayoutProps {
  children: React.ReactNode;
  title?: string;
  showInstallPrompt?: boolean;
  pageName?: string;
  onLocationClick?: () => void;
}

export const PWALayout: React.FC<PWALayoutProps> = ({
  children,
  title = "Halsaram — 번개모임 커뮤니티",
  showInstallPrompt = true,
  pageName,
  onLocationClick,
}) => {
  const [isStandalone] = useState(deviceCapabilities.isStandalone());
  
  // Mock 지역 인증 상태 - 실제로는 auth store나 context에서 가져와야 함
  const [isLocationVerified] = useState(true); // false로 변경하면 인증 안됨 상태
  const [userLocation] = useState('송파구'); // 사용자 지역 정보

  // Update document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LayoutContainer>
        <Header $isStandalone={isStandalone}>
          <HeaderContent>
            <LeftSection>
              <PageName>{pageName || '홈'}</PageName>
              <Separator>—</Separator>
              <LocationButton 
                $hasError={!isLocationVerified}
                onClick={onLocationClick || (() => console.log('Location setting clicked'))}
              >
                {!isLocationVerified && <AlertCircle size={16} />}
                <LocationText>
                  {isLocationVerified ? userLocation : '지역 인증 필요'}
                </LocationText>
                <ChevronDown size={16} />
              </LocationButton>
            </LeftSection>
          </HeaderContent>
        </Header>

        <Main>{children}</Main>

        <Footer>© 2025 Halsaram. All rights reserved.</Footer>

        {showInstallPrompt && <InstallPrompt />}
      </LayoutContainer>
    </ThemeProvider>
  );
};
