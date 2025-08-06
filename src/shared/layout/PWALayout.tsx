import React, { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
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
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 16px 20px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  /* Adjust for standalone mode */
  ${({ $isStandalone }) =>
    $isStandalone &&
    `
    padding-top: 20px;
  `}
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
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
}

export const PWALayout: React.FC<PWALayoutProps> = ({
  children,
  title = "Halsaram — 번개모임 커뮤니티",
  showInstallPrompt = true,
}) => {
  const [isStandalone] = React.useState(deviceCapabilities.isStandalone());

  // Update document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LayoutContainer>
        <Header $isStandalone={isStandalone}>
          <Title>{title}</Title>
        </Header>

        <Main>{children}</Main>

        <Footer>© 2025 Halsaram. All rights reserved.</Footer>

        {showInstallPrompt && <InstallPrompt />}
      </LayoutContainer>
    </ThemeProvider>
  );
};
