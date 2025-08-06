import React from "react";
import styled from "styled-components";
import { X, Link, MessageSquare, MoreHorizontal } from "lucide-react";
import kakaotalkLogo from "../../../assets/images/kakaotalk-logo.png";
import { shareToKakao } from "../../utils/kakaoShare";
import type { MissionWithDetails } from "../../../types";

const ModalOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
  transition: all 0.3s ease;
`;

const ModalContainer = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ $isMobile, theme }) =>
    $isMobile
      ? `${theme.borderRadius.xl} ${theme.borderRadius.xl} 0 0`
      : theme.borderRadius.xl};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "40px 48px")};
  width: ${({ $isMobile }) => ($isMobile ? "100%" : "500px")};
  max-width: ${({ $isMobile }) => ($isMobile ? "100%" : "500px")};
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  position: ${({ $isMobile }) => ($isMobile ? "fixed" : "relative")};
  bottom: ${({ $isMobile }) => ($isMobile ? "0" : "auto")};
  left: ${({ $isMobile }) => ($isMobile ? "0" : "auto")};
  right: ${({ $isMobile }) => ($isMobile ? "0" : "auto")};
  transform: ${({ $isMobile }) => ($isMobile ? "none" : "none")};

  ${({ $isMobile }) =>
    $isMobile &&
    `
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
  `}
`;

const ModalHeader = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "24px")};
  margin-top: ${({ $isMobile }) => ($isMobile ? "8px" : "0")};
`;

const ModalTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ $isMobile }) => ($isMobile ? "-20px 0px 0px 0" : "0 -10px")};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
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
  }
`;

const DragHandle = styled.div<{ $isMobile?: boolean }>`
  display: ${({ $isMobile }) => ($isMobile ? "flex" : "none")};
  justify-content: center;
  padding: 8px 0 4px 0;
  margin-bottom: 4px;

  &::after {
    content: "";
    width: 36px;
    height: 4px;
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 2px;
  }
`;

const ShareOptions = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const ShareOption = styled.button<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 12px" : "20px 16px")};
  border: none;
  background: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: center;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ShareIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const KakaotalkLogo = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const ShareLabel = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: MissionWithDetails;
  isMobile?: boolean;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  mission,
  isMobile = false,
}) => {
  const handleKakaoShare = () => {
    shareToKakao(mission);
    onClose();
  };

  const handleMessageShare = () => {
    const text = mission
      ? `${mission.title} - ${mission.description} ${window.location.href}`
      : `나랑 미션 같이 할 사람? 두근두근, 재미있는 미션이 도착 했어요! ${window.location.href}`;

    // iOS/Android 메시지 앱 열기
    try {
      const messageUrl = `sms:?body=${encodeURIComponent(text)}`;
      window.open(messageUrl, '_blank');
      onClose();
    } catch (error) {
      console.error('Failed to open message app:', error);
      // 폴백: 텍스트 복사
      handleCopyLink();
    }
  };

  const handleMoreShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mission ? mission.title : "나랑 미션 같이 할 사람?",
          text: mission
            ? mission.description
            : "두근두근, 재미있는 미션이 도착 했어요!",
          url: window.location.href,
        });
        onClose();
      } catch (error) {
        console.log("Share cancelled or failed:", error);
      }
    } else {
      // 폴백: 링크 복사
      alert("이 브라우저에서는 네이티브 공유가 지원되지 않습니다. 링크를 복사합니다.");
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 클립보드에 복사되었습니다.");
      } else {
        // 폴백: 텍스트 영역을 이용한 복사
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          alert("링크가 클립보드에 복사되었습니다.");
        } catch (err) {
          console.error('Fallback copy failed:', err);
          alert("링크 복사에 실패했습니다. 링크를 수동으로 복사해주세요:\n" + window.location.href);
        }
        
        document.body.removeChild(textArea);
      }
      onClose();
    } catch (error) {
      console.error('Copy failed:', error);
      alert("링크 복사에 실패했습니다. 링크를 수동으로 복사해주세요:\n" + window.location.href);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay $show={isOpen} onClick={handleOverlayClick}>
      <ModalContainer $isMobile={isMobile}>
        <DragHandle $isMobile={isMobile} />

        <CloseButton onClick={onClose}>
          <X size={18} />
        </CloseButton>

        <ModalHeader $isMobile={isMobile}>
          <ModalTitle $isMobile={isMobile}>공유하기</ModalTitle>
        </ModalHeader>

        <ShareOptions $isMobile={isMobile}>
          <ShareOption $isMobile={isMobile} onClick={handleCopyLink}>
            <ShareIconContainer>
              <Link size={22} />
            </ShareIconContainer>
            <ShareLabel $isMobile={isMobile}>링크 복사</ShareLabel>
          </ShareOption>

          <ShareOption $isMobile={isMobile} onClick={handleKakaoShare}>
            <ShareIconContainer>
              <KakaotalkLogo src={kakaotalkLogo} alt="카카오톡" />
            </ShareIconContainer>
            <ShareLabel $isMobile={isMobile}>카카오톡</ShareLabel>
          </ShareOption>

          <ShareOption $isMobile={isMobile} onClick={handleMessageShare}>
            <ShareIconContainer>
              <MessageSquare size={22} />
            </ShareIconContainer>
            <ShareLabel $isMobile={isMobile}>메시지</ShareLabel>
          </ShareOption>

          <ShareOption $isMobile={isMobile} onClick={handleMoreShare}>
            <ShareIconContainer>
              <MoreHorizontal size={22} />
            </ShareIconContainer>
            <ShareLabel $isMobile={isMobile}>기타</ShareLabel>
          </ShareOption>
        </ShareOptions>
      </ModalContainer>
    </ModalOverlay>
  );
};
