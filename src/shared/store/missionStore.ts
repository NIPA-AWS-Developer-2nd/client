import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authFetch, apiUrl } from "../utils/api";

export interface MissionWithDetails {
  id: string;
  title: string;
  description: string;
  point: number;
  duration: number;
  minParticipants: number;
  maxParticipants: number;
  minDuration: number;
  minPhotoCount: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  region_code: string;
  thumbnailUrl: string;
  category: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "INACTIVE";
  context?: {
    id: string;
    missionId: string;
    photoGuide: string;
  };
  samplePhotos?: Array<{
    id: string;
    missionId: string;
    photoUrl: string;
  }>;
  warnings?: Array<{
    id: string;
    missionId: string;
    content: string;
  }>;
}

export interface MeetingWithDetails {
  id: string;
  missionId: string;
  mission?: MissionWithDetails;
  hostUserId: string;
  scheduledAt: string;
  location: string;
  latitude: number;
  longitude: number;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  preferredGender: "MALE" | "FEMALE" | "ANY";
  minAge: number;
  maxAge: number;
  host?: {
    id: number;
    provider: "KAKAO" | "NAVER" | "GOOGLE";
    provider_user_id: string;
    email: string;
    name: string;
    status: "ACTIVE" | "INACTIVE";
    created_at: string;
    updated_at: string;
  };
  participants?: Array<{
    id: string;
    userId: string;
    meetingId: string;
    joinedAt: string;
  }>;
  traitDetails?: Array<{
    id: string;
    label: string;
    description: string;
    is_active: boolean;
    display_order: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
  traits?: Array<{
    id: string;
    label: string;
    description: string;
    is_active: boolean;
    display_order: number;
  }>;
}

interface MissionStore {
  // State
  currentMission: MissionWithDetails | null;
  meetings: MeetingWithDetails[];
  missions: MissionWithDetails[];
  categories: Array<{
    id: string;
    label: string;
    slug: string;
    icon: string | null;
  }>;
  isLoading: boolean;
  isLoadingMissions: boolean;
  isLoadingCategories: boolean;
  lastFetched: number | null;
  error: string | null;

