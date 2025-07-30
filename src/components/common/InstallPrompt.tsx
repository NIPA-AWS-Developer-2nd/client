import React from "react";
import styled from "styled-components";
import { usePWA } from "../../hooks/usePWA";

const PromptContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: ${({ $show }) => ($show ? "80px" : "-100px")};
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme?.colors?.primary || "#007bff"};
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: bottom 0.3s ease-in-out;
  z-index: 1001;
  max-width: 90vw;
  text-align: center;

  @media (max-width: 768px) {
    bottom: ${({ $show }) => ($show ? "80px" : "-100px")};
    left: 12px;
    right: 12px;
    transform: none;
    max-width: none;
    margin-bottom: env(safe-area-inset-bottom);
  }
`;

const PromptText = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;

  ${({ $variant }) =>
    $variant === "secondary"
      ? `
        background: rgba(255, 255, 255, 0.2);
        color: white;
        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `
      : `
        background: white;
        color: #007bff;
        &:hover {
          background: #f8f9fa;
        }
      `}
`;

interface InstallPromptProps {
  onDismiss?: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onDismiss }) => {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = React.useState(false);

  const handleInstall = async () => {
    await installApp();
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <PromptContainer $show={true}>
      <PromptText>홈 화면에 추가하시겠어요?</PromptText>
      <ButtonContainer>
        <Button onClick={handleInstall}>설치하기</Button>
        <Button $variant="secondary" onClick={handleDismiss}>
          나중에
        </Button>
      </ButtonContainer>
    </PromptContainer>
  );
};
