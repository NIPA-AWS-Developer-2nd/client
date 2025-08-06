export const lightColors = {
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
} as const;

export const darkColors = {
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
  white: "#FFFFFF",
  gray50: "#2D3748",
  gray100: "#4A5568",
  gray200: "#5A6274",
  gray300: "#718096",
  gray400: "#A0AEC0",
  gray500: "#CBD5E0",
  gray600: "#E2E8F0",
  gray700: "#EDF2F7",
  gray800: "#F7FAFC",
  gray900: "#FFFFFF",
  black: "#000000",

  // Background
  background: "#2D3748",
  surface: "#384156",
  card: "#384156",

  // Border
  border: "#4A5568",
  divider: "#4A5568",

  // Text
  text: {
    primary: "#F7FAFC",
    secondary: "#CBD5E0",
    disabled: "#718096",
    inverse: "#1A202C",
  },

  // Legacy support
  light: "#2D3748",
  dark: "#F7FAFC",
} as const;

export type Colors = typeof lightColors;
