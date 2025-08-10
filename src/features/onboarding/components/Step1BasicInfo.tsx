import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Check } from "lucide-react";
import { useOnboardingStore } from "../../../shared/store";

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

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

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
`;

const Select = styled.select`
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
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: transparent;
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PhoneInputBox = styled.div`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: 8px;
`;

const PhoneInputGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const VerifyButton = styled.button<{
  $verified: boolean;
  $variant?: "primary" | "secondary";
}>`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: ${({ $verified, theme }) =>
    $verified ? "#28a745" : theme.colors.primary};
  color: white;

  &:hover {
    transform: translateY(-1px);
    background: ${({ $verified, theme }) =>
      $verified ? "#218838" : `${theme.colors.primary}dd`};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray300};
    border-color: ${({ theme }) => theme.colors.gray300};
    color: white;
    cursor: not-allowed;
    transform: none;
  }
`;

const VerifyStatus = styled.div<{
  status: "success" | "info" | "warning" | "none";
}>`
  font-size: 12px;
  color: ${({ theme, status }) => {
    switch (status) {
      case "success":
        return "#28a745";
      case "info":
        return theme.colors.info;
      case "warning":
        return theme.colors.warning;
      default:
        return theme.colors.text.secondary;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const Timer = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.info};
  font-weight: 600;
`;

const FieldValidationMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.warning};
  margin-top: 6px;
  margin-bottom: 8px;
