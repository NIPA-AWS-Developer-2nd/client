import React from "react";
import { X, Copy, MessageSquare, MoreHorizontal } from "lucide-react";
import kakaotalkLogo from "../../../../assets/images/kakaotalk-logo.png";
import { useShareModal } from "./useShareModal";
import type { ShareModalProps, ShareOptionData } from "./types";
import {
  ModalOverlay,
  ModalContainer,
  DragHandle,
  CloseButton,
  ModalHeader,
  ModalTitle,
  ShareOptions,
  ShareOption,
  ShareIconContainer,
  KakaotalkLogo,
  ShareLabel,
} from "./styles";


export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  mission,
  isMobile = false,
}) => {
  const { handleKakaoShare, handleMessageShare, handleMoreShare, handleCopyLink } =
    useShareModal(mission, onClose);

  const shareOptions: ShareOptionData[] = [
    {
      id: "copy-link",
      icon: <Copy size={22} />,
      label: "링크 복사",
      onClick: handleCopyLink,
    },
    {
      id: "kakaotalk",
      icon: <KakaotalkLogo src={kakaotalkLogo} alt="카카오톡" />,
      label: "카카오톡",
      onClick: handleKakaoShare,
    },
    {
      id: "message",
      icon: <MessageSquare size={22} />,
      label: "메시지",
      onClick: handleMessageShare,
    },
    {
      id: "more",
      icon: <MoreHorizontal size={22} />,
      label: "기타",
      onClick: handleMoreShare,
    },
  ];

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
          {shareOptions.map((option) => (
            <ShareOption
              key={option.id}
              $isMobile={isMobile}
              onClick={option.onClick}
            >
              <ShareIconContainer>{option.icon}</ShareIconContainer>
              <ShareLabel $isMobile={isMobile}>{option.label}</ShareLabel>
            </ShareOption>
          ))}
        </ShareOptions>
      </ModalContainer>
    </ModalOverlay>
  );
};