  // Actions
  setCurrentMission: (mission: MissionWithDetails | null) => void;
  setMeetings: (meetings: MeetingWithDetails[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Async actions
  fetchMissionDetails: (id: string) => Promise<void>;
  fetchMeetings: (missionId: string) => Promise<void>;
  fetchMissions: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createMeeting: (meetingData: Partial<MeetingWithDetails>) => Promise<void>;
  joinMeeting: (meetingId: string) => Promise<void>;
  leaveMeeting: (meetingId: string) => Promise<void>;

  // Computed getters
  getFilteredMissions: (filters: {
    category?: string;
    difficulty?: string;
    participants?: string;
    duration?: string;
    point?: string;
  }) => MissionWithDetails[];
}

export const useMissionStore = create<MissionStore>()(
  devtools(
    (set, _get) => ({
      // Initial State
      currentMission: null,
      meetings: [],
      missions: [],
      categories: [],
      isLoading: false,
      isLoadingMissions: false,
      isLoadingCategories: false,
      lastFetched: null,
      error: null,

      // Actions
      setCurrentMission: (mission) => set({ currentMission: mission }),
      setMeetings: (meetings) => set({ meetings }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Async Actions
      fetchMissionDetails: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authFetch(apiUrl(`/missions/${id}`));

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error(`미션을 찾을 수 없습니다.`);
            }
            throw new Error(`미션 로드 실패: ${response.status}`);
          }

          const result = await response.json();
          const mission = result.data || result;

          set({ currentMission: mission, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      fetchMeetings: async (missionId: string) => {
        set({ isLoading: true, error: null });
        try {
          if (import.meta.env.DEV) {
            // 개발 환경에서만 mock 데이터 사용
            console.log("🔧 개발 환경: Mock 미팅 데이터 사용");
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockMeetings: MeetingWithDetails[] = [
              {
                id: "1",
                missionId,
                hostUserId: "host1",
                scheduledAt: new Date(
                  Date.now() + 24 * 60 * 60 * 1000
                ).toISOString(), // Tomorrow
                location: "잠실역 2번 출구",
                latitude: 37.5133,
                longitude: 127.1,
                status: "SCHEDULED",
                preferredGender: "ANY",
                minAge: 20,
                maxAge: 35,
                host: {
                  id: 1,
                  provider: "KAKAO",
                  provider_user_id: "host1",
                  email: "host1@example.com",
                  name: "김모임",
                  status: "ACTIVE",
                  created_at: "2024-01-01T00:00:00Z",
                  updated_at: "2024-01-01T00:00:00Z",
                },
                participants: [
                  {
                    id: "1",
                    userId: "user1",
                    meetingId: "1",
                    joinedAt: "2024-12-01T00:00:00Z",
                  },
                  {
                    id: "2",
                    userId: "user2",
                    meetingId: "1",
                    joinedAt: "2024-12-01T00:00:00Z",
                  },
                  {
                    id: "3",
                    userId: "user3",
                    meetingId: "1",
                    joinedAt: "2024-12-01T00:00:00Z",
                  },
                ],
                traitDetails: [
                  {
                    id: "1",
                    label: "사진 촬영에 적극적인 분",
                    description: "인증 사진을 재미있게 찍고 싶어하는 분",
                    is_active: true,
                    display_order: 1,
                  },
                  {
                    id: "2",
                    label: "미션 클리어에 적극적인 분",
                    description: "미션 완수에 열정적인 분",
                    is_active: true,
                    display_order: 2,
                  },
                ],
              },
            ];

            // Filter only upcoming meetings
            const now = new Date();
            const upcomingMeetings = mockMeetings.filter((meeting) => {
              const meetingTime = new Date(meeting.scheduledAt);
              return meetingTime > now && meeting.status === "SCHEDULED";
            });

            set({ meetings: upcomingMeetings, isLoading: false });
          } else {
            // 프로덕션 환경에서는 실제 API 호출
            // TODO: 실제 API 연동 필요
            // const response = await fetch(apiUrl(`/missions/${missionId}/meetings`));
            // const meetings = await response.json();
            set({ meetings: [], isLoading: false, error: "API 연동 필요" });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      createMeeting: async (meetingData) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // For now, just show success message
          console.log("Meeting created:", meetingData);

          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      joinMeeting: async (meetingId) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 500));

          console.log("Joined meeting:", meetingId);

          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      leaveMeeting: async (meetingId) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 500));

          console.log("Left meeting:", meetingId);

          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      // 캐시 지속 시간 5분
      fetchMissions: async () => {
        const { lastFetched, isLoadingMissions } = _get();
        const CACHE_DURATION = 5 * 60 * 1000;

        // 캐시가 유효하거나 이미 로딩 중이면 스킵
        if (
          (lastFetched && Date.now() - lastFetched < CACHE_DURATION) ||
          isLoadingMissions
        ) {
          return;
        }

        set({ isLoadingMissions: true, error: null });

        try {
          // 모든 미션을 한 번에 가져오기
          const response = await authFetch(apiUrl("/missions?limit=100"));

          if (response.ok) {
            const result = await response.json();
            const data = result.data || result;

            set({
              missions: data.missions || [],
              lastFetched: Date.now(),
              error: null,
            });
          } else {
            throw new Error(`미션 로드 실패: ${response.status}`);
          }
        } catch (error) {
          console.error("미션 로드 에러:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "미션을 불러오는데 실패했습니다.",
            missions: [],
          });
        } finally {
          set({ isLoadingMissions: false });
        }
      },

      fetchCategories: async () => {
        const { categories, isLoadingCategories } = _get();

        // 이미 카테고리가 있거나 로딩 중이면 스킵
        if (categories.length > 0 || isLoadingCategories) {
          return;
        }

        set({ isLoadingCategories: true });

        try {
          const response = await authFetch(apiUrl("/categories"));

          if (response.ok) {
            const result = await response.json();
            const categoryData = result.data || result;

            // "전체" 카테고리 추가
            const allCategories = [
              { id: "all", label: "전체", slug: "all", icon: null },
              ...categoryData.map(
                (cat: { id: string; name: string; slug: string; icon?: string }) => ({
                  id: cat.slug || cat.id,
                  label: cat.name,
                  slug: cat.slug,
                  icon: cat.icon || null,
                })
              ),
            ];

            set({ categories: allCategories });
          } else {
            throw new Error(`카테고리 로드 실패: ${response.status}`);
          }
        } catch (error) {
          console.error("카테고리 로드 에러:", error);
          // 에러 시 기본 카테고리만 설정
          set({
            categories: [{ id: "all", label: "전체", slug: "all", icon: null }],
          });
        } finally {
          set({ isLoadingCategories: false });
        }
      },

      // 클라이언트 사이드 필터링
      getFilteredMissions: (filters) => {
        const { missions } = _get();
        let filtered = missions;

        // 카테고리 필터
        if (filters.category && filters.category !== "all") {
          filtered = filtered.filter((mission) =>
            mission.category.includes(filters.category!)
          );
        }

        // 난이도 필터
        if (filters.difficulty && filters.difficulty !== "all") {
          filtered = filtered.filter(
            (mission) => mission.difficulty === filters.difficulty
          );
        }

        // 참여인원 필터
        if (filters.participants && filters.participants !== "all") {
          filtered = filtered.filter((mission) => {
            switch (filters.participants) {
              case "medium":
                return (
                  mission.maxParticipants >= 4 && mission.maxParticipants <= 6
                );
              case "large":
                return mission.maxParticipants > 6;
              default:
                return true;
            }
          });
        }

        // 예상시간 필터
        if (filters.duration && filters.duration !== "all") {
          filtered = filtered.filter((mission) => {
            switch (filters.duration) {
              case "short":
                return mission.duration <= 90;
              case "medium":
                return mission.duration > 90 && mission.duration <= 180;
              case "long":
                return mission.duration > 180;
              default:
                return true;
            }
          });
        }

        // 포인트 범위 필터
        if (filters.point && filters.point !== "all") {
          filtered = filtered.filter((mission) => {
            switch (filters.point) {
              case "low":
                return mission.point < 400;
              case "medium":
                return mission.point >= 400 && mission.point < 800;
              case "high":
                return mission.point >= 800;
              default:
                return true;
            }
          });
        }

        // 포인트 높은 순으로 정렬
        return filtered.sort((a, b) => b.point - a.point);
      },
    }),
    {
      name: "mission-store",
    }
  )
);