`;

interface Props {
  showValidationErrors?: boolean;
}

export const Step1BasicInfo: React.FC<Props> = ({
  showValidationErrors = false,
}) => {
  const {
    formData,
    updateFormData,
    sendVerificationCode,
    verifyCode,
    isSendingCode,
    isVerifyingCode,
    isVerificationCodeSent,
    error,
    existingUserInfo,
  } = useOnboardingStore();

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setTimerActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (existingUserInfo) {
      // 기존 사용자와 통합 완료 후 홈으로 이동
      setTimeout(() => {
        window.location.href = "/";
      }, 1000); // 1초 후 이동 (통합 처리 완료 대기)
    }
  }, [existingUserInfo]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    updateFormData({ phoneNumber: numericValue, phoneVerified: false });
  };

  const handleSendCode = async () => {
    if (!formData.phoneNumber) return;
    try {
      await sendVerificationCode(formData.phoneNumber);
      setTimeLeft(300); // 5분 = 300초
      setTimerActive(true);
      // 재전송 시 에러 상태 초기화하여 info 메시지가 다시 나오도록
      updateFormData({ verificationCode: "" });
    } catch (error) {
      console.error("Failed to send code:", error);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) return;
    try {
      await verifyCode(formData.phoneNumber, formData.verificationCode);
      setTimerActive(false);
      setTimeLeft(0);

      // 기존 사용자가 있으면 useEffect에서 자동으로 홈으로 이동됨
    } catch (error) {
      console.error("Failed to verify code:", error);
      // 인증 실패 시 타이머 정지
      setTimerActive(false);
      setTimeLeft(0);
    }
  };

  const handleBirthYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ birthYear: e.target.value });
  };

  const handleGenderSelect = (gender: "male" | "female") => {
    updateFormData({ gender });
  };

  const getVerificationStatus = (): {
    status: "success" | "info" | "warning" | "none";
    message: string;
  } => {
    if (existingUserInfo) {
      return { status: "success", message: "기존 계정으로 로그인됩니다" };
    }
    if (formData.phoneVerified) {
      return { status: "success", message: "전화번호 인증이 완료되었습니다" };
    }
    if (error) {
      // 모든 에러를 warning 상태로 표시
      return { status: "warning", message: error };
    }
    if (isVerificationCodeSent) {
      return { status: "info", message: "인증번호를 입력해주세요." };
    }
    return { status: "none", message: "" };
  };

  const getBirthYearValidation = () => {
    if (showValidationErrors && !formData.birthYear) {
      return "출생연도를 선택해주세요";
    }
    return null;
  };

  const getGenderValidation = () => {
    if (showValidationErrors && !formData.gender) {
      return "성별을 선택해주세요";
    }
    return null;
  };

  const getPhoneValidation = () => {
    if (showValidationErrors && !formData.phoneVerified) {
      return "휴대폰 인증을 완료해주세요";
    }
    return null;
  };

  const verificationStatus = getVerificationStatus();

  // 출생연도 옵션 생성
  const currentYear = new Date().getFullYear();
  const birthYearOptions = [];
  for (let year = currentYear - 14; year >= 1950; year--) {
    birthYearOptions.push(year);
  }

  return (
    <Container>
      <Title>기본 정보를 입력해주세요</Title>
      <Subtitle>서비스 이용을 위해 필요한 정보예요</Subtitle>

      <FormGroup>
        <Label htmlFor="birthYear">출생연도 *</Label>
        <Select
          id="birthYear"
          value={formData.birthYear}
          onChange={handleBirthYearChange}
        >
          <option value="">출생연도를 선택해주세요</option>
          {birthYearOptions.map((year) => (
            <option key={year} value={year.toString()}>
              {year}년
            </option>
          ))}
        </Select>
        {getBirthYearValidation() && (
          <FieldValidationMessage>
            {getBirthYearValidation()}
          </FieldValidationMessage>
        )}
      </FormGroup>

      <FormGroup>
        <Label>성별 *</Label>
        <GenderButtonGroup>
          <GenderButton
            type="button"
            $selected={formData.gender === "male"}
            onClick={() => handleGenderSelect("male")}
          >
            남성
          </GenderButton>
          <GenderButton
            type="button"
            $selected={formData.gender === "female"}
            onClick={() => handleGenderSelect("female")}
          >
            여성
          </GenderButton>
        </GenderButtonGroup>
        {getGenderValidation() && (
          <FieldValidationMessage>
            {getGenderValidation()}
          </FieldValidationMessage>
        )}
      </FormGroup>

      <FormGroup>
        <Label>휴대번호 *</Label>
        <PhoneInputBox>
          <PhoneInputGroup>
            <Input
              type="tel"
              placeholder="01012345678"
              value={formData.phoneNumber}
              onChange={handlePhoneNumberChange}
              disabled={formData.phoneVerified}
            />
            <VerifyButton
              type="button"
              $variant={
                isVerificationCodeSent && !formData.phoneVerified
                  ? "secondary"
                  : "primary"
              }
              $verified={formData.phoneVerified}
              onClick={handleSendCode}
              disabled={
                !formData.phoneNumber || isSendingCode || formData.phoneVerified
              }
            >
              {formData.phoneVerified
                ? "인증 완료"
                : isVerificationCodeSent
                ? "재전송"
                : isSendingCode
                ? "전송 중.."
                : "인증코드 전송"}
            </VerifyButton>
          </PhoneInputGroup>

          {isVerificationCodeSent && !formData.phoneVerified && (
            <PhoneInputGroup>
              <Input
                type="text"
                placeholder="인증코드 입력"
                value={formData.verificationCode}
                onChange={(e) =>
                  updateFormData({ verificationCode: e.target.value })
                }
              />
              <VerifyButton
                type="button"
                $variant="secondary"
                $verified={false}
                onClick={handleVerifyCode}
                disabled={!formData.verificationCode || isVerifyingCode}
              >
                {isVerifyingCode ? "확인 중.." : "인증 완료"}
              </VerifyButton>
            </PhoneInputGroup>
          )}

          {verificationStatus.message && (
            <VerifyStatus status={verificationStatus.status}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {verificationStatus.status === "success" && <Check size={12} />}
                {verificationStatus.message}
              </div>
              {timerActive && timeLeft > 0 && (
                <Timer>{formatTime(timeLeft)}</Timer>
              )}
            </VerifyStatus>
          )}
        </PhoneInputBox>
        {getPhoneValidation() && (
          <FieldValidationMessage>
            {getPhoneValidation()}
          </FieldValidationMessage>
        )}
      </FormGroup>
    </Container>
  );
};
