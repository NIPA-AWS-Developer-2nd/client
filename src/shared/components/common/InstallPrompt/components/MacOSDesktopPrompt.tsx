import React from "react";
import { AlertCircle, X } from "lucide-react";
import { deviceDetection } from "../../../../utils/deviceDetection";
import { InstallGuideModal } from "../modals/InstallGuideModal";
import { BrowserInstallGuide } from "../modals/BrowserInstallGuide";
import {
  MacOSModal,
  MacOSModalHeader,
  MacOSModalIcon,
  AndroidModalTitle,
  MacOSCloseButton,
  AndroidModalText,
  AndroidButton,
} from "../utils/styles";

interface MacOSDesktopPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
  showGuideModal: boolean;
  onGuideComplete: () => void;
}

export const MacOSDesktopPrompt: React.FC<MacOSDesktopPromptProps> = ({
  onInstall,
  onDismiss,
  showGuideModal,
  onGuideComplete,
}) => {
  const browser = deviceDetection.getBrowser();

  const getButtonText = () => {
    return "설치 방법 보기";
  };

  const renderDescriptionText = () => {
    switch (browser) {
      case "safari":
        return (
          <>
            Safari에서 더 나은 사용자 경험을 제공합니다.
            <br />
            아래 버튼을 눌러 설치 방법을 확인해주세요.
          </>
        );
      case "chrome":
        return (
          <>
            Chrome에서 앱으로 설치할 수 있습니다.
            <br />
            아래 버튼을 눌러 설치 방법을 확인해주세요.
          </>
        );
      case "edge":
        return (
          <>
            Edge에서 앱으로 설치할 수 있습니다.
            <br />
            아래 버튼을 눌러 설치 방법을 확인해주세요.
          </>
        );
      case "firefox":
        return "Firefox는 앱 설치를 지원하지 않습니다. 다른 브라우저 사용을 권장합니다.";
      default:
        return "아래 버튼을 눌러 설치 방법을 확인해주세요.";
    }
  };

  return (
    <>
      <MacOSModal $show={true}>
        <MacOSModalHeader>
          <MacOSModalIcon>
            <AlertCircle size={24} />
          </MacOSModalIcon>
          <AndroidModalTitle>앱으로 더 편하게 사용하세요!</AndroidModalTitle>
          <MacOSCloseButton onClick={onDismiss}>
            <X size={20} />
          </MacOSCloseButton>
        </MacOSModalHeader>
        <AndroidModalText>{renderDescriptionText()}</AndroidModalText>
        <AndroidButton onClick={onInstall}>{getButtonText()}</AndroidButton>
      </MacOSModal>

      {/* Safari는 기존 InstallGuideModal 사용 */}
      {showGuideModal && browser === "safari" && (
        <InstallGuideModal
          show={showGuideModal}
          platform="macos-desktop"
          onClose={onGuideComplete}
        />
      )}

      {/* Chrome, Edge, Firefox는 새로운 BrowserInstallGuide 사용 */}
      {showGuideModal && ["chrome", "edge", "firefox"].includes(browser) && (
        <BrowserInstallGuide
          show={showGuideModal}
          browser={browser as "chrome" | "edge" | "firefox"}
          onClose={onGuideComplete}
        />
      )}
    </>
  );
};
