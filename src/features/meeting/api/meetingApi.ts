import { api } from '../../../shared/utils/api';

export interface MeetingJoinResponse {
  success: boolean;
  message: string;
}

export interface MeetingLeaveResponse {
  success: boolean;
  message: string;
}

export interface MeetingCancelResponse {
  success: boolean;
  message: string;
}

export const meetingApi = {
  // 모임 참여
  joinMeeting: async (meetingId: string): Promise<MeetingJoinResponse> => {
    const { data } = await api.post(`/meetings/${meetingId}/join`);
    return data;
  },

  // 모임 탈퇴
  leaveMeeting: async (meetingId: string): Promise<MeetingLeaveResponse> => {
    const { data } = await api.post(`/meetings/${meetingId}/leave`);
    return data;
  },

  // 모임 취소 (호스트)
  cancelMeeting: async (meetingId: string, reason: string): Promise<MeetingCancelResponse> => {
    const { data } = await api.post(`/meetings/${meetingId}/cancel`, { reason });
    return data;
  },
};