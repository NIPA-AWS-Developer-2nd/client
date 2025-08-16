import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ChatMessage, ChatState, SendMessageDto } from '../types/chat.types.js';
import { useAuth } from '../../auth/hooks/useAuth';

interface UseChatProps {
  meetingId: string;
  enabled?: boolean;
}

export const useChat = ({ meetingId, enabled = true }: UseChatProps) => {
  const { user } = useAuth();
  const [state, setState] = useState<ChatState>({
    messages: [],
    isConnected: false,
    isLoading: false,
    error: null,
  });

  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 소켓 연결
  const connect = useCallback(() => {
    if (!enabled || !user?.id || !meetingId || socketRef.current?.connected) {
      return;
    }

    console.log('🔌 채팅 소켓 연결 중...', { meetingId, userId: user.id });

    const socket = io(`${import.meta.env.VITE_API_URL}/chat`, {
      query: {
        userId: user.id,
        meetingId,
      },
      transports: ['websocket'],
      forceNew: true,
    });

    // 연결 이벤트
    socket.on('connect', () => {
      console.log('✅ 채팅 소켓 연결됨');
      setState(prev => ({ ...prev, isConnected: true, error: null }));
      
      // 모임 채팅방 참여
      socket.emit('join_meeting', { meetingId });
    });

    socket.on('disconnect', () => {
      console.log('❌ 채팅 소켓 연결 끊김');
      setState(prev => ({ ...prev, isConnected: false }));
      
      // 자동 재연결 시도 (5초 후)
      if (enabled) {
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('💥 채팅 소켓 연결 실패:', error);
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        error: '채팅 서버에 연결할 수 없습니다.' 
      }));
    });

    // 채팅 이벤트 리스너
    socket.on('chat_history', (messages: ChatMessage[]) => {
      console.log('📜 채팅 히스토리 수신:', messages.length, '개');
      setState(prev => ({ ...prev, messages, isLoading: false }));
    });

    socket.on('new_message', (message: ChatMessage) => {
      console.log('💬 새 메시지 수신:', message);
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    });

    socket.on('messages_read', (data: { userId: string; chatIds: string[]; timestamp: Date }) => {
      console.log('👁️ 메시지 읽음 처리:', data);
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => {
          if (data.chatIds.includes(msg.id)) {
            return {
              ...msg,
              readBy: [...new Set([...msg.readBy, data.userId])],
            };
          }
          return msg;
        }),
      }));
    });

    socket.on('user_joined', (data: { userId: string; timestamp: Date }) => {
      console.log('👋 사용자 입장:', data);
    });

    socket.on('user_left', (data: { userId: string; timestamp: Date }) => {
      console.log('👋 사용자 퇴장:', data);
    });

    socket.on('error', (data: { message: string }) => {
      console.error('⚠️ 소켓 에러:', data.message);
      setState(prev => ({ ...prev, error: data.message }));
    });

    socketRef.current = socket;
  }, [enabled, user?.id, meetingId]);

  // 소켓 연결 해제
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      console.log('🔌 채팅 소켓 연결 해제');
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setState(prev => ({ ...prev, isConnected: false }));
  }, []);

  // 메시지 전송
  const sendMessage = useCallback(async (data: SendMessageDto) => {
    if (!socketRef.current?.connected) {
      throw new Error('채팅 서버에 연결되지 않았습니다.');
    }

    console.log('📤 메시지 전송:', data);
    socketRef.current.emit('send_message', {
      ...data,
      meetingId,
    });
  }, [meetingId]);

  // 메시지 읽음 처리
  const markAsRead = useCallback(async (chatIds: string[]) => {
    if (!socketRef.current?.connected) {
      return;
    }

    console.log('👁️ 메시지 읽음 처리:', chatIds);
    socketRef.current.emit('mark_as_read', {
      chatIds,
      meetingId,
    });
  }, [meetingId]);

  // 초기 연결
  useEffect(() => {
    if (enabled && user?.id && meetingId) {
      setState(prev => ({ ...prev, isLoading: true }));
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, user?.id, meetingId, connect, disconnect]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    messages: state.messages,
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    markAsRead,
    connect,
    disconnect,
  };
};