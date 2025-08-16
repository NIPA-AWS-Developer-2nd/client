export interface PointTransaction {
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

export interface PointBalanceData {
  points: number;
}