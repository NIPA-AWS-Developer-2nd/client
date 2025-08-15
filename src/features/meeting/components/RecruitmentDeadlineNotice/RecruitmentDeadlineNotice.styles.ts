import styled, { css } from "styled-components";
import { responsive } from "../../../../shared/styles/mixins";

export const Container = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.gray100};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  margin-bottom: 20px;

  ${responsive.mobile(css`
    padding: 16px;
  `)}
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const IconWrapper = styled.div<{ $urgent: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${({ $urgent, theme }) =>
    $urgent ? theme.colors.orange500 : theme.colors.primary};
`;

export const Title = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "15px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;

  ${responsive.mobile(css`
    font-size: 15px;
  `)}
`;

export const Content = styled.div`
  margin-bottom: 12px;
`;

export const DeadlineText = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
  margin-bottom: 8px;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const TimeRemaining = styled.div<{
  $urgent: boolean;
  $isMobile: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  color: ${({ $urgent, theme }) =>
    $urgent ? theme.colors.orange600 : theme.colors.primary};

  ${responsive.mobile(css`
    font-size: 13px;
  `)}
`;

export const GuideText = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  ${responsive.mobile(css`
    font-size: 12px;
  `)}
`;
