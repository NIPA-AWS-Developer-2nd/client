export interface ChatMessage {
  id: string;
  meetingId: string;
  userId: string;
  message: string;
  messageType: 'text' | 'image' | 'system';
  createdAt: string | Date;
  user: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  readBy: string[]; // 읽은 사용자 ID 목록
}

export interface SendMessageDto {
  message: string;
  messageType?: 'text' | 'image' | 'system';
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SocketEvents {
  // 받는 이벤트
  new_message: (message: ChatMessage) => void;
  chat_history: (messages: ChatMessage[]) => void;
  messages_read: (data: { userId: string; chatIds: string[]; timestamp: Date }) => void;
  user_joined: (data: { userId: string; timestamp: Date }) => void;
  user_left: (data: { userId: string; timestamp: Date }) => void;
  error: (data: { message: string }) => void;
  
  // 보내는 이벤트
  send_message: (data: SendMessageDto & { meetingId: string }) => void;
  mark_as_read: (data: { chatIds: string[]; meetingId: string }) => void;
  join_meeting: (data: { meetingId: string }) => void;
}