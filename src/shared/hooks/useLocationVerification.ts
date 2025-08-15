import { useState, useEffect, useCallback } from 'react';
import { 
  userApiService, 
  type LocationVerificationStatusResponse 
} from '../services/userApi';

interface UseLocationVerificationReturn {
  isVerified: boolean;
  isLoading: boolean;
  lastVerificationAt?: string;
  currentDistrict?: {
    id: string;
    districtName: string;
    city: string;
  };
  refreshStatus: () => Promise<void>;
  error?: string;
}

export const useLocationVerification = (): UseLocationVerificationReturn => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVerificationAt, setLastVerificationAt] = useState<string>();
  const [currentDistrict, setCurrentDistrict] = useState<{
    id: string;
    districtName: string;
    city: string;
  }>();
  const [error, setError] = useState<string>();

  const fetchLocationStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      
      console.log('📡 위치 인증 상태 조회 API 호출...');
      const status: LocationVerificationStatusResponse = await userApiService.getLocationVerificationStatus();
      console.log('📡 위치 인증 상태 조회 응답:', status);
      
      setIsVerified(status.isVerified);
      setLastVerificationAt(status.lastVerificationAt);
      setCurrentDistrict(status.currentDistrict);
      
      console.log('🔄 상태 업데이트 완료:', {
        isVerified: status.isVerified,
        lastVerificationAt: status.lastVerificationAt,
        currentDistrict: status.currentDistrict
      });
    } catch (err) {
      console.error('❌ 위치 인증 상태 조회 실패:', err);
      setError(err instanceof Error ? err.message : 'Failed to check location verification status');
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    await fetchLocationStatus();
  }, [fetchLocationStatus]);

  useEffect(() => {
    fetchLocationStatus();
  }, [fetchLocationStatus]);

  return {
    isVerified,
    isLoading,
    lastVerificationAt,
    currentDistrict,
    refreshStatus,
    error,
  };
};