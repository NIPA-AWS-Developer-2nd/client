import React from "react";
import styled from "styled-components";
import { X } from "lucide-react";

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContainer = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: ${({ $isMobile }) => ($isMobile ? "90vw" : "500px")};
  max-height: ${({ $isMobile }) => ($isMobile ? "80vh" : "70vh")};
  overflow: hidden;
  position: relative;
`;

const ModalHeader = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 20px" : "20px 24px")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.gray50};
`;

const ModalTitle = styled.h2<{ $isMobile?: boolean }>`
  margin: 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
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
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ModalContent = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  overflow-y: auto;
  max-height: ${({ $isMobile }) => ($isMobile ? "60vh" : "50vh")};

  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray400};
  }
`;

const InfoSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3<{ $isMobile?: boolean }>`
  margin: 0 0 12px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: none;

  li {
    position: relative;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text.secondary};

    &:before {
      content: "•";
      position: absolute;
      left: -16px;
      color: ${({ theme }) => theme.colors.gray600};
      font-weight: bold;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const InfoText = styled.p<{ $isMobile?: boolean }>`
  margin: 0 0 16px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:last-child {
    margin-bottom: 0;
  }
`;


interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "version" | "privacy";
  isMobile?: boolean;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  type,
  isMobile = false,
}) => {
  // 모달 외부 클릭시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 키로 닫기
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // 배경 스크롤 방지
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const renderVersionContent = () => {
    const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';
    
    return (
    <>
      <InfoSection>
        <SectionTitle $isMobile={isMobile}>앱 버전</SectionTitle>
        <InfoText $isMobile={isMobile} style={{fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px'}}>
          v{appVersion}
        </InfoText>
        
        <InfoList>
          <li>빌드 날짜: 2024.01.31</li>
          <li>개발팀: Halsaram Team</li>
          <li>지원: 송파구 지역 기반 번개모임 서비스</li>
        </InfoList>
      </InfoSection>

      <InfoSection>
        <SectionTitle $isMobile={isMobile}>기술 스택</SectionTitle>
        <InfoList>
          <li>React 19 + TypeScript</li>
          <li>Styled Components (CSS-in-JS)</li>
          <li>PWA (Progressive Web App)</li>
          <li>Vite (Build Tool)</li>
          <li>React Router v7</li>
          <li>Zustand (State Management)</li>
        </InfoList>
      </InfoSection>

      <InfoSection>
        <SectionTitle $isMobile={isMobile}>주요 기능</SectionTitle>
        <InfoList>
          <li>번개모임 생성 및 참여</li>
          <li>미션 수행으로 포인트 획득</li>
          <li>포인트 마켓에서 상품 구매</li>
          <li>지역 기반 매칭 시스템</li>
          <li>PWA로 앱처럼 설치 가능</li>
        </InfoList>
      </InfoSection>
    </>
    );
  };

  const renderPrivacyContent = () => (
    <>
      <InfoSection>
        <SectionTitle $isMobile={isMobile}>📊 수집하는 정보</SectionTitle>
        <InfoList>
          <li>앱 사용 통계 (익명화된 데이터)</li>
          <li>오류 및 크래시 리포트</li>
          <li>성능 개선을 위한 사용 패턴</li>
          <li>기기 정보 (모델, OS 버전 등)</li>
        </InfoList>
      </InfoSection>

      <InfoSection>
        <SectionTitle $isMobile={isMobile}>🔒 개인정보 보호</SectionTitle>
        <InfoList>
          <li>개인 식별 정보는 절대 수집하지 않습니다</li>
          <li>모든 데이터는 암호화되어 전송됩니다</li>
          <li>수집된 데이터는 서비스 개선 목적으로만 사용</li>
          <li>언제든지 설정에서 데이터 수집을 비활성화 가능</li>
        </InfoList>
      </InfoSection>

      <InfoSection>
        <SectionTitle $isMobile={isMobile}>⚖️ 법적 근거</SectionTitle>
        <InfoText $isMobile={isMobile}>
          개인정보보호법 및 정보통신망법에 따라 최소한의 데이터만 수집하며,
          사용자의 동의 하에 서비스 품질 향상을 위해서만 활용됩니다.
        </InfoText>
        <InfoText $isMobile={isMobile}>
          데이터 수집에 대한 자세한 내용은 개인정보처리방침을 참고해주세요.
        </InfoText>
      </InfoSection>
    </>
  );

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer $isMobile={isMobile}>
        <ModalHeader $isMobile={isMobile}>
          <ModalTitle $isMobile={isMobile}>
            {type === "version" ? "앱 버전 정보" : "정보수집 및 개인정보 보호"}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </ModalHeader>
        <ModalContent $isMobile={isMobile}>
          {type === "version" ? renderVersionContent() : renderPrivacyContent()}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};