import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import type { HostChecklistItem } from '../../types';
import { deviceDetection } from '../../../../shared/utils';
import {
  Container,
  SectionTitle,
  ChecklistList,
  ChecklistCard,
  ChecklistHeader,
  PriorityBadge,
  ChecklistTitle,
  ChecklistDescription,
  ChecklistMeta,
  MetaItem,
  MetaIcon,
  MetaText,
  ActionButton,
  ActionIcon,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from './HostChecklist.styles';

export interface HostChecklistProps {
  items: HostChecklistItem[];
  className?: string;
}

export const HostChecklist: React.FC<HostChecklistProps> = ({
  items,
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '긴급';
      case 'medium':
        return '중요';
      case 'low':
        return '일반';
      default:
        return priority;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={isMobile ? 14 : 16} />;
      case 'medium':
        return <Clock size={isMobile ? 14 : 16} />;
      case 'low':
        return <CheckCircle size={isMobile ? 14 : 16} />;
      default:
        return <Clock size={isMobile ? 14 : 16} />;
    }
  };

  const handleItemClick = (item: HostChecklistItem) => {
    navigate(`/meetings/${item.meetingId}`);
  };

  if (items.length === 0) {
    return (
      <Container className={className} $isMobile={isMobile}>
        <SectionTitle $isMobile={isMobile}>호스트 체크리스트</SectionTitle>
        <EmptyState $isMobile={isMobile}>
          <EmptyIcon>
            <CheckCircle size={isMobile ? 40 : 48} />
          </EmptyIcon>
          <EmptyText $isMobile={isMobile}>
            처리할 항목이 없습니다
          </EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container className={className} $isMobile={isMobile}>
      <SectionTitle $isMobile={isMobile}>호스트 체크리스트</SectionTitle>
      <ChecklistList>
        {items.map((item) => (
          <ChecklistCard 
            key={item.id} 
            $isMobile={isMobile}
            $priority={item.priority}
          >
            <ChecklistHeader>
              <PriorityBadge 
                $priority={item.priority}
                $isMobile={isMobile}
              >
                {getPriorityIcon(item.priority)}
                {getPriorityText(item.priority)}
              </PriorityBadge>
            </ChecklistHeader>
            
            <ChecklistTitle $isMobile={isMobile}>
              {item.title}
            </ChecklistTitle>
            
            <ChecklistDescription $isMobile={isMobile}>
              {item.description}
            </ChecklistDescription>
            
            <ChecklistMeta>
              {item.dueDate && (
                <MetaItem>
                  <MetaIcon>
                    <Clock size={isMobile ? 14 : 16} />
                  </MetaIcon>
                  <MetaText $isMobile={isMobile}>
                    {formatDate(item.dueDate)}
                  </MetaText>
                </MetaItem>
              )}
              
              <ActionButton
                $isMobile={isMobile}
                onClick={() => handleItemClick(item)}
              >
                <span>처리하기</span>
                <ActionIcon>
                  <ArrowRight size={isMobile ? 14 : 16} />
                </ActionIcon>
              </ActionButton>
            </ChecklistMeta>
          </ChecklistCard>
        ))}
      </ChecklistList>
    </Container>
  );
};