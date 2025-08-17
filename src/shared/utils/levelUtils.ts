/**
 * 레벨 계산 및 표시 유틸리티
 */

/**
 * 포인트 기반으로 레벨을 계산합니다.
 * 
 * @param points 사용자 포인트
 * @returns 계산된 레벨
 */
export const calculateLevelFromPoints = (points: number): number => {
  if (points < 0) return 1;
  
  // 레벨 1: 0 ~ 99
  // 레벨 2: 100 ~ 299  
  // 레벨 3: 300 ~ 599
  // 레벨 4: 600 ~ 999
  // 레벨 5: 1000 ~ 1499
  // 이후: 매 500점씩 증가
  
  if (points < 100) return 1;
  if (points < 300) return 2;
  if (points < 600) return 3;
  if (points < 1000) return 4;
  if (points < 1500) return 5;
  
  // 레벨 6부터는 매 500점씩
  return Math.floor((points - 1500) / 500) + 6;
};

/**
 * 안전한 레벨 표시 - 백엔드 레벨이 있으면 사용, 없으면 포인트로 계산
 * 
 * @param level 백엔드에서 받은 레벨
 * @param points 사용자 포인트
 * @returns 표시할 레벨
 */
export const getDisplayLevel = (level?: number | null, points?: number | null): number => {
  // 1. 포인트가 있으면 포인트로 계산 (백엔드 레벨보다 우선)
  if (points && points >= 0) {
    return calculateLevelFromPoints(points);
  }
  
  // 2. 포인트가 없으면 백엔드 레벨 사용
  if (level && level > 0) {
    return level;
  }
  
  // 3. 둘 다 없으면 기본값
  return 1;
};

/**
 * 레벨 텍스트 형식으로 반환
 * 
 * @param level 백엔드에서 받은 레벨  
 * @param points 사용자 포인트
 * @returns "Lv.X" 형식의 문자열
 */
export const formatLevel = (level?: number | null, points?: number | null): string => {
  return `Lv.${getDisplayLevel(level, points)}`;
};