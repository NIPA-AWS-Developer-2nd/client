import { authFetch, apiUrl } from "../utils/api";

// backend api response 타입
export interface ApiResponse<T> {
  status: number;
  message: string;
  result: boolean;
  data: T;
}

// complete-onboarding request 타입
export interface OnboardingRequest {
  phoneNumber: string;
  nickname: string;
  birthYear: number;
  gender: string;
  districtId: string;
  interestIds?: number[]; // 관심사 IDs
  hashtagIds?: number[]; // 해시태그 IDs
  profileImageUrl?: string;
  mbti?: string;
}

// update-profile request 타입
export interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
  profileImageUrl?: string;
  userInterestIds?: number[];
  userHashtagIds?: number[]; // 해시태그 IDs
  mbti?: string;
  districtId?: string;
  birthYear?: number;
  gender?: 'male' | 'female';
}

// level response 타입
export interface LevelInfo {
  level: number;
  requiredPoints: number;
  name: string;
  rewardAiTickets: number;
}

// user-profile response 타입
export interface UserProfile {
  id: string;
  phoneNumber: string;
  nickname: string;
  birthYear?: number;
  gender?: "male" | "female";
  bio?: string;
  profileImageUrl?: string;
  interests: string[];
  mbti?: string;
  districtId?: string;
  points?: number;
  level?: number;
  onboardingCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 완전한 사용자 정보 타입 (기본 정보 + 프로필)
export interface CompleteUserInfo {
  id: string;
  phoneNumber?: string;
  status: string;
  phoneVerifiedAt?: string;
  onboardingCompletedAt?: string;
  lastLoginAt?: string;
  lastLocationVerificationAt?: string;
  districtVerifiedAt?: string;
  currentDistrict?: {
    id: string;
    districtName: string;
    city: string;
  };
  profile?: {
    nickname?: string;
    profileImageUrl?: string;
    bio?: string;
    birthYear?: number;
    gender?: "male" | "female";
    mbti?: string;
    interests: string[];
    hashtags?: string[];
    points?: number;
    level?: number;
    district?: {
      id: string;
      name: string;
      city: string;
    };
  };
  socialAccounts?: {
    provider: string;
    email?: string;
    profileImageUrl?: string;
  }[];
}

// 공개 사용자 정보 타입 (다른 사용자가 볼 수 있는 정보만)
export interface PublicUserInfo {
  id: string;
  status: string;
  profile?: {
    nickname?: string;
    profileImageUrl?: string;
    bio?: string;
    mbti?: string;
    interests: string[];
    hashtags?: string[];
    level?: number;
    district?: {
      id: string;
      name: string;
      city: string;
    };
  };
}

// district response 타입
export interface District {
  id: string;
  districtName: string;
  regionCode: string;
  city: string;
  latitude?: number | string;
  longitude?: number | string;
  isActive: boolean;
}

// category response 타입
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

// hashtag response 타입
export interface Hashtag {
  id: number;
  name: string;
  slug: string;
}

// 활동 내역 타입
export interface ActivityStats {
  verificationCount: number;
  reviewCount: number;
  hostedMeetingCount: number;
  completedMissionCount: number;
}

// 위치 인증 요청 타입
export interface LocationVerificationRequest {
  latitude: number;
  longitude: number;
  districtId: string;
}

// 위치 인증 응답 타입
export interface LocationVerificationResponse {
  isVerified: boolean;
  district: {
    id: string;
    districtName: string;
    city: string;
  };
  distance: number;
  message?: string;
}

// 위치 인증 상태 응답 타입
export interface LocationVerificationStatusResponse {
  isVerified: boolean;
  lastVerificationAt?: string;
  currentDistrict?: {
    id: string;
    districtName: string;
    city: string;
  };
}

class UserApiService {
  // complete-onboarding
  async completeOnboarding(data: OnboardingRequest): Promise<unknown> {
    const response = await authFetch(apiUrl("/auth/complete-onboarding"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();

    return result;
  }

  /**
   * 내 완전한 사용자 정보 조회 (기본 정보 + 프로필)
   */
  async getMe(): Promise<CompleteUserInfo> {
    const response = await authFetch(apiUrl("/user/me"), {
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

    const apiResponse: ApiResponse<CompleteUserInfo> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get user info");
    }

    return apiResponse.data;
  }

  /**
   * 특정 사용자 정보 조회 (공개 정보만)
   */
  async getUserById(userId: string): Promise<PublicUserInfo> {
    const response = await authFetch(apiUrl(`/user/${userId}`), {
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

    const apiResponse: ApiResponse<PublicUserInfo> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get user info");
    }

    return apiResponse.data;
  }

  /**
   * 사용자 프로필 조회 (기존 유지)
   */
  async getUserProfile(): Promise<UserProfile> {
    const response = await authFetch(apiUrl("/user/profile"), {
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

    const apiResponse: ApiResponse<UserProfile> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get profile");
    }

    return apiResponse.data;
  }

  /**
   * 지역 목록 조회
   */
  async getDistricts(): Promise<District[]> {
    const response = await authFetch(apiUrl("/districts"), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const apiResponse: ApiResponse<District[]> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get districts");
    }

    return apiResponse.data;
  }

  /**
   * 사용자 관심사 목록 조회
   */
  async getCategories(): Promise<Category[]> {
    const response = await authFetch(apiUrl("/user-interests"), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const apiResponse: ApiResponse<Category[]> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get user interests");
    }

    return apiResponse.data;
  }

  /**
   * 프로필 업데이트
   */
  async updateProfile(updateData: UpdateProfileRequest): Promise<CompleteUserInfo> {
    const response = await authFetch(apiUrl("/user/profile"), {
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

    const apiResponse: ApiResponse<CompleteUserInfo> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to update profile");
    }

    return apiResponse.data;
  }

  /**
   * 레벨 정보 조회
   */
  async getLevelInfo(level: number): Promise<LevelInfo> {
    const response = await authFetch(apiUrl(`/levels/${level}`), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const apiResponse: ApiResponse<LevelInfo> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get level info");
    }

    return apiResponse.data;
  }

  /**
   * 활동 통계 조회
   */
  async getActivityStats(): Promise<ActivityStats> {
    const response = await authFetch(apiUrl("/user/activity-stats"), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const apiResponse: ApiResponse<ActivityStats> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get activity stats");
    }

    return apiResponse.data;
  }

  /**
   * 해시태그 목록 조회
   */
  async getUserHashtags(): Promise<Hashtag[]> {
    const response = await authFetch(apiUrl("/user-hashtags"), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const apiResponse: ApiResponse<Hashtag[]> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get user hashtags");
    }

    return apiResponse.data;
  }

  /**
   * 위치 인증 상태 확인
   */
  async getLocationVerificationStatus(): Promise<LocationVerificationStatusResponse> {
    const response = await authFetch(apiUrl("/user/location-verification-status"), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const apiResponse: ApiResponse<LocationVerificationStatusResponse> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get location verification status");
    }

    return apiResponse.data;
  }

  /**
   * 위치 인증 실행
   */
  async verifyLocation(data: LocationVerificationRequest): Promise<LocationVerificationResponse> {
    const response = await authFetch(apiUrl("/user/verify-location"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const apiResponse: ApiResponse<LocationVerificationResponse> = await response.json();

    // 위치 인증은 실패해도 응답이 오므로 API 응답의 result를 체크하지 않고
    // 실제 인증 결과는 data.isVerified로 판단
    return apiResponse.data;
  }

  /**
   * 활성 지역 목록 조회 (위치 인증용)
   */
  async getActiveDistricts(): Promise<District[]> {
    const response = await authFetch(apiUrl("/user/districts"), {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const apiResponse: ApiResponse<District[]> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get active districts");
    }

    return apiResponse.data;
  }

  /**
   * 다른 사용자 프로필 조회
   */
  async getOtherUserProfile(userId: string): Promise<{
    id: string;
    profile: {
      nickname: string;
      bio?: string;
      profileImageUrl?: string;
      interests: string[];
      hashtags: string[];
      mbti?: string;
      level: number;
    };
    stats: ActivityStats;
  }> {
    const response = await authFetch(apiUrl(`/user/${userId}/profile`), {
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

    const apiResponse: ApiResponse<{
      id: string;
      profile: {
        nickname: string;
        bio?: string;
        profileImageUrl?: string;
        interests: string[];
        hashtags: string[];
        mbti?: string;
        level: number;
      };
      stats: ActivityStats;
    }> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get user profile");
    }

    return apiResponse.data;
  }

  /**
   * 테스트용: 모든 사용자 목록 조회 (개발 환경에서만)
   */
  async getAllUsers(): Promise<Array<{
    id: string;
    phoneNumber?: string;
    status: string;
    onboardingCompleted: boolean;
    nickname?: string;
    profileImageUrl?: string;
  }>> {
    const response = await authFetch(apiUrl("/user/list"), {
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

    const apiResponse: ApiResponse<Array<{
      id: string;
      phoneNumber?: string;
      status: string;
      onboardingCompleted: boolean;
      nickname?: string;
      profileImageUrl?: string;
    }>> = await response.json();

    if (!apiResponse.result) {
      throw new Error(apiResponse.message || "Failed to get users list");
    }

    return apiResponse.data;
  }
}

export const userApiService = new UserApiService();
