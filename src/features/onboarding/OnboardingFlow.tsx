import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { ChevronLeft, X } from "lucide-react";
import { useOnboardingStore } from "../../shared/store";
import {
  Step1BasicInfo,
  Step2ProfileImage,
  Step3Interests,
  Step4Location,
} from "./components";
import type { User } from "../auth/hooks/useAuth";
import { useAlert } from "../../shared/hooks";

// 모달 스타일 컨테이너
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
  z-index: 9999;
  padding: 20px;
  overflow: visible;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: visible;

  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 85vh;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  /* border-bottom: 1px solid ${({ theme }) => theme.colors.border}; */
  flex-shrink: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const ProgressContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const ProgressDot = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme, $active, $completed }) =>
    $completed || $active ? theme.colors.primary : theme.colors.gray300};
  transition: all 0.2s ease;
`;

const Content = styled.main`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  min-height: 0;
`;

const Footer = styled.footer`
  padding: 16px 20px;
  flex-shrink: 0;
`;

const ValidationMessage = styled.div`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 12px;
  margin-bottom: 13px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ theme, $variant }) => {
    if ($variant === "primary") {
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
        
        &:hover {
          background: ${theme.colors.primary}dd;
        }
        
        &:disabled {
          background: ${theme.colors.gray300};
          cursor: not-allowed;
        }
      `;
    }
    return `
      background: ${theme.colors.gray100};
      color: ${theme.colors.text.primary};
      
      &:hover {
        background: ${theme.colors.gray200};
      }
    `;
  }}
`;

interface OnboardingFlowProps {
  user: User;
  onComplete?: (userData: Partial<User>) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  user,
  onComplete: _onComplete,
}) => {
  const [searchParams] = useSearchParams();
  const [showValidation, setShowValidation] = React.useState(false);
  const { success } = useAlert();

  const {
    currentStep,
    formData,
    isSubmitting,
    accountMerged,
    existingUserInfo,
    _onboardingCompleted,
    setCurrentStep,
    loadStaticData,
    submitOnboarding,
    updateFormData,
    reset,
  } = useOnboardingStore();

  // 컴포넌트 마운트 시 정적 데이터 로드 및 초기화
  useEffect(() => {
    loadStaticData();

    // 기존 사용자 정보로 폼 데이터 초기화
    updateFormData({
      phoneNumber: user?.phoneNumber || "",
      nickname: user?.nickname || "",
      birthYear: user?.birthYear?.toString() || "",
      gender: user?.gender || "",
      bio: user?.bio || "",
      profileImageUrl: user?.profileImageUrl || "",
      interests: user?.interests || [],
      mbti: user?.mbti || "",
      districtId: user?.districtId || "",
    });

    return () => {
      reset();
    };
  }, [user, searchParams, loadStaticData, updateFormData, reset]);

  // 계정 통합 처리
  useEffect(() => {
    if (accountMerged && existingUserInfo) {
      if (_onboardingCompleted) {
        // 온보딩이 완료된 기존 사용자와 통합된 경우
        success("기존 계정으로 통합 로그인 됩니다.", "계정 통합 완료");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        // 온보딩이 필요한 기존 사용자와 통합된 경우
        success(
          "기존 계정과 통합되었습니다. 온보딩을 계속 진행해주세요.",
          "계정 통합 완료"
        );
      }
    }
  }, [accountMerged, existingUserInfo, _onboardingCompleted, success]);

  const handleNext = () => {
    if (!canProceed()) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setShowValidation(false);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!canProceed()) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    try {
      const loginResult = await submitOnboarding();
      console.log("Onboarding completed successfully:", loginResult);
      window.location.href = "/";
    } catch (error) {
      console.error("Onboarding submission failed:", error);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.birthYear && formData.gender && formData.phoneVerified;
      case 2:
        return formData.nickname.trim(); // 닉네임은 필수
      case 3:
        return formData.interests.length > 0;
      case 4:
        return formData.districtId;
      default:
        return false;
    }
  };

  const getValidationMessage = () => {
    if (!showValidation) return null;

    switch (currentStep) {
      case 1:
        // 1단계는 각 필드별로 validation 메시지 표시
        return null;
      case 2:
        // 2단계도 각 필드별로 validation 메시지 표시
        return null;
      case 3:
        if (formData.interests.length === 0)
          return "관심사를 최소 1개 이상 선택해주세요";
        return null;
      case 4:
        // 4단계도 각 필드별로 validation 메시지 표시
        return null;
      default:
        return null;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo showValidationErrors={showValidation} />;
      case 2:
        return <Step2ProfileImage showValidationErrors={showValidation} />;
      case 3:
        return <Step3Interests />;
      case 4:
        return <Step4Location showValidationErrors={showValidation} />;
      default:
        return <Step1BasicInfo showValidationErrors={showValidation} />;
    }
  };

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <Header>
            <BackButton
              onClick={handlePrevious}
              style={{ visibility: currentStep === 1 ? "hidden" : "visible" }}
            >
              <ChevronLeft size={20} />
            </BackButton>

            <ProgressContainer>
              {[1, 2, 3, 4].map((step) => (
                <ProgressDot
                  key={step}
                  $active={step === currentStep}
                  $completed={step < currentStep}
                />
              ))}
            </ProgressContainer>

            <CloseButton onClick={() => (window.location.href = "/login")}>
              <X size={20} />
            </CloseButton>
          </Header>

          <Content>{renderStep()}</Content>

          <Footer>
            {showValidation && getValidationMessage() && (
              <ValidationMessage>{getValidationMessage()}</ValidationMessage>
            )}

            <ButtonGroup>
              {currentStep < 4 ? (
                <Button $variant="primary" onClick={handleNext}>
                  다음
                </Button>
              ) : (
                <Button
                  $variant="primary"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "완료 중..." : "완료"}
                </Button>
              )}
            </ButtonGroup>
          </Footer>
        </ModalContent>
      </ModalOverlay>
    </>
  );
};
