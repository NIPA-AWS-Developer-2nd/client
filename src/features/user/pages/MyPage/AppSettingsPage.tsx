import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAlert } from "../../../../shared/components/common";
import {
  Moon,
  Sun,
  Monitor,
  Check,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  Download,
  Info,
  MessageSquare,
  LogOut,
  UserX,
  ChevronDown,
  Palette,
} from "lucide-react";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import { useTheme } from "../../../../shared/hooks/useTheme";
import { usePWA } from "../../../../shared/hooks/usePWA";
import { useAuth } from "../../../auth";
import {
  AppInfoModal,
  SimpleFeedbackModal,
} from "../../../../shared/components/common";
import { Modal } from "../../../../shared/components/ui";
import { NotificationSettings } from "../../../notification/components/NotificationSettings";
import type { ThemeMode } from "../../../../shared/styles/theme";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
`;

const SettingDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 20px 0;
  line-height: 1.4;
`;

const ThemeOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ThemeOption = styled.button<{
  $isMobile?: boolean;
  $isSelected: boolean;
}>`
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.primary + "10" : theme.colors.white};
  border: 1px solid
    ${({ $isSelected, theme }) =>
      $isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "10px 12px" : "12px 14px")};
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: left;
  width: 100%;

  &:hover:not(:disabled) {
    background: ${({ $isSelected, theme }) =>
      $isSelected ? theme.colors.primary + "10" : theme.colors.gray50};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    box-shadow: none;
  }
`;

const ThemeIconWrapper = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  flex-shrink: 0;
`;

const ThemeInfo = styled.div`
  flex: 1;
`;

const ThemeLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const ThemeSubtext = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.3;
`;

const CheckIconWrapper = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.primary : "transparent"};
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.white : "transparent"};
  transition: ${({ theme }) => theme.transitions.fast};
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
  padding: ${({ $isMobile }) => ($isMobile ? "12px 8px" : "14px 8px")};
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  outline: none;
  width: 100%;
  text-align: left;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }

  &:active {
    transform: scale(0.98);
    background: ${({ theme }) => theme.colors.gray100};
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    box-shadow: none;
  }
`;

const MenuItemStatic = styled.div<{ $isMobile?: boolean }>`
  background: none;
  border: none;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 8px" : "14px 8px")};
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

const ExpandableMenuItem = styled.button<{ 
  $isMobile?: boolean;
  $expanded?: boolean;
}>`
  background: none;
  border: none;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 8px" : "14px 8px")};
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: ${({ $expanded, theme }) => 
    $expanded ? "none" : `1px solid ${theme.colors.divider}`};
  outline: none;
  width: 100%;
  text-align: left;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }

  &:active {
    background: ${({ theme }) => theme.colors.gray100};
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    box-shadow: none;
  }
`;

const ChevronIcon = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease-in-out;
  transform: ${({ $expanded }) =>
    $expanded ? "rotate(180deg)" : "rotate(0deg)"};
  margin-left: auto;
`;

const ThemeSettingsContent = styled.div<{
  $expanded: boolean;
  $isMobile?: boolean;
}>`
  overflow: hidden;
  transition: all 0.25s ease-in-out;
  opacity: ${({ $expanded }) => ($expanded ? "1" : "0")};
  max-height: ${({ $expanded }) => ($expanded ? "500px" : "0")};
  padding-top: ${({ $expanded, $isMobile }) =>
    $expanded ? ($isMobile ? "12px" : "16px") : "0"};
