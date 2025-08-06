import React from "react";
import styled from "styled-components";
import { 
  Heart, 
  Zap, 
  Coffee, 
  Music, 
  Gamepad2, 
  Book, 
  Star, 
  Smile,
  Users,
  Camera,
  Tag
} from "lucide-react";
import type { ParticipantTrait } from "../../../types";
import { deviceDetection } from "../../../shared/utils/deviceDetection";

const Container = styled.div<{ $isMobile?: boolean }>`
  margin: ${({ $isMobile }) => ($isMobile ? "12px 0" : "16px 0")};
`;

const TraitList = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ $isMobile }) => ($isMobile ? "6px" : "8px")};
  align-items: center;
`;

const TraitTag = styled.div<{ $isMobile?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "4px" : "6px")};
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 500;
  line-height: 1.2;
`;

const TraitIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
`;

const EmptyState = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 16px")};
  background: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-style: italic;
`;

// 성향 아이콘 매핑 함수
const getTraitIcon = (label: string) => {
  const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    "친화적인": Heart,
    "음식 탐험가": Coffee,
    "활발한": Zap,
    "활동적인": Zap,
    "적극적인": Star,
    "사교적인": Users,
    "창의적인": Star,
    "음악 애호가": Music,
    "게임 애호가": Gamepad2,
    "독서 애호가": Book,
    "카메라": Camera,
    "웃음": Smile,
  };
  
  // 키워드로 매칭
  for (const [keyword, IconComponent] of Object.entries(iconMap)) {
    if (label.includes(keyword)) {
      return IconComponent;
    }
  }
  
  return Tag; // 기본 아이콘
};

interface TraitDisplayProps {
  traits?: ParticipantTrait[];
  maxDisplay?: number;
}

export const TraitDisplay: React.FC<TraitDisplayProps> = ({
  traits = [],
  maxDisplay = 3,
}) => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!traits || traits.length === 0) {
    return (
      <Container $isMobile={isMobile}>
        <EmptyState $isMobile={isMobile}>
          참여자 성향 제한 없음
        </EmptyState>
      </Container>
    );
  }

  const displayTraits = traits.slice(0, maxDisplay);
  const remainingCount = traits.length - maxDisplay;

  return (
    <Container $isMobile={isMobile}>
      <TraitList $isMobile={isMobile}>
        {displayTraits.map((trait) => {
          const IconComponent = getTraitIcon(trait.label);
          return (
            <TraitTag key={trait.id} $isMobile={isMobile}>
              <TraitIcon>
                <IconComponent size={isMobile ? 12 : 14} />
              </TraitIcon>
              {trait.label}
            </TraitTag>
          );
        })}
        {remainingCount > 0 && (
          <TraitTag $isMobile={isMobile}>
            +{remainingCount}개 더
          </TraitTag>
        )}
      </TraitList>
    </Container>
  );
};