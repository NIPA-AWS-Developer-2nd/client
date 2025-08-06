import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  CheckCircle,
  AlertCircle,
  Users,
  Trophy,
  Mail,
  Phone,
  Edit2,
  Heart,
  Award,
  MessageSquare,
  Star,
  User as UserIcon,
} from "lucide-react";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import { useAuth } from "../../../auth";
import { ProfileEditModal } from "../../components/ProfileEditModal";
import type {
  User,
  VerificationStatus,
  AccountStatus,
} from "../../../../types";
import { CATEGORIES_WITHOUT_ALL } from "../../../../data/categories";

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

const ContactInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;
  }
`;

const ProfileEmail = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ProfilePhone = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
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
    background: ${({ theme }) => theme.colors.gray50};
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

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }

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

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
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
    background: ${({ $achieved, theme }) =>
      $achieved ? theme.colors.primary + "15" : theme.colors.gray50};
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

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock 사용자 데이터
  const mockUserData: User = {
    id: 1,
    provider: "KAKAO",
    provider_user_id: "123456789",
    email: user?.email || "mission@example.com",
    name: user?.nickname || "unknown",
    phone: "010-1234-5678",
    profile_image_url: user?.profileImage || undefined,
    status: "ACTIVE" as AccountStatus,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: new Date().toISOString(),
  };

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

  // 관심 카테고리 데이터
  const selectedCategories = [
    "culture",
    "sports",
    "food",
    "travel",
    "gaming",
    "photo",
  ];
  const interestCategories = CATEGORIES_WITHOUT_ALL.filter((cat) =>
    selectedCategories.includes(cat.id)
  ).map((cat) => cat.label);

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

        <ProfileAvatar $isMobile={isMobile}>
          {mockUserData.profile_image_url ? (
            <img
              src={mockUserData.profile_image_url}
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
            <ProfileName $isMobile={isMobile}>{mockUserData.name}</ProfileName>
            <VerificationContainer>
              <VerificationBadge $status={"APPROVED"} $isMobile={isMobile}>
                {getVerificationIcon("APPROVED")}
                번호 인증
              </VerificationBadge>
              <VerificationBadge
                $status={"APPROVED"}
                $isMobile={isMobile}
                $isLocation={true}
              >
                {getVerificationIcon("APPROVED")}
                지역 인증
              </VerificationBadge>
            </VerificationContainer>
          </ProfileHeader>

          <LevelDisplaySection $isMobile={isMobile}>
            <LevelText $isMobile={isMobile}>Lv.8</LevelText>
            <PointsText $isMobile={isMobile}>1,250P</PointsText>
          </LevelDisplaySection>

          <ProgressSection>
            <LevelProgressBar>
              <LevelProgress $progress={65} />
            </LevelProgressBar>
            <LevelProgressText $isMobile={isMobile}>
              다음 레벨까지 350P
            </LevelProgressText>
          </ProgressSection>

          <ContactInfo>
            <ProfileEmail $isMobile={isMobile}>
              <Mail size={12} />
              {mockUserData.email}
            </ProfileEmail>
            <ProfilePhone $isMobile={isMobile}>
              <Phone size={12} />
              {mockUserData.phone}
            </ProfilePhone>
          </ContactInfo>
        </ProfileInfoContainer>
      </ProfileCard>

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
            <ActivityValue $isMobile={isMobile}>45</ActivityValue>
            <ActivityLabel $isMobile={isMobile}>인증 횟수</ActivityLabel>
          </ActivityCard>

          <ActivityCard $isMobile={isMobile}>
            <ActivityIcon $color="#7C3AED">
              <MessageSquare size={16} />
            </ActivityIcon>
            <ActivityValue $isMobile={isMobile}>24</ActivityValue>
            <ActivityLabel $isMobile={isMobile}>작성한 리뷰</ActivityLabel>
          </ActivityCard>

          <ActivityCard
            $isMobile={isMobile}
            onClick={() => navigate("/meetings")}
          >
            <ActivityIcon $color="#6366F1">
              <Users size={16} />
            </ActivityIcon>
            <ActivityValue $isMobile={isMobile}>18</ActivityValue>
            <ActivityLabel $isMobile={isMobile}>주최한 모임</ActivityLabel>
          </ActivityCard>

          <ActivityCard
            $isMobile={isMobile}
            onClick={() => navigate("/missions")}
          >
            <ActivityIcon $color="#F59E0B">
              <Trophy size={16} />
            </ActivityIcon>
            <ActivityValue $isMobile={isMobile}>12</ActivityValue>
            <ActivityLabel $isMobile={isMobile}>완료한 미션</ActivityLabel>
          </ActivityCard>
        </ActivityGrid>
      </ActivitySection>

      <PreferenceSection $isMobile={isMobile}>
        <PreferenceTitle $isMobile={isMobile}>
          <Heart size={isMobile ? 16 : 18} />
          관심 카테고리
        </PreferenceTitle>
        <CategoryTags>
          {interestCategories.map((category, index) => (
            <CategoryTag key={index} $isMobile={isMobile}>
              {category}
            </CategoryTag>
          ))}
        </CategoryTags>
      </PreferenceSection>

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
        user={mockUserData}
        onSave={(updatedUser) => {
          console.log("프로필 업데이트:", updatedUser);
          // TODO: 실제 API 호출로 프로필 업데이트
          alert("프로필이 성공적으로 업데이트되었습니다!");
          setShowProfileEditModal(false);
        }}
      />
    </PageContainer>
  );
};
