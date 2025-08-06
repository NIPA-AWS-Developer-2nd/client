import styled from "styled-components";

// Windows/macOS Desktop - 브랜딩 뷰 내 상단 알림
export const DesktopNotification = styled.div<{ $show: boolean; $platform: string }>`
  display: ${({ $show }) => ($show ? "flex" : "none")};
  align-items: center;
  gap: 12px;
  background: ${({ $platform, theme }) =>
    $platform === "windows-desktop"
      ? theme?.colors?.primary + "10" || "#f0f8ff"
      : "#f5f7fa"};
  border: 1px solid
    ${({ $platform, theme }) =>
      $platform === "windows-desktop"
        ? theme?.colors?.primary || "#007bff"
        : "#6c757d"};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  position: relative;
`;

export const DesktopNotificationIcon = styled.div`
  color: ${({ theme }) => theme?.colors?.primary || "#007bff"};
  flex-shrink: 0;
`;

export const DesktopNotificationContent = styled.div`
  flex: 1;
`;

export const DesktopNotificationText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
`;

export const DesktopNotificationButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const DesktopButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant, theme }) =>
    $variant === "secondary"
      ? `
        background: #6c757d;
        color: white;
        &:hover {
          background: #5a6268;
        }
      `
      : `
        background: ${theme?.colors?.primary || "#007bff"};
        color: white;
        &:hover {
          opacity: 0.9;
        }
      `}
`;

// Android - 하단 모달
export const AndroidModal = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: ${({ $show }) => ($show ? "0" : "-300px")};
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 1001;
  transition: bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

// macOS 데스크톱 전용 - 하단 모달 (Android보다 좁고 중앙정렬)
export const MacOSModal = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: ${({ $show }) => ($show ? "40px" : "-300px")};
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 16px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 1001;
  transition: bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: 400px;
  max-width: calc(100vw - 40px);
  text-align: center;
`;

export const AndroidModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const MacOSModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  position: relative;
`;

export const MacOSModalIcon = styled.div`
  color: ${({ theme }) => theme?.colors?.primary || "#007bff"};
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export const MacOSCloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  
  &:hover {
    background: #f5f5f5;
  }
`;

export const AndroidModalTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

export const AndroidCloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;

  &:hover {
    background: #f5f5f5;
  }
`;

export const AndroidModalText = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

export const AndroidButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme?.colors?.primary || "#007bff"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

// iOS/iPad - 하단에 위치하는 모달 (Android 스타일과 유사하게)
export const IOSModal = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: ${({ $show }) => ($show ? "0" : "-400px")};
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  padding: 24px;
  z-index: 1001;
  transition: bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 1200px) {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: 1200px;
  }
`;

export const IOSModalIcon = styled.div`
  margin-bottom: 16px;
  color: ${({ theme }) => theme?.colors?.primary || "#007bff"};
  text-align: center;
`;

export const IOSModalTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

export const IOSModalText = styled.p`
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  text-align: center;
`;

export const IOSButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme?.colors?.primary || "#007bff"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;