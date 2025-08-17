import React from "react";
import styled from "styled-components";
import { X, Zap, Users, ShoppingBag, MapPin } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  max-width: ${({ $isMobile }) => ($isMobile ? "90vw" : "500px")};
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const HelpSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  flex-shrink: 0;
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const FeatureDescription = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const InfoText = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  margin: 0 0 16px 0;
`;

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  isMobile = false,
}) => {
  const features = [
    {
      icon: Zap,
      title: "미션 찾기",
      description: "다양한 미션을 완료하고 포인트를 획득하세요",
    },
    {
      icon: Users,
      title: "모임 참여",
      description: "관심사가 같은 사람들과 번개모임에 참여하세요",
    },
    {
      icon: MapPin,
      title: "내 근처",
      description: "주변 지역의 활동과 모임을 찾아보세요",
    },
    {
      icon: ShoppingBag,
      title: "포인트 사용",
      description: "모은 포인트로 다양한 상품을 구매하세요",
    },
  ];

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent $isMobile={isMobile} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle $isMobile={isMobile}>서비스 안내</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <HelpSection>
          <SectionTitle $isMobile={isMobile}>1️⃣ 서비스 소개</SectionTitle>
          <InfoText $isMobile={isMobile}>
            `할사람`은 지역을 기반으로 새로운 사람들과 번개모임을 즐기고,
            <br />
            다양한 미션을 수행하며 포인트도 쌓을 수 있는 서비스입니다.
          </InfoText>
        </HelpSection>

        <HelpSection>
          <SectionTitle $isMobile={isMobile}>2️⃣ 주요 기능</SectionTitle>
          <FeatureList>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <FeatureItem key={index}>
                  <FeatureIcon>
                    <IconComponent size={16} />
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle $isMobile={isMobile}>
                      {feature.title}
                    </FeatureTitle>
                    <FeatureDescription $isMobile={isMobile}>
                      {feature.description}
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
              );
            })}
          </FeatureList>
        </HelpSection>

        <HelpSection>
          <SectionTitle $isMobile={isMobile}>3️⃣ 시작하기</SectionTitle>
          <InfoText $isMobile={isMobile}>
            홈 화면의 "빠른 실행" 메뉴를 통해 원하는 기능에 바로 접근할 수
            있습니다. <br />
            미션을 완료하고 모임에 참여하여 활발한 커뮤니티 활동을 즐겨보세요!
          </InfoText>
        </HelpSection>
      </ModalContent>
    </ModalOverlay>
  );
};
