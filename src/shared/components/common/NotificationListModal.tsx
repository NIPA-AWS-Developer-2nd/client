import React from "react";
import {
  X,
  Bell,
  MessageSquare,
  Calendar,
  Award,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  useNotificationHistory,
  type NotificationItem,
} from "../../hooks/useNotificationHistory";
import { deviceDetection } from "../../utils";
import styled, { css } from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: ${({ $isMobile }) => ($isMobile ? "100%" : "600px")};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div<{ $isMobile: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 12px" : "20px 16px")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  background: ${({ theme }) => theme.colors.gray50};
`;

const ModalTitle = styled.h2<{ $isMobile: boolean }>`
  margin: 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray900};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray500};
  transition: all 0.2s ease;
`;

const ModalContent = styled.div<{ $isMobile: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "24px")};
`;

const NotificationItem = styled.div<{
  $isMobile: boolean;
  $isUnread?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  background: ${({ $isUnread, theme }) =>
    $isUnread ? `${theme.colors.info}10` : "transparent"};
  border: ${({ $isUnread, theme }) =>
    $isUnread ? `1px solid ${theme.colors.info}40` : "1px solid transparent"};
`;

const NotificationIcon = styled.div<{ $type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;

  ${({ $type, theme }) => {
    switch ($type) {
      case "meeting_reminder":
      case "meeting_participant_joined":
      case "meeting_capacity_full":
      case "meeting_recruitment_warning":
        return css`
          background: ${theme.colors.info}20;
          color: ${theme.colors.info};
        `;
      case "mission_complete":
      case "meeting_activity_start":
        return css`
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case "point_earned":
      case "point_deducted":
        return css`
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case "chat_message":
      case "meeting_liked":
        return css`
          background: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case "system_notice":
        return css`
          background: transparent;
          color: ${theme.colors.danger};
        `;
      default:
        return css`
          background: ${theme.colors.gray100};
          color: ${theme.colors.gray600};
        `;
    }
  }}
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: 4px;
  line-height: 1.4;
`;

const NotificationBody = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: 6px;
  line-height: 1.4;
`;

const NotificationTime = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  color: ${({ theme }) => theme.colors.gray400};
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
  align-items: center;
`;

const ActionButton = styled.button<{ $variant?: "danger" }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $variant, theme }) =>
    $variant === "danger" ? theme.colors.danger : theme.colors.gray400};
  transition: all 0.2s ease;
`;

const EmptyMessage = styled.div<{ $isMobile: boolean }>`
  text-align: center;
  padding: ${({ $isMobile }) => ($isMobile ? "40px 20px" : "60px 20px")};
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.gray50};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface NotificationListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationListModal: React.FC<NotificationListModalProps> = ({
  isOpen,
  onClose,
}) => {
  const isMobile = deviceDetection.isMobile();
  const {
    notifications,
    stats,
    isLoading,
    error,
    hasMore,
    currentPage,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    clearError,
  } = useNotificationHistory();

  // 모달이 열릴 때마다 최신 데이터 로드
  React.useEffect(() => {
    if (isOpen) {
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

  if (!isOpen) return null;

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "meeting_reminder":
        return <Calendar size={20} />;
      case "mission_complete":
        return <Award size={20} />;
      case "system_notice":
        return <AlertCircle size={20} />;
      case "friend_request":
        return <MessageSquare size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (notification.status !== "sent") return;

    try {
      await markAsRead(notification.id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchNotifications(currentPage + 1);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUnread = (notification: NotificationItem) => {
    return notification.status === "sent" && !notification.sentAt;
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer $isMobile={isMobile} onClick={(e) => e.stopPropagation()}>
        <ModalHeader $isMobile={isMobile}>
          <ModalTitle $isMobile={isMobile}>
            <Bell size={20} />
            알림
            {stats && stats.unread > 0 && (
              <span
                style={{
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "12px",
                  padding: "2px 8px",
                  fontSize: "12px",
                  marginLeft: "8px",
                }}
              >
                {stats.unread}
              </span>
            )}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalContent $isMobile={isMobile}>
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "16px",
                color: "#dc2626",
              }}
            >
              {error}
              <button
                onClick={clearError}
                style={{
                  float: "right",
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {notifications.length === 0 && !isLoading ? (
            <EmptyMessage $isMobile={isMobile}>알림이 없습니다</EmptyMessage>
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  $isMobile={isMobile}
                  $isUnread={isUnread(notification)}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <NotificationIcon $type={notification.type}>
                    {getNotificationIcon(notification.type)}
                  </NotificationIcon>
                  <NotificationContent>
                    <NotificationTitle $isMobile={isMobile}>
                      {notification.title}
                    </NotificationTitle>
                    <NotificationBody $isMobile={isMobile}>
                      {notification.body}
                    </NotificationBody>
                    <NotificationTime $isMobile={isMobile}>
                      {formatTime(notification.createdAt)}
                      {notification.sentAt &&
                        formatTime(notification.createdAt) !==
                          formatTime(notification.sentAt) &&
                        ` • 읽음 ${formatTime(notification.sentAt)}`}
                      {notification.sentAt &&
                        formatTime(notification.createdAt) ===
                          formatTime(notification.sentAt) &&
                        " • 읽음"}
                    </NotificationTime>
                  </NotificationContent>
                  <NotificationActions>
                    <ActionButton
                      $variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                    >
                      <Trash2 size={20} />
                    </ActionButton>
                  </NotificationActions>
                </NotificationItem>
              ))}

              {hasMore && (
                <LoadMoreButton onClick={handleLoadMore} disabled={isLoading}>
                  {isLoading ? "로딩 중..." : "더 보기"}
                </LoadMoreButton>
              )}
            </>
          )}

          {isLoading && notifications.length === 0 && (
            <LoadingMessage>알림을 불러오는 중...</LoadingMessage>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};
