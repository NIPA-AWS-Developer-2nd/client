import React, { useState } from "react";
import styled from "styled-components";
import { X, User, Edit2, Shuffle, MapPin } from "lucide-react";
import { generateNickname } from "starving-orange";
import type { User as UserType } from "../../auth/hooks/useAuth";
import { CATEGORIES_WITHOUT_ALL } from "../../../data/categories";
import { useOnboardingStore } from "../../../shared/store";
import { uploadToS3 } from "../../../shared/utils/s3Upload";
import { getOptimizedImageUrl } from "../../../shared/utils/imageOptimization";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";
import { deviceDetection } from "../../../shared/utils/deviceDetection";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px 40px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    align-items: center;
    padding: 16px;
  }
`;

const ModalContent = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  background: #fff7f0;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 75vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  flex-shrink: 0;
`;

const ModalBody = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  min-height: 0;
`;

const ModalFooter = styled.div`
  padding: 16px 20px;
  flex-shrink: 0;
`;

const ProgressContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  text-align: center;
  padding-top: 10px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }
`;

const Section = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
`;

const ProfileImageSection = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};

  @media (max-width: 1180px) and (orientation: landscape) {
    margin-bottom: 16px;
    gap: 10px;
  }
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  @media (max-width: 1180px) and (orientation: landscape) {
    width: 120px;
    height: 120px;
  }

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
    theme.colors.background.primary === "#1A202C"
      ? "brightness(0.8) blur(0.5px)"
      : "none"};
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
  background: ${({ theme }) => `${theme.colors.primary}80`};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: ${({ theme }) => theme.transitions.fast};
  color: ${({ theme }) => theme.colors.white};

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FormField = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};

  @media (max-width: 1180px) and (orientation: landscape) {
    margin-bottom: 20px;
  }
`;

const Label = styled.label<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
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
  background: ${({ theme }) => theme.colors.input};
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

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

const NicknameWrapper = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "6px" : "8px")};
`;

const NicknameInput = styled(Input)<{ $isMobile?: boolean }>`
  height: ${({ $isMobile }) => ($isMobile ? "40px" : "44px")};
  flex: 1;
`;

const GenerateButton = styled.button<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "10px 8px" : "12px 10px")};
  background: ${({ theme }) => theme.colors.gray200};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ $isMobile }) => ($isMobile ? "40px" : "44px")};
  width: ${({ $isMobile }) => ($isMobile ? "70px" : "80px")};
  flex-shrink: 0;
  outline: none;
  box-shadow: none;

  &:hover {
    background: ${({ theme }) => theme.colors.gray300};
  }
`;

const CategoryGrid = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "10px")};
  justify-content: flex-start;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};

  @media (max-width: 1180px) and (orientation: landscape) {
    margin-bottom: 16px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const MbtiGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};

  @media (max-width: 1180px) and (orientation: landscape) {
    margin-bottom: 16px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }

  @media (max-width: 360px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

const MbtiOption = styled.button<{
  $isMobile?: boolean;
  $selected?: boolean;
}>`
  padding: 12px 8px;
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.secondary : theme.colors.border};
  border-radius: 8px;
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.secondary : theme.colors.gray100};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.white : theme.colors.text.primary};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  box-shadow: none;

  &:hover {
    transform: translateY(-1px);
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.secondaryLight : theme.colors.gray200};
  }

  &:active {
    transform: translateY(0);
  }
`;

const CategoryOption = styled.button<{
  $isMobile?: boolean;
  $selected?: boolean;
}>`
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 14px")};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.secondary : theme.colors.gray100};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.white : theme.colors.text.primary};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.secondary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: center;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  outline: none;
  box-shadow: none;

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.secondaryLight : theme.colors.gray200};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const BioTextarea = styled.textarea<{ $isMobile?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 14px" : "14px 16px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.input};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`;

const CharacterCount = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: right;
  margin-top: 4px;
`;

const GenderButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const GenderButton = styled.button<{ $selected: boolean }>`
  flex: 1;
  padding: 12px;
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.secondary : theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.secondary : "transparent"};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.white : theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-height: 240px;
  overflow-y: auto;
  padding: 4px;
