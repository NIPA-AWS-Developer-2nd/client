import React from "react";
import styled from "styled-components";
import { X, FileText, Shield, Bell } from "lucide-react";
import { useAlert } from "../../hooks/useAlert";

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
  max-width: ${({ $isMobile }) => ($isMobile ? "90vw" : "500px")};
  max-height: ${({ $isMobile }) => ($isMobile ? "80vh" : "70vh")};
  overflow: hidden;
  position: relative;
`;

const ModalHeader = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 20px" : "20px 24px")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.gray50};
`;

const ModalTitle = styled.h2<{ $isMobile?: boolean }>`
  margin: 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
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
  overflow-y: auto;
  max-height: ${({ $isMobile }) => ($isMobile ? "60vh" : "50vh")};

  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray400};
  }
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MenuItem = styled.button<{ $isMobile?: boolean }>`
  background: none;
  border: none;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 0" : "18px 0")};
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  outline: none;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
    margin: 0 -24px;
    padding-left: 24px;
    padding-right: 24px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  &:focus {
    background: ${({ theme }) => theme.colors.gray50};
    margin: 0 -24px;
    padding-left: 24px;
    padding-right: 24px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MenuIcon = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  height: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  flex-shrink: 0;
`;

const MenuContent = styled.div`
  flex: 1;
  text-align: left;
`;

const MenuLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "15px" : "16px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const MenuDescription = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

interface AppInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export const AppInfoModal: React.FC<AppInfoModalProps> = ({
  isOpen,
  onClose,
  isMobile = false,
}) => {
  const { info } = useAlert();
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
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleTermsClick = () => {
    info("서비스 이용에 관한 약관을 확인할 수 있습니다.", "이용약관");
  };

  const handlePrivacyClick = () => {
    info("개인정보 수집, 이용, 관리에 관한 정책을 확인할 수 있습니다.", "개인정보처리방침");
  };

  const handleNoticesClick = () => {
    info("서비스 업데이트 및 중요 공지사항을 확인할 수 있습니다.", "공지사항");
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer $isMobile={isMobile}>
        <ModalHeader $isMobile={isMobile}>
          <ModalTitle $isMobile={isMobile}>앱 정보</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </ModalHeader>
        <ModalContent $isMobile={isMobile}>
          <MenuList>
            <MenuItem $isMobile={isMobile} onClick={handleTermsClick}>
              <MenuIcon $isMobile={isMobile}>
                <FileText size={isMobile ? 18 : 20} />
              </MenuIcon>
              <MenuContent>
                <MenuLabel $isMobile={isMobile}>이용약관</MenuLabel>
                <MenuDescription $isMobile={isMobile}>
                  서비스 이용에 관한 약관 및 규정
                </MenuDescription>
              </MenuContent>
            </MenuItem>

            <MenuItem $isMobile={isMobile} onClick={handlePrivacyClick}>
              <MenuIcon $isMobile={isMobile}>
                <Shield size={isMobile ? 18 : 20} />
              </MenuIcon>
              <MenuContent>
                <MenuLabel $isMobile={isMobile}>개인정보처리방침</MenuLabel>
                <MenuDescription $isMobile={isMobile}>
                  개인정보 수집, 이용, 관리에 관한 정책
                </MenuDescription>
              </MenuContent>
            </MenuItem>

            <MenuItem $isMobile={isMobile} onClick={handleNoticesClick}>
              <MenuIcon $isMobile={isMobile}>
                <Bell size={isMobile ? 18 : 20} />
              </MenuIcon>
              <MenuContent>
                <MenuLabel $isMobile={isMobile}>공지사항</MenuLabel>
                <MenuDescription $isMobile={isMobile}>
                  서비스 업데이트 및 중요 공지사항
                </MenuDescription>
              </MenuContent>
            </MenuItem>
          </MenuList>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};
