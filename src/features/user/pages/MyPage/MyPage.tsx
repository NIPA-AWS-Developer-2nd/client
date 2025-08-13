import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  CheckCircle,
  AlertCircle,
  Users,
  Trophy,
  Edit2,
  Heart,
  Award,
  MessageSquare,
  Star,
  User as UserIcon,
  Hash,
  Gift,
  Quote,
} from "lucide-react";
import ticketIcon from "../../../../assets/emojis/ticket-removebg.png";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import { useAuth, type User } from "../../../auth";
import { ProfileEditModal } from "../../components/ProfileEditModal";
import {
  userApiService,
  type CompleteUserInfo,
  type LevelInfo,
  type ActivityStats,
} from "../../../../shared/services";
import { useOnboardingStore } from "../../../../shared/store";
import { ImageModal } from "../../../../shared/components/common/ImageModal";
import { useImageModal } from "../../../../shared/hooks/useImageModal";
import { Skeleton } from "../../../../shared/components/ui";
import type { VerificationStatus } from "../../../../types";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "0")};
  background: white;
  min-height: 100vh;
`;

const ProfileCard = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "32px 24px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const ProfileAvatar = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "80px" : "100px")};
  height: ${({ $isMobile }) => ($isMobile ? "80px" : "100px")};
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isMobile }) => ($isMobile ? "28px" : "40px")};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.colors.gray500};
  flex-shrink: 0;
  margin-bottom: 16px;
`;

const ProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const VerificationContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 8px;
`;

const ProfileName = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "22px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const LevelText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const BioSection = styled.div<{ $isMobile?: boolean }>`
  margin-top: 10px;
  padding: 12px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: #6b7280;
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
`;

const RewardSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "32px 24px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const RewardTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressSection = styled.div`
  margin: 4px 0 12px 0;
`;

const VerificationBadge = styled.div<{
  $status: VerificationStatus;
  $isMobile?: boolean;
  $isLocation?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  font-weight: 600;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  ${({ $status, $isLocation, theme }) => {
    if ($isLocation) {
      if ($status === "APPROVED") {
        return `
          color: #059669;
          background: linear-gradient(135deg, #D1FAE5, #10B98120);
          border: 1px solid #10B98130;
        `;
      } else {
        return `
          color: #6B7280;
          background: linear-gradient(135deg, #F3F4F6, #9CA3AF20);
          border: 1px solid #9CA3AF30;
        `;
      }
    }

    if ($status === "APPROVED") {
      return `
        color: #1E40AF;
        background: linear-gradient(135deg, #DBEAFE, #3B82F620);
        border: 1px solid #3B82F630;
      `;
    }

    switch ($status) {
      case "PENDING":
        return `
          color: ${theme.colors.warning};
          background: linear-gradient(135deg, #FEF3C7, ${theme.colors.warning}20);
          border: 1px solid ${theme.colors.warning}30;
        `;
      case "REJECTED":
        return `
          color: ${theme.colors.danger};
          background: linear-gradient(135deg, #FEE2E2, ${theme.colors.danger}20);
          border: 1px solid ${theme.colors.danger}30;
        `;
      default:
        return `
          color: ${theme.colors.text.secondary};
          background: ${theme.colors.gray100};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;

const LevelProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  margin-top: 8px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LevelProgress = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.primary}CC
  );
  border-radius: 8px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
    border-radius: 8px 8px 0 0;
  }
`;

const LevelProgressText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 8px;
  font-weight: 500;
  line-height: 1.4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const ActivitySection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "32px 24px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const ActivityTitle = styled.h4<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActivityGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const ActivityCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary}15;
  }
`;

const ActivityIcon = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ $color, theme }) => $color || theme.colors.primary}15,
    ${({ $color, theme }) => $color || theme.colors.primary}08
  );
  color: ${({ $color, theme }) => $color || theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
  box-shadow: 0 2px 8px
    ${({ $color, theme }) => $color || theme.colors.primary}20;
  transition: all 0.3s ease;
`;

const ActivityValue = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const ActivityLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const ProfileEditButton = styled.button<{ $isMobile?: boolean }>`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ $isMobile }) => ($isMobile ? "6px 12px" : "8px 14px")};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  z-index: 10;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:active {
    transform: scale(0.98);
  }
