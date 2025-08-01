import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ThemeContext } from "../../hooks/useTheme";
import type { ThemeMode, Theme } from "../../styles/theme";
import { getActiveTheme, getSystemTheme } from "../../styles/theme";

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = "halsaram-theme-mode";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 저장된 테마 모드 불러오기
  const getStoredThemeMode = (): ThemeMode => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && ["system", "light", "dark"].includes(stored)) {
        return stored as ThemeMode;
      }
    }
    return "system";
  };

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const stored = getStoredThemeMode();
    // console.log('초기 테마 모드:', stored);
    return stored;
  });
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const stored = getStoredThemeMode();
    const theme = getActiveTheme(stored);
    // console.log("초기 테마:", theme.colors.background);
    return theme;
  });

  // 테마 모드 변경 함수
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    setCurrentTheme(getActiveTheme(mode));

    // 메타 태그 업데이트
    updateMetaThemeColor(getActiveTheme(mode));
  };

  // 메타 태그 테마 컬러 업데이트
  const updateMetaThemeColor = (theme: Theme) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme.colors.background);
    }

    document.documentElement.style.setProperty(
      "--body-bg",
      theme.colors.background
    );
  };

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleSystemThemeChange = () => {
        const newTheme = getActiveTheme("system");
        setCurrentTheme(newTheme);
        updateMetaThemeColor(newTheme);
      };

      // 초기 설정
      handleSystemThemeChange();

      // 리스너 등록
      mediaQuery.addEventListener("change", handleSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    } else {
      const newTheme = getActiveTheme(themeMode);
      setCurrentTheme(newTheme);
      updateMetaThemeColor(newTheme);
    }
  }, [themeMode]);

  // 초기 메타 태그 설정
  useEffect(() => {
    updateMetaThemeColor(currentTheme);
  }, [currentTheme]);

  const isDark =
    currentTheme === getActiveTheme("dark") ||
    (themeMode === "system" && getSystemTheme() === "dark");

  const contextValue = {
    themeMode,
    currentTheme,
    setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={currentTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
