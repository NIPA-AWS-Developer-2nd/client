import React from "react";
import { usePWA } from "../../../hooks/usePWA";
import { deviceDetection } from "../../../utils/deviceDetection";
import { WindowsDesktopPrompt } from "./components/WindowsDesktopPrompt";
import { MacOSDesktopPrompt } from "./components/MacOSDesktopPrompt";
import { AndroidPrompt } from "./components/AndroidPrompt";
import { IOSPrompt } from "./components/IOSPrompt";

interface InstallPromptProps {
  onDismiss?: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onDismiss }) => {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [showGuideModal, setShowGuideModal] = React.useState(false);

  const platform = deviceDetection.getPlatform();

  // PWA 모드에서는 설치 프롬프트를 표시하지 않음
  const isPWA = deviceDetection.isPWAMode();
  
  // PWA 앱에서 실행 중이 아니고, 설치 가능한 경우에만 표시
  const shouldShowPrompt = !isPWA && (isInstallable || deviceDetection.supportsPWAInstall());

  const handleInstall = async () => {
    if (platform === "android") {
      await installApp();
      setIsDismissed(true);
      onDismiss?.();
    } else if (platform === "ios" || platform === "macos-desktop") {
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    // 거부 횟수 증가
    const currentCount = parseInt(localStorage.getItem("installPromptDismissCount") || "0");
    localStorage.setItem("installPromptDismissCount", (currentCount + 1).toString());
    
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleLater = () => {
    if (platform === "windows-desktop") {
      // Windows에서 나중에 버튼 클릭 시 알림 표시
      alert("마이페이지 설정에서 언제든지 앱 설치를 할 수 있습니다!");
    }
    handleDismiss();
  };

  const handleGuideComplete = () => {
    setShowGuideModal(false);
    setIsDismissed(true);
    onDismiss?.();
  };

  // 설치 프롬프트 표시 로직: PWA 모드가 아니고 지원하는 경우에 주기적으로 표시
  React.useEffect(() => {
    if (isPWA) {
      // PWA 모드에서는 항상 숨김
      setIsDismissed(true);
      return;
    }

    // 마지막으로 프롬프트를 보여준 날짜와 거부한 횟수 확인
    const lastShown = localStorage.getItem("installPromptLastShown");
    const dismissCount = parseInt(localStorage.getItem("installPromptDismissCount") || "0");
    const today = new Date().toDateString();

    // 너무 많이 거부했다면 표시 주기를 늘림 (최대 7일)
    const showInterval = Math.min(dismissCount, 7);
    
    if (!lastShown) {
      // 처음 방문하는 경우 즉시 표시
      setIsDismissed(false);
      localStorage.setItem("installPromptLastShown", today);
    } else {
      const lastShownDate = new Date(lastShown);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= showInterval) {
        setIsDismissed(false);
        localStorage.setItem("installPromptLastShown", today);
      } else {
        setIsDismissed(true);
      }
    }
  }, [isPWA]);

  if (!shouldShowPrompt || isDismissed) {
    return null;
  }

  // Platform-specific components
  switch (platform) {
    case "windows-desktop":
      return (
        <WindowsDesktopPrompt
          onInstall={handleInstall}
          onLater={handleLater}
          showGuideModal={showGuideModal}
          onGuideComplete={handleGuideComplete}
        />
      );

    case "macos-desktop":
      return (
        <MacOSDesktopPrompt
          onInstall={handleInstall}
          onDismiss={handleDismiss}
          showGuideModal={showGuideModal}
          onGuideComplete={handleGuideComplete}
        />
      );

    case "android":
      return (
        <AndroidPrompt
          onInstall={handleInstall}
          onDismiss={handleDismiss}
        />
      );

    case "ios":
      return (
        <IOSPrompt
          onInstall={handleInstall}
          showGuideModal={showGuideModal}
          onGuideComplete={handleGuideComplete}
        />
      );

    default:
      return null;
  }
};