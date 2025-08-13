import { authFetch, apiUrl } from "../utils/api";

// 백엔드 API 응답 타입에 맞춤
export interface MeetingHostDto {
  id: string;
  nickname: string;
  profileImageUrl: string;
  points: number;
  level: number;
}

export interface MeetingMissionDto {
  id: string;
  title: string;
  description: string;
  minParticipants: number;
  maxParticipants: number;
  estimatedDuration: number;
  minimumDuration: number;
  basePoints: number;
  photoVerificationGuide: string;
  sampleImageUrls: string[];
  categoryId: number;
  difficulty: string;
  thumbnailUrl: string;
  precautions: string[];
  districtId: string;
  location?: string | null;
  hashtags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    isActive: boolean;
  };
  district?: {
    id: string;
    regionCode: string;
    districtName: string;
    city: string;
    isActive: boolean;
  };
}

export interface MeetingDto {
  id: string;
  missionId: string;
  hostUserId: string;
  status: string;
  recruitUntil: string;
  scheduledAt: string;
  qrCodeToken?: string | null;
  qrGeneratedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  currentParticipants?: number;
  mission?: MeetingMissionDto;
  host?: MeetingHostDto;
}

export interface GetMeetingsResponse {
  meetings: MeetingDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetMeetingsParams {
  status?: 'recruiting' | 'active' | 'completed' | 'cancelled';
  categoryId?: number;
  districtId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  searchKeyword?: string;
  sortBy?: 'latest' | 'deadline' | 'popular';
  weekStartDate?: string;
  weekEndDate?: string;
  selectedDate?: string;
  missionId?: string;
  page?: number;
  size?: number;
}

class MeetingApiService {
  /**
   * 모임 목록 조회
   */
  async getMeetings(params: GetMeetingsParams = {}): Promise<GetMeetingsResponse> {
    const searchParams = new URLSearchParams();
    
    // 파라미터를 URL 쿼리스트링으로 변환
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `/meetings?${queryString}` : '/meetings';

    console.log('🔍 모임 목록 API 호출:', url);

    const response = await authFetch(apiUrl(url), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result: GetMeetingsResponse = await response.json();
    console.log('✅ 모임 목록 조회 성공:', result);
    
    return result;
  }

  /**
   * 특정 미션의 모임 목록 조회
   */
  async getMeetingsByMission(
    missionId: string, 
    params: Omit<GetMeetingsParams, 'missionId'> = {}
  ): Promise<GetMeetingsResponse> {
    return this.getMeetings({ ...params, missionId });
  }

  /**
   * 주간 범위로 모임 검색
   */
  async getMeetingsInWeek(
    weekStartDate: string,
    weekEndDate: string,
    params: Omit<GetMeetingsParams, 'weekStartDate' | 'weekEndDate' | 'selectedDate'> = {}
  ): Promise<GetMeetingsResponse> {
    return this.getMeetings({ 
      ...params, 
      weekStartDate, 
      weekEndDate 
    });
  }

  /**
   * 특정 날짜의 모임 검색
   */
  async getMeetingsOnDate(
    selectedDate: string,
    params: Omit<GetMeetingsParams, 'selectedDate' | 'weekStartDate' | 'weekEndDate'> = {}
  ): Promise<GetMeetingsResponse> {
    return this.getMeetings({ 
      ...params, 
      selectedDate 
    });
  }
}

export const meetingApiService = new MeetingApiService();