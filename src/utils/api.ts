const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// API 요청 시 401 처리를 위한 공통 fetch 래퍼
export const authFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // 쿠키 포함
  });

  // 401 Unauthorized 시 로그인 페이지로 리다이렉트
  if (response.status === 401 && window.location.pathname !== "/login") {
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return response;
};

// API URL 헬퍼
export const apiUrl = (path: string): string => {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export { API_BASE_URL };
