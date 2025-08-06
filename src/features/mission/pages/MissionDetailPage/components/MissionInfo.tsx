import React from "react";
import styled from "styled-components";
import { Award, Clock, Timer, Image, UserCheck } from "lucide-react";
import type { MissionInfoProps } from "../types";

const InfoSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 20px" : "24px 28px")};
  margin-bottom: 32px;
`;

const InfoTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 20px 0;
`;

const InfoGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  padding: 0 ${({ $isMobile }) => ($isMobile ? "12px" : "12px")};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  position: relative;
`;

const InfoLabel = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  z-index: 1;
  background: ${({ theme }) => theme.colors.gray50};
  padding-right: 8px;
`;

const InfoValue = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  z-index: 1;
  background: ${({ theme }) => theme.colors.gray50};
  padding-left: 8px;
`;

const DottedLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-image: radial-gradient(
    circle,
    ${({ theme }) => theme.colors.gray400} 1px,
    transparent 1px
  );
  background-size: 8px 1px;
  background-repeat: repeat-x;
  z-index: 0;
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const MissionInfo: React.FC<MissionInfoProps> = ({
  mission,
  isMobile,
}) => {
  return (
    <InfoSection $isMobile={isMobile}>
      <InfoTitle $isMobile={isMobile}>미션 요약</InfoTitle>
      <InfoGrid $isMobile={isMobile}>
        <InfoRow>
          <DottedLine />
          <InfoLabel $isMobile={isMobile}>
            <InfoIcon>
              <Award size={16} />
            </InfoIcon>
            획득 포인트
          </InfoLabel>
          <InfoValue $isMobile={isMobile}>{mission.point}P</InfoValue>
        </InfoRow>
        <InfoRow>
          <DottedLine />
          <InfoLabel $isMobile={isMobile}>
            <InfoIcon>
              <Clock size={16} />
            </InfoIcon>
            예상 소요시간
          </InfoLabel>
          <InfoValue $isMobile={isMobile}>
            {mission.duration}분
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <DottedLine />
          <InfoLabel $isMobile={isMobile}>
            <InfoIcon>
              <Timer size={16} />
            </InfoIcon>
            최소 참여시간
          </InfoLabel>
          <InfoValue $isMobile={isMobile}>
            {mission.minDuration}분
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <DottedLine />
          <InfoLabel $isMobile={isMobile}>
            <InfoIcon>
              <Image size={16} />
            </InfoIcon>
            업로드 사진 수
          </InfoLabel>
          <InfoValue $isMobile={isMobile}>
            {mission.minPhotoCount}장 이상
          </InfoValue>
        </InfoRow>
        <InfoRow>
          <DottedLine />
          <InfoLabel $isMobile={isMobile}>
            <InfoIcon>
              <UserCheck size={16} />
            </InfoIcon>
            참여 인원
          </InfoLabel>
          <InfoValue $isMobile={isMobile}>
            {mission.minParticipants}-{mission.maxParticipants}명
          </InfoValue>
        </InfoRow>
      </InfoGrid>
    </InfoSection>
  );
};