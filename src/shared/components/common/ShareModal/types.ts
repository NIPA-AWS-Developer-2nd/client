import type { MissionWithDetails } from "../../../../types";

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: MissionWithDetails;
  isMobile?: boolean;
}

export interface ShareOptionData {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export interface ShareHandlers {
  handleKakaoShare: () => void;
  handleMessageShare: () => void;
  handleMoreShare: () => void;
  handleCopyLink: () => void;
}