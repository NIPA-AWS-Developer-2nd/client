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
    return data;
  },

  // 현재 포인트 잔액 조회
  getPointBalance: async (): Promise<PointBalanceData> => {
    const data = await api.get('/points/balance');
    console.log('포인트 API 응답:', data);
    return data;
  },
};