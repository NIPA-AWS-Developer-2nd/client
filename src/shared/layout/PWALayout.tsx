import React, { useEffect, useState, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import { ChevronDown, AlertCircle, MoreVertical, Share } from "lucide-react";
import { GlobalStyle, theme } from "../styles";
import { InstallPrompt } from "../components/common/InstallPrompt";
import { deviceCapabilities } from "../utils/nativeFeatures";
import { useAlert } from "../components/common";

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
    $hasError ? theme.colors.verificationPendingBg : "transparent"};
  border: none;
  color: ${({ $hasError, theme }) =>
    $hasError
      ? theme.colors.verificationPending
      : theme.colors.locationVerified};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $hasError, theme }) =>
      $hasError
        ? theme.colors.verificationPendingBg
        : theme.colors.locationVerifiedBg};
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
`;

const DropdownItem = styled.button<{ $variant?: "default" | "danger" }>`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${({ $variant, theme }) =>
    $variant === "danger" ? theme.colors.error : theme.colors.text.primary};

  &:hover {
    background: ${({ $variant, theme }) =>
      $variant === "danger" ? theme.colors.errorBg : theme.colors.gray50};
  }

  svg {
    flex-shrink: 0;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 4px 0;
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

export interface HeaderAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  divider?: boolean;
}

interface PWALayoutProps {
  children: React.ReactNode;
  title?: string;
  showInstallPrompt?: boolean;
  pageName?: string;
  onLocationClick?: () => void;
  headerActions?: HeaderAction[];
  showShare?: boolean;
  onShare?: () => void;
}

export const PWALayout: React.FC<PWALayoutProps> = ({
  children,
  title = "할사람? — 번개모임 커뮤니티",
  showInstallPrompt = true,
  pageName,
  onLocationClick,
  headerActions = [],
  showShare = false,
  onShare,
}) => {
  const { success } = useAlert();
  const [isStandalone] = useState(deviceCapabilities.isStandalone());
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock 지역 인증 상태 - 실제로는 auth store나 context에서 가져와야 함
  const [isLocationVerified] = useState(true); // false로 변경하면 인증 안됨 상태
  const [userLocation] = useState("송파구"); // 사용자 지역 정보

  // Update document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // 기본 공유 기능
      if (navigator.share) {
        navigator.share({
          title: title,
          url: window.location.href,
        });
      } else {
        // Fallback: 클립보드에 URL 복사
        navigator.clipboard.writeText(window.location.href);
        success("링크가 클립보드에 복사되었습니다.");
      }
    }
  };

  const hasActions = headerActions.length > 0 || showShare;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LayoutContainer>
        <Header $isStandalone={isStandalone}>
          <HeaderContent>
            <LeftSection>
              <PageName>{pageName || "홈"}</PageName>
              <Separator>—</Separator>
              <LocationButton
                $hasError={!isLocationVerified}
                onClick={
                  onLocationClick ||
                  (() => console.log("Location setting clicked"))
                }
              >
                {!isLocationVerified && <AlertCircle size={16} />}
                <LocationText>
                  {isLocationVerified ? userLocation : "지역 인증 필요"}
                </LocationText>
                <ChevronDown size={16} />
              </LocationButton>
            </LeftSection>

            {hasActions && (
              <RightSection>
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <MoreButton onClick={() => setShowDropdown(!showDropdown)}>
                    <MoreVertical size={20} />
                  </MoreButton>

                  {showDropdown && (
                    <DropdownMenu>
                      {showShare && (
                        <>
                          <DropdownItem
                            onClick={() => {
                              handleShare();
                              setShowDropdown(false);
                            }}
                          >
                            <Share size={16} />
                            공유하기
                          </DropdownItem>
                          {headerActions.length > 0 && <DropdownDivider />}
                        </>
                      )}

                      {headerActions.map((action, index) => (
                        <React.Fragment key={index}>
                          {action.divider && <DropdownDivider />}
                          <DropdownItem
                            $variant={action.variant}
                            onClick={() => {
                              action.onClick();
                              setShowDropdown(false);
                            }}
                          >
                            {action.icon}
                            {action.label}
                          </DropdownItem>
                        </React.Fragment>
                      ))}
                    </DropdownMenu>
                  )}
                </div>
              </RightSection>
            )}
          </HeaderContent>
        </Header>

        <Main>{children}</Main>

        <Footer>© 2025 Halsaram. All rights reserved.</Footer>

        {showInstallPrompt && <InstallPrompt />}
      </LayoutContainer>
    </ThemeProvider>
  );
};
