import styled, { keyframes } from "styled-components";
import { Loader2 } from "lucide-react";

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

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

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
  animation: ${fadeIn} 0.2s ease;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
`;

export const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.gray400};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  background: ${({ theme }) => theme.colors.gray100};
`;

export const ModalBody = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
`;

export const InfoSection = styled.div`
  text-align: center;
  padding: 20px 0;
`;

export const InfoText = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.5;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

export const InfoSubText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

export const StatusSection = styled.div<{ $status: "success" | "fail" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  text-align: center;

  svg {
    color: ${({ theme, $status }) =>
      $status === "success" ? theme.colors.success : theme.colors.danger};
    margin-bottom: 16px;
  }
`;

export const StatusTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

export const StatusText = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  margin: 0;
`;

export const LocationInfo = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 12px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: "SF Mono", Monaco, "Courier New", monospace;
  margin-top: 16px;
  text-align: center;
`;

export const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray100};
  display: flex;
  gap: 12px;
`;

export const VerifyButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.primary}dd
  );
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .animate-spin {
    animation: ${spin} 1s linear infinite;
  }
`;

export const LoadingSpinner = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
  color: ${({ theme }) => theme.colors.primary};
`;

export const RetryButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray200};
    border-color: ${({ theme }) => theme.colors.gray300};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CloseModalButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    opacity: 0.9;
  }
`;

// 지역 선택 스타일들
export const DistrictGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px 0;
`;

export const DistrictButton = styled.button<{ 
  $selected: boolean; 
  $disabled?: boolean; 
}>`
  padding: 16px 12px;
  border: 2px solid
    ${({ theme, $selected, $disabled }) =>
      $disabled
        ? theme.colors.gray300
        : $selected 
        ? theme.colors.primary 
        : theme.colors.primary};
  border-radius: 8px;
  background: ${({ theme, $selected, $disabled }) =>
    $disabled
      ? theme.colors.gray100
      : $selected 
      ? theme.colors.primary 
      : theme.colors.white};
  color: ${({ theme, $selected, $disabled }) =>
    $disabled
      ? theme.colors.gray400
      : $selected 
      ? theme.colors.white 
      : theme.colors.text.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-height: 80px;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:active {
    transform: ${({ $disabled }) => ($disabled ? "none" : "translateY(0)")};
  }
`;

export const DistrictIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DistrictName = styled.div`
  font-weight: 600;
`;

export const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: 8px;
`;

export const StepSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: 24px;
`;
