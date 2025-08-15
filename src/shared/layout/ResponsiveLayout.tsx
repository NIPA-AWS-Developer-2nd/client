import React, { useState, useEffect, useRef, useMemo } from "react";
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
  ChevronDown,
  Target,
  // Heart,
  HandHeart,
} from "lucide-react";
import { InstallPrompt, BrandingContent } from "../components/common";
import { useAlert } from "../hooks/useAlert";
import { HelpModal } from "../components/common/HelpModal";
import { LocationVerificationModal } from "../../features/mission/components/LocationVerificationModal";
import { ActivityLogModal } from "../../features/home/components";
import { deviceDetection, viewportManager } from "../utils";
import { useLocationVerification } from "../hooks";
import { useHomeData } from "../../features/home/hooks";
import { useHomeStore } from "../../shared/store/homeStore";
import { ROUTES } from "../constants/routes";
import { PointBalance } from "../../features/point/components/PointBalance";

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

  /* 포커스 아웃라인 제거 */
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageName = styled.span<{ $isMobile: boolean }>`
  margin: 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.2;
`;

const LocationButton = styled.button<{
  $hasError?: boolean;
  $isMobile: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 500;
  cursor: pointer;
  padding: ${({ $isMobile }) => ($isMobile ? "2px 6px" : "4px 8px")};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const LocationText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
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

  /* 포커스 아웃라인 제거 */
  &:focus {
    outline: none;
    box-shadow: none;
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
    color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.gray500};
  }

  &:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  /* 비활성화 상태 스타일 */
  &[href="#"] {
    opacity: 0.6;
    pointer-events: auto; /* 클릭 이벤트는 허용 */
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

  /* 포커스 아웃라인 제거 */
  &:focus {
    outline: none;
    box-shadow: none;
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
  const { info } = useAlert();
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showActivityLogModal, setShowActivityLogModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // 위치 인증 상태 관리
  const {
    isVerified: isLocationVerified,
    currentDistrict,
    refreshStatus: refreshLocationStatus,
    isLoading: isLocationLoading,
  } = useLocationVerification();

  // 사용자 위치 정보 - currentDistrict에서 가져오거나 기본값 사용
  const userLocation = currentDistrict?.districtName || "지역 선택";

  const location = useLocation();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<Element | null>(null);

  // 경로별 상태를 메모이제이션
  const routeInfo = useMemo(() => {
    const pathname = location.pathname;
    return {
      isHomePage: pathname === ROUTES.HOME,
      isMyPage: pathname === ROUTES.MY_PAGE,
      isMySettingsPage: pathname === "/my/settings",
      isMissionDetail: pathname.startsWith("/missions/"),
      isMeetingDetail: pathname.startsWith("/meetings/") && !pathname.includes("/channel") && pathname !== "/meetings/new",
      isMeetingChannel: pathname.includes("/meetings/") && pathname.includes("/channel"),
      isMeetingCreate: pathname === "/meetings/new",
      isMainTab: (
        [
          ROUTES.HOME,
          ROUTES.MISSIONS,
          ROUTES.MEETINGS,
          ROUTES.MARKET,
          "/donation",
          ROUTES.MY_PAGE,
        ] as string[]
      ).includes(pathname),
    };
  }, [location.pathname]);

  // 홈 데이터 가져오기 (활동 로그용)
  const { data: homeData } = useHomeData({ limit: 20 });

  // 모임 채널 페이지에서 호스트 여부 확인
  const { getMeetingDetail } = useHomeStore();
  const meetingId = routeInfo.isMeetingChannel 
    ? location.pathname.split('/')[2] 
    : null;
  const meetingDetail = meetingId ? getMeetingDetail(meetingId) : null;
  const isHostInChannel = meetingDetail?.host?.id === 'current-user-id'; // TODO: 실제 사용자 ID와 비교


  // DOM 쿼리를 초기화 시에만 실행하고 ref로 캐싱
  useEffect(() => {
    if (!scrollContainerRef.current) {
      scrollContainerRef.current = document.querySelector(
        "[data-scroll-container]"
      );
    }
  }, []);

  // 경로 변경 시 스크롤 초기화 (캐시된 ref 사용)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
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
      { path: "/", icon: Home, label: "홈", title: "홈", showLocation: true },
      {
        path: "/missions",
        icon: Zap,
        label: "지역 미션",
        title: "지역 미션",
        showLocation: true,
      },
      {
        path: "/meetings",
        icon: Users,
        label: "번개모임",
        title: "번개모임",
        showLocation: true,
      },
      {
        path: "/market",
        icon: ShoppingBag,
        label: "포인트 마켓",
        title: "포인트 마켓",
        showLocation: false,
      },
      {
        path: "/donation",
        icon: HandHeart,
        label: "기부하기",
        title: "기부하기",
        showLocation: false,
      },
      {
        path: "/my",
        icon: User,
        label: "마이페이지",
        title: "마이페이지",
        showLocation: false,
      },
      {
        path: "/my/settings",
        icon: Settings,
        label: "앱 설정",
        title: "앱 설정",
        showLocation: false,
      },
    ];

    // 포인트 내역 페이지
    if (location.pathname === "/points/history") {
      return { title: "포인트 내역", label: "", showLocation: false };
    }

    // 미션 상세페이지
    if (location.pathname.startsWith("/missions/")) {
      return { title: "미션 상세", label: "", showLocation: false };
    }

    // 모임 채널 페이지
    if (location.pathname.includes("/meetings/") && location.pathname.includes("/channel")) {
      return { title: "모임 채널", label: "", showLocation: false };
    }

    // 모임 생성 페이지
    if (location.pathname === "/meetings/new") {
      return { title: "번개모임 생성", label: "", showLocation: false };
    }

    // 모임 상세페이지
    if (location.pathname.startsWith("/meetings/")) {
      return { title: "번개모임 정보", label: "", showLocation: false };
    }

    // 사용자 프로필 페이지
    if (location.pathname.startsWith("/user/")) {
      return { title: customHeaderTitle || "사용자 프로필", label: "", showLocation: false };
    }

    const currentTab = tabs.find((tab) => tab.path === location.pathname);
    return (
      currentTab || {
        title: customHeaderTitle || "Not Found",
        label: "",
        showLocation: false,
      }
    );
  };

  const currentPage = getCurrentPageInfo();
  const showDesktopSidebar = showBanner && !isMobile;

  // 기존의 중복 로직을 routeInfo로 대체

  // 헤더 액션 핸들러들
  const handleBack = () => {
    // 모임 채널 페이지에서는 홈으로 이동
    if (routeInfo.isMeetingChannel) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  const handleSearch = () => {
    info("검색 기능을 준비 중입니다.");
  };

  const handleNotifications = () => {
    setShowActivityLogModal(true);
  };

  const handleShare = async () => {
    if (routeInfo.isMissionDetail) {
      // ShareModal을 열기 위한 이벤트 디스패치 (미션 상세)
      const shareEvent = new CustomEvent("openShareModal");
      window.dispatchEvent(shareEvent);
    } else if (routeInfo.isMeetingDetail) {
      // 모임 상세 공유
      if (navigator.share) {
        try {
          await navigator.share({
            title: "번개모임",
            text: "함께 참여해요!",
            url: window.location.href,
          });
        } catch (_error) {
          // User cancelled
        }
      } else {
        await navigator.clipboard.writeText(window.location.href);
        info("링크가 복사되었습니다!");
      }
    }
  };


  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  const handleHelpClose = () => {
    setShowHelpModal(false);
  };

  // 위치 인증이 필요한 경우 자동으로 모달 띄우기 (한 번만)
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    if (
      !isLocationLoading &&
      !isLocationVerified &&
      !isLocationModalOpen &&
      !hasShownModal
    ) {
      setIsLocationModalOpen(true);
      setHasShownModal(true);
    }
  }, [
    isLocationLoading,
    isLocationVerified,
    isLocationModalOpen,
    hasShownModal,
  ]);

  const handleLocationClick = () => {
    setIsLocationModalOpen(true);
  };

  const handleLocationModalClose = () => {
    setIsLocationModalOpen(false);
    navigate("/"); // 홈으로 이동
  };

  const handleVerificationComplete = async (isVerified: boolean) => {
    if (isVerified) {
      // console.log("위치 인증 성공");

      // console.log("위치 인증 상태 새로고침 중");
      // 위치 인증 상태 새로고침
      await refreshLocationStatus();
      // console.log("위치 인증 상태 새로고침 완료");

      setHasShownModal(false); // 인증 성공 시 자동 모달 상태 리셋
      // 인증 완료 후 모달 자동으로 닫기
      setIsLocationModalOpen(false);
    } else {
      console.log("❌ 위치 인증 실패");
    }
  };

  const tabs = [
    { path: "/", icon: Home, label: "홈" },
    {
      path: "/missions",
      icon: Target,
      label: "미션",
      requiresLocationVerification: true,
    },
    {
      path: "/meetings",
      icon: Zap,
      label: "번개",
      requiresLocationVerification: true,
    },
    { path: "/donation", icon: HandHeart, label: "기부" },
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
              <BackButton $show={!routeInfo.isMainTab} onClick={handleBack}>
                {routeInfo.isMeetingChannel ? (
                  <Home size={18} />
                ) : (
                  <ArrowLeft size={18} />
                )}
              </BackButton>
              <TitleContainer>
                <PageName $isMobile={isMobile} data-header-title>
                  {currentPage.title}
                </PageName>
                {currentPage.showLocation && (
                  <LocationButton
                    $hasError={!isLocationVerified}
                    $isMobile={isMobile}
                    onClick={handleLocationClick}
                  >
                    <LocationText>
                      {isLocationVerified ? userLocation : "지역 인증 필요"}
                    </LocationText>
                    <ChevronDown size={14} />
                  </LocationButton>
                )}
              </TitleContainer>
              {routeInfo.isHomePage && (
                <HelpButton $isMobile={isMobile} onClick={handleHelpClick}>
                  <HelpCircle size={isMobile ? 16 : 18} />
                </HelpButton>
              )}
            </HeaderLeft>

            <HeaderRight>
              {customHeaderActions || (
                <>
                  {/* 포인트 표시 - 모든 페이지에서 표시 */}
                  {!hideHeaderActions && (
                    <PointBalance size="sm" showLabel={false} onClick={() => navigate('/points/history')} />
                  )}

                  {!hideHeaderActions && (
                    <>
                      {/* 검색 버튼 - 미션/모임 상세 페이지와 마이페이지, 모임 생성 페이지 제외 */}
                      {!routeInfo.isMyPage &&
                        !routeInfo.isMySettingsPage &&
                        !routeInfo.isMissionDetail &&
                        !routeInfo.isMeetingDetail &&
                        !routeInfo.isMeetingCreate && (
                          <HeaderIconButton
                            $isMobile={isMobile}
                            onClick={handleSearch}
                          >
                            <Search size={isMobile ? 18 : 20} />
                          </HeaderIconButton>
                        )}

                      {/* 알림 버튼 - 마이페이지/설정/모임생성 제외 모든 페이지 */}
                      {!routeInfo.isMyPage && !routeInfo.isMySettingsPage && !routeInfo.isMeetingCreate && (
                        <HeaderIconButton
                          $isMobile={isMobile}
                          onClick={handleNotifications}
                        >
                          <Bell size={isMobile ? 18 : 20} />
                        </HeaderIconButton>
                      )}

                      {/* 미션 상세 페이지 - 공유 버튼 */}
                      {routeInfo.isMissionDetail && (
                        <HeaderIconButton
                          $isMobile={isMobile}
                          onClick={handleShare}
                        >
                          <Share2 size={isMobile ? 18 : 20} />
                        </HeaderIconButton>
                      )}

                      {/* 모임 상세 페이지 - 공유 버튼 */}
                      {routeInfo.isMeetingDetail && (
                        <HeaderIconButton
                          $isMobile={isMobile}
                          onClick={handleShare}
                        >
                          <Share2 size={isMobile ? 18 : 20} />
                        </HeaderIconButton>
                      )}

                      {/* 모임 채널 페이지 - 호스트 설정 버튼 */}
                      {routeInfo.isMeetingChannel && isHostInChannel && (
                        <HeaderIconButton
                          $isMobile={isMobile}
                          onClick={() => console.log('설정 페이지 준비 중...')} // TODO: 설정 페이지 구현
                        >
                          <Settings size={isMobile ? 18 : 20} />
                        </HeaderIconButton>
                      )}
                    </>
                  )}

                  {/* 마이페이지 - 알림, 설정 버튼 */}
                  {routeInfo.isMyPage && !hideHeaderActions && (
                    <>
                      <HeaderIconButton
                        $isMobile={isMobile}
                        onClick={handleNotifications}
                      >
                        <Bell size={isMobile ? 18 : 20} />
                      </HeaderIconButton>
                      <HeaderIconButton
                        $isMobile={isMobile}
                        onClick={() => navigate("/my/settings")}
                      >
                        <Settings size={isMobile ? 18 : 20} />
                      </HeaderIconButton>
                    </>
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
                const isRestricted =
                  tab.requiresLocationVerification && !isLocationVerified;

                const handleTabClick = (e: React.MouseEvent) => {
                  if (isRestricted) {
                    e.preventDefault();
                    if (!isLocationModalOpen) {
                      setIsLocationModalOpen(true);
                    }
                  }
                };

                return (
                  <TabItem
                    key={tab.path}
                    to={isRestricted ? "#" : tab.path}
                    $isActive={location.pathname === tab.path}
                    onClick={handleTabClick}
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

      {/* 활동 로그 모달 */}
      <ActivityLogModal
        isOpen={showActivityLogModal}
        onClose={() => setShowActivityLogModal(false)}
        activityLogs={homeData?.activityLogs || []}
      />

      {/* 위치 인증 모달 */}
      <LocationVerificationModal
        isOpen={isLocationModalOpen}
        onClose={handleLocationModalClose}
        onVerificationComplete={handleVerificationComplete}
      />
    </AppContainer>
  );
};
