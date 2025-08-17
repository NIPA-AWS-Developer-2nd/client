import styled from "styled-components";

// 새로운 모임 카드 스타일 (개선된 버전)
export const NewCard = styled.article<{ $status?: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  overflow: hidden;
  border: 3px solid ${({ theme, $status }) => {
    switch ($status) {
      case 'recruiting':
        return '#10b981'; // 초록색
      case 'active':
        return '#3b82f6'; // 파란색
      case 'completed':
        return theme.colors.primary; // 주황색 (theme primary)
      default:
        return theme.colors.border.primary;
    }
  }};
`;

// 1번째 블록: 핵심 정보 (제목, 일정·장소, 모집마감)
export const PrimaryBlock = styled.div<{ $backgroundImage?: string }>`
  position: relative;
  padding: 20px 20px 16px 20px;
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage ? `url(${$backgroundImage})` : "none"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  /* 어둠 오버레이 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    z-index: 1;
  }

  /* 하단 페이드 효과 */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 12px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.1) 60%,
      rgba(0, 0, 0, 0.2) 100%
    );
    z-index: 2;
  }

  /* 자식 요소들이 오버레이 위에 표시되도록 */
  > * {
    position: relative;
    z-index: 3;
  }
`;

export const MissionHeader = styled.div`
  margin-bottom: 12px;
`;

export const MissionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

export const MissionMeta = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 11px;
  font-weight: 500;
  backdrop-filter: blur(4px);
`;

export const DifficultyBadge = styled.span<{
  $difficulty: string;
}>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 11px;
  font-weight: 600;
  background: ${({ $difficulty }) => {
    switch ($difficulty?.toLowerCase()) {
      case "very_easy":
      case "매우 쉬움":
        return "rgba(34, 197, 94, 0.8)"; // 녹색 - 매우 쉬움
      case "easy":
      case "쉬움":
        return "rgba(16, 185, 129, 0.8)"; // 청녹색 - 쉬움
      case "medium":
      case "보통":
        return "rgba(245, 158, 11, 0.8)"; // 노란색 - 보통
      case "hard":
      case "어려움":
        return "rgba(239, 68, 68, 0.8)"; // 빨간색 - 어려움
      case "very_hard":
      case "매우 어려움":
        return "rgba(185, 28, 28, 0.8)"; // 진한 빨간색 - 매우 어려움
      default:
        return "rgba(255, 255, 255, 0.2)";
    }
  }};
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
`;

export const PointBadge = styled.span<{ $point: number }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 11px;
  font-weight: 800;
  background: ${({ $point }) => {
    if ($point < 500) {
      return "rgba(156, 163, 175, 0.8)";
    } else if ($point < 1000) {
      return "linear-gradient(135deg, rgba(147, 197, 253, 0.8), rgba(96, 165, 250, 0.8))";
    } else if ($point < 1500) {
      return "linear-gradient(135deg, rgba(134, 239, 172, 0.8), rgba(74, 222, 128, 0.8))";
    } else if ($point < 2000) {
      return "linear-gradient(135deg, rgba(196, 181, 253, 0.8), rgba(167, 139, 250, 0.8))";
    } else {
      return "linear-gradient(135deg, rgba(253, 186, 116, 0.8), rgba(251, 146, 60, 0.8))";
    }
  }};
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

export const MeetingInfoSection = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MeetingInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

  svg {
    flex-shrink: 0;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
  }

  span {
    line-height: 1.3;
  }
`;

export const DeadlineContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    font-weight: normal;
  }
`;

export const DeadlineText = styled.span<{ $urgent?: boolean }>`
  font-weight: 700;
  padding: 1px 6px;
  background: ${({ $urgent }) =>
    $urgent ? "rgba(239, 68, 68, 0.6)" : "rgba(34, 197, 94, 0.6)"};
  border-radius: 4px;
  backdrop-filter: blur(4px);
  display: inline-block;
  animation: ${({ $urgent }) =>
    $urgent ? "pulse 2s ease-in-out infinite" : "none"};

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }
`;

export const RecruitDeadline = styled.div<{ $urgent?: boolean }>`
  font-size: 13px;
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  background: ${
    ({ $urgent }) =>
      $urgent
        ? "rgba(239, 68, 68, 0.8)" // 긴급한 경우 빨간색
        : "rgba(34, 197, 94, 0.8)" // 여유 있는 경우 초록색
  };
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  backdrop-filter: blur(4px);
  animation: ${({ $urgent }) =>
    $urgent ? "pulse 2s ease-in-out infinite" : "none"};

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }
`;

// 2번째 블록: 호스트 정보
export const HostBlock = styled.div`
  padding: 14px 20px;
  background: ${({ theme }) => theme.colors.surface};
`;

export const HostTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 9px;
`;

export const HostSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
`;

export const HostAvatarWrapper = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
`;

export const HostAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.gray200};
`;

export const CrownIcon = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.colors.white};

  svg {
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
  }
`;

export const HostInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  > div:first-child {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export const HostName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const HostLevel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const HostMbti = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 2px 6px;
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;
  display: inline-block;
  width: fit-content;
  align-self: flex-start;
`;

export const LikesOverlay = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  z-index: 10;
`;

export const LikesCountOverlay = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

// 3번째 블록: 선호 특성
export const PreferenceBlock = styled.div`
  padding: 14px 20px;
  background: ${({ theme }) => theme.colors.surface};
`;

export const PreferenceSection = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PreferenceTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
`;

export const NeutralTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
`;

export const PreferenceTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const PreferredTag = styled.span`
  padding: 5px 12px;
  background: ${({ theme }) => theme.colors.primary + "15"};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

export const NeutralTag = styled.span`
  padding: 5px 12px;
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

// 4번째 블록: 참가자 리스트
export const ParticipantsBlock = styled.div`
  padding: 14px 20px 16px 20px;
  background: ${({ theme }) => theme.colors.surface};
`;

export const ParticipantsTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 10px;
`;

export const ParticipantAvatars = styled.div`
  display: flex;
  align-items: center;
`;

export const ParticipantAvatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  margin-left: -8px;

  &:first-child {
    margin-left: 0;
  }
`;

export const MoreParticipants = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-left: -8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

export const ParticipantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  span {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.text.secondary};
    
    &:last-child {
      font-weight: 500;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
