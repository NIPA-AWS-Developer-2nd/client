import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Camera, Star, Send, Info, X } from "lucide-react";
import { useAlert } from "../../../shared/components/common";
import { authFetch, apiUrl } from "../../../shared/utils/api";

const FormContainer = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "24px")};
  max-width: 600px;
  margin: 0 auto;
`;

const SectionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 16px;
  margin-top: 0;
`;

const PhotoUploadSection = styled.div`
  margin-bottom: 24px;
`;

const PhotoUploadArea = styled.div<{ $hasPhoto?: boolean }>`
  border: 2px dashed ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 32px 16px;
  text-align: center;
  background: ${({ theme }) => theme.colors.background.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary + "08"};
  }
`;

const UploadIcon = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "48px" : "64px")};
  height: ${({ $isMobile }) => ($isMobile ? "48px" : "64px")};
  background: ${({ theme }) => theme.colors.primary + "20"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: ${({ theme }) => theme.colors.primary};
`;

const UploadText = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const UploadSubtext = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const PhotoPreview = styled.div`
  margin-top: 16px;
`;

const PhotoItem = styled.div<{
  $verificationStatus?: "pending" | "approved" | "rejected" | null;
}>`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.tertiary};
  border: 2px solid
    ${({ theme, $verificationStatus }) => {
      if ($verificationStatus === "approved") return theme.colors.success;
      if ($verificationStatus === "rejected") return theme.colors.error;
      return "transparent";
    }};
`;

const VerificationStatus = styled.div<{
  $status: "approved" | "rejected" | "pending";
  $isMobile?: boolean;
}>`
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "12px")};
  font-weight: 600;
  color: white;
  background: ${({ theme, $status }) => {
    if ($status === "approved") return theme.colors.success;
    if ($status === "rejected") return theme.colors.error;
    return theme.colors.warning;
  }};
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemovePhotoButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
`;

const RatingSection = styled.div`
  margin-bottom: 24px;
`;

const StarRating = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 8px;
`;

const StarButton = styled.button<{ $active?: boolean; $isMobile?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.gray300};
  padding: 4px;

  svg {
    width: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
    height: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
  }
`;

const RatingText = styled.p<{ $isMobile?: boolean }>`
  text-align: center;
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const ReviewSection = styled.div`
  margin-bottom: 24px;
`;

const ReviewTextarea = styled.textarea<{ $isMobile?: boolean }>`
  width: 100%;
  min-height: 120px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 12px;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-family: inherit;
  resize: vertical;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  opacity: 0.9;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary + "20"};
    opacity: 1;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  }
`;

const SubmitButton = styled.button<{
  $isMobile?: boolean;
  $disabled?: boolean;
}>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.gray300 : theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, $disabled }) =>
      $disabled ? theme.colors.gray300 : theme.colors.primaryDark};
  }

  &:active {
    transform: ${({ $disabled }) => ($disabled ? "none" : "scale(0.98)")};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const OptionalLabel = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: normal;
`;

const MissionGuideSection = styled.div`
  margin-bottom: 24px;
`;

const GuideCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.primary + "08"};
  border: 1px solid ${({ theme }) => theme.colors.primary + "20"};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const GuideHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const GuideIcon = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  height: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const GuideTitle = styled.h4<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const GuideContent = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.5;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.surface + 'F0'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.gray200};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
  margin: 0;
`;

const LoadingSubtext = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 4px 0 0 0;
`;

const PhotoModal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${({ $show }) => ($show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const PhotoModalContent = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  max-width: ${({ $isMobile }) => ($isMobile ? "90%" : "80%")};
  max-height: ${({ $isMobile }) => ($isMobile ? "90%" : "80%")};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  overflow: hidden;
`;

const PhotoModalImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const PhotoModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const ErrorMessage = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.error + "10"};
  border: 1px solid ${({ theme }) => theme.colors.error + "30"};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h4<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.error};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px 0;
  line-height: 1.5;
`;

const ErrorReason = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 8px 0 0 0;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.error + "20"};
  font-style: italic;
`;

interface Mission {
  id: string;
  title: string;
  description?: string;
  verificationGuide?: string[];
  location?: string;
  photoVerificationGuide?: string;
}

interface PhotoUploadState {
  file: File | null;
  localUrl: string | null;
  uploadedUrl: string | null;
  verificationStatus: "pending" | "approved" | "rejected" | null;
  isUploading: boolean;
  isVerifying: boolean;
  errorMessage?: string;
  errorReason?: string;
}

