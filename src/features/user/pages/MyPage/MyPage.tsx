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
} from "lucide-react";
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
import type { VerificationStatus } from "../../../../types";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "0")};
`;

const ProfileCard = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  align-items: flex-start;
`;

const ProfileAvatar = styled.div<{ $isMobile?: boolean }>`
  width: 100px;
  height: 100px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isMobile }) => ($isMobile ? "32px" : "40px")};
  border: 3px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.gray500};
  flex-shrink: 0;
`;

const ProfileInfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
`;

const VerificationContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ProfileName = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const LevelDisplaySection = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0;
`;

const LevelText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const PointsText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
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
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  font-weight: 500;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  white-space: nowrap;

  ${({ $status, $isLocation, theme }) => {
    if ($isLocation && $status === "APPROVED") {
      return `
        color: #F59E0B;
        background: #F59E0B15;
      `;
    }

    switch ($status) {
      case "APPROVED":
        return `
          color: ${theme.colors.success};
          background: ${theme.colors.success}15;
        `;
      case "PENDING":
        return `
          color: ${theme.colors.warning};
          background: ${theme.colors.warning}15;
        `;
      case "REJECTED":
        return `
          color: ${theme.colors.danger};
          background: ${theme.colors.danger}15;
        `;
      default:
        return `
          color: ${theme.colors.text.secondary};
          background: ${theme.colors.gray100};
        `;
    }
  }}
`;

const LevelProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 4px;
  margin-top: 4px;
  overflow: hidden;
`;

const LevelProgress = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

const LevelProgressText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`;

const ActivitySection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  text-align: center;
  transition: ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ActivityIcon = styled.div<{ $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color, theme }) => $color || theme.colors.primary}15;
  color: ${({ $color, theme }) => $color || theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px auto;
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
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
  padding: ${({ $isMobile }) => ($isMobile ? "8px 16px" : "10px 20px")};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
`;

const AchievementSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
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
  const [levelInfo, setLevelInfo] = React.useState<LevelInfo | null>(null);
  const [activityStats, setActivityStats] =
    React.useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 온보딩 스토어에서 카테고리 데이터 가져오기
  const { categories, loadStaticData } = useOnboardingStore();

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
        console.log("🔄 사용자 데이터 조회 시작:", user?.id);
        setIsLoading(true);
        setError(null);

        // 동시에 사용자 정보와 활동 통계 조회
        const [userData, activityData] = await Promise.all([
          userApiService.getMe(),
          userApiService.getActivityStats(),
        ]);

        console.log("✅ 사용자 정보 조회 성공:", userData);
        console.log("✅ 활동 통계 조회 성공:", activityData);

        setUserInfo(userData);
        setActivityStats(activityData);
      } catch (err) {
        console.error("❌ 사용자 데이터 조회 실패:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // 카테고리 데이터 로드
  React.useEffect(() => {
    if (categories.length === 0) {
      loadStaticData();
    }
  }, [categories.length, loadStaticData]);

  // 레벨 정보 조회
  React.useEffect(() => {
    const fetchLevelInfo = async () => {
      if (userInfo?.profile?.level) {
        try {
          const levelData = await userApiService.getLevelInfo(
            userInfo.profile.level
          );
          setLevelInfo(levelData);
        } catch (err) {
          console.error("❌ 레벨 정보 조회 실패:", err);
        }
      }
    };

    fetchLevelInfo();
  }, [userInfo]);

  // 로딩 상태
  if (isLoading) {
    return (
      <PageContainer $isMobile={isMobile}>
        <div>사용자 정보를 불러오는 중...</div>
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
        <div>사용자 정보를 불러오는 중...</div>
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
    if (!levelInfo || !userInfo?.profile?.points) return 0;
    const currentPoints = userInfo.profile.points;
    const requiredPoints = levelInfo.requiredPoints;
    const prevLevelPoints =
      levelInfo.level === 1 ? 0 : Math.max(0, requiredPoints - 100); // 임시로 이전 레벨 포인트 계산
    const progressPoints = currentPoints - prevLevelPoints;
    const levelRange = requiredPoints - prevLevelPoints;
    return Math.min((progressPoints / levelRange) * 100, 100);
  };

  const getRemainingPoints = () => {
    if (!levelInfo || !userInfo?.profile?.points) return 0;
    return Math.max(0, levelInfo.requiredPoints - userInfo.profile.points);
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
                지역 인증
              </VerificationBadge>
            </VerificationContainer>
          </ProfileHeader>

          <LevelDisplaySection $isMobile={isMobile}>
            <LevelText $isMobile={isMobile}>
              Lv.{userInfo.profile?.level || 1}
            </LevelText>
            <PointsText $isMobile={isMobile}>
              {userInfo.profile?.points || 0}P
            </PointsText>
          </LevelDisplaySection>

          <ProgressSection>
            <LevelProgressBar>
              <LevelProgress $progress={calculateProgress()} />
            </LevelProgressBar>
            <LevelProgressText $isMobile={isMobile}>
              {userInfo.profile?.level === 1 ? (
                "첫 미션을 통해 경험을 쌓아보세요 🎯"
              ) : (
                <>
                  다음 레벨까지 {getRemainingPoints()}P
                  {levelInfo && levelInfo.rewardAiTickets > 0 && (
                    <span style={{ marginLeft: "8px", color: "#10B981" }}>
                      🎫 {levelInfo.rewardAiTickets}개 보상
                    </span>
                  )}
                </>
              )}
            </LevelProgressText>
          </ProgressSection>

          {/* 자기소개 표시 */}
          {userInfo.profile?.bio && (
            <div
              style={{
                marginTop: "12px",
                padding: "8px 0",
                fontSize: isMobile ? "14px" : "15px",
                color: "#6B7280",
                lineHeight: "1.4",
              }}
            >
              {userInfo.profile.bio}
            </div>
          )}
        </ProfileInfoContainer>
      </ProfileCard>

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
          <MessageSquare size={isMobile ? 16 : 18} />
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
          업적
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
            interests: userInfo.profile?.interests
              ? (userInfo.profile.interests
                  .map((interestName) => {
                    const category = categories.find(
                      (cat) => cat.name === interestName
                    );
                    return category ? category.id : interestName;
                  })
                  .filter((id) => typeof id === "string") as string[])
              : [],
            hashtags: userInfo.profile?.hashtags
              ? (userInfo.profile.hashtags
                  .map((hashtagName) => {
                    const hashtag = categories.find(
                      (cat) => cat.name === hashtagName
                    );
                    return hashtag ? parseInt(hashtag.id, 10) : null;
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