`;

const ThemeSettingsWrapper = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) =>
    $isMobile ? "0 0 16px 8px" : "0 20px 20px 20px"};
  transform: translateZ(0); /* GPU 가속 활성화 */
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

export const AppSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { info, error, confirm } = useAlert();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const { themeMode, setThemeMode } = useTheme();
  const { isInstalled, isInstallable, installApp } = usePWA();
  const [showAppInfoModal, setShowAppInfoModal] = React.useState(false);
  const [showSimpleFeedbackModal, setShowSimpleFeedbackModal] =
    React.useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = React.useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = React.useState(false);

  // package.json에서 가져온 앱 버전
  const appVersion =
    typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "1.0.0";

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const themeOptions: Array<{
    mode: ThemeMode;
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    description: string;
  }> = [
    {
      mode: "system",
      icon: Monitor,
      label: "시스템 설정",
      description: "기기의 시스템 설정을 따라 자동으로 변경됩니다",
    },
    {
      mode: "light",
      icon: Sun,
      label: "라이트 모드",
      description: "밝은 테마로 항상 표시됩니다",
    },
    {
      mode: "dark",
      icon: Moon,
      label: "다크 모드",
      description: "어두운 테마로 항상 표시됩니다",
    },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleAppInstall = () => {
    if (isInstallable) {
      installApp();
    } else if (isInstalled) {
      info("앱이 이미 설치되어 있습니다.");
    } else {
      const userAgent = navigator.userAgent.toLowerCase();
      const isChrome =
        userAgent.includes("chrome") && !userAgent.includes("edg");
      const isEdge = userAgent.includes("edg");

      if (deviceDetection.isIOS()) {
        info(
          'Safari에서 "공유" 버튼을 누른 후 "홈 화면에 추가"를 선택하여 앱을 설치할 수 있습니다.'
        );
      } else if (deviceDetection.isAndroid()) {
        info(
          'Chrome에서 메뉴(⋮) 버튼을 누른 후 "홈 화면에 추가" 또는 "앱 설치"를 선택하여 앱을 설치할 수 있습니다.'
        );
      } else if (isChrome) {
        info(
          'Chrome 주소창 오른쪽의 설치 아이콘을 클릭하거나, 메뉴(⋮) > "앱 설치"를 선택하여 설치할 수 있습니다.\n\n또는 페이지를 새로고침한 후 다시 시도해보세요.'
        );
      } else if (isEdge) {
        info(
          'Edge 주소창 오른쪽의 설치 아이콘을 클릭하거나, 메뉴(⋯) > "앱" > "이 사이트를 앱으로 설치"를 선택하여 설치할 수 있습니다.'
        );
      } else {
        error(
          `현재 브라우저는 지원되지 않습니다.\n\n앱 설치를 위해 Chrome 또는 Edge 브라우저를 사용해보세요.`
        );
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login", { replace: true });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirm(
      "탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.",
      "정말로 회원탈퇴를 진행하시겠습니까?"
    );
    if (confirmed) {
      info("회원탈퇴 기능을 준비 중입니다.");
    }
  };

  const menuItems = [
    {
      icon: Bell,
      label: "알림 설정",
      onClick: () => setShowNotificationSettings(true),
    },
    {
      icon: Shield,
      label: "개인정보",
      onClick: () => info("개인정보 기능을 준비 중입니다."),
    },
    {
      icon: CreditCard,
      label: "결제 수단",
      onClick: () => info("결제 수단 기능을 준비 중입니다."),
    },
    {
      icon: HelpCircle,
      label: "고객 센터",
      onClick: () => info("고객 센터 기능을 준비 중입니다."),
    },
  ];

  return (
    <PageContainer $isMobile={isMobile}>
      <MenuCard $isMobile={isMobile}>
        <MenuTitle $isMobile={isMobile}>설정 및 관리</MenuTitle>
        <MenuList>
          <ExpandableMenuItem
            $isMobile={isMobile}
            $expanded={isThemeExpanded}
            onClick={() => setIsThemeExpanded(!isThemeExpanded)}
          >
            <MenuIcon $isMobile={isMobile}>
              <Palette size={isMobile ? 16 : 18} />
            </MenuIcon>
            <MenuLabel $isMobile={isMobile}>테마 설정</MenuLabel>
            <ChevronIcon $expanded={isThemeExpanded}>
              <ChevronDown size={16} />
            </ChevronIcon>
          </ExpandableMenuItem>

          <ThemeSettingsContent
            $expanded={isThemeExpanded}
            $isMobile={isMobile}
          >
            <ThemeSettingsWrapper $isMobile={isMobile}>
              <SettingDescription $isMobile={isMobile}>
                앱의 화면 모드를 선택하세요. 시스템 설정을 선택하면 기기의 다크
                모드 설정에 따라 자동으로 변경됩니다.
              </SettingDescription>
              <ThemeOptions>
                {themeOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = themeMode === option.mode;

                  return (
                    <ThemeOption
                      key={option.mode}
                      $isMobile={isMobile}
                      $isSelected={isSelected}
                      onClick={() => handleThemeChange(option.mode)}
                    >
                      <ThemeIconWrapper $isMobile={isMobile}>
                        <IconComponent size={isMobile ? 16 : 18} />
                      </ThemeIconWrapper>

                      <ThemeInfo>
                        <ThemeLabel $isMobile={isMobile}>
                          {option.label}
                        </ThemeLabel>
                        <ThemeSubtext $isMobile={isMobile}>
                          {option.description}
                        </ThemeSubtext>
                      </ThemeInfo>

                      <CheckIconWrapper $isSelected={isSelected}>
                        <Check size={14} />
                      </CheckIconWrapper>
                    </ThemeOption>
                  );
                })}
              </ThemeOptions>
            </ThemeSettingsWrapper>
          </ThemeSettingsContent>

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
          <MenuItem
            $isMobile={isMobile}
            onClick={() => setShowAppInfoModal(true)}
          >
            <MenuIcon $isMobile={isMobile}>
              <Shield size={isMobile ? 16 : 18} />
            </MenuIcon>
            <MenuLabel $isMobile={isMobile}>앱 정보</MenuLabel>
          </MenuItem>
          <MenuItem
            $isMobile={isMobile}
            onClick={() => setShowSimpleFeedbackModal(true)}
          >
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
      
      {/* 알림 설정 모달 */}
      <Modal
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
        title="알림 설정"
        maxWidth={isMobile ? "90%" : "600px"}
        showCloseButton={true}
      >
        <NotificationSettings />
      </Modal>
    </PageContainer>
  );
};
