import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ArrowLeft,
  Home,
  Zap,
  Users,
  ShoppingBag,
  User,
  HelpCircle,
  Settings,
  Share2,
} from "lucide-react";
import { InstallPrompt, BrandingContent } from "../components/common";
import { HelpModal } from "../components/common/HelpModal";
import { deviceDetection, viewportManager } from "../utils";

// 최상위 고정 컨테이너
const AppContainer = styled.div<{ $keyboardVisible?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  margin: 0;
  padding: 0;
  overflow: hidden; /* 확실한 스크롤 차단 */
  background-color: ${({ theme }) => theme.colors.gray100};
  display: flex;
  justify-content: center;
  align-items: center;

  /* 터치 스크롤 차단 */
  overscroll-behavior: none;
  touch-action: none;

  @media (max-width: 1024px) {
    background-color: ${({ theme }) => theme.colors.white};
    justify-content: stretch;
    align-items: stretch;

    /* 키보드가 열렸을 때 뷰포트 높이 동적 조정 */
    ${({ $keyboardVisible }) =>
      $keyboardVisible &&
      `
      bottom: 0;
      height: auto;
      min-height: 100vh;
      `}
  }
`;

// 메인 컨텐츠 컨테이너
const MainContainer = styled.div<{
  $isMobile: boolean;
  $keyboardVisible?: boolean;
}>`
  position: relative;
  display: flex;
  width: ${({ $isMobile }) => ($isMobile ? "100vw" : "1200px")};
  height: ${({ $isMobile }) =>
    $isMobile ? "calc(var(--vh, 1vh) * 100)" : "80vh"};
  max-width: ${({ $isMobile }) => ($isMobile ? "100vw" : "1200px")};
  max-height: ${({ $isMobile }) =>
    $isMobile ? "calc(var(--vh, 1vh) * 100)" : "80vh"};
  border-radius: ${({ $isMobile }) => ($isMobile ? "0" : "12px")};
  overflow: hidden; /* 확실한 스크롤 차단 */
  box-shadow: ${({ $isMobile, theme }) =>
    $isMobile ? "none" : theme.shadows.xl};
  background-color: ${({ theme }) => theme.colors.white};
  margin: 0;
  padding: 0;

  /* 터치 스크롤 차단 */
  overscroll-behavior: none;

  /* 키보드가 열렸을 때 높이 조정 */
  ${({ $keyboardVisible, $isMobile }) =>
    $keyboardVisible &&
    $isMobile &&
    `
    height: 100vh;
    max-height: 100vh;
    `}
`;

// 데스크톱 사이드바
const DesktopSidebar = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  min-width: 400px;
  height: 100%;
  background: #111827;
  padding: 48px 32px;
  position: relative;

  @media (max-width: 1024px) {
    display: none;
  }
`;

// 앱 영역
const AppArea = styled.div<{ $isMobile: boolean; $keyboardVisible?: boolean }>`
  flex: 1;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  width: ${({ $isMobile }) => ($isMobile ? "100vw" : "800px")};
  max-width: ${({ $isMobile }) => ($isMobile ? "100vw" : "800px")};

  /* 키보드가 열렸을 때 전체 높이 확장 */
  ${({ $keyboardVisible, $isMobile }) =>
    $keyboardVisible &&
    $isMobile &&
    `
    height: 100vh;
    max-height: 100vh;
    `}
`;

// 헤더
const AppHeader = styled.header<{ $isMobile: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ $isMobile }) => ($isMobile ? "12px 16px" : "16px 24px")};
  position: relative;
  z-index: 100;
  height: ${({ $isMobile }) => ($isMobile ? "56px" : "64px")};
  min-height: ${({ $isMobile }) => ($isMobile ? "56px" : "64px")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  padding-top: ${({ $isMobile }) =>
    $isMobile ? "max(12px, env(safe-area-inset-top))" : "16px"};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const BackButton = styled.button<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PageTitle = styled.h1<{ $isMobile: boolean }>`
  margin: 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.2;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderIconButton = styled.button<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  height: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

// 메인 컨텐츠
const AppMain = styled.main<{
  $isMobile: boolean;
  $keyboardVisible?: boolean;
  $noPadding?: boolean;
  $noScroll?: boolean;
}>`
  flex: 1;
  padding: ${({ $isMobile, $noPadding }) =>
    $noPadding ? "0" : $isMobile ? "0" : "24px 32px"};
  overflow-y: ${({ $noScroll }) => ($noScroll ? "hidden" : "auto")};
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.colors.white};

  /* 키보드가 열렸을 때 하단 여백 제거하여 공간 활용 */
  ${({ $keyboardVisible, $isMobile }) =>
    $keyboardVisible &&
    $isMobile &&
    `
    padding-bottom: 20px;
    margin-bottom: 0;
    `}

  /* 모바일에서 오직 이 영역에서만 스크롤 허용 */
  @media (max-width: 1024px) {
    touch-action: ${({ $noScroll }) =>
      $noScroll ? "none" : "pan-y"}; /* 세로 스크롤만 허용 */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain; /* 바운스 스크롤 방지 */
    scroll-behavior: auto; /* 부드러운 스크롤 비활성화로 성능 향상 */
  }

  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray400};
  }
