import React from "react";
import { X } from "lucide-react";
import {
  AndroidModal,
  AndroidModalHeader,
  AndroidModalTitle,
  AndroidCloseButton,
  AndroidModalText,
  AndroidButton,
} from "../utils/styles";

interface AndroidPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export const AndroidPrompt: React.FC<AndroidPromptProps> = ({
  onInstall,
  onDismiss,
}) => {
  return (
    <AndroidModal $show={true}>
      <AndroidModalHeader>
        <AndroidModalTitle>앱으로 더 편하게 사용하세요!</AndroidModalTitle>
        <AndroidCloseButton onClick={onDismiss}>
          <X size={20} />
        </AndroidCloseButton>
      </AndroidModalHeader>
      <AndroidModalText>
        빠른 접속과 더 나은 사용자 경험을 제공합니다.
      </AndroidModalText>
      <AndroidButton onClick={onInstall}>홈 화면에 추가</AndroidButton>
    </AndroidModal>
  );
};
