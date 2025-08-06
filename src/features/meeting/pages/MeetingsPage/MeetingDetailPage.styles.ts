import styled from "styled-components";

// 공통 요소들만 포함
export const ContentSection = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
  max-width: 800px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
`;

export const Description = styled.p<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0 0 24px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
`;