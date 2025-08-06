import styled, { css } from "styled-components";
import { responsive, animations, hoverSupported } from "../../../styles/mixins";

interface ModalContentProps {
  $maxWidth?: string;
}

interface ModalTitleProps {
  $isMobile?: boolean;
}

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
  
  ${animations.fadeIn('0.2s')}
  
  ${responsive.mobile(css`
    padding: ${({ theme }) => theme.spacing.md};
  `)}
`;

export const ModalContent = styled.div<ModalContentProps>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || "400px"};
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  
  ${animations.scaleIn('0.2s')}
  
  ${responsive.mobile(css`
    max-width: 320px;
    max-height: 90vh;
  `)}
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModalTitle = styled.h3<ModalTitleProps>`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  
  ${responsive.mobile(css`
    font-size: 16px;
  `)}
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: ${({ theme }) => theme.transitions.fast};
  
  ${hoverSupported(css`
    background: ${({ theme }) => theme.colors.gray100};
  `)}
`;

export const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;