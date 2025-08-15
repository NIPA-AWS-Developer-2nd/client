import { useState, useEffect, useCallback } from "react";
import type { HomeData, GetHomeDataParams } from "../types";
import { homeApi } from "../api/homeApi";

export interface UseHomeDataResult {
  data: HomeData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useHomeData = (params?: GetHomeDataParams): UseHomeDataResult => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = params?.limit;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await homeApi.getHomeData(limit ? { limit } : undefined);

      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = async () => {
    await fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};
