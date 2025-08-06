import React from "react";
import styled from "styled-components";
import { Camera, AlertTriangle } from "lucide-react";
import type { MissionContentProps } from "../types";

const SectionTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    margin-left: 16px;
    height: 1px;
    background: ${({ theme }) => theme.colors.gray200};
    opacity: 0.5;
    width: calc(100% - ${({ $isMobile }) => ($isMobile ? "120px" : "140px")});
  }
`;

const DescriptionText = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0 0 32px 0;
`;

const GuideSection = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: 32px;
`;

const GuideText = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const GuideImages = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
`;

const GuideImagePlaceholder = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.gray200};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PlaceholderText = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '11px' : '12px')};
  font-weight: 500;
  text-align: center;
`;

const WarningSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.warning}10;
  border: 1px solid ${({ theme }) => theme.colors.warning}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: 32px;
`;

const WarningTitle = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.warning};
  margin-bottom: 12px;
`;

const WarningList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
`;

const WarningItem = styled.li<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MissionContent: React.FC<MissionContentProps> = ({
  mission,
  isMobile,
}) => {
  return (
    <>
      <SectionTitle $isMobile={isMobile}>미션 소개</SectionTitle>
      <DescriptionText $isMobile={isMobile}>
        {mission.description}
      </DescriptionText>

      {mission.context && (
        <GuideSection $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>인증 가이드</SectionTitle>
          <GuideText $isMobile={isMobile}>
            {mission.context.photoGuide}
          </GuideText>

          <GuideImages $isMobile={isMobile}>
            {[1, 2, 3].map((index) => (
              <GuideImagePlaceholder key={index} $isMobile={isMobile}>
                <Camera size={isMobile ? 24 : 28} />
                <PlaceholderText $isMobile={isMobile}>
                  샘플 이미지 {index}
                </PlaceholderText>
              </GuideImagePlaceholder>
            ))}
          </GuideImages>
        </GuideSection>
      )}

      {mission.warnings && mission.warnings.length > 0 && (
        <WarningSection $isMobile={isMobile}>
          <WarningTitle $isMobile={isMobile}>
            <AlertTriangle size={18} />
            주의사항
          </WarningTitle>
          <WarningList>
            {mission.warnings.map((warning) => (
              <WarningItem key={warning.id} $isMobile={isMobile}>
                {warning.content}
              </WarningItem>
            ))}
          </WarningList>
        </WarningSection>
      )}
    </>
  );
};