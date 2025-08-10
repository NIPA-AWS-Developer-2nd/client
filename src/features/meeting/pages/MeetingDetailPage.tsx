import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { deviceDetection } from "../../../shared/utils/deviceDetection";
import { Clock, MapPin, Users, User, Calendar, ArrowLeft } from "lucide-react";
import { getMeetingById } from "../../../data/meetings";
import type { MeetingDetail } from "../../../data/meetings";

const Container = styled.div<{ $isMobile?: boolean }>`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div<{ $isMobile?: boolean }>`
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ $isMobile }) => ($isMobile ? "12px 16px" : "16px 24px")};
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }
`;

const HeaderTitle = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Content = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) =>
    $isMobile ? "20px 16px 100px" : "24px 20px 40px"};
`;

const MissionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
`;

const Title = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
  line-height: 1.3;
`;

const InfoGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "1fr" : "repeat(2, 1fr)"};
  gap: 12px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const InfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
`;

const Description = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
`;

const HostCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HostAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.primary}20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const HostInfo = styled.div`
  flex: 1;
`;

const HostName = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const TrustScore = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ParticipantChip = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RequirementsList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

const RequirementItem = styled.li<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

const BottomBar = styled.div<{ $isMobile?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  z-index: 100;
`;

const ParticipateButton = styled.button<{
  $isMobile?: boolean;
  $isParticipating?: boolean;
  $disabled?: boolean;
}>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  ${({ $isParticipating, $disabled, theme }) => {
    if ($disabled) {
      return `
        background: ${theme.colors.gray200};
        color: ${theme.colors.gray400};
      `;
    }

    if ($isParticipating) {
      return `
        background: ${theme.colors.gray100};
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.border};
        
        &:hover {
          background: ${theme.colors.gray200};
        }
      `;
    }

    return `
      background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary}dd);
      color: white;
      
      &:hover {
        background: linear-gradient(135deg, ${theme.colors.primary}dd, ${theme.colors.primary}bb);
      }
      
      &:active {
        transform: scale(0.98);
      }
    `;
  }}
`;

export const MeetingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [meeting, setMeeting] = React.useState<MeetingDetail | null>(null);
  const [isParticipating, setIsParticipating] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (id) {
      const meetingData = getMeetingById(id);
      if (meetingData) {
        setMeeting(meetingData);
        setIsParticipating(meetingData.isParticipating);
      } else {
        // 모임을 찾을 수 없는 경우
        navigate("/meetings", { replace: true });
      }
    }
  }, [id, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleParticipate = async () => {
    try {
      // 실제 API 호출
      // await participateInMeeting(id);

      console.log(`참여하기: ${id}`);
      setIsParticipating(true);

      // 참여자 수 증가
      setMeeting((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentParticipants: prev.currentParticipants + 1,
          isParticipating: true,
        };
      });

      alert("모임에 참여했습니다!");
    } catch (error) {
      console.error("참여 실패:", error);
      alert("참여에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleLeave = async () => {
    try {
      // 실제 API 호출
      // await leaveMeeting(id);

      console.log(`나가기: ${id}`);
      setIsParticipating(false);

      // 참여자 수 감소
      setMeeting((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentParticipants: prev.currentParticipants - 1,
          isParticipating: false,
        };
      });

      alert("모임에서 나왔습니다.");
    } catch (error) {
      console.error("나가기 실패:", error);
      alert("나가기에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 로딩 상태 처리
  if (!meeting) {
    return (
      <Container $isMobile={isMobile}>
        <Header $isMobile={isMobile}>
          <BackButton onClick={handleBack}>
            <ArrowLeft size={20} />
          </BackButton>
          <HeaderTitle $isMobile={isMobile}>모임 상세</HeaderTitle>
        </Header>
        <Content $isMobile={isMobile}>
          <div>로딩 중...</div>
        </Content>
      </Container>
    );
  }

  const isFull = meeting.currentParticipants >= meeting.maxParticipants;
  const canParticipate = meeting.canParticipate && !isFull && !isParticipating;

  return (
    <Container $isMobile={isMobile}>
      <Header $isMobile={isMobile}>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={20} />
        </BackButton>
        <HeaderTitle $isMobile={isMobile}>모임 상세</HeaderTitle>
      </Header>

      <Content $isMobile={isMobile}>
        <MissionBadge>🎯 {meeting.missionTitle}</MissionBadge>

        <Title $isMobile={isMobile}>{meeting.title}</Title>

        <InfoGrid $isMobile={isMobile}>
          <InfoItem>
            <InfoIcon>
              <Calendar size={16} />
            </InfoIcon>
            {formatDateTime(meeting.startTime)}
          </InfoItem>
          <InfoItem>
            <InfoIcon>
              <Clock size={16} />
            </InfoIcon>
            약{" "}
            {Math.ceil(
              (new Date(meeting.endTime).getTime() -
                new Date(meeting.startTime).getTime()) /
                (1000 * 60 * 60)
            )}
            시간
          </InfoItem>
          <InfoItem>
            <InfoIcon>
              <MapPin size={16} />
            </InfoIcon>
            {meeting.location}
          </InfoItem>
          <InfoItem>
            <InfoIcon>
              <Users size={16} />
            </InfoIcon>
            {meeting.currentParticipants}/{meeting.maxParticipants}명 참여
          </InfoItem>
        </InfoGrid>

        <Section>
          <SectionTitle $isMobile={isMobile}>모임 소개</SectionTitle>
          <Description $isMobile={isMobile}>{meeting.description}</Description>
        </Section>

        <Section>
          <SectionTitle $isMobile={isMobile}>모임장</SectionTitle>
          <HostCard $isMobile={isMobile}>
            <HostAvatar>
              <User size={24} />
            </HostAvatar>
            <HostInfo>
              <HostName $isMobile={isMobile}>{meeting.host.name}</HostName>
              <TrustScore>
                ⭐ {meeting.host.trustScore} · 신뢰도 높음
              </TrustScore>
            </HostInfo>
          </HostCard>
        </Section>

        <Section>
          <SectionTitle $isMobile={isMobile}>
            참여자 ({meeting.currentParticipants}명)
          </SectionTitle>
          <ParticipantsList>
            {meeting.participants.map((participant) => (
              <ParticipantChip key={participant.id}>
                {participant.name}
              </ParticipantChip>
            ))}
          </ParticipantsList>
        </Section>

        <Section>
          <SectionTitle $isMobile={isMobile}>준비사항</SectionTitle>
          <RequirementsList>
            {meeting.requirements.map((requirement, index) => (
              <RequirementItem key={index} $isMobile={isMobile}>
                {requirement}
              </RequirementItem>
            ))}
          </RequirementsList>
        </Section>

        <Section>
          <SectionTitle $isMobile={isMobile}>태그</SectionTitle>
          <TagsContainer>
            {meeting.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsContainer>
        </Section>
      </Content>

      <BottomBar $isMobile={isMobile}>
        {isParticipating ? (
          <ParticipateButton
            $isMobile={isMobile}
            $isParticipating={true}
            onClick={handleLeave}
          >
            참여 취소하기
          </ParticipateButton>
        ) : (
          <ParticipateButton
            $isMobile={isMobile}
            $disabled={!canParticipate}
            onClick={handleParticipate}
            disabled={!canParticipate}
          >
            {isFull ? "모임이 가득참" : "참여하기"}
          </ParticipateButton>
        )}
      </BottomBar>
    </Container>
  );
};
