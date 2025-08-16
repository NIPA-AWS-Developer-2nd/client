import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { deviceDetection } from "../../../shared/utils/deviceDetection";
import {
  meetingApiService,
  // type CreateMeetingRequest,
  type MeetingDetailDto,
} from "../../../shared/services/meetingApi";
import { Slider, MissionCard } from "../../../shared/components/ui";
import {
  HashtagSelector,
  type SelectedHashtagWithPreference,
} from "../components/HashtagSelector";
import { userApiService, type Hashtag } from "../../../shared/services/userApi";
import { useAlert } from "../../../shared/components/common";
import { useAuth } from "../../auth/hooks/useAuth";

const Container = styled.div<{ $isMobile?: boolean }>`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
`;

const Content = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  width: 100%;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label<{ $isMobile?: boolean }>`
  display: block;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;


const Textarea = styled.textarea<{ $isMobile?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  background: ${({ theme }) => theme.colors.white};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const SubmitButton = styled.button<{
  $isMobile?: boolean;
  $isLoading?: boolean;
}>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  background: ${({ theme, $isLoading }) =>
    $isLoading ? theme.colors.text.secondary : theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  cursor: ${({ $isLoading }) => ($isLoading ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;
  margin-top: 32px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ErrorText = styled.div<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  margin-top: 4px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const MeetingEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: meetingId } = useParams<{ id: string }>();
  const { user } = useAuth();

  // 디버깅용 로그
  console.log("현재 사용자 정보:", user);
  const { error, success } = useAlert();
  const isMobile = deviceDetection.isMobile();

  // 원본 모임 데이터
  const [meetingData, setMeetingData] = useState<MeetingDetailDto | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 폼 상태
  const [formData, setFormData] = useState({
    introduction: "",
    focusScore: 50,
    traits: [] as SelectedHashtagWithPreference[],
  });

  const [_hashtags, _setHashtags] = useState<Hashtag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 모임 데이터 로드
  useEffect(() => {
    const loadMeetingData = async () => {
      if (!meetingId) {
        error("잘못된 접근입니다.");
        navigate("/meetings");
        return;
      }

      // 사용자 정보가 로딩되지 않았으면 대기
      if (!user?.id) {
        return;
      }

      try {
        setIsDataLoading(true);
        const data = await meetingApiService.getMeetingDetail(meetingId);

        // 호스트 권한 확인 (디버깅용 로그 추가)
        console.log("호스트 권한 확인:", {
          dataHostUserId: data.hostUserId,
          currentUserId: user?.id,
          isEqual: data.hostUserId === user?.id,
        });

        if (data.hostUserId !== user?.id) {
          error("수정 권한이 없습니다.");
          navigate(`/meetings/${meetingId}`);
          return;
        }

        setMeetingData(data);

        // 폼 데이터 초기화
        setFormData({
          introduction: data.introduction || "",
          focusScore: data.focusScore || 50,
          traits: [], // TODO: 기존 해시태그 데이터 변환 필요
        });
      } catch (err) {
        console.error("모임 데이터 로드 실패:", err);
        error(
          "서버 측에서 예상치 못한 문제가 발생하여 모임 정보를 불러올 수 없습니다."
        );
        navigate("/meetings");
      } finally {
        setIsDataLoading(false);
      }
    };

    loadMeetingData();
  }, [meetingId, user, navigate, error]);

  // 해시태그 데이터 로드
  useEffect(() => {
    const loadHashtags = async () => {
      try {
        const hashtagData = await userApiService.getUserHashtags();
        _setHashtags(hashtagData);
      } catch (error) {
        console.error("해시태그 로드 실패:", error);
      }
    };

    loadHashtags();
  }, []);

  // 페이지 제목 설정
  useEffect(() => {
    document.title = "모임 정보 수정 | 할사람?";
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.introduction.trim()) {
      newErrors.introduction = "모임 소개를 입력해주세요.";
    } else if (formData.introduction.length > 100) {
      newErrors.introduction = "모임 소개는 100자 이내로 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !meetingData) return;

    setIsSubmitting(true);

    try {
      const updateData = {
        introduction: formData.introduction,
        focusScore: formData.focusScore,
        traits: formData.traits.map((trait) => ({ id: trait.name })),
      };

      console.log("모임 수정 데이터:", updateData);

      await meetingApiService.updateMeeting(meetingData.id, updateData);

      success("모임 정보가 수정되었습니다.");
      navigate(`/meetings/${meetingId}`);
    } catch (err) {
      console.error("모임 수정 실패:", err);
      error(
        "서버 측에서 예상치 못한 문제가 발생하여 모임을 수정할 수 없습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isDataLoading) {
    return (
      <Container $isMobile={isMobile}>
        <Content $isMobile={isMobile}>
          <LoadingContainer>모임 정보를 불러오는 중...</LoadingContainer>
        </Content>
      </Container>
    );
  }

  if (!meetingData) {
    return null;
  }

  return (
    <Container $isMobile={isMobile}>
      <Content $isMobile={isMobile}>
        {/* 연결된 미션 정보 */}
        {meetingData.mission && (
          <FormSection>
            <Label $isMobile={isMobile}>연결된 미션</Label>
            <MissionCard
              mission={{
                id: meetingData.mission.id,
                title: meetingData.mission.title,
                description: meetingData.mission.description,
                participants: meetingData.mission.participants,
                basePoints: meetingData.mission.basePoints,
                estimatedDuration: meetingData.mission.estimatedDuration,
                thumbnailUrl: meetingData.mission.thumbnailUrl,
                hashtags: meetingData.mission.hashtags,
                difficulty: meetingData.mission.difficulty as "very_easy" | "easy" | "medium" | "hard" | "very_hard",
                category: meetingData.mission.category,
                district: meetingData.mission.district ? {
                  name: meetingData.mission.district.districtName,
                } : undefined,
              }}
              onClick={() => {}}
              isClickable={false}
            />
          </FormSection>
        )}

        {/* 모임 소개 */}
        <FormSection>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Label $isMobile={isMobile} style={{ marginBottom: "0" }}>
              어떤 모임으로 구성하고 싶은지 소개해주세요.
            </Label>
            <span
              style={{
                fontSize: isMobile ? "12px" : "13px",
                color:
                  formData.introduction.length > 100 ? "#EF4444" : "#6B7280",
                fontWeight: "500",
              }}
            >
              {formData.introduction.length}/100
            </span>
          </div>
          <Textarea
            $isMobile={isMobile}
            placeholder="모임의 분위기, 성향, 원하는 참가자 유형 등 자유롭게 적어주세요.
예: 입문자도 환영! 함께 재미있게 미션 완수해봐요"
            value={formData.introduction}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                handleInputChange("introduction", e.target.value);
              }
            }}
            maxLength={100}
          />
          {errors.introduction && (
            <ErrorText $isMobile={isMobile}>{errors.introduction}</ErrorText>
          )}
        </FormSection>

        {/* 집중도 설정 */}
        <FormSection>
          <Label $isMobile={isMobile}>집중도 점수</Label>

          {/* 슬라이더와 점수 표시 */}
          <div style={{ position: "relative", marginBottom: "20px" }}>
            {/* 점수 표시 - 슬라이더 위 중앙 */}
            <div
              style={{
                position: "absolute",
                top: "-30px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#3B82F6",
                color: "white",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: isMobile ? "12px" : "13px",
                fontWeight: "600",
                zIndex: 2,
              }}
            >
              {formData.focusScore}점
            </div>

            {/* 0, 100 라벨 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontSize: isMobile ? "12px" : "13px",
                color: "#6B7280",
                fontWeight: "500",
              }}
            >
              <span>0</span>
              <span>100</span>
            </div>

            <Slider
              min={0}
              max={100}
              step={10}
              value={formData.focusScore}
              onChange={(value) => handleInputChange("focusScore", value)}
            />
          </div>

          {/* 현재 선택된 값에 대한 설명 */}
          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              background: "#F9FAFB",
              borderRadius: "8px",
              fontSize: isMobile ? "13px" : "14px",
              color: "#374151",
              textAlign: "center",
            }}
          >
            {formData.focusScore <= 30 &&
              "친목과 네트워킹을 중심으로 하는 편안한 모임입니다."}
            {formData.focusScore > 30 &&
              formData.focusScore <= 70 &&
              "미션 수행과 친목이 적절히 균형잡힌 모임입니다."}
            {formData.focusScore > 70 &&
              "미션 완수에 집중하는 진지한 모임입니다."}
          </div>
        </FormSection>

        {/* 함께하고 싶은 성향 선택 */}
        <FormSection>
          <div
            style={{
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Label $isMobile={isMobile}>함께하고 싶은 성향 선택</Label>
            <span
              style={{
                fontSize: isMobile ? "12px" : "13px",
                color: "#6B7280",
                fontWeight: "500",
              }}
            >
              {formData.traits.length}/6개 선택됨
            </span>
          </div>
          <HashtagSelector
            selectedHashtags={formData.traits}
            onHashtagsChange={(selected: SelectedHashtagWithPreference[]) =>
              handleInputChange("traits", selected)
            }
          />
        </FormSection>

        {/* 수정하기 버튼 */}
        <SubmitButton
          $isMobile={isMobile}
          $isLoading={isSubmitting}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "수정 중..." : "수정하기"}
        </SubmitButton>
      </Content>
    </Container>
  );
};
