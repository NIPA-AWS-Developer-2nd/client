import { authFetch, apiUrl } from "../utils/api";

// 백엔드 API 응답 타입에 맞춤
export interface MeetingHostDto {
  id: string;
  userId?: string; // Alias for id to maintain compatibility
  nickname: string;
  profileImageUrl: string | null;
  points: number;
  level: number;
  mbti?: string;
}

export interface MeetingMissionDto {
  id: string;
  title: string;
  description: string;
  participants: number;
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

export interface ParticipantProfileDto {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
  level: number;
  isHost: boolean;
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
  likesCount: number;
  isLiked?: boolean; // 현재 사용자가 좋아요를 눌렀는지 여부 (목록에서는 선택적)
  mission?: MeetingMissionDto;
  host?: MeetingHostDto;
  participantProfiles?: ParticipantProfileDto[];
}

export interface MeetingParticipantDto {
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
  points: number;
  level: number;
  status: string;
  isHost: boolean;
  mbti?: string;
  bio?: string;
  joinedAt: string;
  createdAt: string;
}

export interface MeetingDetailDto extends MeetingDto {
  participants: number;
  participantList: MeetingParticipantDto[];
  canJoin: boolean;
  userParticipationStatus: string | null;
  isLiked: boolean; // 현재 사용자가 좋아요를 눌렀는지 여부
  introduction?: string;
  focusScore?: number;
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

export interface CreateMeetingRequest {
  missionId: string;
  recruitUntil?: string;
  scheduledAt: string;
  participants?: number;
  introduction?: string;
  focusScore?: number;
  hostStake?: number;
  participantStake?: number;
  traits?: Array<{ id: string }>;
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

  /**
   * 모임 상세 정보 조회
   */
  async getMeetingDetail(meetingId: string): Promise<MeetingDetailDto> {
    const url = `/meetings/${meetingId}`;
    
    console.log('🔍 모임 상세 API 호출:', url);

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

    const result: MeetingDetailDto = await response.json();
    console.log('✅ 모임 상세 조회 성공:', result);
    
    return result;
  }

  /**
   * 모임 생성
   */
  async createMeeting(meetingData: CreateMeetingRequest): Promise<MeetingDetailDto> {
    const url = '/meetings';
    
    console.log('🔍 모임 생성 API 호출:', url, meetingData);

    const response = await authFetch(apiUrl(url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result: MeetingDetailDto = await response.json();
    console.log('✅ 모임 생성 성공:', result);
    
    return result;
  }

  /**
   * 모임 좋아요
   */
  async toggleLike(meetingId: string): Promise<{ likesCount: number; isLiked: boolean }> {
    const url = `/meetings/${meetingId}/like`;
    
    console.log('🔍 모임 좋아요 API 호출:', url);

    const response = await authFetch(apiUrl(url), {
      method: "POST",
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

    const result: { likesCount: number; isLiked: boolean } = await response.json();
    console.log('✅ 모임 좋아요 성공:', result);
    
    return result;
  }

  /**
   * 모임 삭제 (호스트 전용)
   */
  async deleteMeeting(meetingId: string): Promise<void> {
    const url = `/meetings/${meetingId}`;
    
    console.log('🔍 모임 삭제 API 호출:', url);

    const response = await authFetch(apiUrl(url), {
      method: "DELETE",
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

    console.log('✅ 모임 삭제 성공');
  }

  /**
   * 모임 나가기
   */
  async leaveMeeting(meetingId: string): Promise<void> {
    const url = `/meetings/${meetingId}/leave`;
    
    console.log('🔍 모임 나가기 API 호출:', url);

    const response = await authFetch(apiUrl(url), {
      method: "POST",
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

    console.log('✅ 모임 나가기 성공');
  }

  /**
   * 모임 수정 (호스트 전용)
   */
  async updateMeeting(meetingId: string, updateData: Partial<CreateMeetingRequest>): Promise<MeetingDetailDto> {
    const url = `/meetings/${meetingId}`;
    
    console.log('🔍 모임 수정 API 호출:', url, updateData);

    const response = await authFetch(apiUrl(url), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result: MeetingDetailDto = await response.json();
    console.log('✅ 모임 수정 성공:', result);
    
    return result;
  }
}

export const meetingApiService = new MeetingApiService();