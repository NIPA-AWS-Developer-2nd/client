import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  MoreHorizontal,
  ArrowLeft,
  Home,
  Zap,
  Users,
  ShoppingBag,
  User,
  HelpCircle,
} from "lucide-react";
import { InstallPrompt, BrandingContent } from "../common";
import { HelpModal } from "../common/HelpModal";
import { deviceDetection, viewportManager } from "../../utils";

// 최상위 고정 컨테이너 (iOS Safari 대응)
const AppContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100); /* iOS Safari 대응 */
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray100};
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    background-color: ${({ theme }) => theme.colors.white};
    justify-content: stretch;
    align-items: stretch;
  }
`;

// 메인 컨텐츠 컨테이너 (iOS Safari 대응)
const MainContainer = styled.div<{ $isMobile: boolean }>`
  position: relative;
  display: flex;
  width: ${({ $isMobile }) => ($isMobile ? "100vw" : "1200px")};
  height: ${({ $isMobile }) =>
    $isMobile ? "calc(var(--vh, 1vh) * 100)" : "80vh"};
  max-width: ${({ $isMobile }) => ($isMobile ? "100vw" : "1200px")};
  max-height: ${({ $isMobile }) =>
    $isMobile ? "calc(var(--vh, 1vh) * 100)" : "80vh"};
  border-radius: ${({ $isMobile }) => ($isMobile ? "0" : "12px")};
  overflow: hidden;
  box-shadow: ${({ $isMobile, theme }) =>
    $isMobile ? "none" : theme.shadows.xl};
  background-color: ${({ theme }) => theme.colors.white};
  margin: 0;
  padding: 0;
`;

// 데스크톱 사이드바 (완전 고정)
const DesktopSidebar = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  min-width: 400px;
  height: 100%;
  background: ${({ theme }) => theme.colors.gray900};
  padding: 48px 32px;
  position: relative;

  @media (max-width: 1024px) {
    display: none;
  }
`;

// 앱 영역 (완전 고정) - flexbox로 레이아웃 관리
const AppArea = styled.div<{ $isMobile: boolean }>`
  flex: 1;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  width: ${({ $isMobile }) => ($isMobile ? "100vw" : "800px")};
  max-width: ${({ $isMobile }) => ($isMobile ? "100vw" : "800px")};
`;

// 헤더 개선 - 새로운 레이아웃
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

  /* iOS Safari에서 헤더 상단 여백 */
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

// 메인 컨텐츠 - 오직 여기서만 스크롤 허용
const AppMain = styled.main<{ $isMobile: boolean }>`
  flex: 1;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 20px" : "24px 32px")};
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.colors.white};

  /* 모바일에서 오직 이 영역에서만 스크롤 허용 */
  @media (max-width: 1024px) {
    touch-action: pan-y; /* 세로 스크롤만 허용 */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain; /* 바운스 스크롤 방지 */
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
const TabBar = styled.nav<{ $isMobile: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px 0;
  display: flex;
  justify-content: space-around;
  z-index: 1000;
  height: 72px;
  min-height: 72px;
  flex-shrink: 0; /* 높이 고정 */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);

  /* 모바일에서 탭바 최적화 */
  @media (max-width: 1024px) {
    will-change: auto;
    transform: translateZ(0); /* 하드웨어 가속 */
  }

  /* iOS Safari safe area 완전 대응 */
  padding-bottom: ${({ $isMobile }) =>
    $isMobile ? "max(8px, env(safe-area-inset-bottom))" : "8px"};

  /* iOS Safari에서 탭바 높이 조정 */
  ${({ $isMobile }) =>
    $isMobile &&
    `
    height: calc(72px + env(safe-area-inset-bottom));
    min-height: calc(72px + env(safe-area-inset-bottom));
  `}
`;

// 탭 아이템 - 클릭 완전 허용
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

  /* 모바일에서 탭 아이템 터치 최적화 */
  @media (max-width: 1024px) {
    min-height: 44px; /* iOS 권장 최소 터치 영역 */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
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
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title = "Halsaram",
  showInstallPrompt = true,
  showBanner = true,
}) => {
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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


  // iOS Safari 뷰포트 높이 관리 초기화
  useEffect(() => {
    if (isMobile) {
      viewportManager; // 뷰포트 매니저 초기화
    }
  }, []);

  // 모바일에서 스크롤 제한 (탭바만 제한, 헤더는 허용)
  useEffect(() => {
    if (isMobile) {
      // 탭바에서만 스크롤 방지
      const preventTabBarScroll = (e: TouchEvent) => {
        const target = e.target as Element;
        const isInTabBar = target.closest("nav");
        const isTabItem = target.closest("a"); // 탭 아이템은 클릭 허용

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
    ];

    const currentTab = tabs.find((tab) => tab.path === location.pathname);
    return currentTab || { title: "Halsaram — 번개모임 커뮤니티", label: "" };
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

  const handleMore = () => {
    alert("더보기 메뉴를 준비 중입니다.");
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
    <AppContainer>
          <OfflineIndicator $show={!isOnline}>
            📡 오프라인 모드 - 일부 기능이 제한될 수 있습니다
          </OfflineIndicator>

          <MainContainer $isMobile={isMobile}>
            {/* 데스크톱 사이드바 */}
            <DesktopSidebar $show={showDesktopSidebar}>
              <BrandingContent variant="sidebar" />
            </DesktopSidebar>

            {/* 앱 영역 */}
            <AppArea $isMobile={isMobile}>
              <AppHeader $isMobile={isMobile}>
                <HeaderLeft>
                  <BackButton $show={!isMainTab} onClick={handleBack}>
                    <ArrowLeft size={18} />
                  </BackButton>
                  <PageTitle $isMobile={isMobile}>
                    {currentPage.title}
                  </PageTitle>
                  {isHomePage && (
                    <HelpButton $isMobile={isMobile} onClick={handleHelpClick}>
                      <HelpCircle size={isMobile ? 16 : 18} />
                    </HelpButton>
                  )}
                </HeaderLeft>

                <HeaderRight>
                  <HeaderIconButton $isMobile={isMobile} onClick={handleSearch}>
                    <Search size={isMobile ? 18 : 20} />
                  </HeaderIconButton>
                  <HeaderIconButton
                    $isMobile={isMobile}
                    onClick={handleNotifications}
                  >
                    <Bell size={isMobile ? 18 : 20} />
                  </HeaderIconButton>
                  <HeaderIconButton $isMobile={isMobile} onClick={handleMore}>
                    <MoreHorizontal size={isMobile ? 18 : 20} />
                  </HeaderIconButton>
                </HeaderRight>
              </AppHeader>

              <AppMain $isMobile={isMobile} data-scroll-container>
                {children}
              </AppMain>

              {/* 하단 탭 바 - 클릭 정상 작동 */}
              <TabBar $isMobile={isMobile}>
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
