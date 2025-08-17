import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Camera, Star, Send, Info } from "lucide-react";
import { useAlert } from "../../../shared/components/common";

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

const PhotoUploadArea = styled.div<{ $hasPhotos?: boolean }>`
  border: 2px dashed ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 32px 16px;
  text-align: center;
  background: ${({ theme }) => theme.colors.gray50};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary + "05"};
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  margin-top: 16px;
`;

const PhotoItem = styled.div<{
  $verificationStatus?: "pending" | "approved" | "rejected" | null;
}>`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray100};
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
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary + "20"};
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

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
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

const GuideList = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 16px;
`;

const GuideItem = styled.li<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
  line-height: 1.4;
`;

interface Mission {
  id: string;
  title: string;
  description?: string;
  verificationGuide?: string[];
  location?: string;
}

interface MissionVerificationFormProps {
  meetingId: string;
  isMobile?: boolean;
}

export const MissionVerificationForm: React.FC<
  MissionVerificationFormProps
> = ({ meetingId, isMobile = false }) => {
  const { success, error, info } = useAlert();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "approved" | "rejected" | null
  >(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [missionInfo, setMissionInfo] = useState<Mission | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const file = files[0]; // 1장만 처리
    const localUrl = URL.createObjectURL(file);

    setPhotos([file]);
    setPhotoUrls([localUrl]);
    setVerificationStatus(null);
    setUploadedPhotoUrl(null);

    try {
      setIsVerifying(true);
      
      // 1. presigned URL 요청
      const presignedResponse = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          category: 'mission-verification',
        }),
      });
      
      if (!presignedResponse.ok) {
        throw new Error('Failed to get presigned URL');
      }
      
      const presignedData = await presignedResponse.json();
      const { uploadUrl, fileUrl } = presignedData.data;
      
      // 2. S3에 직접 업로드
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }
      
      setUploadedPhotoUrl(fileUrl);
      
      // 3. 업로드 완료 후 AI 인증 시작
      await verifyMissionPhoto(fileUrl);
      
    } catch (err) {
      error('사진 업로드에 실패했습니다. 다시 시도해주세요.');
      setPhotos([]);
      setPhotoUrls([]);
      setVerificationStatus(null);
      setIsVerifying(false);
    }
  };

  const removePhoto = (index: number) => {
    // URL 메모리 해제
    URL.revokeObjectURL(photoUrls[index]);

    setPhotos([]);
    setPhotoUrls([]);
    setVerificationStatus(null);
  };

  const verifyMissionPhoto = async (photoUrl: string) => {
    try {
      // AI 인증 API 호출 (업로드된 사진 URL 전달)
      const response = await fetch('/mission/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoUrl,
          meetingId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Verification API failed');
      }
      
      const result = await response.json();
      const status = result.data.status; // 'approved' | 'rejected' | 'pending'
      setVerificationStatus(status);

      if (status === "approved") {
        success("미션 인증이 승인되었습니다! 이제 제출할 수 있습니다.");
      } else if (status === "rejected") {
        error("미션 인증이 거부되었습니다. 다른 사진으로 다시 시도해주세요.");
      } else {
        info("미션 인증을 처리 중입니다. 잠시만 기다려주세요.");
        // pending 상태인 경우 주기적으로 상태 확인
        setTimeout(() => checkVerificationStatus(), 3000);
      }
    } catch (err) {
      error("미션 인증 처리 중 오류가 발생했습니다.");
      setVerificationStatus("rejected");
    } finally {
      setIsVerifying(false);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch(`/mission/verify/status?meetingId=${meetingId}`);
      if (response.ok) {
        const result = await response.json();
        const status = result.data.status;
        setVerificationStatus(status);
        
        if (status === "approved") {
          success("미션 인증이 승인되었습니다!");
        } else if (status === "rejected") {
          error("미션 인증이 거부되었습니다.");
        } else if (status === "pending") {
          // 아직 처리 중이면 3초 후 다시 확인
          setTimeout(() => checkVerificationStatus(), 3000);
        }
      }
    } catch (err) {
      console.error('Failed to check verification status:', err);
    }
  };

  const handleSubmit = async () => {
    if (verificationStatus !== "approved") {
      error("승인된 미션 인증 사진이 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 미션 리뷰 제출 API 호출
      const submitData = {
        meetingId,
        photoUrl: uploadedPhotoUrl,
        rating: rating || null,
        reviewText: reviewText || null,
      };

      const response = await fetch('/mission/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      if (!response.ok) {
        throw new Error('Submit API failed');
      }

      success("미션 인증이 최종 제출되었습니다!");

      // 폼 초기화
      setPhotos([]);
      setPhotoUrls([]);
      setRating(0);
      setReviewText("");
      setVerificationStatus(null);
    } catch (err) {
      error("미션 인증 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 미션 정보 로드
  useEffect(() => {
    const fetchMissionInfo = async () => {
      try {
        // TODO: 실제 API 호출
        // const response = await fetch(`/api/meetings/${meetingId}/mission`);
        // const mission = await response.json();
        // setMissionInfo(mission);

        // 실제 API 호출
        const response = await fetch(`/meetings/${meetingId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch meeting info: ${response.status} ${response.statusText}`);
        }
        
        // Content-Type 확인하여 HTML 응답 감지
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        }
        
        const data = await response.json();
        console.log('Meeting API response:', data); // 디버깅용 로그
        // API 응답이 ApiResponseDto로 래핑된 경우와 직접 반환된 경우 모두 처리
        const mission = data.data?.mission || data.mission;
        
        if (!mission) {
          throw new Error('Mission data not found in response');
        }
        
        // photoVerificationGuide를 배열로 변환 (줄바꿈 기준으로 분리)
        const verificationGuide = mission.photoVerificationGuide 
          ? mission.photoVerificationGuide.split('\n').filter((item: string) => item.trim()) 
          : [];
        
        setMissionInfo({
          id: mission.id,
          title: mission.title,
          description: mission.description,
          verificationGuide,
          location: mission.district?.districtName || mission.district?.city,
        });
      } catch (err) {
        console.error('Failed to fetch mission info:', err);
        console.error('Meeting ID:', meetingId);
        error("미션 정보를 불러오는데 실패했습니다.");
      }
    };

    if (meetingId) {
      fetchMissionInfo();
    }
  }, [meetingId, error]);

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

  return (
    <FormContainer $isMobile={isMobile}>
      {/* 미션 인증 가이드 */}
      {missionInfo && (
        <MissionGuideSection>
          <SectionTitle $isMobile={isMobile}>미션 인증 가이드</SectionTitle>
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
            
            {missionInfo.verificationGuide && missionInfo.verificationGuide.length > 0 && (
              <>
                <GuideContent $isMobile={isMobile} style={{ marginTop: '16px', fontWeight: 600 }}>
                  📸 인증 사진에 포함되어야 할 요소:
                </GuideContent>
                <GuideList>
                  {missionInfo.verificationGuide.map((guide, index) => (
                    <GuideItem key={index} $isMobile={isMobile}>
                      {guide}
                    </GuideItem>
                  ))}
                </GuideList>
              </>
            )}
          </GuideCard>
        </MissionGuideSection>
      )}
      
      <PhotoUploadSection>
        <SectionTitle $isMobile={isMobile}>
          미션 인증 <span style={{ color: "#ef4444" }}>*</span>
        </SectionTitle>

        <PhotoUploadArea
          $hasPhotos={photos.length > 0}
          onClick={() => document.getElementById("photo-upload")?.click()}
        >
          <UploadIcon $isMobile={isMobile}>
            <Camera size={isMobile ? 24 : 32} />
          </UploadIcon>
          <UploadText $isMobile={isMobile}>
            {isVerifying
              ? "미션을 검증하고 있어요"
              : "미션을 완료한 인증 사진을 업로드하세요"}
          </UploadText>
          <UploadSubtext $isMobile={isMobile}>
            {isVerifying ? "잠시만 기다려주세요" : "사진 1장을 업로드해주세요"}
          </UploadSubtext>
        </PhotoUploadArea>

        <HiddenFileInput
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          disabled={isVerifying}
        />

        {photoUrls.length > 0 && (
          <PhotoPreview>
            {photoUrls.map((url, index) => (
              <PhotoItem key={index} $verificationStatus={verificationStatus}>
                <PhotoImage src={url} alt={`미션 인증 사진 ${index + 1}`} />
                {verificationStatus && (
                  <VerificationStatus
                    $status={verificationStatus}
                    $isMobile={isMobile}
                  >
                    {verificationStatus === "approved" && "승인됨"}
                    {verificationStatus === "rejected" && "거부됨"}
                    {verificationStatus === "pending" && "검증중"}
                  </VerificationStatus>
                )}
                <RemovePhotoButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(index);
                  }}
                >
                  ×
                </RemovePhotoButton>
              </PhotoItem>
            ))}
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
              onClick={() => setRating(star)}
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
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="자유롭게 미션을 수행하면서 느낀 점이나 경험을 공유해주세요"
          maxLength={500}
        />
      </ReviewSection>

      <SubmitButton
        $isMobile={isMobile}
        $disabled={verificationStatus !== "approved" || isSubmitting}
        onClick={handleSubmit}
      >
        <Send size={16} />
        {isSubmitting
          ? "제출 중..."
          : verificationStatus === "approved"
          ? "미션 인증 제출"
          : "AI 인증 완료 후 제출 가능"}
      </SubmitButton>
    </FormContainer>
  );
};
