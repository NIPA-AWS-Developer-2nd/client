export interface Mission {
  id: string;
  title: string;
  description: string;
  participants: number;
  estimatedDuration: number;
  basePoints: number;
  difficulty: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';
  thumbnailUrl: string;
  location?: string;
  hashtags: string[];
  category?: {
    name: string;
  };
  district?: {
    name: string;
  };
}

export interface Meeting {
  id: string;
  scheduledAt: string;
  participants: number;
  status: 'recruiting' | 'active' | 'completed' | 'cancelled';
  introduction?: string;
  mission?: Mission;
  host?: {
    id: string;
  };
}

// HOT한 번개 모임 (좋아요 수 + 참가 인원 수 기준)
export interface HotMeeting {
  id: string;
  title: string;
  scheduledAt: string;
  location?: string;
  maxParticipants: number;
  currentParticipants: number;
  likesCount: number;
  hostName: string;
  host?: {
    id: string;
    nickname: string;
    profileImageUrl: string;
    level?: number;
    mbti?: string;
    bio?: string;
  };
  region?: {
    id: string;
    districtName: string;
    city: string;
  };
  participants?: {
    profileImageUrl: string;
  }[];
  mission?: {
    title: string;
    difficulty: string;
    basePoints: number;
    thumbnailUrl?: string;
  };
}

// 내 참여/완료 모임
export interface MyMeeting {
  id: string;
  title: string;
  status: 'recruiting' | 'ready' | 'active' | 'completed';
  scheduledAt: string;
  isHost: boolean;
  participantCount: number;
  mission?: {
    title: string;
    basePoints: number;
    thumbnailUrl?: string;
  };
}

// 활동 로그
export interface ActivityLog {
  id: string;
  userId: string;
  type: 'meeting_joined' | 'meeting_created' | 'meeting_started' | 'meeting_liked' | 'photo_verification_submitted' | 'photo_verification_approved' | 'photo_verification_rejected';
  meetingId?: string;
  relatedUserId?: string;
  createdAt: string;
  meeting?: {
    id: string;
    title: string;
  };
  relatedUser?: {
    id: string;
    profile?: {
      nickname: string;
    };
  };
}

export interface HomeData {
  availableMissions: Mission[];
  hotMeetings: HotMeeting[];
  myMeetings: MyMeeting[];
  activityLogs: ActivityLog[];
}

export interface GetHomeDataParams {
  limit?: number;
}

export interface HomeApiResponse {
  status: number;
  message: string;
  result: boolean;
  data: HomeData;
}

// 내 모임 상세 정보
export interface MyMeetingDetail {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  recruitUntil: string;
  status: "recruiting" | "ready" | "active" | "completed";
  introduction?: string;
  focusScore: number;
  maxParticipants: number;
  currentParticipants: number;
  mission?: {
    id: string;
    title: string;
    description: string;
    basePoints: number;
    difficulty: string;
    location?: string;
    thumbnailUrl: string;
    precautions: string[];
  };
  region?: {
    id: string;
    districtName: string;
    city: string;
  };
  host?: {
    id: string;
    nickname: string;
    profileImageUrl: string;
    level: number;
    mbti?: string;
    bio?: string;
  };
  participants: {
    id: string;
    nickname: string;
    profileImageUrl: string;
    level: number;
    mbti?: string;
    bio?: string;
    isHost: boolean;
    joinedAt: string;
  }[];
  chatRoomId?: string;
}

export interface MyMeetingDetailResponse {
  status: number;
  message: string;
  result: boolean;
  data: MyMeetingDetail;
}