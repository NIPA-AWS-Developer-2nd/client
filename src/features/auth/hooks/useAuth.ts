import { useState, useEffect } from "react";
import { authFetch, apiUrl } from "../../../shared/utils/api";
import type { LocationData, AccountStatus } from "../../../types";

// 백엔드 API와 일치하는 간소화된 User 타입
export interface User {
  id: string; // ULID
  phoneNumber?: string;
  status: AccountStatus;
  phoneVerifiedAt?: string;
  onboardingCompletedAt?: string;
  lastLoginAt?: string;
  districtVerifiedAt?: string;

  // 온보딩 상태 계산 필드
  isNewUser?: boolean;
  hasCompletedOnboarding?: boolean;

  // 소셜 로그인에서 가져온 기본 정보
  nickname?: string;
  birthYear?: number;
  gender?: "male" | "female";
  bio?: string;
  profileImageUrl?: string;
  interests?: string[];
  hashtags?: number[];
  mbti?: string;
  districtId?: string;
  locationData?: LocationData;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: "kakao" | "google" | "naver") => Promise<void>;
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
        // console.log("인증 상태 확인 시작");

        const response = await fetch(apiUrl("/auth/me"), {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          // console.log("사용자 인증 성공:", userData.id);
          // console.log("/auth/me 응답 데이터:", userData);

          // 온보딩 완료 여부 확인
          const hasCompletedOnboarding = !!userData.onboardingCompletedAt;
          // console.log("온보딩 완료 상태:", hasCompletedOnboarding);
          // console.log("onboardingCompletedAt:", userData.onboardingCompletedAt);

          if (
            !hasCompletedOnboarding &&
            window.location.pathname !== "/onboarding"
          ) {
            window.location.href = "/onboarding";
            return;
          }

          setUser({
            ...userData,
            hasCompletedOnboarding,
            isNewUser: !hasCompletedOnboarding,
          });
        } else if (response.status === 401) {
          console.log("인증 실패: 토큰 무효");

          // 개발/프로덕션 모두 일관된 로그인 처리
          if (import.meta.env.DEV) {
            // console.log("개발 환경: 로그인 페이지로 이동");
          }

          // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      } catch (_err) {
        // console.log("인증 상태 확인 에러:", err);
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

  const logout = async () => {
    try {
      // 백엔드 로그아웃 API 호출
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
    logout,
  };
};
