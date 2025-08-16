export type {
  Mission,
  Meeting,
  HotMeeting,
  MyMeeting,
  ActivityLog,
  HomeData,
  GetHomeDataParams,
  HomeApiResponse,
  MyMeetingDetail,
  MyMeetingDetailResponse,
} from './home.types';

// Additional types that may be needed
export interface UserMode {
  mode: 'find' | 'host';
}

export interface HostChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'error';
  priority: 'high' | 'medium' | 'low';
  meetingId?: string;
  dueDate?: string;
}

export interface UserActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  status: string;
  title?: string;
  scheduledAt?: string;
  nextAction?: string;
  mission?: {
    id: string;
    title: string;
  };
  meeting?: {
    id: string;
    title: string;
  };
}