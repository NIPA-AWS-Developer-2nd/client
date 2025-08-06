import styled from "styled-components";

interface LoadingProps {
  isMobile?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  isMobile,
  text = "로딩 중..",
}) => (
  <LoadingContainer>
    <LoadingSpinner />
    <LoadingText $isMobile={isMobile}>{text}</LoadingText>
  </LoadingContainer>
);

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.gray200};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;
