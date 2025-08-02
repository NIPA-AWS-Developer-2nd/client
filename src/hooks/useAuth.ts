import { useState, useEffect } from "react";
import { useAuth as useOidcAuth } from "react-oidc-context";

export interface User {
  id: string | number;
  email: string;
  nickname: string;
  profileImage: string;
  provider: "kakao" | "naver" | "apple" | "google";
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: "apple" | "kakao" | "google" | "naver") => Promise<void>;
  logout: () => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useAuth = (): AuthContextType => {
  const oidcAuth = useOidcAuth();
  const [backendUser, setBackendUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 페이지 로드 시 백엔드 토큰 확인
  useEffect(() => {
    const checkBackendAuthStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setBackendUser(userData);
        }
      } catch (error) {
        console.log("No backend auth", error);
      }
    };

    checkBackendAuthStatus();
  }, []);

  // Cognito 사용자 정보 → User 인터페이스 변환
  const cognitoUser: User | null = oidcAuth.user
    ? {
        id: oidcAuth.user.profile.sub || "",
        email: oidcAuth.user.profile.email || "",
        nickname:
          oidcAuth.user.profile.name ||
          oidcAuth.user.profile.preferred_username ||
          "사용자",
        profileImage: oidcAuth.user.profile.picture || "",
        provider: "google" as const,
      }
    : null;

  // 통합된 사용자 정보
  const user = backendUser || cognitoUser;
  const isAuthenticated = !!(backendUser || oidcAuth.isAuthenticated);
  const combinedIsLoading = isLoading || oidcAuth.isLoading;

  const login = async (provider: "apple" | "kakao" | "google" | "naver") => {
    setIsLoading(true);
    try {
      if (provider === "google" || provider === "apple") {
        // Google, Apple Cognito OIDC
        await oidcAuth.signinRedirect({
          extraQueryParams: {
            identity_provider:
              provider === "google" ? "Google" : "SignInWithApple",
          },
        });
      } else {
        // 카카오,네이버 사용자 정보 백엔드 API
        window.location.href = `${API_BASE_URL}/auth/${provider}`;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 백엔드 로그아웃
      if (backendUser) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          credentials: "include",
        });
        setBackendUser(null);
      }

      // Cognito 로그아웃 (Google/Apple)
      if (oidcAuth.isAuthenticated) {
        await oidcAuth.removeUser();
      }

      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return {
    user,
    isLoading: combinedIsLoading,
    isAuthenticated,
    login,
    logout,
  };
};
