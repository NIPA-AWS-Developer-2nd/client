import React from "react";
import { Info } from "lucide-react";
import { deviceDetection } from "../../../../utils/deviceDetection";
import { InstallGuideModal } from "../modals/InstallGuideModal";
import { SafariRedirectGuide } from "../modals/SafariRedirectGuide";
import {
  IOSModal,
  IOSModalIcon,
  IOSModalTitle,
  IOSModalText,
  IOSButton,
} from "../utils/styles";

interface IOSPromptProps {
  onInstall: () => void;
  showGuideModal: boolean;
  onGuideComplete: () => void;
}

export const IOSPrompt: React.FC<IOSPromptProps> = ({
  onInstall,
  showGuideModal,
  onGuideComplete,
}) => {
  const browser = deviceDetection.getBrowser();

  const handleOpenSafari = () => {
    // Safari로 현재 URL 열기
    const currentUrl = window.location.href;
    // Safari로 URL 열기 (iOS에서는 이 방법으로 Safari로 리다이렉션)
    window.location.href = `x-web-search://?${currentUrl}`;
    setTimeout(() => {
      window.location.href = currentUrl;
    }, 1000);
    onGuideComplete();
  };

  // Safari가 아닌 브라우저에서는 Safari 사용 안내 표시
  if (browser !== "safari") {
    return <SafariRedirectGuide show={true} onOpenSafari={handleOpenSafari} />;
  }

  // Safari에서는 기존 동작 유지
  return (
    <>
      <IOSModal $show={true}>
        <IOSModalIcon>
          <Info size={32} />
        </IOSModalIcon>
        <IOSModalTitle>앱으로 더 편하게 사용하세요!</IOSModalTitle>
        <IOSModalText>
          빠른 접속과 더 나은 사용자 경험을 제공합니다.
          <br />
          아래 버튼을 눌러 설치 방법을 확인해주세요.
        </IOSModalText>
        <IOSButton onClick={onInstall}>설치 방법 보기</IOSButton>
      </IOSModal>

      {showGuideModal && (
        <InstallGuideModal
          show={showGuideModal}
          platform="ios"
          onClose={onGuideComplete}
        />
      )}
    </>
  );
};
