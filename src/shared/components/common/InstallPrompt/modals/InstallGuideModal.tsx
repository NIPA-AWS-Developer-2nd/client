import React from "react";
import styled from "styled-components";
import { X, Smartphone, Share, Plus } from "lucide-react";

const ModalOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  display: ${({ $show }) => ($show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;

  &:hover {
    background: #f5f5f5;
  }
`;

const StepContainer = styled.div`
  margin-bottom: 16px;
`;

const StepNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme?.colors?.primary || "#007bff"};
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
`;

const StepContent = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const StepText = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
`;

const IconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f8f9fa;
  padding: 4px 6px;
  border-radius: 6px;
  margin: 0 4px;
`;

const HighlightText = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.primary || "#007bff"};
`;

interface InstallGuideModalProps {
  show: boolean;
  platform: "ios" | "macos-desktop";
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  show,
  platform,
  onClose,
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderIOSGuide = () => (
    <>
      <StepContent>
        <StepNumber>1</StepNumber>
        <StepText>
          화면 하단의
          <IconContainer>
            <Share size={16} />
          </IconContainer>
          <HighlightText>공유</HighlightText> 버튼을 눌러주세요
        </StepText>
      </StepContent>
      <StepContent>
        <StepNumber>2</StepNumber>
        <StepText>
          메뉴에서
          <IconContainer>
            <Plus size={16} />
          </IconContainer>
          <HighlightText>홈 화면에 추가</HighlightText>를 선택해주세요
        </StepText>
      </StepContent>
      <StepContent>
        <StepNumber>3</StepNumber>
        <StepText>
          오른쪽 상단의 <HighlightText>추가</HighlightText> 버튼을 눌러
          완료해주세요
        </StepText>
      </StepContent>
    </>
  );

  const renderMacOSGuide = () => (
    <>
      <StepContent>
        <StepNumber>1</StepNumber>
        <StepText>
          브라우저 주소창 오른쪽의
          <IconContainer>
            <Share size={16} />
          </IconContainer>
          <HighlightText>공유</HighlightText> 버튼을 클릭하세요
        </StepText>
      </StepContent>
      <StepContent>
        <StepNumber>2</StepNumber>
        <StepText>
          드롭다운 메뉴에서
          <HighlightText> Dock에 추가</HighlightText>를 선택하세요
        </StepText>
      </StepContent>
      <StepContent>
        <StepNumber>3</StepNumber>
        <StepText>
          앱 이름을 확인하고 <HighlightText>추가</HighlightText> 버튼을 클릭하여
          완료하세요
        </StepText>
      </StepContent>
    </>
  );

  return (
    <ModalOverlay $show={show} onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <Smartphone
              size={20}
              style={{ marginRight: "8px", verticalAlign: "middle" }}
            />
            앱 설치 방법
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <StepContainer>
          {platform === "ios" && renderIOSGuide()}
          {platform === "macos-desktop" && renderMacOSGuide()}
        </StepContainer>
      </ModalContent>
    </ModalOverlay>
  );
};
