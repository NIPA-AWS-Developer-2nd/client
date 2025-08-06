import { css } from 'styled-components';
import { breakpoints } from '../theme/breakpoints';

// Media queries
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  tabletUp: `@media (min-width: calc(${breakpoints.mobile} + 1px))`,
  desktopUp: `@media (min-width: calc(${breakpoints.tablet} + 1px))`,
} as const;

// Responsive mixins
export const responsive = {
  mobile: (styles: ReturnType<typeof css>) => css`
    ${media.mobile} {
      ${styles}
    }
  `,
  tablet: (styles: ReturnType<typeof css>) => css`
    ${media.tablet} {
      ${styles}
    }
  `,
  desktop: (styles: ReturnType<typeof css>) => css`
    ${media.desktop} {
      ${styles}
    }
  `,
  tabletUp: (styles: ReturnType<typeof css>) => css`
    ${media.tabletUp} {
      ${styles}
    }
  `,
  desktopUp: (styles: ReturnType<typeof css>) => css`
    ${media.desktopUp} {
      ${styles}
    }
  `,
} as const;

// Mobile-specific utilities
export const mobileUtils = {
  // 모바일에서 터치 영역 확보
  touchTarget: css`
    min-height: 44px;
    min-width: 44px;
  `,
  
  // 모바일에서 스크롤 개선
  smoothScroll: css`
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  `,
  
  // 모바일에서 선택 방지
  noSelect: css`
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  `,
  
  // 텍스트 선택 허용
  allowSelect: css`
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  `,
};

// Hover only for devices that support it
export const hoverSupported = (styles: ReturnType<typeof css>) => css`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      ${styles}
    }
  }
`;

// Safe area support
export const safeArea = {
  paddingTop: css`
    padding-top: env(safe-area-inset-top, 0);
  `,
  paddingBottom: css`
    padding-bottom: env(safe-area-inset-bottom, 0);
  `,
  paddingLeft: css`
    padding-left: env(safe-area-inset-left, 0);
  `,
  paddingRight: css`
    padding-right: env(safe-area-inset-right, 0);
  `,
  padding: css`
    padding-top: env(safe-area-inset-top, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
  `,
};