import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface HomeData {
  recentMeetings?: MyMeetingDetail[];
  upcomingMeetings?: MyMeetingDetail[];
  statistics?: {
    totalMeetings: number;
    completedMissions: number;
    totalPoints: number;
  };
  [key: string]: unknown;
}

interface MyMeetingDetail {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  status: string;
  maxParticipants: number;
  currentParticipants: number;
  mission?: {
    title: string;
    location?: string;
    precautions?: string[];
  };
  region?: {
    districtName: string;
    city: string;
  };
  host?: {
    nickname: string;
    level: number;
    mbti?: string;
  };
  participants: Array<{
    id: string;
    nickname: string;
    profileImageUrl?: string;
    level: number;
    mbti?: string;
    isHost: boolean;
  }>;
  chatRoomId?: string;
}

interface MeetingDetailCache {
  data: MyMeetingDetail;
  timestamp: number;
}

interface HomeStore {
  // 홈 데이터 캐시
  homeData: HomeData | null;
  homeDataTimestamp: number | null;
  
  // 모임 상세 정보 캐시
  meetingDetailsCache: Map<string, MeetingDetailCache>;
  
  // 로딩 상태
  isLoadingHome: boolean;
  loadingMeetingIds: Set<string>;
  
  // 에러 상태
  homeError: string | null;
  meetingErrors: Map<string, string>;
  
  // 캐시 유효 시간 (5분)
  CACHE_DURATION: number;
  
  // Actions
  setHomeData: (data: HomeData) => void;
  setMeetingDetail: (meetingId: string, data: MyMeetingDetail) => void;
  getMeetingDetail: (meetingId: string) => MyMeetingDetail | null;
  isDataFresh: () => boolean;
  clearCache: () => void;
  setLoadingMeetingId: (meetingId: string, isLoading: boolean) => void;
  setMeetingError: (meetingId: string, error: string | null) => void;
}

export const useHomeStore = create<HomeStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      homeData: null,
      homeDataTimestamp: null,
      meetingDetailsCache: new Map(),
      isLoadingHome: false,
      loadingMeetingIds: new Set(),
      homeError: null,
      meetingErrors: new Map(),
      CACHE_DURATION: 5 * 60 * 1000, // 5분

      // 홈 데이터 설정
      setHomeData: (data) => 
        set((_state) => ({
          homeData: data,
          homeDataTimestamp: Date.now(),
          homeError: null,
        })),

      // 모임 상세 정보 설정
      setMeetingDetail: (meetingId, data) =>
        set((state) => {
          const newCache = new Map(state.meetingDetailsCache);
          newCache.set(meetingId, {
            data,
            timestamp: Date.now(),
          });
          
          const newLoadingIds = new Set(state.loadingMeetingIds);
          newLoadingIds.delete(meetingId);
          
          const newErrors = new Map(state.meetingErrors);
          newErrors.delete(meetingId);
          
          return {
            meetingDetailsCache: newCache,
            loadingMeetingIds: newLoadingIds,
            meetingErrors: newErrors,
          };
        }),

      // 특정 모임 상세 정보 가져오기
      getMeetingDetail: (meetingId) => {
        const state = get();
        const cached = state.meetingDetailsCache.get(meetingId);
        
        if (!cached) {
          return null;
        }
        
        // 캐시가 만료된 경우
        if ((Date.now() - cached.timestamp) > state.CACHE_DURATION) {
          return null;
        }
        
        return cached.data;
      },

      // 데이터가 신선한지 확인
      isDataFresh: () => {
        const state = get();
        
        if (!state.homeDataTimestamp) {
          return false;
        }
        
        return (Date.now() - state.homeDataTimestamp) < state.CACHE_DURATION;
      },

      // 로딩 상태 설정
      setLoadingMeetingId: (meetingId, isLoading) =>
        set((state) => {
          const newLoadingIds = new Set(state.loadingMeetingIds);
          if (isLoading) {
            newLoadingIds.add(meetingId);
          } else {
            newLoadingIds.delete(meetingId);
          }
          return { loadingMeetingIds: newLoadingIds };
        }),

      // 에러 설정
      setMeetingError: (meetingId, error) =>
        set((state) => {
          const newErrors = new Map(state.meetingErrors);
          if (error) {
            newErrors.set(meetingId, error);
          } else {
            newErrors.delete(meetingId);
          }
          return { meetingErrors: newErrors };
        }),

      // 캐시 클리어
      clearCache: () =>
        set({
          homeData: null,
          homeDataTimestamp: null,
          meetingDetailsCache: new Map(),
          isLoadingHome: false,
          loadingMeetingIds: new Set(),
          homeError: null,
          meetingErrors: new Map(),
        }),
    }),
    {
      name: 'home-store',
    }
  )
);