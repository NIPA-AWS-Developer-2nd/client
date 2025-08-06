// Light Theme
export const lightTheme = {
  colors: {
    // Primary
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#60A5FA",

    // Status colors
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    info: "#06B6D4",

    // Grayscale
    white: "#FFFFFF",
    gray50: "#F8FAFC",
    gray100: "#F1F5F9",
    gray200: "#E2E8F0",
    gray300: "#CBD5E1",
    gray400: "#94A3B8",
    gray500: "#64748B",
    gray600: "#475569",
    gray700: "#334155",
    gray800: "#1E293B",
    gray900: "#0F172A",
    black: "#000000",

    // Background
    background: "#FFFFFF",
    surface: "#F8FAFC",
    card: "#FFFFFF",

    // Border
    border: "#E2E8F0",
    divider: "#F1F5F9",

    // Text
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
      disabled: "#94A3B8",
      inverse: "#FFFFFF",
    },

    // Legacy support
    light: "#F8FAFC",
    dark: "#1E293B",
  },
  fonts: {
    primary: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
    mono: `ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`,
  },
  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1200px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    xxxl: "64px",
  },
  borderRadius: {
    none: "0",
    sm: "2px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    xxl: "16px",
    full: "50%",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  transitions: {
    fast: "150ms ease-in-out",
    normal: "200ms ease-in-out",
    slow: "300ms ease-in-out",
  },
};

// Dark Theme
export const darkTheme = {
  colors: {
    // Primary
    primary: "#34D399",
    secondary: "#9CA3AF",
    accent: "#059669",

    // Status colors
    success: "#34D399",
    danger: "#F87171",
    warning: "#FBBF24",
    info: "#34D399",

    // Grayscale
    white: "#1F2937",
    gray50: "#1F2937",
    gray100: "#374151",
    gray200: "#4B5563",
    gray300: "#6B7280",
    gray400: "#9CA3AF",
    gray500: "#D1D5DB",
    gray600: "#E5E7EB",
    gray700: "#F3F4F6",
    gray800: "#F9FAFB",
    gray900: "#FFFFFF",
    black: "#FFFFFF",

    // Background
    background: "#111827",
    surface: "#1F2937",
    card: "#1F2937",

    // Border
    border: "#374151",
    divider: "#374151",

    // Text
    text: {
      primary: "#F9FAFB",
      secondary: "#D1D5DB",
      disabled: "#6B7280",
      inverse: "#111827",
    },

    // Legacy support
    light: "#1F2937",
    dark: "#F9FAFB",
  },
  fonts: {
    primary: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
    mono: `ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`,
  },
  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1200px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    xxxl: "64px",
  },
  borderRadius: {
    none: "0",
    sm: "2px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    xxl: "16px",
    full: "50%",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
  },
  transitions: {
    fast: "150ms ease-in-out",
    normal: "200ms ease-in-out",
    slow: "300ms ease-in-out",
  },
};

// 테마 타입
export type Theme = typeof lightTheme;

// 테마 모드 타입
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
export const getActiveTheme = (mode: ThemeMode): Theme => {
  if (mode === "system") {
    return getSystemTheme() === "dark" ? darkTheme : lightTheme;
  }
  return mode === "dark" ? darkTheme : lightTheme;
};
