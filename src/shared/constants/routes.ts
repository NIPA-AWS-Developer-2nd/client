// 중앙화된 라우트 상수 관리
export const ROUTES = {
  // 인증 관련
  LOGIN: '/login',
  AUTH_CALLBACK: '/auth/callback',
  AUTH_SUCCESS: '/auth/success',
  
  // 온보딩
  ONBOARDING: '/onboarding',
  
  // 메인 페이지
  HOME: '/',
  
  // 사용자
  MY_PAGE: '/my',
  
  // 미션
  MISSIONS: '/missions',
  MISSION_DETAIL: (id: string) => `/missions/${id}`,
  
  // 미팅
  MEETINGS: '/meetings',
  MEETING_DETAIL: (id: string) => `/meetings/${id}`,
  
  // 마켓
  MARKET: '/market'
} as const;

// 인증이 필요하지 않은 페이지들
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.AUTH_CALLBACK,
  ROUTES.AUTH_SUCCESS
] as const;

// 온보딩이 필요한 페이지들
export const ONBOARDING_ROUTES = [
  ROUTES.ONBOARDING
] as const;

// 레이아웃에서 제외되는 페이지들
export const LAYOUT_EXCLUDED_ROUTES = [
  ...PUBLIC_ROUTES,
  ...ONBOARDING_ROUTES
] as const;

// 경로 유틸리티 함수들
export const routeUtils = {
  isPublicRoute: (pathname: string): boolean => 
    (PUBLIC_ROUTES as readonly string[]).includes(pathname),
    
  isOnboardingRoute: (pathname: string): boolean => 
    (ONBOARDING_ROUTES as readonly string[]).includes(pathname),
    
  isLayoutExcluded: (pathname: string): boolean => 
    (LAYOUT_EXCLUDED_ROUTES as readonly string[]).includes(pathname),
    
  requiresAuth: (pathname: string): boolean => 
    !routeUtils.isPublicRoute(pathname),
    
  requiresOnboarding: (pathname: string): boolean => 
    routeUtils.isOnboardingRoute(pathname)
} as const;