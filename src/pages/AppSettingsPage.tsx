import React from "react";
import styled from "styled-components";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { deviceDetection } from "../utils/deviceDetection";
import { useTheme } from "../hooks";
import type { ThemeMode } from "../styles/theme";

const PageContainer = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  margin: 0 auto;
`;

const SettingCard = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const SettingTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const SettingDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 20px 0;
  line-height: 1.4;
`;

const ThemeOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ThemeOption = styled.button<{
  $isMobile?: boolean;
  $isSelected: boolean;
}>`
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.primary + "10" : theme.colors.white};
  border: 2px solid
    ${({ $isSelected, theme }) =>
      $isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: left;
  width: 100%;

  &:hover:not(:disabled) {
    border-color: ${({ $isSelected, theme }) =>
      $isSelected ? theme.colors.primary : theme.colors.gray300};
    background: ${({ $isSelected, theme }) =>
      $isSelected ? theme.colors.primary + "10" : theme.colors.gray50};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ThemeIconWrapper = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? "40px" : "48px")};
  height: ${({ $isMobile }) => ($isMobile ? "40px" : "48px")};
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  flex-shrink: 0;
`;

const ThemeInfo = styled.div`
  flex: 1;
`;

const ThemeLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "15px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const ThemeSubtext = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.3;
`;

const CheckIconWrapper = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.primary : "transparent"};
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.white : "transparent"};
  transition: ${({ theme }) => theme.transitions.fast};
`;

export const AppSettingsPage: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const { themeMode, setThemeMode } = useTheme();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const themeOptions: Array<{
    mode: ThemeMode;
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    description: string;
  }> = [
    {
      mode: "system",
      icon: Monitor,
      label: "시스템 설정",
      description: "기기의 시스템 설정을 따라 자동으로 변경됩니다",
    },
    {
      mode: "light",
      icon: Sun,
      label: "라이트 모드",
      description: "밝은 테마로 항상 표시됩니다",
    },
    {
      mode: "dark",
      icon: Moon,
      label: "다크 모드",
      description: "어두운 테마로 항상 표시됩니다",
    },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return (
    <PageContainer $isMobile={isMobile}>
      <SettingCard $isMobile={isMobile}>
        <SettingTitle $isMobile={isMobile}>테마 설정</SettingTitle>
        <SettingDescription $isMobile={isMobile}>
          앱의 화면 모드를 선택하세요. 시스템 설정을 선택하면 기기의 다크 모드
          설정에 따라 자동으로 변경됩니다.
        </SettingDescription>

        <ThemeOptions>
          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = themeMode === option.mode;

            return (
              <ThemeOption
                key={option.mode}
                $isMobile={isMobile}
                $isSelected={isSelected}
                onClick={() => handleThemeChange(option.mode)}
              >
                <ThemeIconWrapper $isMobile={isMobile}>
                  <IconComponent size={isMobile ? 20 : 24} />
                </ThemeIconWrapper>

                <ThemeInfo>
                  <ThemeLabel $isMobile={isMobile}>{option.label}</ThemeLabel>
                  <ThemeSubtext $isMobile={isMobile}>
                    {option.description}
                  </ThemeSubtext>
                </ThemeInfo>

                <CheckIconWrapper $isSelected={isSelected}>
                  <Check size={16} />
                </CheckIconWrapper>
              </ThemeOption>
            );
          })}
        </ThemeOptions>
      </SettingCard>
    </PageContainer>
  );
};
