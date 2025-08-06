import React from "react";
import styled from "styled-components";
import { Globe, AlertTriangle, X } from "lucide-react";

const ModalContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: ${({ $show }) => ($show ? "0" : "-400px")};
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  padding: 24px;
  z-index: 1001;
  transition: bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;

  @media (min-width: 1200px) {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: 1200px;
  }
`;

const ModalHeader = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;

  &:hover {
    background: #f5f5f5;
  }
`;

const IconContainer = styled.div`
  margin-bottom: 16px;
  color: #007bff;
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const Description = styled.p`
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

interface SafariRedirectGuideProps {
  show: boolean;
  onOpenSafari: () => void;
  onClose?: () => void;
}

export const SafariRedirectGuide: React.FC<SafariRedirectGuideProps> = ({
  show,
  onOpenSafari,
  onClose,
}) => {
  return (
    <ModalContainer $show={show}>
      <ModalHeader>
        {onClose && (
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        )}
        <IconContainer>
          <AlertTriangle size={32} />
        </IconContainer>
        <Title>앱으로 더 편하게 사용해보세요!</Title>
      </ModalHeader>

      <Description>
        Safari에서 앱을 설치하고 더 빠르게 접근할 수 있습니다.
        <br />
        Safari로 이동해 설치를 진행해주세요.
      </Description>

      <Button onClick={onOpenSafari}>
        <Globe size={20} />
        Safari로 열기
      </Button>
    </ModalContainer>
  );
};
