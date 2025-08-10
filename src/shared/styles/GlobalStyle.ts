import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden; /* 모든 방향 스크롤 차단 */
  }

  body {
    font-family: ${({ theme }) => theme.fonts.primary};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.5;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    overflow: hidden; /* 모든 방향 스크롤 차단 */
    
    /* 최소 높이 보장 */
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);
  }

  #root {
    width: 100%;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);
    overflow: hidden; /* 모든 방향 스크롤 차단 */
  }

  /* 모바일 safe area */
  @supports (padding: max(0px)) {
    body {
      padding-left: max(0px, env(safe-area-inset-left));
      padding-right: max(0px, env(safe-area-inset-right));
    }
  }

  /* 모든 여백 제거 */
  html, body, #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* 스크롤바 숨김 */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  /* 텍스트 선택 스타일 */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: #000000 !important;
  }
  
  ::-moz-selection {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: #000000 !important;
  }

  /* 버튼 기본 스타일 제거 */
  button {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    outline: none;
  }

  /* 링크 기본 스타일 */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* 입력 필드 기본 스타일 */
  input, textarea, select {
    font: inherit;
    border: none;
    outline: none;
    background: none;
  }

  /* 리스트 기본 스타일 제거 */
  ul, ol {
    list-style: none;
  }

  /* 이미지 반응형 */
  img {
    max-width: 100%;
    height: auto;
  }

  /* 포커스 아웃라인 설정 */
  button:focus,
  a:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    box-shadow: none;
  }

  /* 키보드 접근용 포커스 테두리 유지 */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    box-shadow: none;
  }

  /* 모바일 탭 하이라이트 제거 */
  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* 모바일 hover 효과 비활성화 */
  @media (hover: none) and (pointer: coarse) {
    *:hover:not(:active) {
      background: inherit !important;
      background-color: inherit !important;
      border-color: inherit !important;
      box-shadow: inherit !important;
      color: inherit !important;
      transform: none !important;
      opacity: inherit !important;
      filter: inherit !important;
    }
  }

  /* 모바일 터치 피드백 */
  @media (hover: none) and (pointer: coarse) {
    *:active {
      background-color: ${({ theme }) =>
        theme.colors.background === "#2D3748"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)"} !important;
      transform: scale(0.98) !important;
      transition: all 0.1s ease !important;
    }
  }

  /* 텍스트 선택 가능 */
  p, span, div, h1, h2, h3, h4, h5, h6 {
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }
`;
