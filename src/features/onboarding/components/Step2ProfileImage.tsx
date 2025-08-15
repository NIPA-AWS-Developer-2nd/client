import React, { useState, useRef } from "react";
import styled from "styled-components";
import { User, Shuffle, Image as ImageIcon } from "lucide-react";
import { useOnboardingStore } from "../../../shared/store";
import { uploadToS3 } from "../../../shared/utils/s3Upload";
import { getOptimizedImageUrl } from "../../../shared/utils/imageOptimization";
import { generateNickname } from "starving-orange";
import { useAlert } from "../../../shared/components/common";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: 24px;
`;

const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  cursor: pointer;
`;

const ProfileImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: filter 0.2s;

  &:hover .edit-overlay {
    opacity: 1;
    pointer-events: auto;
  }
  &:hover {
    filter: brightness(0.7);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const DefaultAvatarIcon = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 2;
`;

const UploadText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

// const BioSection = styled.div`
//   margin-top: 16px;
// `;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const NicknameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GenerateButton = styled.button`
  padding: 12px 10px;
  background: ${({ theme }) => theme.colors.gray200};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.gray300};
  }
`;

// const TextArea = styled.textarea`
//   width: 100%;
//   min-height: 80px;
//   padding: 12px 16px;
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: 8px;
//   font-size: 14px;
//   background: ${({ theme }) => theme.colors.background};
//   color: ${({ theme }) => theme.colors.text.primary};
//   resize: vertical;

//   &:focus {
//     outline: none;
//     border-color: ${({ theme }) => theme.colors.primary};
//   }

//   &::placeholder {
//     color: ${({ theme }) => theme.colors.text.secondary};
//   }
// `;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FieldValidationMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.warning};
  margin-top: 6px;
  margin-bottom: 8px;
`;

// const CharCount = styled.div`
//   text-align: right;
//   font-size: 12px;
//   color: ${({ theme }) => theme.colors.text.secondary};
//   margin-top: 4px;
// `;

interface Props {
  showValidationErrors?: boolean;
}

export const Step2ProfileImage: React.FC<Props> = ({
  showValidationErrors = false,
}) => {
  const { formData, updateFormData } = useOnboardingStore();
  const { error } = useAlert();
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 기존 이미지 URL이 있으면 미리보기에 설정
  React.useEffect(() => {
    if (formData.profileImageUrl && !previewImage) {
      setPreviewImage(formData.profileImageUrl);
    }
  }, [formData.profileImageUrl, previewImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // if (file.size > 5 * 1024 * 1024) {
    //   alert("파일 크기가 5MB를 초과합니다.");
    //   return;
    // }

    if (!file.type.startsWith("image/")) {
      error("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setIsUploading(true);
    try {
      // 미리보기를 위한 로컬 URL 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // profiles 폴더에 업로드 (백엔드에서 original/profiles/로 저장됨)
      const imageUrl = await uploadToS3(file, "profiles");
      updateFormData({ profileImageUrl: imageUrl });
    } catch (uploadError) {
      console.error("이미지 업로드 실패:", uploadError);
      error("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      // 실패 시 미리보기 제거
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileImageClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  // 한글, 영문, 숫자만 허용 (공백, 특수문자 제외)
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 한글(자모 포함), 영문, 숫자만 허용
    const filtered = value
      .replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, "")
      .slice(0, 10);
    updateFormData({ nickname: filtered });
  };

  const handleGenerateNickname = () => {
    const newNickname = generateNickname({ noSpacing: true }).nickname;
    updateFormData({ nickname: newNickname });
  };

  // const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const value = e.target.value;
  //   if (value.length <= 50) {
  //     updateFormData({ bio: value });
  //   }
  // };

  // 이미지 로드 핸들러
  const handleImageLoad = () => {
    // console.log("이미지 로드 성공:", currentImage);
    setImageError(false);
  };

  // 현재 표시할 이미지 (미리보기 우선, 없으면 저장된 URL의 최적화 버전)
  const currentImage = previewImage || getOptimizedImageUrl(formData.profileImageUrl, { size: 'medium' });

  const getNicknameValidation = () => {
    if (showValidationErrors && !formData.nickname.trim()) {
      return "닉네임을 입력해주세요";
    }
    return null;
  };

  return (
    <Container>
      <Title>프로필을 설정해주세요</Title>
      <Subtitle>나를 나타내는 프로필 사진과 닉네임을 지정해주세요</Subtitle>

      <Label htmlFor="profile-image">프로필이미지</Label>
      <ProfileImageSection>
        <ProfileImageContainer
          onClick={handleProfileImageClick}
          style={{ cursor: isUploading ? "not-allowed" : "pointer" }}
        >
          <ProfileImageWrapper>
            {currentImage && !imageError ? (
              <ProfileImage
                src={currentImage}
                alt="Profile"
                onLoad={handleImageLoad}
              />
            ) : (
              <DefaultAvatarIcon>
                <User size={48} />
              </DefaultAvatarIcon>
            )}
            <EditOverlay className="edit-overlay">
              <ImageIcon size={32} color="#fff" />
            </EditOverlay>
          </ProfileImageWrapper>
        </ProfileImageContainer>

        <UploadText>
          {isUploading ? "업로드 중.." : "프로필 이미지를 클릭하여 변경"}
        </UploadText>

        <HiddenFileInput
          id="profile-image-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          ref={fileInputRef}
        />
      </ProfileImageSection>

      <FormGroup>
        <Label htmlFor="nickname">닉네임 *</Label>
        <NicknameWrapper>
          <Input
            id="nickname"
            type="text"
            placeholder="사용할 닉네임을 입력해주세요"
            value={formData.nickname}
            onChange={handleNicknameChange}
            maxLength={10}
          />
          <GenerateButton type="button" onClick={handleGenerateNickname}>
            <Shuffle size={16} />
          </GenerateButton>
        </NicknameWrapper>
        {getNicknameValidation() && (
          <FieldValidationMessage>
            {getNicknameValidation()}
          </FieldValidationMessage>
        )}
      </FormGroup>

      {/* <BioSection>
        <Label htmlFor="bio">자기소개</Label>
        <TextArea
          id="bio"
          placeholder="간단한 자기소개를 작성해주세요"
          value={formData.bio}
          onChange={handleBioChange}
          maxLength={50}
        />
        <CharCount>{formData.bio.length}/50</CharCount>
      </BioSection> */}
    </Container>
  );
};
