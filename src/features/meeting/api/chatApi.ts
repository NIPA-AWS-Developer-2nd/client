import { apiClient } from '../../../shared/api/apiClient';
import type { ChatMessage, SendMessageDto } from '../types/chat.types.js';

export const chatApi = {
  // 채팅 메시지 목록 조회
  getChatMessages: async (
    meetingId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ChatMessage[]> => {
    const response = await apiClient.get(`/meetings/${meetingId}/chat`, {
      params: { limit, offset }
    });
    return response.data;
  },

  // 채팅 메시지 전송 (REST API)
  sendMessage: async (
    meetingId: string,
    data: SendMessageDto
  ): Promise<ChatMessage> => {
    const response = await apiClient.post(`/meetings/${meetingId}/chat`, data);
    return response.data;
  },

  // 채팅 메시지 읽음 처리
  markAsRead: async (
    meetingId: string,
    chatIds: string[]
  ): Promise<void> => {
    await apiClient.post(`/meetings/${meetingId}/chat/read`, { chatIds });
  },
};