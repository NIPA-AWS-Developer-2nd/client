import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { deviceDetection } from "../../../shared/utils/deviceDetection";
import { getAllMeetings, getMeetingsByMissionId } from "../../../data/meetings";

const Container = styled.div<{ $isMobile?: boolean }>`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "24px")};
`;

const Header = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: 24px;
`;

const Title = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const ContextBadge = styled.div<{ $isMobile?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 16px")};
  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const MeetingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MeetingCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const MeetingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const MeetingTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px 0;
`;

const MissionBadge = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}10;
  padding: 4px 8px;
  border-radius: 12px;
`;

const MeetingInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const InfoItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Description = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.gray100};
  padding: 2px 6px;
  border-radius: 8px;
`;

const EmptyState = styled.div<{ $isMobile?: boolean }>`
  text-align: center;
  padding: ${({ $isMobile }) => ($isMobile ? "40px 20px" : "60px 40px")};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const EmptyTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const EmptyDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 20px 0;
`;

const CreateButton = styled.button<{ $isMobile?: boolean }>`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.primary}dd
  );
  color: white;
  border: none;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 20px" : "14px 24px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary}dd,
      ${({ theme }) => theme.colors.primary}bb
    );
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const MeetingListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());

  const missionId = searchParams.get("missionId");

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // missionId 필터링
  const filteredMeetings = React.useMemo(() => {
    return missionId ? getMeetingsByMissionId(missionId) : getAllMeetings();
  }, [missionId]);

  const handleMeetingClick = (meetingId: string) => {
    navigate(`/meetings/${meetingId}`);
  };

  const handleRemoveFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("missionId");
    newSearchParams.delete("tags");
    setSearchParams(newSearchParams);
  };

  const handleCreateMeeting = () => {
    const createUrl = missionId
      ? `/meetings/new?missionId=${missionId}`
      : "/meetings/new";
    navigate(createUrl);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${month}/${day} ${hours}:${minutes}`;
  };

  // 미션별 필터링된 상태에서 모임이 없는 경우
  const showEmptyState = missionId && filteredMeetings.length === 0;

  return (
    <Container $isMobile={isMobile}>
      <Header $isMobile={isMobile}>
        <Title $isMobile={isMobile}>모임 찾기</Title>
        <Subtitle $isMobile={isMobile}>함께할 모임을 찾아보세요</Subtitle>
      </Header>

      <FilterSection>
        {missionId && (
          <ContextBadge $isMobile={isMobile}>
            🎯 미션: {filteredMeetings[0]?.missionTitle || "미션"}
            <CloseButton onClick={handleRemoveFilter}>×</CloseButton>
          </ContextBadge>
        )}
      </FilterSection>

      {showEmptyState ? (
        <EmptyState $isMobile={isMobile}>
          <EmptyTitle $isMobile={isMobile}>
            아직 개설된 모임이 없어요
          </EmptyTitle>
          <EmptyDescription $isMobile={isMobile}>
            이 미션의 첫 번째 모임을 만들어보세요!
          </EmptyDescription>
          <CreateButton $isMobile={isMobile} onClick={handleCreateMeeting}>
            모임 만들기
          </CreateButton>
        </EmptyState>
      ) : (
        <MeetingList>
          {filteredMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              $isMobile={isMobile}
              onClick={() => handleMeetingClick(meeting.id)}
            >
              <MeetingHeader>
                <div>
                  <MeetingTitle $isMobile={isMobile}>
                    {meeting.title}
                  </MeetingTitle>
                  <MissionBadge>{meeting.missionTitle}</MissionBadge>
                </div>
              </MeetingHeader>

              <MeetingInfo>
                <InfoItem>📅 {formatDateTime(meeting.startTime)}</InfoItem>
                <InfoItem>📍 {meeting.location}</InfoItem>
                {meeting.distance && <InfoItem>🚶 {meeting.distance}</InfoItem>}
                <InfoItem>
                  👥 {meeting.currentParticipants}/{meeting.maxParticipants}명
                </InfoItem>
                <InfoItem>👑 {meeting.hostName}</InfoItem>
              </MeetingInfo>

              <Description $isMobile={isMobile}>
                {meeting.description}
              </Description>

              <TagsContainer>
                {meeting.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagsContainer>
            </MeetingCard>
          ))}
        </MeetingList>
      )}
    </Container>
  );
};
