import React from "react";
import styled from "styled-components";
import {
  Skeleton,
  SkeletonText,
} from "../../../../../shared/components/ui/Skeleton";

const SkeletonContainer = styled.div`
  width: 100%;
`;

// 헤더 섹션
const SkeletonHeaderSection = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  width: 100%;
  height: ${({ $isMobile }) => ($isMobile ? "300px" : "400px")};
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.gray100} 0%,
    ${({ theme }) => theme.colors.gray200} 100%
  );
`;

const SkeletonHeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.05) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
`;

const SkeletonHeaderContent = styled.div<{ $isMobile?: boolean }>`
  position: absolute;
  bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "30px")};
  left: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  right: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  z-index: 2;
`;

const SkeletonBadges = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const SkeletonMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-left: 8px;
`;

// 콘텐츠 섹션
const SkeletonContentSection = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "24px 20px")};
`;

// 미션 소개 섹션
const SkeletonSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

// 미션 요약 정보 섹션
const SkeletonInfoSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 20px" : "24px 28px")};
  margin-bottom: 32px;
`;

const SkeletonInfoGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  padding: 0 12px;
`;

const SkeletonInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  position: relative;
`;

// 갤러리 섹션
const SkeletonGalleryContainer = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  padding: ${({ $isMobile }) => ($isMobile ? "0 50px" : "0 70px")};
  margin-bottom: 16px;
`;

const SkeletonGuideImages = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "20px")};
`;

const SkeletonGuideImageContainer = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) =>
    $isMobile ? "calc(100% - 8px)" : "calc(50% - 8px)"};
  min-width: ${({ $isMobile }) =>
    $isMobile ? "calc(100% - 8px)" : "calc(50% - 8px)"};
  height: ${({ $isMobile }) => ($isMobile ? "220px" : "200px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex-shrink: 0;
  overflow: hidden;
`;

// 주의사항 섹션
const SkeletonWarningSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.warning}10;
  border: 1px solid ${({ theme }) => theme.colors.warning}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: 32px;
`;

// 액션 섹션
const SkeletonActionSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "24px 20px" : "32px 24px")};
  text-align: center;
  margin: 0 ${({ $isMobile }) => ($isMobile ? "16px" : "20px")} 32px;
`;

const SkeletonActionButtons = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  ${({ $isMobile }) =>
    $isMobile &&
    `
    flex-direction: column;
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
      {/* 헤더 스켈레톤 */}
      <SkeletonHeaderSection $isMobile={isMobile}>
        <SkeletonHeaderOverlay />
        <SkeletonHeaderContent $isMobile={isMobile}>
          {/* 배지 */}
          <SkeletonBadges>
            <Skeleton width="60px" height="24px" borderRadius="12px" />
            <Skeleton width="80px" height="24px" borderRadius="12px" />
          </SkeletonBadges>

          {/* 타이틀 */}
          <Skeleton
            width="70%"
            height={isMobile ? "24px" : "32px"}
            marginBottom="20px"
          />

          {/* 메타 정보 */}
          <SkeletonMeta>
            <Skeleton width="70px" height="20px" borderRadius="4px" />
            <Skeleton width="80px" height="20px" borderRadius="4px" />
            <Skeleton width="90px" height="20px" borderRadius="4px" />
          </SkeletonMeta>
        </SkeletonHeaderContent>
      </SkeletonHeaderSection>

      {/* 콘텐츠 섹션 */}
      <SkeletonContentSection $isMobile={isMobile}>
        {/* 미션 소개 */}
        <SkeletonSection>
          <Skeleton
            width="120px"
            height={isMobile ? "18px" : "20px"}
            marginBottom="16px"
          />
          <SkeletonText lines={3} />
        </SkeletonSection>

        {/* 인증 가이드 */}
        <SkeletonSection>
          <Skeleton
            width="120px"
            height={isMobile ? "18px" : "20px"}
            marginBottom="16px"
          />
          <div style={{ marginBottom: "24px" }}>
            <SkeletonText lines={2} />
          </div>

          {/* 갤러리 이미지 */}
          <SkeletonGalleryContainer $isMobile={isMobile}>
            <SkeletonGuideImages $isMobile={isMobile}>
              <SkeletonGuideImageContainer $isMobile={isMobile}>
                <Skeleton width="100%" height="100%" borderRadius="8px" />
              </SkeletonGuideImageContainer>
              {!isMobile && (
                <SkeletonGuideImageContainer $isMobile={isMobile}>
                  <Skeleton width="100%" height="100%" borderRadius="8px" />
                </SkeletonGuideImageContainer>
              )}
            </SkeletonGuideImages>
          </SkeletonGalleryContainer>
        </SkeletonSection>

        {/* 미션 요약 정보 */}
        <SkeletonInfoSection $isMobile={isMobile}>
          <Skeleton
            width="100px"
            height={isMobile ? "16px" : "18px"}
            marginBottom="20px"
          />
          <SkeletonInfoGrid $isMobile={isMobile}>
            {[1, 2, 3, 4, 5].map((index) => (
              <SkeletonInfoRow key={index}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Skeleton width="16px" height="16px" borderRadius="4px" />
                  <Skeleton width="80px" height="14px" />
                </div>
                <Skeleton width="60px" height="14px" />
              </SkeletonInfoRow>
            ))}
          </SkeletonInfoGrid>
        </SkeletonInfoSection>

        {/* 주의사항 */}
        <SkeletonWarningSection $isMobile={isMobile}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Skeleton width="18px" height="18px" borderRadius="4px" />
            <Skeleton width="80px" height={isMobile ? "14px" : "16px"} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              paddingLeft: "20px",
            }}
          >
            <Skeleton width="90%" height={isMobile ? "13px" : "14px"} />
            <Skeleton width="85%" height={isMobile ? "13px" : "14px"} />
            <Skeleton width="75%" height={isMobile ? "13px" : "14px"} />
          </div>
        </SkeletonWarningSection>

        {/* 액션 섹션 */}
        <SkeletonActionSection $isMobile={isMobile}>
          {/* 가이드 이미지 */}
          <div
            style={{
              margin: "0 auto 20px",
              width: isMobile ? "200px" : "250px",
            }}
          >
            <Skeleton
              width="100%"
              height={isMobile ? "150px" : "180px"}
              borderRadius="8px"
            />
          </div>

          {/* 타이틀 */}
          <div style={{ margin: "0 auto 8px", width: "220px" }}>
            <Skeleton width="100%" height={isMobile ? "18px" : "20px"} />
          </div>

          {/* 설명 */}
          <div style={{ margin: "0 auto 24px", width: "80%" }}>
            <Skeleton width="100%" height={isMobile ? "14px" : "16px"} />
          </div>

          {/* 버튼들 */}
          <SkeletonActionButtons $isMobile={isMobile}>
            <Skeleton width="100%" height="44px" borderRadius="8px" />
            <Skeleton width="100%" height="44px" borderRadius="8px" />
          </SkeletonActionButtons>
        </SkeletonActionSection>
      </SkeletonContentSection>
    </SkeletonContainer>
  );
};
