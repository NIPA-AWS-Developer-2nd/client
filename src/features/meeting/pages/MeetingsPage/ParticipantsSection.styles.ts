import styled from "styled-components";

export const ParticipantsSection = styled.section<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ParticipantItem = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
`;

export const ParticipantAvatar = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "28px" : "32px")};
  height: ${({ $isMobile }) => ($isMobile ? "28px" : "32px")};
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  position: relative;
`;

export const ParticipantName = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const HostLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: normal;
`;

export const CrownIcon = styled.div<{ $isMobile?: boolean }>`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${({ theme }) => theme.colors.warning};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  width: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  height: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.colors.white};
`;