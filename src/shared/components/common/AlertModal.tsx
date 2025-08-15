import React from "react";
import styled from "styled-components";
import { X, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { deviceDetection } from "../../utils/deviceDetection";

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContainer = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: ${({ $isMobile }) => ($isMobile ? "90vw" : "400px")};
  overflow: hidden;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const ModalHeader = styled.div<{ $type: AlertType; $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 20px" : "20px 24px")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $type }) => {
    switch ($type) {
      case "info":
        return theme.colors.blue + "10";
      case "warning":
        return theme.colors.yellow + "10";
      case "success":
        return theme.colors.green + "10";
      case "error":
        return theme.colors.red + "10";
      default:
        return theme.colors.gray50;
    }
  }};
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrapper = styled.div<{ $type: AlertType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme, $type }) => {
    switch ($type) {
      case "info":
        return theme.colors.blue + "20";
      case "warning":
        return theme.colors.yellow + "20";
      case "success":
        return theme.colors.green + "20";
      case "error":
        return theme.colors.red + "20";
      default:
        return theme.colors.gray200;
    }
  }};
  color: ${({ theme, $type }) => {
    switch ($type) {
      case "info":
        return theme.colors.blue;
      case "warning":
        return theme.colors.yellow;
      case "success":
        return theme.colors.green;
      case "error":
        return theme.colors.red;
      default:
        return theme.colors.gray600;
    }
  }};
`;

const ModalTitle = styled.h2<{ $isMobile?: boolean }>`
  margin: 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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
`;

const ModalContent = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const MessageText = styled.p<{ $isMobile?: boolean }>`
  margin: 0 0 20px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonContainer = styled.div<{ $isMobile?: boolean; $centered?: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  justify-content: ${({ $centered }) => ($centered ? "center" : "flex-end")};
`;

const Button = styled.button<{ $variant: "primary" | "secondary"; $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "10px 16px" : "12px 20px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  border: none;
  min-width: ${({ $isMobile }) => ($isMobile ? "80px" : "100px")};

  ${({ theme, $variant }) => {
    if ($variant === "primary") {
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
        
        &:hover {
          background: ${theme.colors.primaryDark};
        }
      `;
    } else {
      return `
        background: ${theme.colors.gray100};
        color: ${theme.colors.text.secondary};
        
        &:hover {
          background: ${theme.colors.gray200};
          color: ${theme.colors.text.primary};
        }
      `;
    }
  }}

  &:active {
    transform: scale(0.98);
  }
`;

export type AlertType = "info" | "warning" | "success" | "error";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const getIcon = (type: AlertType) => {
  switch (type) {
    case "info":
      return <Info size={18} />;
    case "warning":
      return <AlertTriangle size={18} />;
    case "success":
      return <CheckCircle size={18} />;
    case "error":
      return <XCircle size={18} />;
    default:
      return <Info size={18} />;
  }
};

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  showCancel = false,
}) => {
  const isMobile = deviceDetection.isMobile();

  // 모달 외부 클릭시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 키로 닫기
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // 배경 스크롤 방지
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer $isMobile={isMobile}>
        <ModalHeader $type={type} $isMobile={isMobile}>
          <HeaderContent>
            <IconWrapper $type={type}>
              {getIcon(type)}
            </IconWrapper>
            <ModalTitle $isMobile={isMobile}>
              {title}
            </ModalTitle>
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </ModalHeader>
        <ModalContent $isMobile={isMobile}>
          <MessageText $isMobile={isMobile}>
            {message}
          </MessageText>
          <ButtonContainer $isMobile={isMobile} $centered={!showCancel}>
            {showCancel && (
              <Button 
                $variant="secondary" 
                $isMobile={isMobile}
                onClick={onClose}
              >
                {cancelText}
              </Button>
            )}
            <Button 
              $variant="primary" 
              $isMobile={isMobile}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};