import styled from "styled-components";

export const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0;
  padding: 0;
  background: ${({ theme }) => theme.colors.background};
  min-height: ${({ $isMobile }) =>
    $isMobile ? "100vh" : "calc(100vh - 64px)"};
  ${({ $isMobile }) => $isMobile && `
    position: relative;
    overflow-x: hidden;
  `}
`;

export const ContentSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl}
    ${({ theme }) => theme.borderRadius.xl} 0 0;
  margin-top: -20px;
  position: relative;
  z-index: 1;
  padding: ${({ $isMobile }) => ($isMobile ? "24px 16px" : "50px 50px")};
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  ${({ $isMobile }) => $isMobile && `
    margin-left: 0;
    margin-right: 0;
    border-radius: 20px 20px 0 0;
  `}
`;