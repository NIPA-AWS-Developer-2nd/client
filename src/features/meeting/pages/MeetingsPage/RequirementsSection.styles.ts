import styled from "styled-components";

export const RequirementsSection = styled.section<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RequirementItem = styled.li<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
`;

export const ActionSection = styled.section<{ $isMobile?: boolean }>`
  padding-top: 20px;
`;