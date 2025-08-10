/**
 * API 응답 캐싱 유틸리티
 * 동일한 API 호출을 중복으로 하지 않도록 메모리에 캐싱
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry?: number; // 만료 시간
}

class ApiCache {
  private cache = new Map<string, CacheItem<unknown>>();

  /**
   * 캐시에서 데이터 가져오기
   * @param key - 캐시 키
   * @returns 캐시된 데이터 또는 undefined
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) {
      return undefined;
    }

    // 만료 시간 체크
    if (item.expiry && Date.now() > item.timestamp + item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.data as T;
  }

  /**
   * 데이터를 캐시에 저장
   * @param key - 캐시 키
   * @param data - 저장할 데이터
   * @param expiry - 만료 시간
   */
  set<T>(key: string, data: T, expiry: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry,
    });
  }

  /**
   * 특정 키의 캐시 삭제
   * @param key - 삭제할 캐시 키
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * 모든 캐시 삭제
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 만료된 캐시 항목들 정리
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry && now > item.timestamp + item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// 싱글톤 인스턴스
export const apiCache = new ApiCache();

/**
 * API 호출을 캐싱하는 래퍼 함수
 * @param key - 캐시 키
 * @param apiCall - API 호출 함수
 * @param expiry - 캐시 만료 시간
 * @returns 캐시된 데이터 또는 새로운 API 호출 결과
 */
export async function cachedApiCall<T>(
  key: string,
  apiCall: () => Promise<T>,
  expiry?: number
): Promise<T> {
  // 캐시에서 확인
  const cached = apiCache.get<T>(key);
  if (cached) {
    // console.log(`캐시 데이터 사용: ${key}`);
    return cached;
  }

  // console.log(`새로운 API 호출: ${key}`);
  // 캐시에 없으면 API 호출
  const data = await apiCall();

  // 결과를 캐시에 저장
  apiCache.set(key, data, expiry);

  return data;
}

// 5분 주기로 만료된 캐시 정리
if (typeof window !== "undefined") {
  setInterval(() => {
    apiCache.cleanup();
  }, 5 * 60 * 1000);
}