`;

// 하단 탭 바 - 클릭 가능, 스크롤은 차단
const TabBar = styled.nav<{ $isMobile: boolean; $keyboardVisible?: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px 0;
  display: flex;
  justify-content: space-around;
  z-index: 1000;
  height: 72px;
  min-height: 72px;
  flex-shrink: 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;

  /* 키보드가 열렸을 때 탭바 숨기기 */
  ${({ $keyboardVisible, $isMobile }) =>
    $keyboardVisible &&
    $isMobile &&
    `
    display: none !important;
    height: 0 !important;
    min-height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    visibility: hidden !important;
    `}

  /* 모바일에서 탭바 최적화 */
  @media (max-width: 1024px) {
    will-change: transform, opacity;

    /* iOS에서 키보드와 탭바 겹침 방지 */
    @supports (-webkit-touch-callout: none) {
      /* iOS Safari에서 키보드가 올라올 때 탭바를 아예 화면 밖으로 */
      ${({ $keyboardVisible }) =>
        $keyboardVisible &&
        `
        position: fixed;
        bottom: -200px;
        transform: none;
        transition: bottom 0.3s ease, opacity 0.3s ease;
        opacity: 0;
        visibility: hidden;
        `}
    }
  }

  /* iOS Safari safe area */
  padding-bottom: ${({ $isMobile }) =>
    $isMobile ? "max(16px, calc(env(safe-area-inset-bottom) + 8px))" : "8px"};

  /* iOS Safari에서 탭바 높이 조정 */
  ${({ $isMobile }) =>
    $isMobile &&
    `
    height: calc(72px + env(safe-area-inset-bottom) + 8px);
    min-height: calc(72px + env(safe-area-inset-bottom) + 8px);
  `}
`;

// 탭 아이템
const TabItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.gray500};
  font-size: 11px;
  transition: ${({ theme }) => theme.transitions.fast};
  flex: 1;
  max-width: 80px;
  text-decoration: none;
  font-weight: ${({ $isActive }) => ($isActive ? "600" : "400")};

  @media (max-width: 1024px) {
    min-height: 44px;
    -webkit-tap-highlight-color: transparent;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
`;

const TabIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
  line-height: 1;
`;

const TabLabel = styled.span`
  font-size: 11px;
  line-height: 1;
`;

// 오프라인 상태 표시
const OfflineIndicator = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.gray900};
  padding: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  z-index: 2000;
  transform: translateY(${({ $show }) => ($show ? "0" : "-100%")});
  transition: ${({ theme }) => theme.transitions.normal};
