import React from "react";
import styled from "styled-components";
import { Skeleton, SkeletonText } from "../../../../../shared/components/ui/Skeleton";

const SkeletonContainer = styled.div`
  width: 100%;
`;

const SkeletonHeader = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SkeletonHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const SkeletonBadges = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const SkeletonContent = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  background: ${({ theme }) => theme.colors.white};
`;

const SkeletonSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkeletonInfoGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => 
    $isMobile ? "1fr" : "repeat(2, 1fr)"};
  gap: 16px;
  margin-top: 16px;
`;

const SkeletonInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SkeletonActions = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "16px 20px" : "20px 24px")};
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 12px;
  ${({ $isMobile }) =>
    $isMobile &&
    `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  `}
`;

interface MissionDetailSkeletonProps {
  isMobile?: boolean;
}

export const MissionDetailSkeleton: React.FC<MissionDetailSkeletonProps> = ({
  isMobile = false,
}) => {
  return (
    <SkeletonContainer>
      {/* Header Skeleton */}
      <SkeletonHeader $isMobile={isMobile}>
        <SkeletonHeaderTop>
          <div style={{ flex: 1 }}>
            <SkeletonBadges>
              <Skeleton width="60px" height="24px" borderRadius="12px" />
              <Skeleton width="80px" height="24px" borderRadius="12px" />
              <Skeleton width="70px" height="24px" borderRadius="12px" />
            </SkeletonBadges>
            <Skeleton 
              width="70%" 
              height={isMobile ? "28px" : "32px"} 
              marginBottom="12px" 
            />
            <SkeletonText lines={2} />
          </div>
          <Skeleton width="40px" height="40px" borderRadius="50%" />
        </SkeletonHeaderTop>
      </SkeletonHeader>

      {/* Content Skeleton */}
      <SkeletonContent $isMobile={isMobile}>
        {/* Mission Info Section */}
        <SkeletonSection>
          <Skeleton width="120px" height="20px" marginBottom="16px" />
          <SkeletonInfoGrid $isMobile={isMobile}>
            <SkeletonInfoItem>
              <Skeleton width="40px" height="40px" borderRadius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="14px" marginBottom="4px" />
                <Skeleton width="40%" height="12px" />
              </div>
            </SkeletonInfoItem>
            <SkeletonInfoItem>
              <Skeleton width="40px" height="40px" borderRadius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="14px" marginBottom="4px" />
                <Skeleton width="40%" height="12px" />
              </div>
            </SkeletonInfoItem>
            <SkeletonInfoItem>
              <Skeleton width="40px" height="40px" borderRadius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="14px" marginBottom="4px" />
                <Skeleton width="40%" height="12px" />
              </div>
            </SkeletonInfoItem>
            <SkeletonInfoItem>
              <Skeleton width="40px" height="40px" borderRadius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="14px" marginBottom="4px" />
                <Skeleton width="40%" height="12px" />
              </div>
            </SkeletonInfoItem>
          </SkeletonInfoGrid>
        </SkeletonSection>

        {/* Description Section */}
        <SkeletonSection>
          <Skeleton width="120px" height="20px" marginBottom="16px" />
          <SkeletonText lines={4} />
        </SkeletonSection>

        {/* Requirements Section */}
        <SkeletonSection>
          <Skeleton width="120px" height="20px" marginBottom="16px" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Skeleton width="20px" height="20px" borderRadius="50%" />
              <Skeleton width="200px" height="14px" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Skeleton width="20px" height="20px" borderRadius="50%" />
              <Skeleton width="180px" height="14px" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Skeleton width="20px" height="20px" borderRadius="50%" />
              <Skeleton width="220px" height="14px" />
            </div>
          </div>
        </SkeletonSection>
      </SkeletonContent>

      {/* Actions Skeleton */}
      <SkeletonActions $isMobile={isMobile}>
        <Skeleton width="100%" height="48px" borderRadius="8px" />
        <Skeleton width="48px" height="48px" borderRadius="8px" />
      </SkeletonActions>

      {/* Add padding for fixed bottom bar on mobile */}
      {isMobile && <div style={{ height: "80px" }} />}
    </SkeletonContainer>
  );
};