import React from "react";
import styled from "styled-components";
import { X, Chrome, Search, Menu, AlertTriangle } from "lucide-react";

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

const GuideContainer = styled.div`
  margin-bottom: 16px;
`;

const StepContent = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
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

const StepText = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
`;

const HighlightText = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.primary || "#007bff"};
`;

const IconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 6px;
  margin: 0 4px;
`;

const WarningContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const WarningIcon = styled.div`
  color: #856404;
  flex-shrink: 0;
`;

const WarningText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #856404;
  line-height: 1.4;
`;

interface BrowserInstallGuideProps {
  show: boolean;
  browser: "chrome" | "edge" | "firefox";
  onClose: () => void;
}

export const BrowserInstallGuide: React.FC<BrowserInstallGuideProps> = ({
  show,
  browser,
  onClose,
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderChromeGuide = () => (
    <>
      <StepContent>
        <StepNumber>1</StepNumber>
        <StepText>
          주소창 오른쪽의
          <IconContainer>
            <Search size={16} />
          </IconContainer>
          <HighlightText>설치</HighlightText> 아이콘을 클릭하세요
        </StepText>
      </StepContent>
      <StepContent>
        <StepNumber>2</StepNumber>
        <StepText>
          앱 설치 팝업에서 <HighlightText>설치</HighlightText> 버튼을 클릭하세요
        </StepText>
      </StepContent>
    </>
  );

  const renderEdgeGuide = () => (
    <>
      <StepContent>
        <StepNumber>1</StepNumber>
        <StepText>
          브라우저 오른쪽 상단의
          <IconContainer>
            <Menu size={16} />
          </IconContainer>
          <HighlightText>메뉴</HighlightText> 버튼을 클릭하세요
        </StepText>
      </StepContent>
      <StepContent>
        <StepNumber>2</StepNumber>
        <StepText>
          메뉴에서 <HighlightText>앱</HighlightText> →{" "}
          <HighlightText>"이 사이트를 앱으로 설치"</HighlightText>를 선택하세요
        </StepText>
      </StepContent>
      <StepContent>
        <StepNumber>3</StepNumber>
        <StepText>
          앱 이름을 확인하고 <HighlightText>"설치"</HighlightText> 버튼을
          클릭하세요
        </StepText>
      </StepContent>
    </>
  );

  const renderFirefoxGuide = () => (
    <WarningContainer>
      <WarningIcon>
        <AlertTriangle size={20} />
      </WarningIcon>
      <WarningText>
        Firefox는 PWA 설치를 지원하지 않습니다.
        <br />더 나은 앱 경험을 위해
        <HighlightText>Safari, Chrome 또는 Edge</HighlightText> 브라우저를
        사용해주세요.
      </WarningText>
    </WarningContainer>
  );

  const getBrowserName = () => {
    switch (browser) {
      case "chrome":
        return "Chrome";
      case "edge":
        return "Edge";
      case "firefox":
        return "Firefox";
      default:
        return "브라우저";
    }
  };

  const getBrowserIcon = () => {
    switch (browser) {
      case "chrome":
        return <Chrome size={20} />;
      case "edge":
        return <Search size={20} />;
      case "firefox":
        return <AlertTriangle size={20} />;
      default:
        return <Search size={20} />;
    }
  };

  return (
    <ModalOverlay $show={show} onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {getBrowserIcon()}
            <span style={{ marginLeft: "8px" }}>
              {getBrowserName()}에서 앱 설치
            </span>
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <GuideContainer>
          {browser === "chrome" && renderChromeGuide()}
          {browser === "edge" && renderEdgeGuide()}
          {browser === "firefox" && renderFirefoxGuide()}
        </GuideContainer>
      </ModalContent>
    </ModalOverlay>
  );
};
