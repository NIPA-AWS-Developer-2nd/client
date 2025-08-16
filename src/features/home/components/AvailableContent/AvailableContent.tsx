import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Zap } from 'lucide-react';
import type { Mission, Meeting } from '../../types';
import { deviceDetection } from '../../../../shared/utils';
import {
  Container,
  SectionTitle,
  ContentGrid,
  ContentCard,
  ContentImage,
  ContentInfo,
  ContentTitle,
  ContentMeta,
  MetaItem,
  MetaIcon,
  MetaText,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from './AvailableContent.styles';

export interface AvailableContentProps {
  missions: Mission[];
  meetings: Meeting[];
  className?: string;
}

export const AvailableContent: React.FC<AvailableContentProps> = ({
  missions,
  meetings,
  className,
}) => {
  const navigate = useNavigate();
  const [isMobile] = React.useState(deviceDetection.isMobile());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMissionClick = (missionId: string) => {
    navigate(`/missions/${missionId}`);
  };

  const handleMeetingClick = (meetingId: string) => {
    navigate(`/meetings/${meetingId}`);
  };

  const hasContent = missions.length > 0 || meetings.length > 0;

  if (!hasContent) {
    return (
      <Container className={className} $isMobile={isMobile}>
        <SectionTitle $isMobile={isMobile}>지금 할 수 있는 것들</SectionTitle>
        <EmptyState $isMobile={isMobile}>
          <EmptyIcon>
            <Zap size={isMobile ? 40 : 48} />
          </EmptyIcon>
          <EmptyText $isMobile={isMobile}>
            현재 참여할 수 있는 미션이나 모임이 없습니다
          </EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container className={className} $isMobile={isMobile}>
      <SectionTitle $isMobile={isMobile}>지금 할 수 있는 것들</SectionTitle>
      <ContentGrid $isMobile={isMobile}>
        {missions.map((mission) => (
          <ContentCard
            key={mission.id}
            $isMobile={isMobile}
            onClick={() => handleMissionClick(mission.id)}
          >
            <ContentImage src={mission.thumbnailUrl} alt={mission.title} />
            <ContentInfo>
              <ContentTitle $isMobile={isMobile}>{mission.title}</ContentTitle>
              <ContentMeta>
                <MetaItem>
                  <MetaIcon>
                    <Users size={isMobile ? 12 : 14} />
                  </MetaIcon>
                  <MetaText $isMobile={isMobile}>
                    {mission.participants}명
                  </MetaText>
                </MetaItem>
                <MetaItem>
                  <MetaIcon>
                    <Zap size={isMobile ? 12 : 14} />
                  </MetaIcon>
                  <MetaText $isMobile={isMobile}>
                    {mission.basePoints}P
                  </MetaText>
                </MetaItem>
                {mission.location && (
                  <MetaItem>
                    <MetaIcon>
                      <MapPin size={isMobile ? 12 : 14} />
                    </MetaIcon>
                    <MetaText $isMobile={isMobile}>
                      {mission.location}
                    </MetaText>
                  </MetaItem>
                )}
              </ContentMeta>
            </ContentInfo>
          </ContentCard>
        ))}
        
        {meetings.map((meeting) => (
          <ContentCard
            key={meeting.id}
            $isMobile={isMobile}
            onClick={() => handleMeetingClick(meeting.id)}
          >
            <ContentImage 
              src={meeting.mission?.thumbnailUrl || '/default-meeting.jpg'} 
              alt={meeting.mission?.title || '모임'}
            />
            <ContentInfo>
              <ContentTitle $isMobile={isMobile}>
                {meeting.mission?.title || '모임'}
              </ContentTitle>
              <ContentMeta>
                <MetaItem>
                  <MetaIcon>
                    <Calendar size={isMobile ? 12 : 14} />
                  </MetaIcon>
                  <MetaText $isMobile={isMobile}>
                    {formatDate(meeting.scheduledAt)}
                  </MetaText>
                </MetaItem>
                <MetaItem>
                  <MetaIcon>
                    <Users size={isMobile ? 12 : 14} />
                  </MetaIcon>
                  <MetaText $isMobile={isMobile}>
                    {meeting.participants}명 모집
                  </MetaText>
                </MetaItem>
                {meeting.mission?.basePoints && (
                  <MetaItem>
                    <MetaIcon>
                      <Zap size={isMobile ? 12 : 14} />
                    </MetaIcon>
                    <MetaText $isMobile={isMobile}>
                      {meeting.mission.basePoints}P
                    </MetaText>
                  </MetaItem>
                )}
              </ContentMeta>
            </ContentInfo>
          </ContentCard>
        ))}
      </ContentGrid>
    </Container>
  );
};