import { useState, useEffect } from "react";
import { authFetch, apiUrl } from "../../../shared/utils/api";

export interface User {
  id: string | number;
  email: string;
  nickname: string;
  profileImage: string;
  provider: "kakao" | "naver" | "google";
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: "kakao" | "google" | "naver") => Promise<void>;
  testLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 페이지 로드 시 백엔드 토큰 확인
  useEffect(() => {
    // 로그인 페이지에서는 인증 체크 제외
    if (window.location.pathname === "/login") {
      return;
    }

    // 테스트 로그인 사용자인지 확인
    const isTestLogin = localStorage.getItem("isTestLogin") === "true";
    const testUserData = localStorage.getItem("testUser");

    if (isTestLogin && testUserData) {
      // 테스트 로그인인 경우 로컬스토리지에서 사용자 정보 복원
      try {
        const userData = JSON.parse(testUserData);
        setUser(userData);
        return;
      } catch (error) {
        console.error("Failed to parse test user data:", error);
        // 파싱 실패 시 테스트 로그인 정보 제거
        localStorage.removeItem("isTestLogin");
        localStorage.removeItem("testUser");
      }
    }

    const checkAuthStatus = async () => {
      try {
        const response = await fetch(apiUrl("/auth/me"), {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401) {
          // 개발 환경에서는 401 에러 시 로그만 남기고 계속 진행
          console.log("Authentication failed: Invalid token");
          
          // 프로덕션 환경에서만 로그인 페이지로 리다이렉트
          if (import.meta.env.PROD) {
            window.location.href = "/login";
          }
        }
      } catch (error) {
        console.log("No auth", error);
      }
    };

    checkAuthStatus();
  }, []);

  const isAuthenticated = !!user;

  const login = async (provider: "kakao" | "google" | "naver") => {
    setIsLoading(true);
    try {
      // 모든 로그인을 백엔드 API로 처리
      window.location.href = apiUrl(`/auth/${provider}`);
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      // 테스트용 가짜 사용자 데이터
      const testUser: User = {
        id: "test-user",
        email: "test@example.com",
        nickname: "테스트",
        profileImage: "",
        provider: "kakao",
      };

      // 가짜 로그인 프로세스 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 로컬스토리지에 테스트 로그인 정보 저장
      localStorage.setItem("isTestLogin", "true");
      localStorage.setItem("testUser", JSON.stringify(testUser));

      setUser(testUser);

      // 홈으로 리다이렉트
      window.location.href = "/";
    } catch (error) {
      console.error("Test login failed:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 테스트 로그인인지 확인
      const isTestLogin = localStorage.getItem("isTestLogin") === "true";
      
      if (isTestLogin) {
        // 테스트 로그인인 경우 로컬스토리지만 정리
        localStorage.removeItem("isTestLogin");
        localStorage.removeItem("testUser");
      } else {
        // 실제 백엔드 로그아웃
        await authFetch(apiUrl("/auth/logout"), {
          redirect: "manual", // 리다이렉트 자동 처리 방지
        });
      }
      
      setUser(null);

      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // 에러가 있어도 로그인 페이지로 이동
      setUser(null);
      // 테스트 로그인 정보도 정리
      localStorage.removeItem("isTestLogin");
      localStorage.removeItem("testUser");
      window.location.href = "/login";
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    testLogin,
    logout,
  };
};
