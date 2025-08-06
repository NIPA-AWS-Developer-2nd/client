import { useState, useEffect } from "react";
import { authFetch, apiUrl } from "../utils/api";

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

    const checkAuthStatus = async () => {
      try {
        const response = await fetch(apiUrl("/auth/me"), {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401) {
          // 401 인증 실패 시 로그인 페이지로 리다이렉트
          window.location.href = "/login";
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
      // 테스트 사용자 데이터 생성
      const testUser: User = {
        id: "test-user-1",
        email: "test@halsaram.com",
        nickname: "테스트유저",
        profileImage: "https://via.placeholder.com/40x40?text=T",
        provider: "kakao", // 기본값으로 카카오 설정
      };

      // 테스트 로그인은 로컬 상태만 업데이트
      setUser(testUser);
      setIsLoading(false);
      
      // 홈 페이지로 리다이렉트
      window.location.href = "/";
    } catch (error) {
      console.error("Test login failed:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 백엔드 로그아웃
      await authFetch(apiUrl("/auth/logout"), {
        redirect: "manual", // 리다이렉트 자동 처리 방지
      });
      setUser(null);
      
      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // 에러가 있어도 로그인 페이지로 이동
      setUser(null);
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
