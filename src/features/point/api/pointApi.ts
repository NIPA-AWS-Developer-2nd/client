import { api } from '../../../shared/utils/api';

// 포인트 거래 내역 인터페이스
export interface PointTransactionData {
  id: string;
  type: 'meeting_payment' | 'meeting_reward' | 'meeting_refund' | 'no_show_penalty' | 'cancellation_penalty';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  meeting?: {
    id: string;
    mission?: {
      title: string;
      basePoints: number;
    };
  };
}

// 포인트 잔액 인터페이스
export interface PointBalanceData {
  points: number;
}

export const pointApi = {
  // 포인트 내역 조회
  getPointHistory: async (limit = 20, offset = 0): Promise<PointTransactionData[]> => {
    const data = await api.get(`/points/history?limit=${limit}&offset=${offset}`);
    console.log('포인트 내역 응답:', data);
    
    // 백엔드에서 직접 배열을 반환하므로 data가 배열이어야 함
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data; // { data: [...] } 형태인 경우
    } else {
      console.warn('예상하지 못한 포인트 내역 응답 형태:', data);
      return []; // 빈 배열 반환
    }
  },

  // 현재 포인트 잔액 조회
  getPointBalance: async (): Promise<PointBalanceData> => {
    const data = await api.get('/points/balance');
    console.log('포인트 잔액 응답:', data);
    
    // 백엔드에서 직접 { points: number } 객체를 반환
    if (data && typeof data.points === 'number') {
      return data;
    } else if (data && data.data && typeof data.data.points === 'number') {
      return data.data; // ApiResponseDto 래핑된 경우
    } else {
      console.warn('예상하지 못한 포인트 잔액 응답 형태:', data);
      return { points: 0 }; // 기본값 반환
    }
  },
};