import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $marginBottom?: string;
}>`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "20px"};
  border-radius: ${({ $borderRadius, theme }) =>
    $borderRadius || theme.borderRadius.sm};
  margin-bottom: ${({ $marginBottom }) => $marginBottom || "0"};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gray200} 0%,
    ${({ theme }) => theme.colors.gray100} 50%,
    ${({ theme }) => theme.colors.gray200} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  marginBottom?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  marginBottom,
}) => {
  return (
    <SkeletonBase
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      $marginBottom={marginBottom}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; width?: string }> = ({
  lines = 1,
  width = "100%",
}) => {
  return (
    <>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? "80%" : width}
          height="14px"
          marginBottom={index < lines - 1 ? "8px" : "0"}
        />
      ))}
    </>
  );
};

export const SkeletonImage: React.FC<{
  width?: string;
  height?: string;
  borderRadius?: string;
}> = ({ width = "100%", height = "200px", borderRadius }) => {
  return <Skeleton width={width} height={height} borderRadius={borderRadius} />;
};

export const SkeletonButton: React.FC<{
  width?: string;
  height?: string;
}> = ({ width = "100px", height = "40px" }) => {
  return <Skeleton width={width} height={height} borderRadius="8px" />;
};
