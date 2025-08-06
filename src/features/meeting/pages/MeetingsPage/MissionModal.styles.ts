import styled from "styled-components";

export const MissionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MissionInfoTitle = styled.h4<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

export const MissionInfoDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  line-height: 1.5;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const RewardHighlight = styled.div<{ $isMobile?: boolean }>`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}15 0%,
    ${({ theme }) => theme.colors.warning}15 100%
  );
  border: 2px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const RewardIcon = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const RewardContent = styled.div`
  flex: 1;
`;

export const RewardTitle = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
`;

export const RewardAmount = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const MissionConditionsSection = styled.div`
  margin: 20px 0;
`;

export const ConditionsTitle = styled.h4<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 600;
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ConditionItem = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const RequiredPhotosSection = styled.div`
  margin: 16px 0;
  padding: 16px;
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const PhotosTitle = styled.h5<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const PhotoRequirement = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

export const RequiredActivitiesSection = styled.div`
  margin: 16px 0;
  padding: 16px;
  background: ${({ theme }) => theme.colors.primary}08;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
`;

export const ActivitiesTitle = styled.h5<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ActivityRequirement = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 0;
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;