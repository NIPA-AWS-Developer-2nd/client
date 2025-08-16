import styled, { css, keyframes } from "styled-components";
import { responsive, hoverSupported } from "../../../styles/mixins";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeIn} 0.2s ease;
  
  ${responsive.mobile(css`
    padding: ${({ theme }) => theme.spacing.md};
  `)}
`;

export const ModalContent = styled.div<ModalContentProps>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || "500px"};
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  
  ${responsive.mobile(css`
    max-width: 90vw;
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

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  flex: 1;
  overflow-y: auto;
`;