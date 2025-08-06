import React from "react";
import { AlertCircle } from "lucide-react";
import { InstallGuideModal } from "../modals/InstallGuideModal";
import {
  DesktopNotification,
  DesktopNotificationIcon,
  DesktopNotificationContent,
  DesktopNotificationText,
  DesktopNotificationButtons,
  DesktopButton,
} from "../utils/styles";

interface WindowsDesktopPromptProps {
  onInstall: () => void;
  onLater: () => void;
  showGuideModal: boolean;
  onGuideComplete: () => void;
}

export const WindowsDesktopPrompt: React.FC<WindowsDesktopPromptProps> = ({
  onInstall,
  onLater,
  showGuideModal,
  onGuideComplete,
}) => {
  return (
    <>
      <DesktopNotification $show={true} $platform="windows-desktop">
        <DesktopNotificationIcon>
          <AlertCircle size={20} />
        </DesktopNotificationIcon>
        <DesktopNotificationContent>
          <DesktopNotificationText>
            앱으로 더 편하게 사용하세요!
          </DesktopNotificationText>
          <DesktopNotificationButtons>
            <DesktopButton onClick={onInstall}>
              홈 화면에 추가
            </DesktopButton>
            <DesktopButton $variant="secondary" onClick={onLater}>
              나중에
            </DesktopButton>
          </DesktopNotificationButtons>
        </DesktopNotificationContent>
      </DesktopNotification>

      {showGuideModal && (
        <InstallGuideModal
          show={showGuideModal}
          platform="macos-desktop"
          onClose={onGuideComplete}
        />
      )}
    </>
  );
};