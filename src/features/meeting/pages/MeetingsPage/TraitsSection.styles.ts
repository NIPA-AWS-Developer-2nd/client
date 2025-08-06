import styled from "styled-components";

export const TraitsSection = styled.section<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const TraitsList = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
`;

export const TraitItem = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? "6px" : "8px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 500;
`;

export const TraitIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
`;

export const TraitLabel = styled.span<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.text.secondary};
`;