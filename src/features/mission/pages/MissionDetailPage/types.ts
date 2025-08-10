import type { MissionWithDetails } from "../../../../shared/store/missionStore";

export interface MissionDetailPageProps {
  isMobile: boolean;
}

export interface MissionHeaderProps {
  mission: MissionWithDetails;
  isMobile: boolean;
}

export interface MissionBadgesProps {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  categories: string[];
  isMobile?: boolean;
}

export interface MissionContentProps {
  mission: MissionWithDetails;
  isMobile: boolean;
}

export interface MissionInfoProps {
  mission: MissionWithDetails;
  isMobile: boolean;
}

export interface MissionActionsProps {
  isMobile: boolean;
  onCreateMeeting: () => void;
  onSearchMeetings: () => void;
}