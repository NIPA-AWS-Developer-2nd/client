import { lightColors, darkColors } from './colors';
import { fonts, fontSize, fontWeight, lineHeight } from './typography';
import { breakpoints } from './breakpoints';
import { spacing, borderRadius, shadows, darkShadows, transitions } from './spacing';

// Light Theme
export const lightTheme = {
  colors: lightColors,
  fonts,
  fontSize,
  fontWeight,
  lineHeight,
  breakpoints,
  spacing,
  borderRadius,
  shadows,
  transitions,
} as const;

// Dark Theme
export const darkTheme = {
  colors: darkColors,
  fonts,
  fontSize,
  fontWeight,
  lineHeight,
  breakpoints,
  spacing,
  borderRadius,
  shadows: darkShadows,
  transitions,
} as const;

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
export * from './colors';
export * from './typography';
export * from './breakpoints';
export * from './spacing';