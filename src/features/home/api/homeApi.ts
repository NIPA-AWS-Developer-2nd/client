import { apiClient } from '../../../shared/api/apiClient';
import type { HomeApiResponse, GetHomeDataParams, MyMeetingDetailResponse } from '../types';

export const homeApi = {
  getHomeData: async (params?: GetHomeDataParams): Promise<HomeApiResponse> => {
    const response = await apiClient.get('/home/data', {
      params: params ? {
        limit: params.limit,
      } : undefined,
    });
    return response;
  },

  getMyMeetingDetail: async (meetingId: string): Promise<MyMeetingDetailResponse> => {
    const response = await apiClient.get(`/home/meetings/${meetingId}/detail`);
    return response;
  },
};