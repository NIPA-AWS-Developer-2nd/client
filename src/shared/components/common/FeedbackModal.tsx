import React, { useState } from "react";
import styled from "styled-components";
import { X, Send, MessageSquare, Bug } from "lucide-react";

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
  max-width: ${({ $isMobile }) => ($isMobile ? "90vw" : "600px")};
  max-height: ${({ $isMobile }) => ($isMobile ? "85vh" : "80vh")};
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
  overflow-y: auto;
  max-height: ${({ $isMobile }) => ($isMobile ? "70vh" : "65vh")};

  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray400};
  }
`;

const TabButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.gray800 : theme.colors.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.gray800 : theme.colors.gray50};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.white : theme.colors.text.primary};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const InfoSection = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const SectionTitle = styled.h3<{ $isMobile?: boolean }>`
  margin: 0 0 12px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: none;

  li {
    position: relative;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text.secondary};

    &:before {
      content: "•";
      position: absolute;
      left: -16px;
      color: ${({ theme }) => theme.colors.gray600};
      font-weight: bold;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const FeedbackForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "10px 12px" : "12px 16px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const TextArea = styled.textarea<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "10px 12px" : "12px 16px")};
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
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const Select = styled.select<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "10px 12px" : "12px 16px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
  }
`;

const SubmitButton = styled.button<{ $isMobile?: boolean; $loading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 16px" : "14px 20px")};
  background: ${({ theme }) => theme.colors.gray800};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 500;
  cursor: ${({ $loading }) => ($loading ? "not-allowed" : "pointer")};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray900};
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
  padding: 16px;
  background: ${({ theme }) => theme.colors.success};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  font-weight: 500;
`;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  isMobile = false,
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "feedback">("info");
  const [feedbackType, setFeedbackType] = useState("general");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
      setActiveTab("info");
      setFeedbackType("general");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // 실제 서버 전송 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

  };

  const renderInfoContent = () => (
    <InfoSection>
      <SectionTitle $isMobile={isMobile}>📊 수집하는 정보</SectionTitle>
      <InfoList>
        <li>앱 사용 통계 (익명화된 데이터)</li>
        <li>오류 및 크래시 리포트</li>
        <li>성능 개선을 위한 사용 패턴</li>
        <li>기기 정보 (모델, OS 버전 등)</li>
      </InfoList>

      <SectionTitle $isMobile={isMobile} style={{ marginTop: "20px" }}>
        🔒 개인정보 보호
      </SectionTitle>
      <InfoList>
        <li>개인 식별 정보는 절대 수집하지 않습니다</li>
        <li>모든 데이터는 암호화되어 전송됩니다</li>
        <li>수집된 데이터는 서비스 개선 목적으로만 사용</li>
        <li>언제든지 설정에서 데이터 수집을 비활성화 가능</li>
      </InfoList>
    </InfoSection>
  );

  const renderFeedbackContent = () => {
    if (isSubmitted) {
      return (
        <SuccessMessage>
          피드백이 성공적으로 전송되었습니다!
          <br />
          소중한 의견 감사합니다.
        </SuccessMessage>
      );
    }

    return (
      <FeedbackForm>
        <FormGroup>
          <Label $isMobile={isMobile}>피드백 유형</Label>
          <Select
            $isMobile={isMobile}
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
          >
            <option value="general">일반 피드백</option>
            <option value="bug">버그 신고</option>
            <option value="feature">기능 제안</option>
            <option value="improvement">개선 사항</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label $isMobile={isMobile}>이메일 (선택사항)</Label>
          <Input
            $isMobile={isMobile}
            type="email"
            placeholder="답변을 받고 싶으시면 이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label $isMobile={isMobile}>메시지 *</Label>
          <TextArea
            $isMobile={isMobile}
            placeholder="자세한 내용을 알려주세요. 발생 상황을 구체적으로 설명해주시면 도움이 됩니다."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </FormGroup>

        <SubmitButton
          $isMobile={isMobile}
          $loading={isSubmitting}
          onClick={handleSubmit}
          disabled={!message.trim() || isSubmitting}
        >
          {isSubmitting ? (
            "전송 중..."
          ) : (
            <>
              <Send size={16} />
              피드백 보내기
            </>
          )}
        </SubmitButton>
      </FeedbackForm>
    );
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer $isMobile={isMobile}>
        <ModalHeader $isMobile={isMobile}>
          <ModalTitle $isMobile={isMobile}>정보수집 및 피드백</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </ModalHeader>
        <ModalContent $isMobile={isMobile}>
          <TabButtons>
            <TabButton
              $active={activeTab === "info"}
              onClick={() => setActiveTab("info")}
            >
              <Bug size={16} />
              정보수집 정책
            </TabButton>
            <TabButton
              $active={activeTab === "feedback"}
              onClick={() => setActiveTab("feedback")}
            >
              <MessageSquare size={16} />
              피드백 보내기
            </TabButton>
          </TabButtons>

          {activeTab === "info" ? renderInfoContent() : renderFeedbackContent()}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};