`;

const LocationButton = styled.button<{
  $selected: boolean;
  $disabled: boolean;
}>`
  padding: 12px 8px;
  border: 2px solid
    ${({ theme, $selected, $disabled }) =>
      $disabled
        ? theme.colors.gray300
        : $selected
        ? theme.colors.secondary
        : theme.colors.border};
  border-radius: 8px;
  background: ${({ theme, $selected, $disabled }) =>
    $disabled
      ? theme.colors.gray100
      : $selected
      ? theme.colors.secondary
      : theme.colors.background};
  color: ${({ theme, $selected, $disabled }) =>
    $disabled
      ? theme.colors.gray400
      : $selected
      ? theme.colors.white
      : theme.colors.text.primary};
  font-size: 13px;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  min-height: 60px;

  &:hover {
    transform: ${({ $disabled }) => ($disabled ? "none" : "translateY(-1px)")};
    box-shadow: ${({ $disabled }) =>
      $disabled ? "none" : "0 2px 8px rgba(0, 0, 0, 0.1)"};
  }

  &:active {
    transform: ${({ $disabled }) => ($disabled ? "none" : "translateY(0)")};
  }
`;

const SaveButton = styled.button<{ $isMobile?: boolean }>`
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray300};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  margin: 0 28px 16px 28px;
  background: ${({ theme }) => theme.colors.danger}15;
  border: 1px solid ${({ theme }) => theme.colors.danger}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  line-height: 1.4;

  @media (max-width: 768px) {
    margin: 0 16px 16px 16px;
    padding: 10px 14px;
    font-size: 13px;
  }
`;

const FieldError = styled.div`
  color: ${({ theme }) => theme.colors.danger || "#ef4444"};
  font-size: 12px;
  margin-top: 4px;
  margin-left: 2px;
