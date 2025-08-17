import { api } from '../../../shared/utils/api';

export enum GiftCardCategory {
  COFFEE_BEVERAGE = 'coffee_beverage',
  CHICKEN = 'chicken',
  FAST_FOOD = 'fast_food',
  CONVENIENCE = 'convenience',
}

export interface GiftCard {
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

export interface GiftCardListResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  data: GiftCard[];
}

export interface GiftCardQuery {
  category?: GiftCardCategory;
  brand?: string;
  page?: number;
  limit?: number;
}

export const giftCardApi = {
  // 기프티콘 목록 조회
  getGiftCards: async (query?: GiftCardQuery): Promise<GiftCardListResponse> => {
    const params = new URLSearchParams();
    
    if (query?.category) {
      params.append('category', query.category);
    }
    if (query?.brand) {
      params.append('brand', query.brand);
    }
    if (query?.page) {
      params.append('page', query.page.toString());
    }
    if (query?.limit) {
      params.append('limit', query.limit.toString());
    }

    const response = await api.get(`/gift-cards?${params.toString()}`);
    console.log('기프티콘 목록 응답:', response);
    
    // 백엔드에서 직접 응답 구조 반환
    if (response && typeof response === 'object') {
      return response as GiftCardListResponse;
    } else if (response && response.data) {
      return response.data as GiftCardListResponse;
    } else {
      console.warn('예상하지 못한 기프티콘 응답 형태:', response);
      return {
        page: 1,
        size: 0,
        totalElements: 0,
        totalPages: 0,
        data: []
      };
    }
  },

  // 기프티콘 상세 조회
  getGiftCardById: async (id: string): Promise<GiftCard> => {
    const response = await api.get(`/gift-cards/${id}`);
    console.log('기프티콘 상세 응답:', response);
    
    if (response && typeof response === 'object') {
      return response as GiftCard;
    } else if (response && response.data) {
      return response.data as GiftCard;
    } else {
      throw new Error('기프티콘 정보를 찾을 수 없습니다.');
    }
  },

  // 카테고리별 기프티콘 조회
  getGiftCardsByCategory: async (category: GiftCardCategory, page = 1, limit = 20): Promise<GiftCardListResponse> => {
    return giftCardApi.getGiftCards({ category, page, limit });
  },
};