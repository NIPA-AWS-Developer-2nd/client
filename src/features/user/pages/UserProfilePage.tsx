import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  CheckCircle,
  // AlertCircle,
  Users,
  Trophy,
  Heart,
  // Award,
  MessageSquare,
  // Star,
  User as UserIcon,
  Hash,
  Quote,
} from "lucide-react";
import { deviceDetection } from "../../../shared/utils/deviceDetection";
import { userApiService } from "../../../shared/services";
import { useOnboardingStore } from "../../../shared/store";
import { ImageModal } from "../../../shared/components/common/ImageModal";
import { useImageModal } from "../../../shared/hooks/useImageModal";
import { Skeleton } from "../../../shared/components/ui";
import type { VerificationStatus } from "../../../types";

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

const _VerificationContainer = styled.div`
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

const _VerificationBadge = styled.div<{
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

interface UserProfileData {
  id: string;
  profile: {
    nickname: string;
    bio?: string;
    profileImageUrl?: string;
    interests: string[];
    hashtags: string[];
    mbti?: string;
    level: number;
  };
  stats: {
    verificationCount: number;
    reviewCount: number;
    hostedMeetingCount: number;
    completedMissionCount: number;
  };
}

// 디버그용 사용자 목록 컴포넌트
const DebugUserList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState<Array<{
    id: string;
    phoneNumber?: string;
    status: string;
    onboardingCompleted: boolean;
    nickname?: string;
    profileImageUrl?: string;
  }>>([]);
  const [loading, setLoading] = React.useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userList = await userApiService.getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error("사용자 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#f9f9f9" }}>
      <h3 style={{ marginTop: 0 }}>🔧 디버그: 존재하는 사용자 목록</h3>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div>
          <p>총 {users.length}명의 사용자</p>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  padding: "8px",
                  margin: "5px 0",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  background: "white",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/user/${user.id}`)}
              >
                <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#666" }}>
                  ID: {user.id}
                </div>
                <div>
                  <strong>{user.nickname || "닉네임 없음"}</strong> ({user.phoneNumber || "번호 없음"})
                </div>
                <div style={{ fontSize: "12px", color: user.onboardingCompleted ? "green" : "orange" }}>
                  {user.status} | 온보딩: {user.onboardingCompleted ? "완료" : "미완료"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [userInfo, setUserInfo] = React.useState<UserProfileData | null>(null);
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

  // 사용자 프로필 정보 조회
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        // userId가 없으면 404 페이지로 리다이렉트
        navigate("/404", { replace: true });
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const userData = await userApiService.getOtherUserProfile(userId);
        setUserInfo(userData);
        
        // 페이지 제목 동적 변경
        document.title = `${userData.profile?.nickname || '사용자'} 프로필 | Halsaram`;
        
        // 헤더 제목도 업데이트
        const headerElement = document.querySelector('[data-header-title]');
        if (headerElement) {
          headerElement.textContent = `${userData.profile?.nickname || '사용자'} 프로필`;
        }
      } catch (err) {
        console.error("❌ 사용자 프로필 조회 실패:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        
        // 사용자를 찾을 수 없는 경우 404 페이지로 리다이렉트
        if (errorMessage.includes("찾을 수 없습니다") || errorMessage.includes("not found")) {
          navigate("/404", { replace: true });
          return;
        }
        
        setError(errorMessage);
        // 에러 시 기본 제목으로 설정
        document.title = "사용자 프로필 | Halsaram";
        
        // 헤더 제목도 기본값으로 설정
        const headerElement = document.querySelector('[data-header-title]');
        if (headerElement) {
          headerElement.textContent = "사용자 프로필";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  // 카테고리와 해시태그 데이터 로드
  React.useEffect(() => {
    if (categories.length === 0 || hashtags.length === 0) {
      loadStaticData();
    }
  }, [categories.length, hashtags.length, loadStaticData]);

  // 로딩 상태
  if (isLoading) {
    return (
      <PageContainer $isMobile={isMobile}>
        {/* 프로필 카드 스켈레톤 */}
        <ProfileCard $isMobile={isMobile}>
          <Skeleton
            width={isMobile ? "80px" : "100px"}
            height={isMobile ? "80px" : "100px"}
            borderRadius="50%"
            marginBottom="16px"
          />
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
          <Skeleton width="200px" height="16px" />
        </ProfileCard>

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
      </PageContainer>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <PageContainer $isMobile={isMobile}>
        <div style={{ padding: "20px" }}>
          <h2>사용자 정보를 불러오는데 실패했습니다</h2>
          <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>
          
          <DebugUserList />
        </div>
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

  // 관심사 데이터 (이모지 포함)
  const userInterests = (userInfo?.profile?.interests || []).map(
    (interestName) => {
      // 백엔드 카테고리에서 해당하는 이모지 찾기
      const category = categories.find((cat) => cat.name === interestName);
      return category ? `${category.icon} ${category.name}` : interestName;
    }
  );

  // 해시태그 데이터
  const userHashtags: string[] = userInfo.profile?.hashtags || [];

  return (
    <PageContainer $isMobile={isMobile}>
      <ProfileCard $isMobile={isMobile}>
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
              {userInfo.stats?.verificationCount || 0}
            </ActivityValue>
            <ActivityLabel $isMobile={isMobile}>인증 횟수</ActivityLabel>
          </ActivityCard>

          <ActivityCard $isMobile={isMobile}>
            <ActivityIcon $color="#7C3AED">
              <MessageSquare size={16} />
            </ActivityIcon>
            <ActivityValue $isMobile={isMobile}>
              {userInfo.stats?.reviewCount || 0}
            </ActivityValue>
            <ActivityLabel $isMobile={isMobile}>작성한 리뷰</ActivityLabel>
          </ActivityCard>

          <ActivityCard $isMobile={isMobile}>
            <ActivityIcon $color="#6366F1">
              <Users size={16} />
            </ActivityIcon>
            <ActivityValue $isMobile={isMobile}>
              {userInfo.stats?.hostedMeetingCount || 0}
            </ActivityValue>
            <ActivityLabel $isMobile={isMobile}>주최한 모임</ActivityLabel>
          </ActivityCard>

          <ActivityCard $isMobile={isMobile}>
            <ActivityIcon $color="#F59E0B">
              <Trophy size={16} />
            </ActivityIcon>
            <ActivityValue $isMobile={isMobile}>
              {userInfo.stats?.completedMissionCount || 0}
            </ActivityValue>
            <ActivityLabel $isMobile={isMobile}>완료한 미션</ActivityLabel>
          </ActivityCard>
        </ActivityGrid>
      </ActivitySection>

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