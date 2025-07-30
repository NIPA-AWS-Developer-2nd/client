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
    overflow-x: hidden;
    
    /* 모바일에서 완벽한 전체 화면 사용 */
    -webkit-overflow-scrolling: touch;
    
    /* 검정 화면 방지를 위한 최소 높이 보장 */
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
  }

  /* 모바일 safe area 완벽 지원 */
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
    background-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.white};
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

  /* 포커스 아웃라인 (접근성) */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
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

  /* 텍스트는 선택 가능하게 */
  p, span, div, h1, h2, h3, h4, h5, h6 {
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }
`;
