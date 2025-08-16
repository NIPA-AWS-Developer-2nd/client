import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { userApiService } from '../services/userApi';
import type { LocationVerificationStatusResponse } from '../services/userApi';

interface LocationStore {
  isVerified: boolean;
  isLoading: boolean;
  lastVerificationAt?: string;
  currentDistrict?: {
    id: string;
    districtName: string;
    city: string;
  };
  error?: string;
  
  // Actions
  fetchLocationStatus: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  setVerified: (verified: boolean) => void;
}

export const useLocationStore = create<LocationStore>()(
  devtools(
    (set, get) => ({
      isVerified: false,
      isLoading: true,
      lastVerificationAt: undefined,
      currentDistrict: undefined,
      error: undefined,

      fetchLocationStatus: async () => {
        try {
          set({ isLoading: true, error: undefined });
          
          console.log('🏪 LocationStore - 위치 인증 상태 조회 API 호출...');
          const status: LocationVerificationStatusResponse = await userApiService.getLocationVerificationStatus();
          console.log('🏪 LocationStore - 위치 인증 상태 조회 응답:', status);
          console.log('🏪 LocationStore - isVerified 값:', status.isVerified, typeof status.isVerified);
          
          set({
            isVerified: status.isVerified,
            lastVerificationAt: status.lastVerificationAt,
            currentDistrict: status.currentDistrict,
            isLoading: false,
            error: undefined,
          });
          
          console.log('🏪 LocationStore - 상태 업데이트 완료:', {
            isVerified: status.isVerified,
            lastVerificationAt: status.lastVerificationAt,
            currentDistrict: status.currentDistrict
          });
        } catch (err) {
          console.error('🏪 LocationStore - 위치 인증 상태 조회 실패:', err);
          set({
            error: err instanceof Error ? err.message : 'Failed to check location verification status',
            isVerified: false,
            isLoading: false,
          });
        }
      },

      refreshStatus: async () => {
        await get().fetchLocationStatus();
      },

      setVerified: (verified: boolean) => {
        set({ isVerified: verified });
      },
    }),
    { name: 'location-store' }
  )
);

// 자동으로 초기 상태 로드
useLocationStore.getState().fetchLocationStatus();