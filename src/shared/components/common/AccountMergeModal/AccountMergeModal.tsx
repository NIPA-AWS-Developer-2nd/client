import React from "react";
import { X, Info } from "lucide-react";
import styled from "styled-components";
import {
  AndroidModalHeader,
  AndroidModalTitle,
  AndroidCloseButton,
  AndroidModalText,
} from "../InstallPrompt/utils/styles";

// 온보딩 모달을 비활성화시키는 오버레이
const ModalOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10000;
  display: ${({ $show }) => ($show ? "block" : "none")};
  pointer-events: ${({ $show }) => ($show ? "auto" : "none")};
`;

// 온보딩 모달보다 위에 표시
const HighZIndexModal = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: ${({ $show }) => ($show ? "0" : "-300px")};
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 10001; /* 온보딩 모달(9999)보다 높게 설정 */
  transition: bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

interface AccountMergeModalProps {
  show: boolean;
  onClose: () => void;
}

export const AccountMergeModal: React.FC<AccountMergeModalProps> = ({
  show,
  onClose,
}) => {
  return (
    <>
      <ModalOverlay $show={show} />
      <HighZIndexModal $show={show}>
        <AndroidModalHeader>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Info size={20} color="#2196F3" />
            <AndroidModalTitle>계정 통합 알림</AndroidModalTitle>
          </div>
          <AndroidCloseButton onClick={onClose}>
            <X size={20} />
          </AndroidCloseButton>
        </AndroidModalHeader>
        <AndroidModalText>
          이미 해당 전화번호로 가입된 계정이 있어 소셜 계정과 자동으로
          통합됩니다.
        </AndroidModalText>
      </HighZIndexModal>
    </>
  );
};