interface ExistingVerification {
  status: "approved" | "rejected" | "pending";
  verifiedAt?: string;
  photoUrl?: string;
  rating?: number;
  reviewText?: string;
  reasoning?: string;
  confidence?: number;
}

interface SinglePhotoVerificationProps {
  meetingId: string;
  isMobile?: boolean;
}

export const SinglePhotoVerification: React.FC<
  SinglePhotoVerificationProps
> = ({ meetingId, isMobile = false }) => {
  const { success, error } = useAlert();
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [missionInfo, setMissionInfo] = useState<Mission | null>(null);
  const [existingVerification, setExistingVerification] = useState<ExistingVerification | null>(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoState, setPhotoState] = useState<PhotoUploadState>({
    file: null,
    localUrl: null,
    uploadedUrl: null,
    verificationStatus: null,
    isUploading: false,
    isVerifying: false,
    errorMessage: undefined,
    errorReason: undefined,
  });

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const file = files[0]; // 1장만 처리
    const localUrl = URL.createObjectURL(file);

    // 상태 업데이트
    setPhotoState({
      file,
      localUrl,
      uploadedUrl: null,
      verificationStatus: null,
      isUploading: true,
      isVerifying: false,
      errorMessage: undefined,
      errorReason: undefined,
    });

    try {
      // 파일 업로드 + Bedrock 검증을 한 번에 처리
      await verifyMissionPhoto(file);
    } catch (_err) {
      error("사진 업로드 및 인증에 실패했습니다. 다시 시도해주세요.");

      // 실패 시 상태 초기화
      setPhotoState({
        file: null,
        localUrl: null,
        uploadedUrl: null,
        verificationStatus: null,
        isUploading: false,
        isVerifying: false,
        errorMessage: "사진 업로드 및 인증에 실패했습니다.",
        errorReason: "다시 시도해주세요.",
      });

      // URL 메모리 해제
      URL.revokeObjectURL(localUrl);
    }
  };

  const removePhoto = () => {
    if (photoState.localUrl) {
      URL.revokeObjectURL(photoState.localUrl);
    }

    setPhotoState({
      file: null,
      localUrl: null,
      uploadedUrl: null,
      verificationStatus: null,
      isUploading: false,
      isVerifying: false,
      errorMessage: undefined,
      errorReason: undefined,
    });
  };

  const verifyMissionPhoto = async (file: File) => {
    try {
      // 검증 중 상태로 업데이트
      setPhotoState((prev) => ({
        ...prev,
        isUploading: false,
        isVerifying: true,
      }));

      // FormData로 파일 업로드 + Bedrock 검증 API 호출
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("meetingId", meetingId);

      const response = await authFetch(apiUrl("/mission/verify/photo"), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Verification API failed");
      }

      const result = await response.json();
      const status = result.data.status; // 'approved' | 'rejected' | 'pending'
      const confidence = result.data.confidence;
      const reasoning = result.data.reasoning;

      // 인증 상태 업데이트
      setPhotoState((prev) => ({
        ...prev,
        verificationStatus: status,
        isUploading: false,
        isVerifying: false,
      }));

      if (status === "approved") {
        success(
          `미션 인증이 승인되었습니다! (신뢰도: ${confidence}%)\n${reasoning}`
        );
      } else if (status === "rejected") {
        // 거부된 경우 에러 메시지를 상태에 저장
        setPhotoState((prev) => ({
          ...prev,
          errorMessage: "미션 인증이 거부되었습니다",
          errorReason: reasoning || "다른 사진으로 다시 시도해주세요.",
        }));
      } else {
        // pending 상태는 일반적으로 즉시 처리되므로 여기서는 처리하지 않음
      }
    } catch (_err) {
      // 에러 시 상태 업데이트
      setPhotoState((prev) => ({
        ...prev,
        verificationStatus: "rejected",
        isUploading: false,
        isVerifying: false,
        errorMessage: "미션 인증 처리 중 오류가 발생했습니다",
        errorReason: "네트워크 연결을 확인하고 다시 시도해주세요.",
      }));
    }
  };

  const handleSubmit = async () => {
    // 사진 인증이 승인되었는지 확인
    if (photoState.verificationStatus !== "approved") {
      error("사진 인증이 승인되어야 제출할 수 있습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 미션 리뷰 제출 API 호출
      const submitData = {
        meetingId,
        photoUrls: photoState.uploadedUrl ? [photoState.uploadedUrl] : [],
        rating: rating || null,
        reviewText: reviewText || null,
      };

      const response = await authFetch(apiUrl("/mission/submit"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Submit API failed");
      }

      success("미션 인증이 최종 제출되었습니다!");

      // 폼 초기화
      setRating(0);
      setReviewText("");

      // 사진 상태 초기화
      if (photoState.localUrl) {
        URL.revokeObjectURL(photoState.localUrl);
      }
      setPhotoState({
        file: null,
        localUrl: null,
        uploadedUrl: null,
        verificationStatus: null,
        isUploading: false,
        isVerifying: false,
        errorMessage: undefined,
        errorReason: undefined,
      });
    } catch (_err) {
      error("미션 인증 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 기존 인증 데이터 로드
  const fetchExistingVerification = useCallback(async () => {
    try {
      setIsLoadingExisting(true);
      const response = await authFetch(apiUrl(`/mission/verify/status?meetingId=${meetingId}`));
      
      if (response.ok) {
        const data = await response.json();
        const verificationData = data.data;
        
        if (verificationData && verificationData.status) {
          setExistingVerification(verificationData);
          
          // 기존 데이터가 있으면 폼에 미리 채우기
          if (verificationData.rating) {
            setRating(verificationData.rating);
          }
          if (verificationData.reviewText) {
            setReviewText(verificationData.reviewText);
          }
          if (verificationData.photoUrl) {
            setPhotoState({
              file: null,
              localUrl: verificationData.photoUrl,
              uploadedUrl: verificationData.photoUrl,
              verificationStatus: verificationData.status,
              isUploading: false,
              isVerifying: false,
            });
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch existing verification:", err);
      // 기존 인증 데이터 조회 실패는 에러로 표시하지 않음 (신규 인증일 수 있음)
    } finally {
      setIsLoadingExisting(false);
    }
  }, [meetingId]);

  // 미션 정보 로드
  useEffect(() => {
    const fetchMissionInfo = async () => {
      try {
        const response = await authFetch(apiUrl(`/meetings/${meetingId}`));
        if (!response.ok) {
          throw new Error(
            `Failed to fetch meeting info: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        const mission = data.data?.mission || data.mission;

        if (!mission) {
          throw new Error("Mission data not found in response");
        }

        setMissionInfo({
          id: mission.id,
          title: mission.title,
          description: mission.description,
          verificationGuide: [],
          location: mission.district?.districtName || mission.district?.city,
          photoVerificationGuide: mission.photoVerificationGuide,
        });
      } catch (err) {
        console.error("Failed to fetch mission info:", err);
        error("미션 정보를 불러오는데 실패했습니다.");
      }
    };

    const loadData = async () => {
      if (meetingId) {
        await Promise.all([
          fetchMissionInfo(),
          fetchExistingVerification()
        ]);
      }
    };

    loadData();
  }, [meetingId, error, fetchExistingVerification]);

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "아쉬워요";
      case 2:
        return "그저 그래요";
      case 3:
        return "보통이에요";
      case 4:
        return "좋아요";
      case 5:
        return "최고예요!";
      default:
        return "별점을 선택해주세요";
    }
  };

  // 로딩 중일 때 표시
  if (isLoadingExisting) {
    return (
      <FormContainer $isMobile={isMobile}>
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText $isMobile={isMobile}>기존 인증 데이터를 확인하고 있어요</LoadingText>
          <LoadingSubtext $isMobile={isMobile}>잠시만 기다려주세요...</LoadingSubtext>
        </LoadingOverlay>
      </FormContainer>
    );
  }

  return (
    <FormContainer $isMobile={isMobile}>
      {/* 기존 인증 완료 상태 표시 */}
      {existingVerification && existingVerification.status === "approved" && (
        <MissionGuideSection>
          <GuideCard $isMobile={isMobile} style={{ background: "#f0fdf4", borderColor: "#16a34a" }}>
            <GuideHeader>
              <GuideIcon $isMobile={isMobile} style={{ color: "#16a34a" }}>
                <Info size={isMobile ? 20 : 24} />
              </GuideIcon>
              <GuideTitle $isMobile={isMobile} style={{ color: "#16a34a" }}>
                ✅ 인증 완료됨
              </GuideTitle>
            </GuideHeader>
            <GuideContent $isMobile={isMobile}>
              {existingVerification.verifiedAt && (
                <p>인증 완료 시간: {new Date(existingVerification.verifiedAt).toLocaleString('ko-KR')}</p>
              )}
              {existingVerification.confidence && (
                <p>AI 신뢰도: {existingVerification.confidence}%</p>
              )}
              {existingVerification.reasoning && (
                <p>검증 결과: {existingVerification.reasoning}</p>
              )}
              <p style={{ marginTop: '12px', fontWeight: '600' }}>
                아래에서 작성했던 별점과 후기를 확인할 수 있습니다.
              </p>
            </GuideContent>
          </GuideCard>
        </MissionGuideSection>
      )}

      {/* 미션 기본 정보 */}
      {missionInfo && (
        <MissionGuideSection>
          <SectionTitle $isMobile={isMobile}>미션 정보</SectionTitle>
          <GuideCard $isMobile={isMobile}>
            <GuideHeader>
              <GuideIcon $isMobile={isMobile}>
                <Info size={isMobile ? 20 : 24} />
              </GuideIcon>
              <GuideTitle $isMobile={isMobile}>{missionInfo.title}</GuideTitle>
            </GuideHeader>
            <GuideContent $isMobile={isMobile}>
              {missionInfo.description}
            </GuideContent>
          </GuideCard>
        </MissionGuideSection>
      )}

      {/* 사진 인증 섹션 */}
      <PhotoUploadSection>
        <SectionTitle $isMobile={isMobile}>
          미션 인증 사진 <span style={{ color: "#ef4444" }}>*</span>
          {existingVerification?.status === "approved" && (
            <span style={{ marginLeft: "8px", fontSize: "14px", color: "#16a34a", fontWeight: "normal" }}>
              (완료됨)
            </span>
          )}
        </SectionTitle>
        
        {/* 에러 메시지 표시 */}
        {photoState.errorMessage && photoState.verificationStatus === "rejected" && (
          <ErrorMessage $isMobile={isMobile}>
            <ErrorTitle $isMobile={isMobile}>
              ⚠️ {photoState.errorMessage}
            </ErrorTitle>
            {photoState.errorReason && (
              <>
                <ErrorDescription $isMobile={isMobile}>
                  AI 검증 결과가 미션 요구사항과 일치하지 않습니다.
                </ErrorDescription>
                <ErrorReason $isMobile={isMobile}>
                  💡 {photoState.errorReason}
                </ErrorReason>
              </>
            )}
          </ErrorMessage>
        )}

        <PhotoUploadArea
          onClick={() => {
            if (!photoState.isUploading && !photoState.isVerifying && existingVerification?.status !== "approved") {
              document.getElementById("photo-upload")?.click();
            }
          }}
          style={{
            cursor:
              photoState.isUploading || photoState.isVerifying || existingVerification?.status === "approved"
                ? "not-allowed"
                : "pointer",
            opacity: existingVerification?.status === "approved" ? 0.7 : 1,
          }}
        >
          {/* 로딩 오버레이 */}
          {(photoState.isUploading || photoState.isVerifying) && (
            <LoadingOverlay>
              <LoadingSpinner />
              <LoadingText $isMobile={isMobile}>
                {photoState.isUploading
                  ? "사진을 업로드하고 있어요"
                  : "AI가 미션을 검증하고 있어요"}
              </LoadingText>
              <LoadingSubtext $isMobile={isMobile}>
                {photoState.isUploading
                  ? "잠시만 기다려주세요..."
                  : "최대 10초 정도 소요될 수 있어요"}
              </LoadingSubtext>
            </LoadingOverlay>
          )}
          
          <UploadIcon $isMobile={isMobile}>
            <Camera size={isMobile ? 20 : 24} />
          </UploadIcon>
          <UploadText $isMobile={isMobile}>
            {photoState.verificationStatus === "approved" || existingVerification?.status === "approved"
              ? "인증 완료됨"
              : "사진 1장을 업로드하세요"}
          </UploadText>
          <UploadSubtext $isMobile={isMobile}>
            {existingVerification?.status === "approved" 
              ? "이미 인증이 완료되었습니다"
              : "JPG, PNG, WEBP 형식 (최대 10MB)"}
          </UploadSubtext>
        </PhotoUploadArea>

        <HiddenFileInput
          id="photo-upload"
          type="file"
          accept="image/*"
          multiple={false}
          onChange={handlePhotoUpload}
          disabled={photoState.isUploading || photoState.isVerifying || existingVerification?.status === "approved"}
        />

        {/* 사진 미리보기 */}
        {photoState.localUrl && (
          <PhotoPreview>
            <PhotoItem $verificationStatus={photoState.verificationStatus}>
              <PhotoImage 
                src={photoState.localUrl} 
                alt="미션 인증 사진" 
                onClick={() => setShowPhotoModal(true)}
                style={{ cursor: "pointer" }}
              />
              {photoState.verificationStatus && (
                <VerificationStatus
                  $status={photoState.verificationStatus}
                  $isMobile={isMobile}
                >
                  {photoState.verificationStatus === "approved" && "승인됨"}
                  {photoState.verificationStatus === "rejected" && "거부됨"}
                  {photoState.verificationStatus === "pending" && "검증중"}
                </VerificationStatus>
              )}
              {photoState.verificationStatus !== "approved" && !existingVerification?.status && (
                <RemovePhotoButton onClick={removePhoto}>×</RemovePhotoButton>
              )}
            </PhotoItem>
          </PhotoPreview>
        )}
      </PhotoUploadSection>

      <RatingSection>
        <SectionTitle $isMobile={isMobile}>
          별점 평가{" "}
          <OptionalLabel $isMobile={isMobile}>(선택사항)</OptionalLabel>
        </SectionTitle>
        <StarRating>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
              key={star}
              $active={star <= rating}
              $isMobile={isMobile}
              onClick={() => {
                // 기존 인증이 있으면 클릭 불가
                if (!existingVerification?.status) {
                  setRating(star);
                }
              }}
              style={{
                cursor: existingVerification?.status ? "default" : "pointer",
                opacity: existingVerification?.status ? 0.7 : 1,
              }}
            >
              <Star fill={star <= rating ? "currentColor" : "none"} />
            </StarButton>
          ))}
        </StarRating>
        <RatingText $isMobile={isMobile}>{getRatingText(rating)}</RatingText>
      </RatingSection>

      <ReviewSection>
        <SectionTitle $isMobile={isMobile}>
          후기 작성{" "}
          <OptionalLabel $isMobile={isMobile}>(선택사항)</OptionalLabel>
        </SectionTitle>
        <ReviewTextarea
          $isMobile={isMobile}
          value={reviewText}
          onChange={(e) => {
            // 기존 인증이 있으면 입력 불가
            if (!existingVerification?.status) {
              setReviewText(e.target.value);
            }
          }}
          placeholder={
            existingVerification?.status 
              ? "작성된 후기를 확인할 수 있습니다"
              : "자유롭게 미션을 수행하면서 느낀 점이나 경험을 공유해주세요"
          }
          maxLength={500}
          readOnly={!!existingVerification?.status}
          style={{
            cursor: existingVerification?.status ? "default" : "text",
            backgroundColor: existingVerification?.status ? "#f9f9f9" : "white",
          }}
        />
      </ReviewSection>

      <SubmitButton
        $isMobile={isMobile}
        $disabled={
          existingVerification?.status === "approved" ||
          (photoState.verificationStatus !== "approved" && !existingVerification?.status) ||
          isSubmitting
        }
        onClick={handleSubmit}
      >
        <Send size={16} />
        {isSubmitting
          ? "제출 중..."
          : existingVerification?.status === "approved"
          ? "이미 인증 완료됨"
          : photoState.verificationStatus === "approved"
          ? "미션 인증 제출"
          : "사진 인증 완료 후 제출 가능"}
      </SubmitButton>

      {/* 사진 확대 모달 */}
      <PhotoModal 
        $show={showPhotoModal} 
        onClick={(e) => e.target === e.currentTarget && setShowPhotoModal(false)}
      >
        <PhotoModalContent $isMobile={isMobile}>
          <PhotoModalCloseButton onClick={() => setShowPhotoModal(false)}>
            <X size={16} />
          </PhotoModalCloseButton>
          {photoState.localUrl && (
            <PhotoModalImage src={photoState.localUrl} alt="미션 인증 사진 (확대)" />
          )}
        </PhotoModalContent>
      </PhotoModal>
    </FormContainer>
  );
};
