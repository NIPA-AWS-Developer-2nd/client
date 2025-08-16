import React from "react";
import styled from "styled-components";
import { Skeleton } from "../../../../shared/components/ui";
import { deviceDetection } from "../../../../shared/utils";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  max-width: 100%;
  margin: 0 auto;
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "0")};
`;

const SkeletonCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "32px 24px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const SkeletonGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)"};
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const SkeletonActionButton = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: ${({ $isMobile }) => ($isMobile ? "16px 12px" : "20px 16px")};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const StatsGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const SkeletonStatItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  }
`;

const SkeletonActivityContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const HomeSkeleton: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PageContainer $isMobile={isMobile}>
      {/* 빠른 실행 섹션 스켈레톤 */}
      <SkeletonCard $isMobile={isMobile}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Skeleton width="18px" height="18px" />
          <Skeleton width="80px" height={isMobile ? "16px" : "18px"} />
        </div>
        <SkeletonGrid $isMobile={isMobile}>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <SkeletonActionButton key={index} $isMobile={isMobile}>
                <Skeleton 
                  width={isMobile ? "20px" : "24px"} 
                  height={isMobile ? "20px" : "24px"} 
                  borderRadius="4px" 
                  marginBottom="8px" 
                />
                <Skeleton 
                  width="60px" 
                  height={isMobile ? "12px" : "14px"} 
                />
              </SkeletonActionButton>
            ))}
        </SkeletonGrid>
      </SkeletonCard>

      {/* 내 활동 현황 섹션 스켈레톤 */}
      <SkeletonCard $isMobile={isMobile}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Skeleton width="18px" height="18px" />
          <Skeleton width="100px" height={isMobile ? "16px" : "18px"} />
        </div>
        <StatsGrid $isMobile={isMobile}>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <SkeletonStatItem key={index}>
                <Skeleton 
                  width={isMobile ? "60px" : "80px"} 
                  height={isMobile ? "20px" : "24px"} 
                  marginBottom="4px" 
                />
                <Skeleton 
                  width={isMobile ? "50px" : "60px"} 
                  height={isMobile ? "12px" : "14px"} 
                />
              </SkeletonStatItem>
            ))}
        </StatsGrid>
      </SkeletonCard>

      {/* 최근 활동 섹션 스켈레톤 */}
      <SkeletonCard $isMobile={isMobile}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Skeleton width="18px" height="18px" />
          <Skeleton width="80px" height={isMobile ? "16px" : "18px"} />
        </div>
        <ActivityList>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <SkeletonActivityItem key={index}>
                <Skeleton 
                  width={isMobile ? "32px" : "36px"} 
                  height={isMobile ? "32px" : "36px"} 
                  borderRadius="50%" 
                />
                <SkeletonActivityContent>
                  <Skeleton 
                    width="240px" 
                    height={isMobile ? "13px" : "14px"} 
                    marginBottom="2px" 
                  />
                  <Skeleton 
                    width="60px" 
                    height={isMobile ? "11px" : "12px"} 
                  />
                </SkeletonActivityContent>
              </SkeletonActivityItem>
            ))}
        </ActivityList>
      </SkeletonCard>
    </PageContainer>
  );
};