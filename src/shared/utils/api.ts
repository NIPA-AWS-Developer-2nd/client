const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// 리프레시 토큰 요청 중인지 추적하는 변수
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// 토큰 리프레시 함수
const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl("/auth/refresh"), {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("토큰 리프레시 실패:", err);
    return false;
  }
};

// API 요청 시 401 처리를 위한 공통 fetch 래퍼
export const authFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let response = await fetch(url, {
    ...options,
    credentials: "include", // 쿠키 포함
  });

  // 401 Unauthorized 시 토큰 리프레시 시도
  if (response.status === 401 && window.location.pathname !== "/login") {
    // 이미 리프레시 중인 경우 기존 promise 대기
    if (isRefreshing && refreshPromise) {
      const refreshSuccess = await refreshPromise;

      if (refreshSuccess) {
        // 리프레시 성공 후 원래 요청 재시도
        response = await fetch(url, {
          ...options,
          credentials: "include",
        });
      }
    } else {
      // 리프레시 토큰 요청
      isRefreshing = true;
      refreshPromise = refreshToken();

      const refreshSuccess = await refreshPromise;

      isRefreshing = false;
      refreshPromise = null;

      if (refreshSuccess) {
        // 리프레시 성공 후 원래 요청 재시도
        response = await fetch(url, {
          ...options,
          credentials: "include",
        });
      } else {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
    }

    // 리프레시 후에도 401이면 로그인 페이지로
    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
  }

  if (response.ok) {
    console.log("✅ API 요청 응답 성공:", url, response.status);
  } else {
    console.log("❌ API 요청 응답 실패:", url, response.status);
  }

  return response;
};

// API URL 헬퍼
export const apiUrl = (path: string): string => {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export { API_BASE_URL };
