import { useState, useEffect } from "react";
import { giftCardApi } from "../api/giftCardApi";

enum GiftCardCategory {
  COFFEE_BEVERAGE = "coffee_beverage",
  CHICKEN = "chicken",
  FAST_FOOD = "fast_food",
  CONVENIENCE = "convenience",
}

interface GiftCard {
  id: string;
  brand: string;
  name: string;
  points: number;
  imageUrl: string;
  category: GiftCardCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseGiftCardsProps {
  category?: GiftCardCategory | null;
  page?: number;
  limit?: number;
}

interface UseGiftCardsReturn {
  giftCards: GiftCard[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  totalElements: number;
  refetch: () => void;
}

export const useGiftCards = ({
  category,
  page = 1,
  limit = 20,
}: UseGiftCardsProps = {}): UseGiftCardsReturn => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchGiftCards = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const query = {
        page,
        limit,
        ...(category && { category }),
      };

      const response = await giftCardApi.getGiftCards(query);

      setGiftCards(response.data);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error("기프티콘 조회 실패:", err);
      setError("기프티콘을 불러오는데 실패했습니다.");
      setGiftCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards();
  }, [category, page, limit]);

  return {
    giftCards,
    isLoading,
    error,
    totalPages,
    totalElements,
    refetch: fetchGiftCards,
  };
};
