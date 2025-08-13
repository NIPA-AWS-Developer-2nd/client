import styled, { keyframes, css } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const skeletonGradient = css`
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 1.5s infinite ease-in-out;
`;

export const SkeletonCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const SkeletonThumbnail = styled.div`
  width: 100%;
  height: 200px;
  ${skeletonGradient}
`;

export const SkeletonContent = styled.div`
  padding: 16px;
`;

export const SkeletonHeader = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

export const SkeletonBadge = styled.div<{ $width?: string }>`
  width: ${props => props.$width || '80px'};
  height: 24px;
  border-radius: 12px;
  ${skeletonGradient}
`;

export const SkeletonTitle = styled.div`
  width: 100%;
  height: 24px;
  border-radius: 8px;
  margin-bottom: 8px;
  ${skeletonGradient}
`;

export const SkeletonDescription = styled.div`
  margin-bottom: 16px;
`;

export const SkeletonLine = styled.div<{ $width?: string }>`
  width: ${props => props.$width || '100%'};
  height: 16px;
  border-radius: 8px;
  margin-bottom: 4px;
  ${skeletonGradient}
`;

export const SkeletonInfo = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

export const SkeletonInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const SkeletonIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  ${skeletonGradient}
`;

export const SkeletonText = styled.div<{ 
  $width?: string; 
  $height?: string;
}>`
  width: ${props => props.$width || '100px'};
  height: ${props => props.$height || '16px'};
  border-radius: 8px;
  ${skeletonGradient}
`;

export const SkeletonFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

export const SkeletonAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  ${skeletonGradient}
`;

export const SkeletonHostInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SkeletonButton = styled.div`
  width: 80px;
  height: 32px;
  border-radius: 16px;
  ${skeletonGradient}
`;