`;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  user: UserType;
  onSave: (updatedUser: Partial<UserType>) => void;
  isOnboarding?: boolean;
  // 새로운 props for backend integration
  isSubmitting?: boolean;
  error?: string | null;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  isMobile,
  user,
  onSave,
  isOnboarding = false,
  isSubmitting = false,
  error = null,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 온보딩 스토어 (항상 호출하똄 온보딩 모드일 때만 사용)
  const {
    formData: _storeFormData,
    updateFormData: updateStoreFormData,
    categories: storeCategories,
    districts: storeDistricts,
    hashtags: storeHashtags,
    loadStaticData,
  } = useOnboardingStore();
  const [formData, setFormData] = useState({
    name: user.nickname || "",
    bio: user.bio || "",
    profile_image_url: user.profileImageUrl || "",
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedMbti, setSelectedMbti] = useState<string>("");
  const [selectedBirthYear, setSelectedBirthYear] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedHashtags, setSelectedHashtags] = useState<number[]>([]);
  const [nicknameError, setNicknameError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    nickname: "",
    interests: "",
    hashtags: "",
  });

  // Validation function
  const validateForm = () => {
    const errors = {
      nickname: "",
      interests: "",
      hashtags: "",
    };

    // 닉네임 검증
    if (!formData.name.trim()) {
      errors.nickname = "닉네임을 입력해주세요.";
    } else if (formData.name.trim().length > 10) {
      errors.nickname = "닉네임은 10글자 이내로 입력해주세요.";
    }

    // 관심사 검증
    if (selectedCategories.length === 0) {
      errors.interests = "관심사를 최소 1개 선택해주세요.";
    } else if (selectedCategories.length > 6) {
      errors.interests = "관심사는 최대 6개까지 선택할 수 있습니다.";
    }

    // 해시태그 검증 (선택사항이므로 최대 개수만 체크)
    if (selectedHashtags.length > 6) {
      errors.hashtags = "해시태그는 최대 6개까지 선택할 수 있습니다.";
    }

    setValidationErrors(errors);
    return !errors.nickname && !errors.interests && !errors.hashtags;
  };

  // 모달이 열릴 때 한 번만 사용자 데이터로 폼 초기화
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  React.useEffect(() => {
    if (isOpen && storeCategories.length > 0 && storeHashtags.length > 0 && !isInitialized) {
      console.log("ProfileEditModal 초기화 -> 받은 user 데이터:", user);

      setFormData({
        name: user.nickname || "",
        bio: user.bio || "",
        profile_image_url: user.profileImageUrl || "",
      });

      // MBTI 초기화
      setSelectedMbti(user.mbti || "");

      // 출생연도 초기화
      setSelectedBirthYear(user.birthYear?.toString() || "");

      // 성별 초기화
      setSelectedGender(user.gender || "");

      // 지역 초기화
      setSelectedDistrictId(user.districtId || "");

      // 해시태그 초기화
      setSelectedHashtags(user.hashtags || []);

      // 관심사 초기화
      setSelectedCategories(user.interests || []);

      setPreviewImage(null);
      setNicknameError("");
      setIsInitialized(true);

      console.log("🔧 ProfileEditModal 초기화 완료:", {
        name: user.nickname,
        mbti: user.mbti,
        interests: user.interests,
        hashtags: user.hashtags,
      });
    }
  }, [isOpen, storeCategories.length, storeHashtags.length, isInitialized, user.nickname, user.mbti, user.interests, user.hashtags]);

  // 모달이 닫힐 때 초기화 상태 리셋
  React.useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen]);

  // 카테고리 및 지역 데이터 로드
  React.useEffect(() => {
    if (
      !isOnboarding &&
      (storeCategories.length === 0 || storeDistricts.length === 0)
    ) {
      // 프로필 편집 모드에서도 백엔드 데이터 로드
      loadStaticData();
    }
  }, [
    isOnboarding,
    storeCategories.length,
    storeDistricts.length,
    loadStaticData,
  ]);

  // 중앙화된 카테고리 사용
  // 백엔드 카테고리가 있으면 사용, 없으면 기본 카테고리 사용
  const availableCategories =
    storeCategories.length > 0
      ? storeCategories.map((cat) => ({
          id: cat.id,
          label: cat.name,
          icon: cat.icon,
        }))
      : CATEGORIES_WITHOUT_ALL;

  // 디버깅용 로그
  React.useEffect(() => {
    // console.log("카테고리 데이터:", {
    //   storeCategories,
    //   availableCategories,
    //   selectedCategories,
    // });
  }, [storeCategories, availableCategories, selectedCategories]);

  const mbtiOptions = [
    "INTJ",
    "INTP",
    "ENTJ",
    "ENTP",
    "INFJ",
    "INFP",
    "ENFJ",
    "ENFP",
    "ISTJ",
    "ISFJ",
    "ESTJ",
    "ESFJ",
    "ISTP",
    "ISFP",
    "ESTP",
    "ESFP",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 온보딩 모드일 때 스토어에도 동기화
    if (isOnboarding) {
      const fieldMap: Record<string, keyof typeof _storeFormData> = {
        name: "nickname",
        bio: "bio",
        profile_image_url: "profileImageUrl",
      };

      const storeField = fieldMap[field];
      if (storeField) {
        updateStoreFormData({ [storeField]: value });
      }
    }
  };

  const generateRandomNickname = () => {
    const result = generateNickname({
      noSpacing: true,
    });
    // handleInputChange를 통해 스토어 동기화도 함께 처리
    handleInputChange("name", result.nickname);
    setNicknameError("");
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    try {
      setIsUploadingImage(true);

      // 미리보기를 위한 로컬 URL 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // S3 profiles 폴더에 업로드 (백엔드에서 original/profiles/로 저장됨)
      const publicUrl = await uploadToS3(file, "profiles");

      // 업로드 성공 시 URL을 form data에 저장
      setFormData((prev) => ({ ...prev, profile_image_url: publicUrl }));

      // 온보딩 모드일 때 스토어에도 저장
      if (isOnboarding) {
        updateStoreFormData({ profileImageUrl: publicUrl });
      }

      console.log("Profile image uploaded successfully:", publicUrl);
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");

      // 실패 시 미리보기 제거
      setPreviewImage(null);
    } finally {
      setIsUploadingImage(false);
      // input 값 초기화 (같은 파일을 다시 선택할 수 있도록)
      event.target.value = "";
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    let newCategories: string[];

    if (selectedCategories.includes(categoryId)) {
      // 선택 해제
      newCategories = selectedCategories.filter((c) => c !== categoryId);
    } else {
      // 선택 추가 - 최대 6개 제한
      if (selectedCategories.length >= 6) {
        setValidationErrors((prev) => ({
          ...prev,
          interests: "관심사는 최대 6개까지 선택할 수 있습니다.",
        }));
        return;
      }
      newCategories = [...selectedCategories, categoryId];
    }

    setSelectedCategories(newCategories);

    // 관심사 에러 초기화
    if (newCategories.length > 0 && newCategories.length <= 3) {
      setValidationErrors((prev) => ({
        ...prev,
        interests: "",
      }));
    }

    // 온보딩 모드일 때 스토어에도 동기화
    if (isOnboarding) {
      updateStoreFormData({ interests: newCategories });
    }
  };

  const handleMbtiSelect = (mbti: string) => {
    setSelectedMbti(mbti);

    // 온보딩 모드일 때 스토어에도 동기화
    if (isOnboarding) {
      updateStoreFormData({ mbti });
    }
  };

  const handleBirthYearSelect = (birthYear: string) => {
    setSelectedBirthYear(birthYear);

    // 온보딩 모드일 때 스토어에도 동기화
    if (isOnboarding) {
      updateStoreFormData({ birthYear });
    }
  };

  const handleGenderSelect = (gender: "male" | "female") => {
    setSelectedGender(gender);

    // 온보딩 모드일 때 스토어에도 동기화
    if (isOnboarding) {
      updateStoreFormData({ gender });
    }
  };

  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrictId(districtId);

    // 온보딩 모드일 때 스토어에도 동기화
    if (isOnboarding) {
      updateStoreFormData({ districtId });
    }
  };

  const handleHashtagToggle = (hashtagId: number) => {
    let newHashtags: number[];

    if (selectedHashtags.includes(hashtagId)) {
      // 선택 해제
      newHashtags = selectedHashtags.filter((h) => h !== hashtagId);
    } else {
      // 선택 추가 - 최대 6개 제한
      if (selectedHashtags.length >= 6) {
        setValidationErrors((prev) => ({
          ...prev,
          hashtags: "해시태그는 최대 6개까지 선택할 수 있습니다.",
        }));
        return;
      }
      newHashtags = [...selectedHashtags, hashtagId];
    }

    setSelectedHashtags(newHashtags);

    // 해시태그 에러 초기화
    if (newHashtags.length <= 3) {
      setValidationErrors((prev) => ({
        ...prev,
        hashtags: "",
      }));
    }

    // 온보딩 모드일 때 스토어에도 동기화 (문자열 배열로 변환)
    if (isOnboarding) {
      const hashtagLabels = newHashtags
        .map((id) => {
          const hashtag = storeHashtags.find((opt) => opt.id === id);
          return hashtag ? hashtag.name : "";
        })
        .filter((label) => label !== "");

      updateStoreFormData({ moods: hashtagLabels });
    }
  };

  const handleNext = () => {
    // 폼 검증
    if (!validateForm()) {
      console.log("폼 검증 실패:", validationErrors);
      return;
    }

    if (!isOnboarding) {
      // 비온보딩 모드: 바로 저장
      onSave({
        ...formData,
        interests: selectedCategories,
        hashtags: selectedHashtags,
        mbti: selectedMbti,
        birthYear: selectedBirthYear ? parseInt(selectedBirthYear) : undefined,
        gender: selectedGender as "male" | "female" | undefined,
        districtId: selectedDistrictId,
      });
      return;
    }

    onSave({
      ...formData,
      interests: selectedCategories,
      hashtags: selectedHashtags,
      mbti: selectedMbti,
      birthYear: selectedBirthYear ? parseInt(selectedBirthYear) : undefined,
      gender: selectedGender as "male" | "female" | undefined,
      districtId: selectedDistrictId,
    });
    onClose();
  };

  const currentImage =
    previewImage ||
    getOptimizedImageUrl(formData.profile_image_url, { size: "medium" });

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent $isMobile={isMobile} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div style={{ width: 36 }} />
          <ProgressContainer>
            <ModalTitle $isMobile={isMobile}>프로필 편집</ModalTitle>
          </ProgressContainer>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* 1. 기본 정보 (출생연도, 성별) */}
          <Section $isMobile={isMobile}>
            <FormField $isMobile={isMobile}>
              <Label $isMobile={isMobile}>출생연도</Label>
              <CustomSelect
                value={selectedBirthYear}
                options={(() => {
                  const currentYear = new Date().getFullYear();
                  const options = [];
                  for (let year = currentYear - 14; year >= 1950; year--) {
                    options.push({
                      value: year.toString(),
                      label: `${year}년`,
                    });
                  }
                  return options;
                })()}
                placeholder="출생연도를 선택해주세요"
                onChange={handleBirthYearSelect}
                $isMobile={deviceDetection.isMobile()}
              />
            </FormField>

            <FormField $isMobile={isMobile}>
              <Label $isMobile={isMobile}>성별</Label>
              <GenderButtonGroup>
                <GenderButton
                  type="button"
                  $selected={selectedGender === "male"}
                  onClick={() => handleGenderSelect("male")}
                >
                  남성
                </GenderButton>
                <GenderButton
                  type="button"
                  $selected={selectedGender === "female"}
                  onClick={() => handleGenderSelect("female")}
                >
                  여성
                </GenderButton>
              </GenderButtonGroup>
            </FormField>
          </Section>

          {/* 2. 프로필 이미지, 닉네임, 한줄소개 */}
          <Section $isMobile={isMobile}>
            <SectionTitle $isMobile={isMobile}>프로필이미지</SectionTitle>
            <ProfileImageSection $isMobile={isMobile}>
              <ProfileImageWrapper
                onClick={() =>
                  !isUploadingImage && fileInputRef.current?.click()
                }
                style={{
                  cursor: isUploadingImage ? "wait" : "pointer",
                  opacity: isUploadingImage ? 0.7 : 1,
                }}
              >
                {currentImage ? (
                  <ProfileImage src={currentImage} alt="Profile" />
                ) : (
                  <ProfileImagePlaceholder>
                    <User size={40} />
                  </ProfileImagePlaceholder>
                )}
                <EditOverlay className="edit-overlay">
                  {isUploadingImage ? (
                    <div
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <div>업로드 중</div>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid transparent",
                          borderTop: "2px solid white",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    </div>
                  ) : (
                    <Edit2 size={20} />
                  )}
                </EditOverlay>
              </ProfileImageWrapper>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
              />
            </ProfileImageSection>
          </Section>

          <Section $isMobile={isMobile}>
            <FormField $isMobile={isMobile}>
              <Label $isMobile={isMobile}>닉네임</Label>
              <NicknameWrapper $isMobile={isMobile}>
                <NicknameInput
                  $isMobile={isMobile}
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const cleanValue = inputValue.slice(0, 10);

                    // 글자수 제한만 체크
                    if (inputValue.length > 10) {
                      setNicknameError("닉네임은 10글자 이내로 입력해주세요.");
                      setValidationErrors((prev) => ({
                        ...prev,
                        nickname: "닉네임은 10글자 이내로 입력해주세요.",
                      }));
                    } else {
                      setNicknameError("");
                      setValidationErrors((prev) => ({
                        ...prev,
                        nickname: "",
                      }));
                    }

                    handleInputChange("name", cleanValue);
                  }}
                  placeholder="닉네임을 입력하세요"
                  maxLength={10}
                />
                <GenerateButton
                  $isMobile={isMobile}
                  type="button"
                  onClick={generateRandomNickname}
                >
                  <Shuffle size={16} />
                </GenerateButton>
              </NicknameWrapper>
              {(nicknameError || validationErrors.nickname) && (
                <FieldError>
                  {nicknameError || validationErrors.nickname}
                </FieldError>
              )}
            </FormField>

            <FormField $isMobile={isMobile}>
              <Label $isMobile={isMobile}>한줄소개</Label>
              <BioTextarea
                $isMobile={isMobile}
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="직업, 취미, 관심사 등 무엇이든 좋아요"
                maxLength={50}
              />
              <CharacterCount>{formData.bio?.length || 0}/50</CharacterCount>
            </FormField>
          </Section>

          {/* 3. 관심 카테고리 */}
          <Section $isMobile={isMobile}>
            <SectionTitle $isMobile={isMobile}>관심 카테고리</SectionTitle>
            <CategoryGrid $isMobile={isMobile}>
              {availableCategories.map((category) => {
                return (
                  <CategoryOption
                    key={category.id}
                    $isMobile={isMobile}
                    $selected={selectedCategories.includes(category.id)}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    {typeof category.icon === "string" && (
                      <span>{category.icon}</span>
                    )}
                    {category.label}
                  </CategoryOption>
                );
              })}
            </CategoryGrid>
            {validationErrors.interests && (
              <FieldError>{validationErrors.interests}</FieldError>
            )}
          </Section>

          {/* 4. MBTI */}
          <Section $isMobile={isMobile}>
            <SectionTitle $isMobile={isMobile}>MBTI</SectionTitle>
            <MbtiGrid $isMobile={isMobile}>
              {mbtiOptions.map((mbti) => (
                <MbtiOption
                  key={mbti}
                  $isMobile={isMobile}
                  $selected={selectedMbti === mbti}
                  onClick={() => handleMbtiSelect(mbti)}
                >
                  {mbti}
                </MbtiOption>
              ))}
            </MbtiGrid>
          </Section>

          {/* 5. 해시태그 */}
          <Section $isMobile={isMobile}>
            <SectionTitle $isMobile={isMobile}>해시태그</SectionTitle>
            <CategoryGrid $isMobile={isMobile}>
              {storeHashtags.map((hashtag) => (
                <CategoryOption
                  key={hashtag.id}
                  $isMobile={isMobile}
                  $selected={selectedHashtags.includes(hashtag.id)}
                  onClick={() => handleHashtagToggle(hashtag.id)}
                >
                  {hashtag.name}
                </CategoryOption>
              ))}
            </CategoryGrid>
            {validationErrors.hashtags && (
              <FieldError>{validationErrors.hashtags}</FieldError>
            )}
          </Section>

          {/* 6. 활동 지역 */}
          <Section $isMobile={isMobile}>
            <SectionTitle $isMobile={isMobile}>활동 지역</SectionTitle>
            <LocationGrid>
              {storeDistricts.map((district) => (
                <LocationButton
                  key={district.id}
                  $selected={selectedDistrictId === district.id}
                  $disabled={!district.isActive}
                  onClick={() =>
                    district.isActive && handleDistrictSelect(district.id)
                  }
                >
                  <div>
                    <MapPin size={20} />
                  </div>
                  <div>{district.districtName}</div>
                </LocationButton>
              ))}
            </LocationGrid>
          </Section>
        </ModalBody>

        {/* 에러 메시지 표시 */}
        {error && isOnboarding && <ErrorMessage>{error}</ErrorMessage>}

        <ModalFooter>
          <ButtonGroup>
            <SaveButton
              $isMobile={isMobile}
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? "처리 중..." : "저장"}
            </SaveButton>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