`;

const HelpButton = styled.button<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  showInstallPrompt?: boolean;
  showBanner?: boolean;
  customHeaderTitle?: string;
  customHeaderActions?: React.ReactNode;
  hideBottomNav?: boolean;
  fullWidth?: boolean;
  noPadding?: boolean;
  noScroll?: boolean;
  hideHeaderActions?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title = "Halsaram",
  showInstallPrompt = true,
  showBanner = true,
  customHeaderTitle,
  customHeaderActions,
  hideBottomNav = false,
  fullWidth: _fullWidth = false,
  noPadding: _noPadding = false,
  noScroll: _noScroll = false,
  hideHeaderActions = false,
}) => {
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const scrollContainer = document.querySelector("[data-scroll-container]");
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("resize", handleResize);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 키보드 감지 로직
  useEffect(() => {
    if (!isMobile) return;

    const initialWindowHeight = window.innerHeight;
    let isInputFocused = false;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        isInputFocused = true;
        setKeyboardVisible(true);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        isInputFocused = false;
        // 키보드가 내려가는데 시간이 걸림
        setTimeout(() => {
          if (!isInputFocused) {
            setKeyboardVisible(false);
          }
        }, 300);
      }
    };

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialWindowHeight - currentHeight;

      // 키보드가 200px 이상 화면을 차지하고 input이 포커스된 상태일 때
      if (heightDifference > 200 && isInputFocused) {
        setKeyboardVisible(true);
      } else if (heightDifference < 100) {
        setKeyboardVisible(false);
      }
    };

    // iOS의 visualViewport API 사용
    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const heightDifference =
          initialWindowHeight - window.visualViewport.height;
        if (heightDifference > 200 && isInputFocused) {
          setKeyboardVisible(true);
        } else if (heightDifference < 100) {
          setKeyboardVisible(false);
        }
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    window.addEventListener("resize", handleResize);

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        handleVisualViewportChange
      );
    }

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      window.removeEventListener("resize", handleResize);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleVisualViewportChange
        );
      }
    };
  }, [isMobile]);

  // iOS Safari 뷰포트 높이 관리 초기화
  useEffect(() => {
    if (isMobile) {
      // 뷰포트 매니저 초기화
      viewportManager.getCurrentHeight();
    }
  }, [isMobile]);

  // 모바일에서 스크롤 제한 (탭바만 제한, 헤더는 허용)
  useEffect(() => {
    if (isMobile) {
      // 탭바에서만 스크롤 방지
      const preventTabBarScroll = (e: TouchEvent) => {
        const target = e.target as Element;
        const isInTabBar = target.closest("nav");
        const isTabItem = target.closest("a");

        // 탭바 영역이지만 탭 아이템이 아닌 경우에만 스크롤 방지
        if (isInTabBar && !isTabItem) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      document.addEventListener("touchmove", preventTabBarScroll, {
        passive: false,
      });

      return () => {
        document.removeEventListener("touchmove", preventTabBarScroll);
      };
    }
  }, [isMobile]);

  // Update document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  // 현재 페이지 정보 가져오기
  const getCurrentPageInfo = () => {
    const tabs = [
      { path: "/", icon: Home, label: "홈", title: "홈" },
      { path: "/missions", icon: Zap, label: "미션", title: "미션" },
      { path: "/meetings", icon: Users, label: "모임", title: "모임" },
      { path: "/market", icon: ShoppingBag, label: "마켓", title: "마켓" },
      { path: "/my", icon: User, label: "마이", title: "마이페이지" },
      {
        path: "/my/settings",
        icon: Settings,
        label: "앱 설정",
        title: "앱 설정",
      },
    ];

    // 미션 상세페이지
    if (location.pathname.startsWith("/missions/")) {
      return { title: "미션 상세", label: "" };
    }

    // 모임 상세페이지
    if (location.pathname.startsWith("/meetings/")) {
      return { title: "모임 정보", label: "" };
    }

    const currentTab = tabs.find((tab) => tab.path === location.pathname);
    return currentTab || { title: customHeaderTitle || "Not Found", label: "" };
  };

  const currentPage = getCurrentPageInfo();
  const showDesktopSidebar = showBanner && !isMobile;

  // 메인 탭들 (뒤로가기 버튼이 필요 없는 페이지들)
  const mainTabs = ["/", "/missions", "/meetings", "/market", "/my"];
  const isMainTab = mainTabs.includes(location.pathname);
  const isHomePage = location.pathname === "/";

  // 헤더 액션 핸들러들
  const handleBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    alert("검색 기능을 준비 중입니다.");
  };

  const handleNotifications = () => {
    alert("알림 기능을 준비 중입니다.");
  };

  const handleShare = () => {
    // ShareModal을 열기 위한 이벤트 디스패치
    const shareEvent = new CustomEvent("openShareModal");
    window.dispatchEvent(shareEvent);
  };

  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  const handleHelpClose = () => {
    setShowHelpModal(false);
  };

  const tabs = [
    { path: "/", icon: Home, label: "홈" },
    { path: "/missions", icon: Zap, label: "미션" },
    { path: "/meetings", icon: Users, label: "모임" },
    { path: "/market", icon: ShoppingBag, label: "마켓" },
    { path: "/my", icon: User, label: "마이" },
  ];

  return (
    <AppContainer $keyboardVisible={keyboardVisible}>
      <OfflineIndicator $show={!isOnline}>
        오프라인 모드는 일부 기능이 제한될 수 있습니다.
      </OfflineIndicator>

      <MainContainer $isMobile={isMobile} $keyboardVisible={keyboardVisible}>
        {/* 데스크톱 사이드바 */}
        <DesktopSidebar $show={showDesktopSidebar}>
          <BrandingContent variant="sidebar" />
        </DesktopSidebar>

        {/* 앱 영역 */}
        <AppArea $isMobile={isMobile} $keyboardVisible={keyboardVisible}>
          <AppHeader $isMobile={isMobile}>
            <HeaderLeft>
              <BackButton $show={!isMainTab} onClick={handleBack}>
                <ArrowLeft size={18} />
              </BackButton>
              <PageTitle $isMobile={isMobile}>{currentPage.title}</PageTitle>
              {isHomePage && (
                <HelpButton $isMobile={isMobile} onClick={handleHelpClick}>
                  <HelpCircle size={isMobile ? 16 : 18} />
                </HelpButton>
              )}
            </HeaderLeft>

            <HeaderRight>
              {customHeaderActions || (
                <>
                  {!hideHeaderActions && (
                    <>
                      {location.pathname !== "/my" &&
                        location.pathname !== "/my/settings" &&
                        !location.pathname.startsWith("/missions/") && (
                          <HeaderIconButton
                            $isMobile={isMobile}
                            onClick={handleSearch}
                          >
                            <Search size={isMobile ? 18 : 20} />
                          </HeaderIconButton>
                        )}
                      {location.pathname !== "/my" &&
                        location.pathname !== "/my/settings" && (
                          <HeaderIconButton
                            $isMobile={isMobile}
                            onClick={handleNotifications}
                          >
                            <Bell size={isMobile ? 18 : 20} />
                          </HeaderIconButton>
                        )}
                      {location.pathname.startsWith("/missions/") && (
                        <HeaderIconButton
                          $isMobile={isMobile}
                          onClick={handleShare}
                        >
                          <Share2 size={isMobile ? 18 : 20} />
                        </HeaderIconButton>
                      )}
                    </>
                  )}
                  {location.pathname === "/my" && !hideHeaderActions && (
                    <HeaderIconButton
                      $isMobile={isMobile}
                      onClick={() => navigate("/my/settings")}
                    >
                      <Settings size={isMobile ? 18 : 20} />
                    </HeaderIconButton>
                  )}
                </>
              )}
            </HeaderRight>
          </AppHeader>

          <AppMain
            $isMobile={isMobile}
            $keyboardVisible={keyboardVisible}
            $noPadding={_noPadding}
            $noScroll={_noScroll}
            data-scroll-container
          >
            {children}
          </AppMain>

          {/* 하단 탭 바 */}
          {!hideBottomNav && (
            <TabBar $isMobile={isMobile} $keyboardVisible={keyboardVisible}>
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabItem
                    key={tab.path}
                    to={tab.path}
                    $isActive={location.pathname === tab.path}
                  >
                    <TabIcon>
                      <IconComponent size={20} />
                    </TabIcon>
                    <TabLabel>{tab.label}</TabLabel>
                  </TabItem>
                );
              })}
            </TabBar>
          )}
        </AppArea>
      </MainContainer>

      {showInstallPrompt && <InstallPrompt />}

      {/* 도움말 모달 */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={handleHelpClose}
        isMobile={isMobile}
      />
    </AppContainer>
  );
};
