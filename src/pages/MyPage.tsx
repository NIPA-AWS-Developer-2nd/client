import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  Settings,
  Star,
  Smile,
  Download,
  Info,
  MessageSquare,
  LogOut,
  UserX,
} from "lucide-react";
import { deviceDetection } from "../utils/deviceDetection";
import { usePWA } from "../hooks/usePWA";
import { useAuth } from "../hooks/useAuth";
import { AppInfoModal, SimpleFeedbackModal } from "../components/common";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
`;

const ProfileCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  text-align: center;
`;

const ProfileAvatar = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "60px" : "80px")};
  height: ${({ $isMobile }) => ($isMobile ? "60px" : "80px")};
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 50%;
  margin: 0 auto 16px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProfileName = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const ProfileSubtitle = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 20px 0;
`;

const StatsGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)"};
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const StatLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const MenuCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const MenuTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MenuItem = styled.button<{ $isMobile?: boolean }>`
  background: none;
  border: none;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 0" : "14px 0")};
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  outline: none;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  &:focus {
    background: ${({ theme }) => theme.colors.gray50};
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: none;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MenuItemStatic = styled.div<{ $isMobile?: boolean }>`
  background: none;
  border: none;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 0" : "14px 0")};
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};

  &:last-child {
    border-bottom: none;
  }
`;

const MenuIcon = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MenuLabel = styled.span<{ $isMobile?: boolean }>`
  flex: 1;
  text-align: left;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MenuLabelWithSubtext = styled.div`
  flex: 1;
  text-align: left;
`;

const MenuMainLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const MenuSubLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const { isInstalled, isInstallable, installApp } = usePWA();
  const [showAppInfoModal, setShowAppInfoModal] = React.useState(false);
  const [showSimpleFeedbackModal, setShowSimpleFeedbackModal] =
    React.useState(false);

  // package.json에서 가져온 앱 버전
  const appVersion =
    typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "1.0.0";

  // 디버깅을 위한 PWA 상태 로그
  // React.useEffect(() => {
  //   console.log("PWA Status:", {
  //     isInstallable,
  //     isInstalled,
  //     isPWASupported,
  //     userAgent: navigator.userAgent,
  //   });
  // }, [isInstallable, isInstalled, isPWASupported]);

  const handleAppInstall = () => {
    if (isInstallable) {
      installApp();
    } else if (isInstalled) {
      alert("앱이 이미 설치되어 있습니다.");
    } else {
      // 브라우저별 상세 감지
      const userAgent = navigator.userAgent.toLowerCase();
      const isChrome =
        userAgent.includes("chrome") && !userAgent.includes("edg");
      const isEdge = userAgent.includes("edg");

      if (deviceDetection.isIOS()) {
        alert(
          'Safari에서 "공유" 버튼을 누른 후 "홈 화면에 추가"를 선택하여 앱을 설치할 수 있습니다.'
        );
      } else if (deviceDetection.isAndroid()) {
        alert(
          'Chrome에서 메뉴(⋮) 버튼을 누른 후 "홈 화면에 추가" 또는 "앱 설치"를 선택하여 앱을 설치할 수 있습니다.'
        );
      } else if (isChrome) {
        alert(
          'Chrome 주소창 오른쪽의 설치 아이콘을 클릭하거나, 메뉴(⋮) > "앱 설치"를 선택하여 설치할 수 있습니다.\n\n또는 페이지를 새로고침한 후 다시 시도해보세요.'
        );
      } else if (isEdge) {
        alert(
          'Edge 주소창 오른쪽의 설치 아이콘을 클릭하거나, 메뉴(⋯) > "앱" > "이 사이트를 앱으로 설치"를 선택하여 설치할 수 있습니다.'
        );
      } else {
        alert(
          `현재 브라우저는 지원되지 않습니다.\n\n앱 설치를 위해 Chrome 또는 Edge 브라우저를 사용해보세요.`
        );
      }
    }
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAppInfo = () => {
    setShowAppInfoModal(true);
  };

  const handleFeedback = () => {
    setShowSimpleFeedbackModal(true);
  };

  const handleAppSettings = () => {
    navigate("/my/settings");
  };

  const handleLogout = async () => {
    try {
      // 로컬 세션만 정리하고 로그인 페이지로 이동
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // 로그아웃 실패 시에도 로그인 페이지로 이동
      navigate("/login", { replace: true });
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "정말로 회원탈퇴를 진행하시겠습니까?\n\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
      )
    ) {
      // TODO: 실제 회원탈퇴 API 구현
      alert("회원탈퇴 기능을 준비 중입니다.");
    }
  };

  const menuItems = [
    {
      icon: User,
      label: "프로필 수정",
      onClick: () => alert("프로필 수정 기능을 준비 중입니다."),
    },
    {
      icon: Bell,
      label: "알림 설정",
      onClick: () => alert("알림 설정 기능을 준비 중입니다."),
    },
    {
      icon: Shield,
      label: "개인정보",
      onClick: () => alert("개인정보 기능을 준비 중입니다."),
    },
    {
      icon: CreditCard,
      label: "결제 수단",
      onClick: () => alert("결제 수단 기능을 준비 중입니다."),
    },
    {
      icon: HelpCircle,
      label: "고객 센터",
      onClick: () => alert("고객 센터 기능을 준비 중입니다."),
    },
    { icon: Settings, label: "앱 설정", onClick: handleAppSettings },
  ];

  const userPoints = 2850;
  const meetingsCount = 12;
  const reviewsCount = 5;
  const trustScore = 4.8;

  return (
    <PageContainer $isMobile={isMobile}>
      <ProfileCard $isMobile={isMobile}>
        <ProfileAvatar $isMobile={isMobile}>
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Smile size={isMobile ? 24 : 32} />
          )}
        </ProfileAvatar>
        <ProfileName $isMobile={isMobile}>
          {user?.nickname || "사용자님"}
        </ProfileName>
        <ProfileSubtitle $isMobile={isMobile}>
          {user?.email || "이메일 정보 없음"}
        </ProfileSubtitle>

        <StatsGrid $isMobile={isMobile}>
          <StatItem>
            <StatValue $isMobile={isMobile}>
              {userPoints.toLocaleString()}P
            </StatValue>
            <StatLabel $isMobile={isMobile}>보유 포인트</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue $isMobile={isMobile}>{meetingsCount}</StatValue>
            <StatLabel $isMobile={isMobile}>참여 모임</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue $isMobile={isMobile}>{reviewsCount}</StatValue>
            <StatLabel $isMobile={isMobile}>리뷰 수</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue $isMobile={isMobile}>
              <Star size={isMobile ? 14 : 16} fill="currentColor" />{" "}
              {trustScore}
            </StatValue>
            <StatLabel $isMobile={isMobile}>스코어</StatLabel>
          </StatItem>
        </StatsGrid>
      </ProfileCard>

      <MenuCard $isMobile={isMobile}>
        <MenuTitle $isMobile={isMobile}>설정 및 관리</MenuTitle>
        <MenuList>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <MenuItem key={index} $isMobile={isMobile} onClick={item.onClick}>
                <MenuIcon $isMobile={isMobile}>
                  <IconComponent size={isMobile ? 16 : 18} />
                </MenuIcon>
                <MenuLabel $isMobile={isMobile}>{item.label}</MenuLabel>
              </MenuItem>
            );
          })}
        </MenuList>
      </MenuCard>
      <MenuCard $isMobile={isMobile}>
        <MenuTitle $isMobile={isMobile}>정보</MenuTitle>
        <MenuList>
          <MenuItem $isMobile={isMobile} onClick={handleAppInstall}>
            <MenuIcon $isMobile={isMobile}>
              <Download size={isMobile ? 16 : 18} />
            </MenuIcon>
            <MenuLabel $isMobile={isMobile}>
              {isInstalled ? "앱 설치됨" : "앱 설치"}
            </MenuLabel>
          </MenuItem>
          <MenuItem $isMobile={isMobile} onClick={handleAppInfo}>
            <MenuIcon $isMobile={isMobile}>
              <Shield size={isMobile ? 16 : 18} />
            </MenuIcon>
            <MenuLabel $isMobile={isMobile}>앱 정보</MenuLabel>
          </MenuItem>
          <MenuItem $isMobile={isMobile} onClick={handleFeedback}>
            <MenuIcon $isMobile={isMobile}>
              <MessageSquare size={isMobile ? 16 : 18} />
            </MenuIcon>
            <MenuLabel $isMobile={isMobile}>피드백 보내기</MenuLabel>
          </MenuItem>
          <MenuItemStatic $isMobile={isMobile}>
            <MenuIcon $isMobile={isMobile}>
              <Info size={isMobile ? 16 : 18} />
            </MenuIcon>
            <MenuLabelWithSubtext>
              <MenuMainLabel $isMobile={isMobile}>앱 버전</MenuMainLabel>
              <MenuSubLabel $isMobile={isMobile}>v{appVersion}</MenuSubLabel>
            </MenuLabelWithSubtext>
          </MenuItemStatic>
        </MenuList>
      </MenuCard>

      {/* 계정 관리 섹션 */}
      <MenuCard $isMobile={isMobile}>
        <MenuTitle $isMobile={isMobile}>계정 관리</MenuTitle>
        <MenuList>
          <MenuItem $isMobile={isMobile} onClick={handleLogout}>
            <MenuIcon $isMobile={isMobile}>
              <LogOut size={isMobile ? 16 : 18} />
            </MenuIcon>
            <MenuLabel $isMobile={isMobile}>로그아웃</MenuLabel>
          </MenuItem>
          <MenuItem $isMobile={isMobile} onClick={handleDeleteAccount}>
            <MenuIcon $isMobile={isMobile}>
              <UserX size={isMobile ? 16 : 18} />
            </MenuIcon>
            <MenuLabel $isMobile={isMobile}>회원탈퇴</MenuLabel>
          </MenuItem>
        </MenuList>
      </MenuCard>

      {/* 모달들 */}
      <AppInfoModal
        isOpen={showAppInfoModal}
        onClose={() => setShowAppInfoModal(false)}
        isMobile={isMobile}
      />
      <SimpleFeedbackModal
        isOpen={showSimpleFeedbackModal}
        onClose={() => setShowSimpleFeedbackModal(false)}
        isMobile={isMobile}
      />
    </PageContainer>
  );
};
