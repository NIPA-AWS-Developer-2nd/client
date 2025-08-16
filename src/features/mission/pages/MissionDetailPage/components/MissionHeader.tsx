import React from "react";
import styled from "styled-components";
import { Clock, Users, Star } from "lucide-react";
import type { MissionHeaderProps } from "../types";
import { MissionBadges } from "./MissionBadges";

const HeaderSection = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  width: 100%;
  height: ${({ $isMobile }) => ($isMobile ? "300px" : "400px")};
  overflow: hidden;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${({ theme }) =>
    theme.colors.background.primary === "#2D3748"
      ? "brightness(0.8) blur(0.5px)"
      : "none"};
  transition: filter 0.2s ease;
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
`;

const HeaderContent = styled.div<{ $isMobile?: boolean }>`
  position: absolute;
  bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "30px")};
  left: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  right: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  color: white;
  z-index: 2;
`;

const MissionTitle = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  font-weight: 700;
  color: white;
  margin: 0 0 20px 0;
  line-height: 1.2;
`;

const MissionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  margin-left: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const ClearOverlay = styled.div<{ $isMobile?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const ClearText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "48px" : "56px")};
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.25);
  letter-spacing: 4px;
  font-family: 'Helvetica Neue', 'Arial', sans-serif;
  text-transform: uppercase;
  line-height: 1;
`;

export const MissionHeader: React.FC<MissionHeaderProps> = ({
  mission,
  isMobile,
}) => {
  return (
    <HeaderSection $isMobile={isMobile}>
      <HeroImage
        src={mission.thumbnailUrl}
        alt={mission.title}
        loading="eager"
        onError={(e) => {
          console.log("Hero image failed to load:", mission.thumbnailUrl);
          e.currentTarget.style.background =
            "linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)";
        }}
      />
      <HeaderOverlay />
      
      {mission.isCompleted && (
        <ClearOverlay $isMobile={isMobile}>
          <ClearText $isMobile={isMobile}>CLEAR!</ClearText>
        </ClearOverlay>
      )}

      <HeaderContent $isMobile={isMobile}>
        <MissionBadges
          difficulty={mission.difficulty}
          categories={mission.category}
        />

        <MissionTitle $isMobile={isMobile}>{mission.title}</MissionTitle>

        <MissionMeta>
          <MetaItem>
            <Star size={16} />
            {mission.point}P
          </MetaItem>
          <MetaItem>
            <Clock size={16} />
            {mission.duration}분
          </MetaItem>
          <MetaItem>
            <Users size={16} />
            {mission.participants}명
          </MetaItem>
        </MissionMeta>
      </HeaderContent>
    </HeaderSection>
  );
};