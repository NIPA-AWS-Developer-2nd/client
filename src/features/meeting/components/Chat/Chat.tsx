import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../../auth/hooks/useAuth";
import type { ChatMessage } from "../../types/chat.types.js";
import * as S from "./Chat.styles";

interface ChatProps {
  meetingId: string;
  isMobile: boolean;
  meetingStatus?: string;
  totalParticipants?: number;
  noShowUserIds?: Set<string>;
  isCurrentUserNoShow?: boolean;
}

export const Chat: React.FC<ChatProps> = ({
  meetingId,
  isMobile,
  meetingStatus,
  totalParticipants = 4,
  noShowUserIds: _noShowUserIds = new Set(),
  isCurrentUserNoShow = false,
}) => {
  const { user } = useAuth();
  const { messages, isConnected, isLoading, sendMessage, markAsRead } = useChat(
    {
      meetingId,
      enabled: true,
    }
  );

  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 메시지 목록 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

    // 새 메시지들을 자동으로 읽음 처리
    if (messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg) => !msg.readBy.includes(user?.id || "")
      );

      if (unreadMessages.length > 0) {
        const chatIds = unreadMessages.map((msg) => msg.id);
        markAsRead(chatIds);
      }
    }
  }, [messages, markAsRead, user?.id]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (
      !inputMessage.trim() ||
      isSending ||
      !isConnected ||
      isCurrentUserNoShow
    ) {
      return;
    }

    try {
      setIsSending(true);
      await sendMessage({
        message: inputMessage.trim(),
        messageType: "text",
      });
      setInputMessage("");
      // 브라우저 렌더링 후 focus 적용
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 메시지 시간 포맷팅
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 시간 표시 여부 결정 (모든 메시지에 시간 표시)
  const shouldShowTime = (_currentMessage: ChatMessage, _index: number) => {
    return true; // 모든 메시지에 시간 표시
  };

  // 안읽은 인원 수 계산 (단체 채팅방 로직)
  const getUnreadCount = (message: ChatMessage) => {
    // readBy 배열이 없으면 전체 인원이 안읽음
    if (!message.readBy || message.readBy.length === 0) {
      console.log(
        `📊 [${message.id.slice(
          -4
        )}] readBy 없음 - ${totalParticipants}명 안읽음`
      );
      return totalParticipants;
    }

    // 전체 참가자 수에서 읽은 사람 수를 뺀 값
    const unreadCount = totalParticipants - message.readBy.length;
    console.log(
      `📊 [${message.id.slice(-4)}] 전체: ${totalParticipants}, 읽음: ${
        message.readBy.length
      }, 안읽음: ${unreadCount}`,
      message.readBy
    );

    // 0이면 모든 사람이 읽었으므로 표시하지 않음
    return Math.max(0, unreadCount);
  };

  // 모임이 완료되었는지 확인
  const isMeetingCompleted = meetingStatus === "completed";

  if (isLoading) {
    return (
      <S.ChatContainer $isMobile={isMobile}>
        <S.LoadingContainer>
          <div>채팅을 불러오는 중...</div>
        </S.LoadingContainer>
      </S.ChatContainer>
    );
  }

  return (
    <S.ChatContainer $isMobile={isMobile}>
      {/* 메시지 목록 */}
      <S.MessagesContainer $isMobile={isMobile}>
        {messages.length === 0 ? (
          <S.EmptyState $isMobile={isMobile}>
            첫 번째 메시지를 보내보세요! 👋
          </S.EmptyState>
        ) : (
          messages.map((message, index) => {
            const isMyMessage = message.userId === user?.id;
            const unreadCount = getUnreadCount(message);
            const showTime = shouldShowTime(message, index);

            return (
              <S.MessageBubble
                key={message.id}
                $isMyMessage={isMyMessage}
                $isMobile={isMobile}
              >
                {!isMyMessage && (
                  <S.MessageHeader $isMobile={isMobile}>
                    <S.UserAvatar
                      src={
                        message.user.profileImageUrl ||
                        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"
                      }
                      alt={message.user.nickname}
                      $isMobile={isMobile}
                    />
                    <S.UserName $isMobile={isMobile}>
                      {message.user.nickname}
                    </S.UserName>
                  </S.MessageHeader>
                )}

                <S.MessageContent
                  $isMyMessage={isMyMessage}
                  $isMobile={isMobile}
                >
                  <S.MessageText $isMobile={isMobile}>
                    {message.message}
                  </S.MessageText>

                  <S.MessageMeta
                    $isMyMessage={isMyMessage}
                    $isMobile={isMobile}
                  >
                    {unreadCount > 0 && (
                      <S.UnreadCount $isMobile={isMobile}>
                        {unreadCount}
                      </S.UnreadCount>
                    )}

                    {showTime && (
                      <S.MessageTime $isMobile={isMobile}>
                        {formatTime(new Date(message.createdAt))}
                      </S.MessageTime>
                    )}
                  </S.MessageMeta>
                </S.MessageContent>
              </S.MessageBubble>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </S.MessagesContainer>

      {/* 메시지 입력 */}
      <S.InputContainer $isMobile={isMobile}>
        <S.MessageInput
          ref={inputRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isCurrentUserNoShow
              ? "출석하지 않은 사용자는 채팅을 사용할 수 없습니다"
              : isMeetingCompleted
              ? "모임이 완료되어 채팅을 사용할 수 없습니다"
              : isConnected
              ? "메시지를 입력하세요..."
              : "연결 중..."
          }
          disabled={
            isCurrentUserNoShow ||
            isMeetingCompleted ||
            !isConnected ||
            isSending
          }
          $isMobile={isMobile}
        />
        <S.SendButton
          onClick={handleSendMessage}
          disabled={
            isCurrentUserNoShow ||
            isMeetingCompleted ||
            !inputMessage.trim() ||
            !isConnected ||
            isSending
          }
          $isMobile={isMobile}
        >
          <Send size={isMobile ? 16 : 18} />
        </S.SendButton>
      </S.InputContainer>

      {/* 모임 완료 시 오버레이 */}
      {isMeetingCompleted && (
        <S.DisabledOverlay $isMobile={isMobile}>
          <S.DisabledMessage $isMobile={isMobile}>
            <h3>채팅 종료</h3>
            <p>
              모임이 완료되어 더 이상 채팅을
              <br />
              이용할 수 없습니다.
            </p>
          </S.DisabledMessage>
        </S.DisabledOverlay>
      )}
    </S.ChatContainer>
  );
};
