import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import type { MissionActionsProps } from "../types";
import missionGuideImage from "../../../../../assets/images/mission-guide.png";
import { meetingApiService } from "../../../../../shared/services";
import { MeetingMapper } from "../../../../../shared/services/meetingMapper";
import MeetingCard from "../../../../meeting/components/MeetingCard";
import MeetingCardSkeleton from "../../../../meeting/components/MeetingCardSkeleton";
import type { Meeting } from "../../../../../types";

const ActionSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "32px 24px")};
  position: relative;
  overflow: hidden;
`;

const ActionImage = styled.img<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "200px" : "250px")};
  height: auto;
  margin: 0 auto 20px;
  display: block;
  filter: ${({ theme }) =>
    theme.colors.background === "#2D3748"
      ? "brightness(0.8) blur(0.5px)"
      : "none"};
  transition: filter 0.2s ease;
`;

const ActionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
  text-align: center;
`;

const ActionDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 24px 0;
  line-height: 1.5;
  text-align: center;
`;

const ActionButtons = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  justify-content: center;
  ${({ $isMobile }) =>
    $isMobile &&
    `
    flex-direction: column;
  `}
`;

const MeetingGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ $isMobile }) => $isMobile ? '12px' : '16px'};
  margin: 24px 0;
`;

const ViewAllButton = styled.button<{ $isMobile?: boolean }>`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => $isMobile ? '14px' : '15px'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    border-color: ${({ theme }) => theme.colors.gray300};
  }
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

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const MissionActions: React.FC<MissionActionsProps> = ({
  isMobile,
  onCreateMeeting,
  onSearchMeetings,
}) => {
  const { id: missionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!missionId) return;
      
      setIsLoading(true);
      try {
        const response = await meetingApiService.getMeetings({
          missionId,
          size: 3, // 최대 3개만 표시
        });
        const convertedMeetings = MeetingMapper.toMeetings(response.meetings);
        setMeetings(convertedMeetings);
      } catch (error) {
        console.error('Failed to fetch meetings for mission:', error);
        setMeetings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [missionId]);

  const handleViewAllMeetings = () => {
    navigate(`/meetings?missionId=${missionId}`);
  };

  return (
    <ActionSection $isMobile={isMobile}>
      <ActionImage
        $isMobile={isMobile}
        src={missionGuideImage}
        alt="미션 가이드"
        loading="lazy"
        onError={(e) => {
          console.log("Guide image failed to load:", missionGuideImage);
          e.currentTarget.style.display = "none";
        }}
      />
      <ActionTitle $isMobile={isMobile}>
        이 미션, 함께 도전해볼까요?
      </ActionTitle>
      
      {/* 모임 목록 표시 */}
      {isLoading ? (
        <>
          <ActionDescription $isMobile={isMobile}>
            원하는 모임에 참여하거나, 직접 모임을 만들어 미션을 시작해보세요!
          </ActionDescription>
          <MeetingGrid $isMobile={isMobile}>
            {Array.from({ length: 3 }).map((_, index) => (
              <MeetingCardSkeleton key={`skeleton-${index}`} />
            ))}
          </MeetingGrid>
        </>
      ) : meetings.length > 0 ? (
        <>
          <ActionDescription $isMobile={isMobile}>
            원하는 모임에 참여하거나, 직접 모임을 만들어 미션을 시작해보세요!
          </ActionDescription>
          <MeetingGrid $isMobile={isMobile}>
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </MeetingGrid>
          <ViewAllButton $isMobile={isMobile} onClick={handleViewAllMeetings}>
            모든 모임 보기
          </ViewAllButton>
        </>
      ) : (
        <>
          <ActionDescription $isMobile={isMobile}>
            아직 개설된 번개모임이 없어요. 직접 모임을 만들어 미션을 시작해보세요!
          </ActionDescription>
          <ActionButtons $isMobile={isMobile} style={{ marginTop: '24px' }}>
            <ActionButton
              $isMobile={isMobile}
              $variant="primary"
              onClick={onCreateMeeting}
            >
              새 모임 만들기
            </ActionButton>
          </ActionButtons>
        </>
      )}

      {/* 기존 버튼들 (모임이 있을 때는 숨김) */}
      {!isLoading && meetings.length === 0 && (
        <div style={{ display: 'none' }}>
          <ActionButtons $isMobile={isMobile}>
            <ActionButton
              $isMobile={isMobile}
              $variant="secondary"
              onClick={onSearchMeetings}
            >
              참여할 모임 찾기
            </ActionButton>
            <ActionButton
              $isMobile={isMobile}
              $variant="primary"
              onClick={onCreateMeeting}
            >
              새 모임 만들기
            </ActionButton>
          </ActionButtons>
        </div>
      )}
    </ActionSection>
  );
};
