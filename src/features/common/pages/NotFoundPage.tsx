import React from "react";
import styled from "styled-components";
import { ResponsiveLayout } from "../../../shared/layout/ResponsiveLayout";
import { deviceDetection } from "../../../shared/utils/deviceDetection";

const NotFoundContainer = styled.div<{ $isMobile?: boolean }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`;

const ErrorCode = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "56px" : "84px")};
  font-weight: 900;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primary}80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 24px 0;
  line-height: 1;
  letter-spacing: -0.02em;
`;

const ErrorDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  margin: 0;
  max-width: 400px;
`;

export const NotFoundPage: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveLayout
      title="Not Found"
      customHeaderTitle="Not Found"
      hideHeaderActions={true}
      hideBottomNav={true}
      noPadding={true}
      noScroll={true}
    >
      <NotFoundContainer $isMobile={isMobile}>
        <ErrorCode $isMobile={isMobile}>404</ErrorCode>
        
        <ErrorDescription $isMobile={isMobile}>
          페이지가 존재하지 않습니다
        </ErrorDescription>
      </NotFoundContainer>
    </ResponsiveLayout>
  );
};