`;

const PreferenceSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "32px 24px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const PreferenceTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CategoryTag = styled.div<{ $isMobile?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $isMobile }) => ($isMobile ? "10px 16px" : "12px 20px")};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.gray50},
    ${({ theme }) => theme.colors.white}
  );
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}30;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary}05,
      ${({ theme }) => theme.colors.white}
    );
  }
`;

const AchievementSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "32px 24px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const AchievementTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AchievementGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const AchievementItem = styled.div<{
  $isMobile?: boolean;
  $achieved?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  background: ${({ $achieved, theme }) =>
    $achieved ? theme.colors.primary + "10" : theme.colors.white};
  border: 1px solid
    ${({ $achieved, theme }) =>
      $achieved ? theme.colors.primary + "30" : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const AchievementIcon = styled.div<{ $achieved?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $achieved, theme }) =>
    $achieved ? theme.colors.primary : theme.colors.gray200};
  color: ${({ $achieved, theme }) =>
    $achieved ? theme.colors.white : theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const AchievementName = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: 2px;
`;

const AchievementDesc = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

export const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [showProfileEditModal, setShowProfileEditModal] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<CompleteUserInfo | null>(null);
  const [currentLevelInfo, setCurrentLevelInfo] =
    React.useState<LevelInfo | null>(null);
  const [nextLevelInfo, setNextLevelInfo] = React.useState<LevelInfo | null>(
    null
  );
  const [activityStats, setActivityStats] =
    React.useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 온보딩 스토어에서 카테고리와 해시태그 데이터 가져오기
  const { categories, hashtags, loadStaticData } = useOnboardingStore();

  // 이미지 모달 훅
  const imageModal = useImageModal(1);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 사용자 프로필 정보 및 활동 통계 조회
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        // console.log("사용자 데이터 조회 시작:", user?.id);
        setIsLoading(true);
        setError(null);

        // 딜레이 추가
        const [userData, activityData] = await Promise.all([
          userApiService.getMe(),
          userApiService.getActivityStats(),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);

        // console.log("사용자 정보 조회 성공:", userData);
        // console.log("활동 통계 조회 성공:", activityData);

        // console.log("사용자 정보:", userData);
        // console.log("프로필 관심사:", userData.profile?.interests);

        setUserInfo(userData);
        setActivityStats(activityData);
      } catch (err) {
        // console.error("❌ 사용자 데이터 조회 실패:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // 카테고리와 해시태그 데이터 로드
  React.useEffect(() => {
    if (categories.length === 0 || hashtags.length === 0) {
      loadStaticData();
    }
  }, [categories.length, hashtags.length, loadStaticData]);

  // 현재 레벨과 다음 레벨 정보 조회
  React.useEffect(() => {
    const fetchLevelInfo = async () => {
      if (userInfo?.profile?.level) {
        try {
          const [currentLevel, nextLevel] = await Promise.all([
            userApiService.getLevelInfo(userInfo.profile.level),
            userApiService
              .getLevelInfo(userInfo.profile.level + 1)
              .catch(() => null),
          ]);

          setCurrentLevelInfo(currentLevel);
          setNextLevelInfo(nextLevel);
        } catch (_err) {
          // console.error("레벨 정보 조회 실패:", err);
        }
      }
    };

    fetchLevelInfo();
  }, [userInfo]);

  // 로딩 상태
  if (isLoading) {
    return (
      <PageContainer $isMobile={isMobile}>
        {/* 프로필 카드 스켈레톤 */}
        <ProfileCard $isMobile={isMobile}>
          {/* 프로필 이미지 스켈레톤 */}
          <Skeleton
            width={isMobile ? "80px" : "100px"}
            height={isMobile ? "80px" : "100px"}
            borderRadius="50%"
            marginBottom="16px"
          />

          {/* 닉네임 + 레벨 스켈레톤 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Skeleton width="120px" height="24px" />
            <Skeleton width="60px" height="20px" />
          </div>

          {/* 인증 배지 스켈레톤 */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <Skeleton width="80px" height="24px" borderRadius="12px" />
            <Skeleton width="100px" height="24px" borderRadius="12px" />
          </div>

          {/* 바이오 스켈레톤 */}
          <Skeleton width="200px" height="16px" />
        </ProfileCard>

        {/* 리워드 섹션 스켈레톤 */}
        <RewardSection $isMobile={isMobile}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Skeleton width="20px" height="20px" />
            <Skeleton width="100px" height="18px" />
          </div>
          <Skeleton
            width="100%"
            height="10px"
            borderRadius="8px"
            marginBottom="8px"
          />
          <Skeleton width="150px" height="12px" />
        </RewardSection>

        {/* 관심사 섹션 스켈레톤 */}
        <PreferenceSection $isMobile={isMobile}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Skeleton width="18px" height="18px" />
            <Skeleton width="100px" height="16px" />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  width="80px"
                  height="36px"
                  borderRadius="18px"
                />
              ))}
          </div>
        </PreferenceSection>

        {/* 해시태그 섹션 스켈레톤 */}
        <PreferenceSection $isMobile={isMobile}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Skeleton width="18px" height="18px" />
            <Skeleton width="80px" height="16px" />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  width="70px"
                  height="36px"
                  borderRadius="18px"
                />
              ))}
          </div>
        </PreferenceSection>

        {/* 활동 내역 스켈레톤 */}
        <ActivitySection $isMobile={isMobile}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Skeleton width="18px" height="18px" />
            <Skeleton width="80px" height="16px" />
          </div>
          <ActivityGrid $isMobile={isMobile}>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  style={{
                    padding: isMobile ? "16px" : "20px",
                    textAlign: "center",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow:
                      "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Skeleton
                    width="40px"
                    height="40px"
                    borderRadius="50%"
                    marginBottom="12px"
                  />
                  <Skeleton width="30px" height="18px" marginBottom="4px" />
                  <Skeleton width="60px" height="12px" />
                </div>
              ))}
          </ActivityGrid>
        </ActivitySection>

        {/* 업적 섹션 스켈레톤 */}
        <AchievementSection $isMobile={isMobile}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Skeleton width="18px" height="18px" />
            <Skeleton width="120px" height="16px" />
          </div>
          <AchievementGrid $isMobile={isMobile}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: isMobile ? "12px" : "16px",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Skeleton
                    width="40px"
                    height="40px"
                    borderRadius="50%"
                    marginBottom="8px"
                  />
                  <Skeleton width="50px" height="12px" marginBottom="2px" />
                  <Skeleton width="60px" height="11px" />
                </div>
              ))}
          </AchievementGrid>
        </AchievementSection>
      </PageContainer>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <PageContainer $isMobile={isMobile}>
        <div>사용자 정보를 불러오는데 실패했습니다: {error}</div>
      </PageContainer>
    );
  }

  // userInfo가 없으면 로딩 상태 표시
  if (!userInfo) {
    return (
      <PageContainer $isMobile={isMobile}>
        <div>사용자 정보를 불러오는 중</div>
      </PageContainer>
    );
  }

  const getVerificationIcon = (status: VerificationStatus) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle size={14} />;
      case "PENDING":
        return <AlertCircle size={14} />;
      case "REJECTED":
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  // 관심사 데이터 (이모지 포함)
  const userInterests = (userInfo?.profile?.interests || []).map(
    (interestName) => {
      // 백엔드 카테고리에서 해당하는 이모지 찾기
      const category = categories.find((cat) => cat.name === interestName);
      return category ? `${category.icon} ${category.name}` : interestName;
    }
  );

  // 해시태그 데이터 (실제 사용자 데이터 사용)
  const userHashtags: string[] = userInfo.profile?.hashtags || [
    "#활발한",
    "#친근한",
    "#긍정적인",
  ]; // 기본값

  // 레벨 진행률 계산
  const calculateProgress = () => {
    if (!currentLevelInfo || !nextLevelInfo || !userInfo?.profile?.points)
      return 0;

    const currentPoints = userInfo.profile.points;
    const currentLevelRequired = currentLevelInfo.requiredPoints;
    const nextLevelRequired = nextLevelInfo.requiredPoints;

    // 현재 레벨에서 다음 레벨까지의 진행률 계산
    const progressInCurrentLevel = currentPoints - currentLevelRequired;
    const totalPointsNeeded = nextLevelRequired - currentLevelRequired;

    return Math.min((progressInCurrentLevel / totalPointsNeeded) * 100, 100);
  };

  const getRemainingPoints = () => {
    if (!nextLevelInfo || !userInfo?.profile?.points) return 0;
    return Math.max(0, nextLevelInfo.requiredPoints - userInfo.profile.points);
  };

  // 업적 데이터
  const achievements = [
    {
      id: 1,
      name: "첫 모임",
      desc: "첫 모임 참여",
      icon: Users,
      achieved: true,
    },
    {
      id: 2,
      name: "인증 마스터",
      desc: "10회 인증",
      icon: CheckCircle,
      achieved: true,
    },
    {
      id: 3,
      name: "리뷰왕",
      desc: "5개 리뷰 작성",
      icon: Star,
      achieved: true,
    },
    {
      id: 4,
      name: "모임 호스트",
      desc: "첫 모임 주최",
      icon: Trophy,
      achieved: true,
    },
    {
      id: 5,
      name: "활발한 참여자",
      desc: "20회 모임 참여",
      icon: Users,
      achieved: false,
    },
    {
      id: 6,
      name: "인기 호스트",
      desc: "10회 모임 주최",
      icon: Award,
      achieved: false,
    },
  ];

  return (
    <PageContainer $isMobile={isMobile}>
      <ProfileCard $isMobile={isMobile}>
        <ProfileEditButton
          $isMobile={isMobile}
          onClick={() => setShowProfileEditModal(true)}
        >
          <Edit2 size={14} />
          편집
        </ProfileEditButton>

        <ProfileAvatar
          $isMobile={isMobile}
          onClick={() => {
            if (userInfo.profile?.profileImageUrl) {
              imageModal.openModal(0);
            }
          }}
          style={{
            cursor: userInfo.profile?.profileImageUrl ? "pointer" : "default",
          }}
        >
          {userInfo.profile?.profileImageUrl ? (
            <img
              src={userInfo.profile.profileImageUrl}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <UserIcon size={40} />
          )}
        </ProfileAvatar>

        <ProfileInfoContainer>
          <ProfileHeader>
            <ProfileName $isMobile={isMobile}>
              {userInfo.profile?.nickname || "사용자"}
              <LevelText $isMobile={isMobile}>
                Lv.{userInfo.profile?.level || 1}
              </LevelText>
            </ProfileName>
            <VerificationContainer>
              <VerificationBadge
                $status={userInfo.phoneVerifiedAt ? "APPROVED" : "PENDING"}
                $isMobile={isMobile}
              >
                {getVerificationIcon(
                  userInfo.phoneVerifiedAt ? "APPROVED" : "PENDING"
                )}
                번호 인증
              </VerificationBadge>
              <VerificationBadge
                $status={userInfo.districtVerifiedAt ? "APPROVED" : "PENDING"}
                $isMobile={isMobile}
                $isLocation={true}
              >
                {getVerificationIcon(
                  userInfo.districtVerifiedAt ? "APPROVED" : "PENDING"
                )}
                {userInfo.districtVerifiedAt
                  ? "지역 인증"
                  : "지역인증이 필요합니다"}
              </VerificationBadge>
            </VerificationContainer>
          </ProfileHeader>

          {/* 자기소개 표시 */}
          {userInfo.profile?.bio && (
            <BioSection $isMobile={isMobile}>
              <span>{userInfo.profile.bio}</span>
              <Quote
                size={16}
                style={{
                  opacity: 0.7,
                  flexShrink: 0,
                  marginTop: "-4px",
                }}
              />
            </BioSection>
          )}
        </ProfileInfoContainer>
      </ProfileCard>

      {/* 리워드 섹션 */}
      <RewardSection $isMobile={isMobile}>
        <RewardTitle $isMobile={isMobile}>
          <Gift size={isMobile ? 16 : 18} />
          다음 보상
        </RewardTitle>
        <ProgressSection>
          <LevelProgressBar>
            <LevelProgress $progress={calculateProgress()} />
          </LevelProgressBar>
          <LevelProgressText $isMobile={isMobile}>
            {userInfo.profile?.level === 1 ? (
              <span>첫 미션을 통해 경험을 쌓아보세요 🎯</span>
            ) : (
              <>
                <span>다음 레벨까지 {getRemainingPoints()}P 남음</span>
                {nextLevelInfo && nextLevelInfo.rewardAiTickets > 0 && (
                  <span
                    style={{
                      color: "#10B981",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: "600",
                    }}
                  >
                    <img
                      src={ticketIcon}
                      alt="티켓"
                      style={{ width: "20px", height: "18px" }}
                    />
                    {nextLevelInfo.rewardAiTickets}개 보상
                  </span>
                )}
              </>
            )}
          </LevelProgressText>
        </ProgressSection>
      </RewardSection>

      {/* 관심사 섹션 */}
      <PreferenceSection $isMobile={isMobile}>
        <PreferenceTitle $isMobile={isMobile}>
          <Heart size={isMobile ? 16 : 18} />
          관심 카테고리
        </PreferenceTitle>
        <CategoryTags>
          {userInterests.map((interest, index) => (
            <CategoryTag key={index} $isMobile={isMobile}>
              {interest}
            </CategoryTag>
          ))}
        </CategoryTags>
      </PreferenceSection>

      {/* 해시태그 섹션 */}
      <PreferenceSection $isMobile={isMobile}>
        <PreferenceTitle $isMobile={isMobile}>
          <Hash size={isMobile ? 16 : 18} />
          해시태그
        </PreferenceTitle>
        <CategoryTags>
          {userHashtags.map((hashtag, index) => (
            <CategoryTag key={index} $isMobile={isMobile}>
              {hashtag}
            </CategoryTag>
          ))}
        </CategoryTags>
      </PreferenceSection>

      <ActivitySection $isMobile={isMobile}>
        <ActivityTitle $isMobile={isMobile}>
          <Trophy size={isMobile ? 16 : 18} />
          활동 내역
        </ActivityTitle>
        <ActivityGrid $isMobile={isMobile}>
          <ActivityCard $isMobile={isMobile}>
            <ActivityIcon $color="#10B981">
              <CheckCircle size={16} />
            </ActivityIcon>
            <ActivityValue $isMobile={isMobile}>
              {activityStats?.verificationCount || 0}
            </ActivityValue>
            <ActivityLabel $isMobile={isMobile}>인증 횟수</ActivityLabel>
          </ActivityCard>

          <ActivityCard $isMobile={isMobile}>
            <ActivityIcon $color="#7C3AED">
              <MessageSquare size={16} />
            </ActivityIcon>
            <ActivityValue $isMobile={isMobile}>
              {activityStats?.reviewCount || 0}
            </ActivityValue>
            <ActivityLabel $isMobile={isMobile}>작성한 리뷰</ActivityLabel>
          </ActivityCard>

          <ActivityCard
            $isMobile={isMobile}
            onClick={() => navigate("/meetings")}
          >
            <ActivityIcon $color="#6366F1">
              <Users size={16} />
            </ActivityIcon>
            <ActivityValue $isMobile={isMobile}>
              {activityStats?.hostedMeetingCount || 0}
            </ActivityValue>
            <ActivityLabel $isMobile={isMobile}>주최한 모임</ActivityLabel>
          </ActivityCard>

          <ActivityCard
            $isMobile={isMobile}
            onClick={() => navigate("/missions")}
          >
            <ActivityIcon $color="#F59E0B">
              <Trophy size={16} />
            </ActivityIcon>
            <ActivityValue $isMobile={isMobile}>
              {activityStats?.completedMissionCount || 0}
            </ActivityValue>
            <ActivityLabel $isMobile={isMobile}>완료한 미션</ActivityLabel>
          </ActivityCard>
        </ActivityGrid>
      </ActivitySection>

      <AchievementSection $isMobile={isMobile}>
        <AchievementTitle $isMobile={isMobile}>
          <Award size={isMobile ? 16 : 18} />
          업적 (임시 데이터)
        </AchievementTitle>
        <AchievementGrid $isMobile={isMobile}>
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <AchievementItem
                key={achievement.id}
                $isMobile={isMobile}
                $achieved={achievement.achieved}
              >
                <AchievementIcon $achieved={achievement.achieved}>
                  <IconComponent size={20} />
                </AchievementIcon>
                <AchievementName $isMobile={isMobile}>
                  {achievement.name}
                </AchievementName>
                <AchievementDesc $isMobile={isMobile}>
                  {achievement.desc}
                </AchievementDesc>
              </AchievementItem>
            );
          })}
        </AchievementGrid>
      </AchievementSection>

      {/* 프로필 편집 모달 */}
      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        isMobile={isMobile}
        user={
          {
            ...user,
            // 기본 정보
            phoneNumber: userInfo.phoneNumber,

            // 프로필 정보
            name: userInfo.profile?.nickname,
            nickname: userInfo.profile?.nickname,
            birthYear: userInfo.profile?.birthYear?.toString(),
            gender: userInfo.profile?.gender,
            bio: userInfo.profile?.bio,
            profile_image_url: userInfo.profile?.profileImageUrl,
            interests:
              userInfo.profile?.interests && categories.length > 0
                ? (userInfo.profile.interests
                    .map((interestName) => {
                      // console.log("관심사 변환:", { interestName, categories: categories.length });
                      const category = categories.find(
                        (cat) => cat.name === interestName
                      );
                      // console.log("찾은 카테고리:", category);
                      return category ? category.id : null;
                    })
                    .filter((id) => id !== null) as string[])
                : [],
            hashtags:
              userInfo.profile?.hashtags && hashtags.length > 0
                ? (userInfo.profile.hashtags
                    .map((hashtagName) => {
                      const hashtag = hashtags.find(
                        (tag) => tag.name === hashtagName
                      );
                      return hashtag ? hashtag.id : null;
                    })
                    .filter((id) => id !== null) as number[])
                : [],
            mbti: userInfo.profile?.mbti,
            districtId: userInfo.profile?.district?.id,

            // 지역 정보 (district가 있으면 locationData 설정)
            locationData: userInfo.profile?.district
              ? {
                  districtId: userInfo.profile.district.id,
                  districtName: userInfo.profile.district.name,
                  city: userInfo.profile.district.city,
                  regionCode: userInfo.profile.district.id,
                }
              : undefined,

            // 인증 상태 정보
            isPhoneVerified: !!userInfo.phoneVerifiedAt,
            isLocationVerified: !!userInfo.districtVerifiedAt,
          } as User
        }
        onSave={async (updatedUser) => {
          try {
            console.log("프로필 업데이트:", updatedUser);

            // API 요청 데이터 구성
            // interests를 number 배열로 변환
            const userInterestIds = Array.isArray(updatedUser.interests)
              ? updatedUser.interests
                  .map((id) => parseInt(id, 10))
                  .filter((id) => !isNaN(id))
              : [];

            // hashtags를 ID 배열로 변환 (이미 number 배열)
            const userHashtagIds = Array.isArray(updatedUser.hashtags)
              ? updatedUser.hashtags
              : [];

            const updateData = {
              nickname: updatedUser.nickname,
              bio: updatedUser.bio,
              profileImageUrl: updatedUser.profile_image_url,
              userInterestIds: userInterestIds,
              userHashtagIds: userHashtagIds,
              mbti: updatedUser.mbti,
              districtId: updatedUser.districtId,
              birthYear: updatedUser.birthYear,
              gender: updatedUser.gender,
            };

            console.log("API 요청 데이터:", updateData);

            // 실제 API 호출로 프로필 업데이트
            await userApiService.updateProfile(updateData);

            alert("프로필이 성공적으로 업데이트되었습니다!");
            setShowProfileEditModal(false);

            // 프로필 정보 다시 조회
            const refreshedUserInfo = await userApiService.getMe();
            setUserInfo(refreshedUserInfo);
          } catch (error) {
            console.error("프로필 업데이트 실패:", error);
            alert(
              `프로필 업데이트에 실패했습니다: ${
                error instanceof Error ? error.message : "알 수 없는 오류"
              }`
            );
          }
        }}
      />

      {/* 프로필 이미지 확대 모달 */}
      {userInfo.profile?.profileImageUrl && (
        <ImageModal
          isOpen={imageModal.isOpen}
          onClose={imageModal.closeModal}
          images={[userInfo.profile.profileImageUrl]}
          currentIndex={imageModal.currentIndex}
          showNavigation={false}
        />
      )}
    </PageContainer>
  );
};
