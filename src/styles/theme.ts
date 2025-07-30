export const theme = {
  colors: {
    // Primary - 노션 스타일 블랙&화이트
    primary: "#000000",
    secondary: "#6B7280",
    accent: "#3B82F6",

    // Status colors - 미니멀하게
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",

    // Grayscale - 노션 스타일
    white: "#FFFFFF",
    gray50: "#F9FAFB",
    gray100: "#F3F4F6",
    gray200: "#E5E7EB",
    gray300: "#D1D5DB",
    gray400: "#9CA3AF",
    gray500: "#6B7280",
    gray600: "#4B5563",
    gray700: "#374151",
    gray800: "#1F2937",
    gray900: "#111827",
    black: "#000000",

    // Background
    background: "#FFFFFF",
    surface: "#FFFFFF",
    card: "#FFFFFF",

    // Border
    border: "#E5E7EB",
    divider: "#F3F4F6",

    // Text
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
      inverse: "#FFFFFF",
    },

    // Legacy support
    light: "#F9FAFB",
    dark: "#111827",
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

export type Theme = typeof theme;
