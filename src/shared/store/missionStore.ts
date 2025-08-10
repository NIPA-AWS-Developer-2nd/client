import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  region_code: string;
  thumbnailUrl: string;
  category: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
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
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  preferredGender: 'MALE' | 'FEMALE' | 'ANY';
  minAge: number;
  maxAge: number;
  host?: {
    id: number;
    provider: 'KAKAO' | 'NAVER' | 'GOOGLE';
    provider_user_id: string;
    email: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
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
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentMission: (mission: MissionWithDetails | null) => void;
  setMeetings: (meetings: MeetingWithDetails[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchMissionDetails: (id: string) => Promise<void>;
  fetchMeetings: (missionId: string) => Promise<void>;
  createMeeting: (meetingData: Partial<MeetingWithDetails>) => Promise<void>;
  joinMeeting: (meetingId: string) => Promise<void>;
  leaveMeeting: (meetingId: string) => Promise<void>;
}

export const useMissionStore = create<MissionStore>()(
  devtools(
    (set, _get) => ({
      // Initial State
      currentMission: null,
      meetings: [],
      isLoading: false,
      error: null,

      // Actions
      setCurrentMission: (mission) => set({ currentMission: mission }),
      setMeetings: (meetings) => set({ meetings }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Async Actions
      fetchMissionDetails: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // Import missions data
          const { MISSIONS_DATA } = await import('../../data/missions');
          
          // Find the mission by ID
          const mission = MISSIONS_DATA.find((m: MissionWithDetails) => m.id === id);
          
          if (!mission) {
            throw new Error(`Mission with ID ${id} not found`);
          }

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          set({ currentMission: mission, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
        }
      },

      fetchMeetings: async (missionId: string) => {
        set({ isLoading: true, error: null });
        try {
          if (import.meta.env.DEV) {
            // 개발 환경에서만 mock 데이터 사용
            console.log("🔧 개발 환경: Mock 미팅 데이터 사용");
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockMeetings: MeetingWithDetails[] = [
            {
              id: "1",
              missionId,
              hostUserId: "host1",
              scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
              location: "잠실역 2번 출구",
              latitude: 37.5133,
              longitude: 127.1000,
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
                { id: "1", userId: "user1", meetingId: "1", joinedAt: "2024-12-01T00:00:00Z" },
                { id: "2", userId: "user2", meetingId: "1", joinedAt: "2024-12-01T00:00:00Z" },
                { id: "3", userId: "user3", meetingId: "1", joinedAt: "2024-12-01T00:00:00Z" },
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
            }
          ];

          // Filter only upcoming meetings
          const now = new Date();
          const upcomingMeetings = mockMeetings.filter(meeting => {
            const meetingTime = new Date(meeting.scheduledAt);
            return meetingTime > now && meeting.status === "SCHEDULED";
          });

            set({ meetings: upcomingMeetings, isLoading: false });
          } else {
            // 프로덕션 환경에서는 실제 API 호출
            console.log("🚀 프로덕션 환경: 실제 API 호출");
            // TODO: 실제 API 연동 필요
            // const response = await fetch(`/api/missions/${missionId}/meetings`);
            // const meetings = await response.json();
            set({ meetings: [], isLoading: false, error: "API 연동 필요" });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
        }
      },

      createMeeting: async (meetingData) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For now, just show success message
          console.log('Meeting created:', meetingData);
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
        }
      },

      joinMeeting: async (meetingId) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          console.log('Joined meeting:', meetingId);
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
        }
      },

      leaveMeeting: async (meetingId) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          console.log('Left meeting:', meetingId);
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
        }
      },
    }),
    {
      name: 'mission-store',
    }
  )
);