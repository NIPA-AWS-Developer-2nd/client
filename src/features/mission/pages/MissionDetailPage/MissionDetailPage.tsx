import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  Camera,
  AlertTriangle,
  Star,
  Award,
  Timer,
  Image,
  UserCheck,
} from "lucide-react";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import { Loading } from "../../../../shared/components/ui/Loading";
import { useMissionStore } from "../../../../shared/store";
import { getCategoryLabel } from "../../../../data/categories";
import missionGuideImage from "../../../../assets/images/mission-guide.png";
import styled from "styled-components";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0;
  padding: 0;
  background: ${({ theme }) => theme.colors.background};
  min-height: ${({ $isMobile }) =>
    $isMobile ? "100vh" : "calc(100vh - 64px)"};
  ${({ $isMobile }) => $isMobile && `
    position: relative;
    overflow-x: hidden;
  `}
`;

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
    theme.colors.background === '#2D3748' ? 'brightness(0.8) blur(0.5px)' : 'none'
  };
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

const MissionBadges = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const DifficultyBadge = styled.div<{ $difficulty: string }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 12px;
  font-weight: 600;
  background: ${({ $difficulty }) => {
    switch ($difficulty) {
      case "EASY":
        return "#10B981";
      case "MEDIUM":
        return "#F59E0B";
      case "HARD":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  }};
  color: white;
`;

const CategoryBadge = styled.div`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 12px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  backdrop-filter: blur(8px);
`;

const ContentSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl}
    ${({ theme }) => theme.borderRadius.xl} 0 0;
  margin-top: -20px;
  position: relative;
  z-index: 1;
  padding: ${({ $isMobile }) => ($isMobile ? "24px 16px" : "50px 50px")};
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  ${({ $isMobile }) => $isMobile && `
    margin-left: 0;
    margin-right: 0;
    border-radius: 20px 20px 0 0;
  `}
`;

const SectionTitleStyled = styled.h2<{ $isMobile?: boolean }>`
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

const ActionSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "32px 24px")};
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const ActionImage = styled.img<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "200px" : "250px")};
  height: auto;
  margin: 0 auto 20px;
  display: block;
  filter: ${({ theme }) => 
    theme.colors.background === '#2D3748' ? 'brightness(0.8) blur(0.5px)' : 'none'
  };
  transition: filter 0.2s ease;
`;

const ActionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const ActionDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const ActionButtons = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  ${({ $isMobile }) =>
    $isMobile &&
    `
    flex-direction: column;
  `}
`;

const ActionButton = styled.button<{
  $isMobile?: boolean;
  $variant?: "primary" | "secondary";
}>`
  flex: 1;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 16px" : "12px 20px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  border: none;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary}dd);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, ${theme.colors.primary}dd, ${theme.colors.primary}bb);
    }
  `
      : `
    background: linear-gradient(135deg, ${theme.colors.gray50}, ${theme.colors.gray100});
    color: ${theme.colors.text.primary};
    
    &:hover {
      background: linear-gradient(135deg, ${theme.colors.gray100}, ${theme.colors.gray200});
    }
  `}

  &:active {
    transform: scale(0.98);
  }
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

const MetaItemStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
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

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case "EASY": return "쉬움";
    case "MEDIUM": return "보통";
    case "HARD": return "어려움";
    default: return "보통";
  }
};

