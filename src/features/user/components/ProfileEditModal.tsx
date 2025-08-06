import React, { useState } from "react";
import styled from "styled-components";
import { X, User, Check, Shield, Edit2 } from "lucide-react";
// import { Modal } from "../../../components/ui";
import type { User as UserType } from "../../../types";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 20px 16px 40px 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 1024px) {
    padding: 10px 16px 102px 16px; /* fallback: 72px + 30px */
    padding: 10px 16px calc(72px + env(safe-area-inset-bottom) + 30px) 16px;
  }
`;

const ModalContent = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "90vw" : "420px")};
  max-width: ${({ $isMobile }) => ($isMobile ? "90vw" : "420px")};
  max-height: none;
  height: auto;
  margin: ${({ $isMobile }) =>
    $isMobile ? "10px auto 10px auto" : "20px auto 20px auto"};
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Section = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
`;

const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.02);
  }

  &:hover .edit-overlay {
    opacity: 1;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${({ theme }) => 
    theme.colors.background === '#1A202C' ? 'brightness(0.8) blur(0.5px)' : 'none'
  };
  transition: filter 0.2s ease;
`;

const ProfileImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray500};
`;

const EditOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: ${({ theme }) => theme.transitions.fast};
  color: ${({ theme }) => theme.colors.white};
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FormField = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const Label = styled.label<{ $isMobile?: boolean }>`
  display: block;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

const Input = styled.input<{ $isMobile?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 14px" : "14px 16px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray50};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const PhoneVerificationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PhoneInput = styled(Input)`
  flex: 1;
`;

const VerifyButton = styled.button<{
  $isMobile?: boolean;
  $verified?: boolean;
}>`
  padding: ${({ $isMobile }) => ($isMobile ? "12px 16px" : "14px 18px")};
  background: ${({ $verified, theme }) =>
    $verified ? theme.colors.success : theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 500;
  cursor: ${({ $verified }) => ($verified ? "default" : "pointer")};
  transition: ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${({ $verified, theme }) =>
      $verified ? theme.colors.success : theme.colors.primary}DD;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CategoryGrid = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "10px")};
`;

const CategoryOption = styled.button<{
  $isMobile?: boolean;
  $selected?: boolean;
}>`
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 14px")};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.gray100};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.white : theme.colors.text.primary};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: center;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.gray200};
  }
`;

const ButtonGroup = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  margin-top: ${({ $isMobile }) => ($isMobile ? "24px" : "32px")};
`;

const SaveButton = styled.button<{ $isMobile?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 20px" : "14px 24px")};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}DD;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  user: UserType;
  onSave: (updatedUser: Partial<UserType>) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  isMobile,
  user,
  onSave,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    profile_image_url: user.profile_image_url || "",
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "문화/예술",
    "스포츠",
    "맛집 탐방",
    "여행",
    "독서",
    "게임",
  ]);

  const [isPhoneVerified, setIsPhoneVerified] = useState(true); // Mock: 이미 인증된 상태
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 모달이 열릴 때마다 사용자 데이터로 폼 초기화
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profile_image_url: user.profile_image_url || "",
      });
      setPreviewImage(null);
    }
  }, [isOpen, user]);

  const availableCategories = [
    "문화/예술",
    "스포츠",
    "음식",
    "여행",
    "독서",
    "게임",
    "요리",
    "음악",
    "영화",
    "사진",
    "운동",
    "카페",
    "쇼핑",
    "반려동물",
    "IT/테크",
    "언어",
    "봉사활동",
    "건강",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({ ...prev, profile_image_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePhoneVerification = () => {
    if (!isPhoneVerified) {
      // Mock: 인증 처리
      alert("전화번호 인증이 시작됩니다.");
      setIsPhoneVerified(true);
    }
  };

  const handleSave = () => {
    onSave({
      ...formData,
      // 선호도는 별도 필드로 관리할 수 있음
    });
    onClose();
  };

  const currentImage = previewImage || formData.profile_image_url;

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent $isMobile={isMobile} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle $isMobile={isMobile}>프로필 편집</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>프로필 사진</SectionTitle>
          <ProfileImageSection>
            <ProfileImageWrapper onClick={() => fileInputRef.current?.click()}>
              {currentImage ? (
                <ProfileImage src={currentImage} alt="Profile" />
              ) : (
                <ProfileImagePlaceholder>
                  <User size={40} />
                </ProfileImagePlaceholder>
              )}
              <EditOverlay className="edit-overlay">
                <Edit2 size={20} />
              </EditOverlay>
            </ProfileImageWrapper>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </ProfileImageSection>
        </Section>

        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>기본 정보</SectionTitle>
          <FormField $isMobile={isMobile}>
            <Label $isMobile={isMobile}>닉네임</Label>
            <Input
              $isMobile={isMobile}
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
          </FormField>
          <FormField $isMobile={isMobile}>
            <Label $isMobile={isMobile}>전화번호</Label>
            <PhoneVerificationWrapper>
              <PhoneInput
                $isMobile={isMobile}
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="010-0000-0000"
                disabled={isPhoneVerified}
              />
              <VerifyButton
                $isMobile={isMobile}
                $verified={isPhoneVerified}
                onClick={handlePhoneVerification}
                disabled={isPhoneVerified}
              >
                {isPhoneVerified ? (
                  <>
                    <Check size={14} />
                    인증완료
                  </>
                ) : (
                  <>
                    <Shield size={14} />
                    인증
                  </>
                )}
              </VerifyButton>
            </PhoneVerificationWrapper>
          </FormField>
        </Section>

        <Section $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>관심 카테고리</SectionTitle>
          <CategoryGrid $isMobile={isMobile}>
            {availableCategories.map((category) => (
              <CategoryOption
                key={category}
                $isMobile={isMobile}
                $selected={selectedCategories.includes(category)}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </CategoryOption>
            ))}
          </CategoryGrid>
        </Section>

        <ButtonGroup $isMobile={isMobile}>
          <SaveButton $isMobile={isMobile} onClick={handleSave}>
            저장
          </SaveButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};
