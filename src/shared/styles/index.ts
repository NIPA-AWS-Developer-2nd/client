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
    
    /* iOS Safari 뷰포트 높이 문제 해결 */
    --vh: 1vh;
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
    height: calc(var(--vh, 1vh) * 100); /* iOS Safari 대응 */
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    
    /* iOS Safari 스크롤 문제 방지 */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  #root {
    width: 100%;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100); /* iOS Safari 대응 */
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  @supports (padding: max(0px)) {
    body {
      padding-left: max(0px, env(safe-area-inset-left));
      padding-right: max(0px, env(safe-area-inset-right));
    }
  }

  html, body, #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.white};
  }

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

  a {
    color: inherit;
    text-decoration: none;
  }

  input, textarea, select {
    font: inherit;
    border: none;
    outline: none;
    background: none;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  p, span, div, h1, h2, h3, h4, h5, h6 {
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  /* iOS Safari 터치 스크롤 최적화 */
  @media (max-width: 1024px) {
    body {
      -webkit-overflow-scrolling: auto;
      overflow-scrolling: auto;
    }
  }
`;

export { theme } from "./theme";
export type { Theme } from "./theme";
