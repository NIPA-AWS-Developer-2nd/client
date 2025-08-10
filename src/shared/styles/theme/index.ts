import { lightTheme, darkTheme } from '../theme';

// Re-export existing themes
export { lightTheme, darkTheme };

// Theme types
export type Theme = typeof lightTheme;
export type ThemeMode = "system" | "light" | "dark";

// 기본 테마 (하위 호환성)
export const theme = lightTheme;

// 시스템 다크 모드 감지 함수
export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

// 실제 테마 계산 함수
export const getActiveTheme = (mode: ThemeMode) => {
  if (mode === "system") {
    return getSystemTheme() === "dark" ? darkTheme : lightTheme;
  }
  return mode === "dark" ? darkTheme : lightTheme;
};

// Re-exports for convenience
export * from '../theme';
export * from './typography';
export * from './breakpoints';
export * from './spacing';