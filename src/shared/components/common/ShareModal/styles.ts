import styled from "styled-components";

export const ModalOverlay = styled.div<{ $show: boolean }>`
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

export const ModalContainer = styled.div<{ $isMobile?: boolean }>`
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

  ${({ $isMobile }) =>
    $isMobile &&
    `
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
  `}
`;

export const ModalHeader = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "24px")};
  margin-top: ${({ $isMobile }) => ($isMobile ? "8px" : "0")};
`;

export const ModalTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ $isMobile }) =>
    $isMobile ? "-20px 0px 0px 0" : "-20px -10px 0 0"};
`;

export const CloseButton = styled.button`
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

export const DragHandle = styled.div<{ $isMobile?: boolean }>`
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

export const ShareOptions = styled.div<{
  $isMobile?: boolean;
  $itemCount?: number;
}>`
  display: grid;
  grid-template-columns: ${({ $itemCount = 4 }) =>
    `repeat(${Math.min($itemCount, 4)}, 1fr)`};
  gap: 16px;
  justify-items: center;

  @media (max-width: 400px) {
    grid-template-columns: ${({ $itemCount = 4 }) =>
      $itemCount <= 3 ? `repeat(${$itemCount}, 1fr)` : "repeat(3, 1fr)"};
    gap: 12px;
  }

  @media (max-width: 320px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;
export const ShareOption = styled.button<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 8px" : "16px 12px")};
  border: none;
  background: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: center;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  &:hover {
    opacity: 0.8;
    background: ${({ theme }) => theme.colors.gray50};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 400px) {
    padding: 10px 6px;
    gap: 6px;
  }

  @media (max-width: 320px) {
    padding: 12px 8px;
    gap: 8px;
  }
`;

export const ShareIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const KakaotalkLogo = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

export const ShareLabel = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;
