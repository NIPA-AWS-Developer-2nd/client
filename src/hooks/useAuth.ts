import { useState, useEffect, createContext, useContext } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  provider: "apple" | "kakao" | "google";
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: "apple" | "kakao" | "google") => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "halsaram-auth";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to load stored auth:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (provider: "apple" | "kakao" | "google") => {
    setIsLoading(true);
    try {
      // TODO: 실제 소셜 로그인 API 구현
      // 임시 mock 데이터
      const mockUser: User = {
        id: `${provider}_user_${Date.now()}`,
        email: `user@${provider}.com`,
        name: `${provider} User`,
        provider,
        avatar: undefined,
      };

      setUser(mockUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 로그아웃 API 구현
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
};