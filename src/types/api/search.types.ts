// 검색 API 타입 정의

// 미션 검색 요청
export interface SearchMissionsRequest {
  category?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  minDuration?: number;
  maxDuration?: number;
  minParticipants?: number;
  participants?: number;
  minPoints?: number;
  maxPoints?: number;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: 'latest' | 'popular' | 'points';
}

// 모임 검색 요청
export interface SearchMeetingsRequest {
  // 날짜/시간 필터
  fromDate?: string; // ISO 8601
  toDate?: string;
  
  // 위치 필터
  latitude?: number;
  longitude?: number;
  maxDistance?: number; // km
  district?: string;
  
  // 좌석 필터
  minAvailableSeats?: number;
  
  // 분위기 필터
  minFocusScore?: number; // 0-100
  maxFocusScore?: number;
  
  // 미션 관련 필터 (보조)
  missionId?: string;
  category?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  
  // 기타
  status?: 'recruiting' | 'active' | 'completed';
  hostUserId?: string;
  keyword?: string;
  
  // 페이지네이션
  page?: number;
  size?: number;
  sort?: 'scheduledAt' | 'distance' | 'seats' | 'deadline';
}

// 미션 검색 응답
export interface SearchMissionsResponse {
  missions: MissionSearchResult[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  facets?: MissionFacets;
}

// 모임 검색 응답
export interface SearchMeetingsResponse {
  meetings: MeetingSearchResult[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  facets?: MeetingFacets;
}

// 미션 검색 결과
export interface MissionSearchResult {
  id: string;
  title: string;
  description: string;
  category: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  duration: number; // minutes
  minParticipants: number;
  participants: number;
  point: number;
  thumbnailUrl: string;
  upcomingMeetingsCount: number;
  completedCount: number;
  averageRating: number;
}

// 모임 검색 결과
export interface MeetingSearchResult {
  id: string;
  missionId: string;
  missionSnapshot: {
    title: string;
    category: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    thumbnailUrl: string;
  };
  scheduledAt: string;
  recruitUntil: string;
  status: 'recruiting' | 'active' | 'completed';
  availableSeats: number;
  participants: number;
  location: {
    district: string;
    place: string;
    latitude: number;
    longitude: number;
  };
  distance?: number; // 사용자 위치 기반
  host: {
    id: string;
    nickname: string;
    profileImageUrl: string;
    level: number;
  };
  focusScore: number; // 0-100
  preferredTraits: string[];
}

// 미션 Facets (필터 옵션)
export interface MissionFacets {
  categories: FacetItem[];
  difficulties: FacetItem[];
  durationRanges: FacetItem[];
  participantRanges: FacetItem[];
  pointRanges: FacetItem[];
}

// 모임 Facets (필터 옵션)
export interface MeetingFacets {
  dateRanges: FacetItem[];
  districts: FacetItem[];
  seatRanges: FacetItem[];
  focusScoreRanges: FacetItem[];
  categories: FacetItem[]; // 보조
  difficulties: FacetItem[]; // 보조
}

export interface FacetItem {
  value: string;
  label: string;
  count: number;
}

// 미션 상세 (다가오는 모임 포함)
export interface MissionDetailWithMeetings {
  mission: MissionDetail;
  upcomingMeetings: MeetingPreview[];
}

export interface MissionDetail {
  id: string;
  title: string;
  description: string;
  category: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  duration: number;
  minParticipants: number;
  participants: number;
  point: number;
  thumbnailUrl: string;
  photoVerificationGuide: string;
  sampleImageUrls: string[];
  precautions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MeetingPreview {
  id: string;
  scheduledAt: string;
  recruitUntil: string;
  availableSeats: number;
  district: string;
  hostNickname: string;
  focusScore: number;
}

// 모임 상세 (미션 스냅샷 포함)
export interface MeetingDetailWithMission {
  meeting: MeetingDetail;
  missionSnapshot: MissionSnapshot;
}

export interface MeetingDetail {
  id: string;
  missionId: string;
  hostUserId: string;
  status: 'recruiting' | 'active' | 'completed';
  scheduledAt: string;
  recruitUntil: string;
  currentParticipants: number;
  participants: number;
  location: {
    district: string;
    place: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  focusScore: number;
  preferredTraits: string[];
  avoidTraits: string[];
  introduction: string;
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MissionSnapshot {
  id: string;
  title: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  duration: number;
  point: number;
  thumbnailUrl: string;
}