import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { deviceDetection } from "../../../shared/utils/deviceDetection";
import { Users } from "lucide-react";
import { useMissionStore } from "../../../shared/store";
import {
  meetingApiService,
  type CreateMeetingRequest,
} from "../../../shared/services/meetingApi";
import { Slider, MissionCard } from "../../../shared/components/ui";
import { CompactWeekSelector } from "../components/CompactWeekSelector";
import { WheelTimePicker } from "../components/WheelTimePicker";
import {
  HashtagSelector,
  type SelectedHashtagWithPreference,
} from "../components/HashtagSelector";
import { RecruitmentDeadlineNotice } from "../components/RecruitmentDeadlineNotice";
import { userApiService, type Hashtag } from "../../../shared/services/userApi";
import { useAlert } from "../../../shared/components/common";

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

const Input = styled.input<{ $isMobile?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

const TextArea = styled.textarea<{ $isMobile?: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.primary};
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

const IconInput = styled(Input)`
  padding-left: 40px;
`;

const BottomBar = styled.div<{ $isMobile?: boolean }>`
  margin-top: 20px;
  padding-top: 12px;
`;

const CreateButton = styled.button<{
  $isMobile?: boolean;
  $disabled?: boolean;
}>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  ${({ $disabled, theme }) => {
    if ($disabled) {
      return `
        background: ${theme.colors.gray200};
        color: ${theme.colors.gray400};
      `;
    }

    return `
      background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary}dd);
      color: white;
      
      &:hover {
        background: linear-gradient(135deg, ${theme.colors.primary}dd, ${theme.colors.primary}bb);
      }
      
      &:active {
        transform: scale(0.98);
      }
    `;
  }}
`;

const ErrorText = styled.div<{ $isMobile?: boolean }>`
  color: #ef4444;
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  margin-top: 4px;
  margin-left: 2px;
`;

interface FormData {
  selectedDate: Date | null;
  selectedTime: string;
  introduction: string;
  focusScore: number;
  selectedHashtags: SelectedHashtagWithPreference[];
}

interface ValidationErrors {
  selectedDate?: string;
  selectedTime?: string;
  introduction?: string;
  selectedHashtags?: string;
}

export const MeetingCreatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const { currentMission, fetchMissionDetails } = useMissionStore();
  const { error, warning, success } = useAlert();

  // 각 섹션에 대한 ref
  const introductionRef = React.useRef<HTMLDivElement>(null);
  const dateRef = React.useRef<HTMLDivElement>(null);
  const hashtagRef = React.useRef<HTMLDivElement>(null);

  const missionId = searchParams.get("missionId");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    selectedDate: null,
    selectedTime: "",
    introduction: "",
    focusScore: 50,
    selectedHashtags: [],
  });
  const [availableHashtags, setAvailableHashtags] = React.useState<Hashtag[]>(
    []
  );
  const [validationErrors, setValidationErrors] =
    React.useState<ValidationErrors>({});

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    // 미션 정보 가져오기
    if (missionId && (!currentMission || currentMission.id !== missionId)) {
      fetchMissionDetails(missionId);
    }
  }, [missionId, currentMission, fetchMissionDetails]);

  React.useEffect(() => {
    // 해시태그 목록 가져오기
    const fetchHashtags = async () => {
      try {
        const hashtags = await userApiService.getUserHashtags();
        setAvailableHashtags(hashtags);
      } catch (error) {
        console.error("Failed to fetch hashtags:", error);
      }
    };

    fetchHashtags();
  }, []);

  // 미션 정보를 기반으로 폼 데이터 초기화
  React.useEffect(() => {
    if (currentMission && missionId === currentMission.id) {
      if (!formData.selectedTime) {
        setFormData((prev) => ({
          ...prev,
          selectedTime: "14:00", // 기본 시간 오후 2시
        }));
      }
    }
  }, [currentMission, missionId, formData.selectedDate]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | Date | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateSelect = (date: Date) => {
    handleInputChange("selectedDate", date);
  };

  const handleTimeSelect = (time: string) => {
    handleInputChange("selectedTime", time);
  };

  const handleHashtagsChange = (hashtags: SelectedHashtagWithPreference[]) => {
    handleInputChange("selectedHashtags", hashtags);
    // 해시태그 선택 시 에러 클리어
    if (validationErrors.selectedHashtags) {
      setValidationErrors((prev) => ({ ...prev, selectedHashtags: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.introduction.trim()) {
      errors.introduction = "모임 소개를 입력해주세요.";
    } else if (formData.introduction.trim().length < 10) {
      errors.introduction = "모임 소개를 10자 이상 입력해주세요.";
    }

    if (!formData.selectedDate) {
      errors.selectedDate = "미션 수행 날짜를 선택해주세요.";
    }

    if (!formData.selectedTime) {
      errors.selectedTime = "미션 수행 시간을 선택해주세요.";
    }

    if (formData.selectedHashtags.length === 0) {
      errors.selectedHashtags = "원하는 성향을 1개 이상 선택해주세요.";
    }

    setValidationErrors(errors);

    // 첫 번째 에러가 있는 필드로 스크롤
    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        if (errors.introduction && introductionRef.current) {
          introductionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else if (
          (errors.selectedDate || errors.selectedTime) &&
          dateRef.current
        ) {
          dateRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else if (errors.selectedHashtags && hashtagRef.current) {
          hashtagRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!missionId) {
      error("미션 정보가 없습니다.", "모임 생성 실패");
      return;
    }

    if (!formData.selectedDate || !formData.selectedTime) {
      warning("미션 수행 날짜와 시간을 모두 선택해주세요.", "입력 확인");
      return;
    }

    // 선택된 날짜와 시간으로 scheduledAt 생성
    const [hours, minutes] = formData.selectedTime.split(":").map(Number);
    const scheduledAt = new Date(formData.selectedDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    const now = new Date();
    if (scheduledAt <= now) {
      warning("미션 수행일은 현재 시간 이후여야 합니다.", "날짜 확인");
      return;
    }

    setIsSubmitting(true);

    try {
      // 선택된 해시태그를 ID만 전송 (백엔드에서 preference 지원 안함)
      const traitRequests = formData.selectedHashtags
        .map((selectedHashtag) => {
          const hashtag = availableHashtags.find(
            (h) => h.name === selectedHashtag.name
          );
          return hashtag
            ? {
                id: hashtag.id.toString(),
              }
            : null;
        })
        .filter(Boolean) as Array<{ id: string }>;

      const meetingData: CreateMeetingRequest = {
        missionId,
        scheduledAt: scheduledAt.toISOString(),
        participants: undefined, // 미션에서 정의된 참가자 수 사용
        introduction: formData.introduction.trim() || undefined,
        focusScore:
          formData.focusScore !== 50 ? formData.focusScore : undefined,
        traits: traitRequests.length > 0 ? traitRequests : undefined,
      };

      const createdMeeting = await meetingApiService.createMeeting(meetingData);

      // 성공 메시지 표시
      success("번개모임이 성공적으로 생성되었습니다!", "모임 생성 완료");

      // 성공 시 모임 상세 페이지로 이동
      setTimeout(() => {
        navigate(`/meetings/${createdMeeting.id}`);
      }, 1500);
    } catch (createError) {
      console.error("모임 생성 실패:", createError);
      error(
        createError instanceof Error
          ? createError.message
          : "모임 생성에 실패했습니다. 다시 시도해주세요.",
        "모임 생성 실패"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // isFormValid 체크 제거 - validation은 submit 시에만

  return (
    <Container $isMobile={isMobile}>
      <Content $isMobile={isMobile}>
        {/* 미션 카드 */}
        {currentMission && missionId && (
          <FormSection>
            <Label $isMobile={isMobile}>미션 요약 정보</Label>
            <MissionCard
              mission={currentMission}
              isMobile={isMobile}
              isClickable={false}
            />
          </FormSection>
        )}

        {/* 어떤 모임으로 구성하고 싶나요? */}
        <FormSection ref={introductionRef}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Label $isMobile={isMobile} style={{ marginBottom: "0" }}>
              어떤 모임으로 구성하고 싶은지 소개해주세요. *
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
          <TextArea
            $isMobile={isMobile}
            value={formData.introduction}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                handleInputChange("introduction", e.target.value);
              }
            }}
            placeholder="모임의 분위기, 성향, 원하는 참가자 유형 등 자유롭게 적어주세요.
예: 입문자도 환영! 함께 재미있게 미션 완수해봐요"
            maxLength={100}
          />
          {validationErrors.introduction && (
            <ErrorText $isMobile={isMobile}>
              {validationErrors.introduction}
            </ErrorText>
          )}
        </FormSection>

        {/* 미션 수행일 선택 (모집 마감 안내 포함) */}
        <FormSection ref={dateRef}>
          <Label $isMobile={isMobile}>미션 수행일 선택 *</Label>
          {/* 모집마감일 안내 */}
          <div style={{ marginBottom: "12px" }}>
            <RecruitmentDeadlineNotice isMobile={isMobile} />
          </div>
          <CompactWeekSelector
            onDateSelect={handleDateSelect}
            selectedDate={formData.selectedDate}
          />
          {validationErrors.selectedDate && (
            <ErrorText $isMobile={isMobile}>
              {validationErrors.selectedDate}
            </ErrorText>
          )}
          {formData.selectedDate && (
            <WheelTimePicker
              onTimeSelect={handleTimeSelect}
              selectedTime={formData.selectedTime}
              isMobile={isMobile}
            />
          )}
          {validationErrors.selectedTime && formData.selectedDate && (
            <ErrorText $isMobile={isMobile}>
              {validationErrors.selectedTime}
            </ErrorText>
          )}
        </FormSection>

        {/* 집중도 점수 */}
        <FormSection>
          <Label $isMobile={isMobile}>집중도 점수 *</Label>

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
              size="medium"
              variant="primary"
              showValue={false}
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

        {/* 해시태그 선택 */}
        <FormSection ref={hashtagRef}>
          <div
            style={{
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Label $isMobile={isMobile}>함께하고 싶은 성향 선택 *</Label>
            <span
              style={{
                fontSize: isMobile ? "12px" : "13px",
                color: "#6B7280",
                fontWeight: "500",
              }}
            >
              {formData.selectedHashtags.length}/6개 선택됨
            </span>
          </div>
          <HashtagSelector
            selectedHashtags={formData.selectedHashtags}
            onHashtagsChange={handleHashtagsChange}
            isMobile={isMobile}
            maxSelection={6}
          />
          {validationErrors.selectedHashtags && (
            <ErrorText $isMobile={isMobile}>
              {validationErrors.selectedHashtags}
            </ErrorText>
          )}
        </FormSection>

        <BottomBar $isMobile={isMobile}>
          <CreateButton
            $isMobile={isMobile}
            $disabled={isSubmitting}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "모임 생성 중..." : "완료"}
          </CreateButton>
        </BottomBar>
      </Content>
    </Container>
  );
};