export const MissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  
  const { 
    currentMission, 
    meetings, 
    isLoading, 
    fetchMissionDetails, 
    fetchMeetings 
  } = useMissionStore();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (id) {
      fetchMissionDetails(id);
      fetchMeetings(id);
    }
  }, [id, fetchMissionDetails, fetchMeetings]);

  const handleCreateMeeting = () => {
    navigate(`/meetings/create?missionId=${id}`);
  };

  const handleMeetingClick = (meetingId: string) => {
    navigate(`/meetings/${meetingId}`);
  };



  if (isLoading && !currentMission) {
    return (
      <PageContainer $isMobile={isMobile}>
        <Loading isMobile={isMobile} />
      </PageContainer>
    );
  }

  if (!currentMission) {
    return (
      <PageContainer $isMobile={isMobile}>
        <div>미션을 찾을 수 없습니다.</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer $isMobile={isMobile}>
      <HeaderSection $isMobile={isMobile}>
        <HeroImage 
          src={currentMission.thumbnailUrl} 
          alt={currentMission.title}
          loading="eager"
          onError={(e) => {
            console.log('Hero image failed to load:', currentMission.thumbnailUrl);
            e.currentTarget.style.background = 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)';
          }}
        />
        <HeaderOverlay />

        <HeaderContent $isMobile={isMobile}>
          <MissionBadges>
            <DifficultyBadge $difficulty={currentMission.difficulty}>
              {getDifficultyText(currentMission.difficulty)}
            </DifficultyBadge>
            {currentMission.category.map((cat, index) => (
              <CategoryBadge key={index}>{getCategoryLabel(cat)}</CategoryBadge>
            ))}
          </MissionBadges>

          <MissionTitle $isMobile={isMobile}>{currentMission.title}</MissionTitle>

          <MissionMeta>
            <MetaItemStyled>
              <Star size={16} />
              {currentMission.point}P
            </MetaItemStyled>
            <MetaItemStyled>
              <Clock size={16} />
              {currentMission.duration}분
            </MetaItemStyled>
            <MetaItemStyled>
              <Users size={16} />
              {currentMission.minParticipants}-{currentMission.maxParticipants}명
            </MetaItemStyled>
          </MissionMeta>
        </HeaderContent>
      </HeaderSection>

      <ContentSection $isMobile={isMobile}>
        <SectionTitleStyled $isMobile={isMobile}>미션 소개</SectionTitleStyled>
        <DescriptionText $isMobile={isMobile}>
          {currentMission.description}
        </DescriptionText>

        {currentMission.context && (
          <GuideSection $isMobile={isMobile}>
            <SectionTitleStyled $isMobile={isMobile}>인증 가이드</SectionTitleStyled>
            <GuideText $isMobile={isMobile}>
              {currentMission.context.photoGuide}
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

        {currentMission.warnings && currentMission.warnings.length > 0 && (
          <WarningSection $isMobile={isMobile}>
            <WarningTitle $isMobile={isMobile}>
              <AlertTriangle size={18} />
              주의사항
            </WarningTitle>
            <WarningList>
              {currentMission.warnings.map((warning) => (
                <WarningItem key={warning.id} $isMobile={isMobile}>
                  {warning.content}
                </WarningItem>
              ))}
            </WarningList>
          </WarningSection>
        )}

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
              <InfoValue $isMobile={isMobile}>{currentMission.point}P</InfoValue>
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
                {currentMission.duration}분
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
                {currentMission.minDuration}분
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
                {currentMission.minPhotoCount}장 이상
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
                {currentMission.minParticipants}-{currentMission.maxParticipants}명
              </InfoValue>
            </InfoRow>
          </InfoGrid>
        </InfoSection>

        <ActionSection $isMobile={isMobile}>
          <ActionImage
            $isMobile={isMobile}
            src={missionGuideImage}
            alt="미션 가이드"
            loading="lazy"
            onError={(e) => {
              console.log('Guide image failed to load:', missionGuideImage);
              e.currentTarget.style.display = 'none';
            }}
          />
          <ActionTitle $isMobile={isMobile}>
            이 미션, 함께 도전해볼까요?
          </ActionTitle>
          <ActionDescription $isMobile={isMobile}>
            원하는 모임에 참여하거나, 직접 모임을 만들어 미션을 시작해보세요!
          </ActionDescription>

          <ActionButtons $isMobile={isMobile}>
            <ActionButton
              $isMobile={isMobile}
              $variant="secondary"
              onClick={() => {
                if (meetings.length > 0) {
                  handleMeetingClick(meetings[0].id);
                } else {
                  alert("참여 가능한 모임이 없습니다.");
                }
              }}
            >
              참여할 모임 찾기
            </ActionButton>
            <ActionButton
              $isMobile={isMobile}
              $variant="primary"
              onClick={handleCreateMeeting}
            >
              새 모임 만들기
            </ActionButton>
          </ActionButtons>
        </ActionSection>
      </ContentSection>

    </PageContainer>
  );
};