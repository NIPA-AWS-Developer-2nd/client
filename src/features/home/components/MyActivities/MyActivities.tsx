import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import type { UserActivity } from '../../types';
import { deviceDetection } from '../../../../shared/utils';
import {
  Container,
  SectionTitle,
  ActivityList,
  ActivityCard,
  ActivityHeader,
  ActivityTitle,
  ActivityStatus,
  ActivityContent,
  ActivityMeta,
  MetaItem,
  MetaIcon,
  MetaText,
  ActionButton,
  ActionIcon,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from './MyActivities.styles';

export interface MyActivitiesProps {
  activities: UserActivity[];
  className?: string;
}

export const MyActivities: React.FC<MyActivitiesProps> = ({
  activities,
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '참여중';
      case 'waiting':
        return '대기중';
      case 'hosting':
        return '참여중'; // hosting도 참여중으로 통일
      case 'completed':
        return '완료';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'waiting':
        return 'warning';
      case 'hosting':
        return 'success'; // hosting도 success 색상으로 통일
      case 'completed':
        return 'disabled';
      default:
        return 'disabled';
    }
  };

  const handleActivityClick = (activity: UserActivity) => {
    if (activity.type === 'mission') {
      navigate(`/missions/${activity.mission?.id}`);
    } else {
      navigate(`/meetings/${activity.meeting?.id}`);
    }
  };

  if (activities.length === 0) {
    return (
      <Container className={className} $isMobile={isMobile}>
        <SectionTitle $isMobile={isMobile}>내 활동</SectionTitle>
        <EmptyState $isMobile={isMobile}>
          <EmptyIcon>
            <CheckCircle size={isMobile ? 40 : 48} />
          </EmptyIcon>
          <EmptyText $isMobile={isMobile}>
            진행 중인 활동이 없습니다
          </EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container className={className} $isMobile={isMobile}>
      <SectionTitle $isMobile={isMobile}>내 활동</SectionTitle>
      <ActivityList>
        {activities.map((activity) => (
          <ActivityCard key={activity.id} $isMobile={isMobile}>
            <ActivityHeader>
              <ActivityTitle $isMobile={isMobile}>
                {activity.title}
              </ActivityTitle>
              <ActivityStatus 
                $color={getStatusColor(activity.status)}
                $isMobile={isMobile}
              >
                {getStatusText(activity.status)}
              </ActivityStatus>
            </ActivityHeader>
            
            <ActivityContent>
              <ActivityMeta>
                {activity.scheduledAt && (
                  <MetaItem>
                    <MetaIcon>
                      <Calendar size={isMobile ? 14 : 16} />
                    </MetaIcon>
                    <MetaText $isMobile={isMobile}>
                      {formatDate(activity.scheduledAt)}
                    </MetaText>
                  </MetaItem>
                )}
                
                {activity.nextAction && (
                  <MetaItem>
                    <MetaIcon>
                      <Clock size={isMobile ? 14 : 16} />
                    </MetaIcon>
                    <MetaText $isMobile={isMobile}>
                      {activity.nextAction}
                    </MetaText>
                  </MetaItem>
                )}
              </ActivityMeta>
              
              <ActionButton
                $isMobile={isMobile}
                onClick={() => handleActivityClick(activity)}
              >
                <span>상세보기</span>
                <ActionIcon>
                  <ArrowRight size={isMobile ? 14 : 16} />
                </ActionIcon>
              </ActionButton>
            </ActivityContent>
          </ActivityCard>
        ))}
      </ActivityList>
    </Container>
  );
};