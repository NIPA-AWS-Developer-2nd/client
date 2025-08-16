import { useLocationStore } from '../store/locationStore';

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
  const {
    isVerified,
    isLoading,
    lastVerificationAt,
    currentDistrict,
    refreshStatus,
    error,
  } = useLocationStore();

  return {
    isVerified,
    isLoading,
    lastVerificationAt,
    currentDistrict,
    refreshStatus,
    error,
  };
};