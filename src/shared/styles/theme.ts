export const lightTheme = {
  colors: {
    // Primary
    primary: "#ff8b55",
    primaryLight: "#ffaa7a",
    secondary: "#ff9e6e",
    secondaryLight: "#ffd4b8",
    tertiary: "#FFE6A7",
    accent: "#FFE0B2", // 카드, 뱃지 등 강조

    // Status colors
    success: "#23d17a",
    danger: "#e53935",
    warning: "#e53935",
    info: "#3B82F6",

    // Verification colors (from MyPage VerificationBadge)
    phoneVerified: "#1E40AF", // 번호 인증 - 파란색
    phoneVerifiedBg: "#DBEAFE",
    locationVerified: "#059669", // 지역 인증 - 초록색
    locationVerifiedBg: "#D1FAE5",
    verificationPending: "#6B7280", // 인증 필요 - 회색
    verificationPendingBg: "#F3F4F6",

    // Grayscale
    white: "#FFFFFF",
    gray50: "#FFF7F0", // 배경에 가까운 밝은 톤
    gray100: "#F9F6F2", // 카드/입력창 배경
    gray200: "#F3EEE7", // 카드/입력창 서브
    gray300: "#E5E1DC", // 경계선, 비활성
    gray400: "#CFC9C1",
    gray500: "#A8A29E",
    gray600: "#78716C",
    gray700: "#57534E",
    gray800: "#3B3732",
    gray900: "#1C1917",
    black: "#000000",

    // Background
    background: "#FFF7F0", // 전체 배경
    surface: "#FFFFFF", // 카드, 입력창 등
    card: "#F9F6F2", // 카드 배경
    input: "#FFFFFF", // 입력 필드 배경

    // Border
    border: "#E5E1DC",
    divider: "#F3EEE7",

    // Text
    text: {
      primary: "#1C1917", //진한 컬러
      secondary: "#78716C", // 설명, 서브텍스트
      disabled: "#CFC9C1", // 비활성
      inverse: "#FFFFFF", // 다크배경 위 텍스트
      placeholder: "#A8A29E", // 입력창 플레이스홀더
    },

    // Legacy support
    light: "#FFF7F0",
    dark: "#1C1917",
  },
  fonts: {
    primary: `'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
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
    sm: "6px",
    md: "12px",
    lg: "18px",
    xl: "24px",
    xxl: "32px",
    full: "50%",
  },
  shadows: {
    none: "none",
    sm: "0 2px 8px 0 rgba(255, 122, 0, 0.06)",
    md: "0 4px 16px 0 rgba(255, 122, 0, 0.10)",
    lg: "0 8px 24px 0 rgba(255, 122, 0, 0.12)",
    xl: "0 16px 32px 0 rgba(255, 122, 0, 0.14)",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.4,0,0.2,1)",
    normal: "200ms cubic-bezier(0.4,0,0.2,1)",
    slow: "300ms cubic-bezier(0.4,0,0.2,1)",
  },
};

export const darkTheme = {
  colors: {
    // Primary
    primary: "#ff8b55", // 버튼, 액티브 등
    primaryLight: "#ffaa7a", // primary보다 밝은 톤
    secondary: "#ffb899", // 서브 포인트 (기존보다 진한 톤)
    secondaryLight: "#ffd4b8", // secondary보다 밝은 톤
    tertiary: "#FFD580", // 기존 secondary 색상
    accent: "#FFB86C", // 카드, 뱃지 등 강조

    // Status colors
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    info: "#60A5FA",

    // Verification colors (from MyPage VerificationBadge)
    phoneVerified: "#60A5FA", // 번호 인증 - 파란색 (다크모드)
    phoneVerifiedBg: "#1E3A8A",
    locationVerified: "#34D399", // 지역 인증 - 초록색 (다크모드)
    locationVerifiedBg: "#064E3B",
    verificationPending: "#9CA3AF", // 인증 필요 - 회색 (다크모드)
    verificationPendingBg: "#374151",

    // Grayscale
    white: "#23242A", // 배경에 가까운 어두운 톤
    gray50: "#18191D", // 전체 배경
    gray100: "#23242A", // 카드/입력창 배경
    gray200: "#2C2D33", // 카드/입력창 서브
    gray300: "#35363C", // 경계선, 비활성
    gray400: "#44454B",
    gray500: "#5A5B60",
    gray600: "#7A7B80",
    gray700: "#A0A1A6",
    gray800: "#CFCFD4",
    gray900: "#F9FAFB",
    black: "#000000",

    // Background
    background: "#18191D", // 전체 배경
    surface: "#23242A", // 카드, 입력창 등
    card: "#23242A", // 카드 배경
    input: "#23242A", // 입력 필드 배경

    // Border
    border: "#35363C",
    divider: "#2C2D33",

    // Text
    text: {
      primary: "#F9FAFB", // 진한 컬러
      secondary: "#A0A1A6", // 설명, 서브텍스트
      disabled: "#44454B", // 비활성
      inverse: "#18191D", // 다크배경 위 텍스트
      placeholder: "#5A5B60", // 입력창 플레이스홀더
    },

    // Legacy support
    light: "#23242A",
    dark: "#F9FAFB",
  },
  fonts: {
    primary: `'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
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
    sm: "8px",
    md: "14px",
    lg: "20px",
    xl: "28px",
    xxl: "36px",
    full: "50%",
  },
  shadows: {
    none: "none",
    sm: "0 2px 8px 0 rgba(0,0,0,0.18)",
    md: "0 4px 16px 0 rgba(0,0,0,0.22)",
    lg: "0 8px 24px 0 rgba(0,0,0,0.26)",
    xl: "0 16px 32px 0 rgba(0,0,0,0.30)",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.4,0,0.2,1)",
    normal: "200ms cubic-bezier(0.4,0,0.2,1)",
    slow: "300ms cubic-bezier(0.4,0,0.2,1)",
  },
};

// 테마 타입
export type Theme = typeof lightTheme;

// 테마 모드 타입
export type ThemeMode = "system" | "light" | "dark";

// 기본 테마
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
