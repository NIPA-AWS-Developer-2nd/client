import React, { useState } from "react";
import styled from "styled-components";
import { X, CheckCircle } from "lucide-react";

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContainer = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: ${({ $isMobile }) => ($isMobile ? "90vw" : "500px")};
  overflow: hidden;
  position: relative;
`;

const ModalHeader = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 20px" : "20px 24px")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.gray50};
`;

const ModalTitle = styled.h2<{ $isMobile?: boolean }>`
  margin: 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
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

  &:active {
    transform: scale(0.95);
  }
`;

const ModalContent = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Select = styled.select<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gray600};
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
  }
`;

const TextArea = styled.textarea<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.white};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gray600};
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{
  $variant?: "primary" | "secondary";
  $isMobile?: boolean;
  $loading?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ $isMobile }) => ($isMobile ? "10px 16px" : "12px 20px")};
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === "primary" ? theme.colors.gray800 : theme.colors.border};
  background: ${({ $variant, theme }) =>
    $variant === "primary" ? theme.colors.gray800 : theme.colors.white};
  color: ${({ $variant, theme }) =>
    $variant === "primary" ? theme.colors.white : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 500;
  cursor: ${({ $loading }) => ($loading ? "not-allowed" : "pointer")};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ $variant, theme }) =>
      $variant === "primary" ? theme.colors.gray900 : theme.colors.gray50};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SuccessMessage = styled.div`
  padding: 20px;
  text-align: center;
`;

const SuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.success};
`;

const SuccessText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

const SuccessSubText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface SimpleFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export const SimpleFeedbackModal: React.FC<SimpleFeedbackModalProps> = ({
  isOpen,
  onClose,
  isMobile = false,
}) => {
  const [category, setCategory] = useState("general");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 모달 외부 클릭시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 키로 닫기
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // 모달이 닫힐 때 상태 초기화
  React.useEffect(() => {
    if (!isOpen) {
      setCategory("general");
      setContent("");
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    // 실제 서버 전송 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleCancel = () => {
    onClose();
  };

  if (isSubmitted) {
    return (
      <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
        <ModalContainer $isMobile={isMobile}>
          <ModalHeader $isMobile={isMobile}>
            <ModalTitle $isMobile={isMobile}>피드백 전송 완료</ModalTitle>
            <CloseButton onClick={onClose}>
              <X size={18} />
            </CloseButton>
          </ModalHeader>
          <ModalContent $isMobile={isMobile}>
            <SuccessMessage>
              <SuccessIcon>
                <CheckCircle size={48} />
              </SuccessIcon>
              <SuccessText $isMobile={isMobile}>
                소중한 피드백 감사합니다!
              </SuccessText>
              <SuccessSubText $isMobile={isMobile}>
                더 나은 서비스를 위해 검토하겠습니다.
              </SuccessSubText>
            </SuccessMessage>
          </ModalContent>
        </ModalContainer>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer $isMobile={isMobile}>
        <ModalHeader $isMobile={isMobile}>
          <ModalTitle $isMobile={isMobile}>피드백 보내기</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </ModalHeader>
        <ModalContent $isMobile={isMobile}>
          <FeedbackForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label $isMobile={isMobile}>카테고리</Label>
              <Select
                $isMobile={isMobile}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="general">일반 피드백</option>
                <option value="bug">버그 신고</option>
                <option value="feature">기능 제안</option>
                <option value="improvement">개선 사항</option>
                <option value="ui">UI/UX 개선</option>
                <option value="other">기타</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label $isMobile={isMobile}>내용 *</Label>
              <TextArea
                $isMobile={isMobile}
                placeholder="자세한 내용을 알려주세요. 발생 상황을 구체적으로 설명해주시면 도움이 됩니다."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </FormGroup>

            <ButtonGroup>
              <Button
                type="button"
                $variant="secondary"
                $isMobile={isMobile}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                $variant="primary"
                $isMobile={isMobile}
                $loading={isSubmitting}
                disabled={!content.trim() || isSubmitting}
              >
                {isSubmitting ? "전송 중.." : <>완료</>}
              </Button>
            </ButtonGroup>
          </FeedbackForm>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};
