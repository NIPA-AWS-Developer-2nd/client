import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  // ArrowLeft, 
  Plus, 
  Minus, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  // Gift
} from 'lucide-react';
import { deviceDetection } from '../../../../shared/utils';
import PointIcon from '../../../../assets/images/point.svg';
import { pointApi } from '../../api/pointApi';

// 임시 타입 정의
type PointTransactionData = {
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
};
import { PointBalance } from '../../components/PointBalance';
import * as S from './PointHistoryPage.styles';

export const PointHistoryPage: React.FC = () => {
  const _navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [transactions, setTransactions] = useState<PointTransactionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchTransactions(0, true);
  }, []);

  const fetchTransactions = async (currentOffset: number, reset = false) => {
    try {
      setLoading(true);
      const data = await pointApi.getPointHistory(20, currentOffset);
      
      if (reset) {
        setTransactions(data);
      } else {
        setTransactions(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === 20);
      setOffset(currentOffset + data.length);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchTransactions(offset);
    }
  };

  const getTransactionIcon = (type: PointTransactionData['type']) => {
    switch (type) {
      case 'meeting_payment':
        return <Minus size={16} />;
      case 'meeting_reward':
        return <img src={PointIcon} alt="포인트 보상" width={16} height={16} />;
      case 'meeting_refund':
        return <TrendingUp size={16} />;
      case 'no_show_penalty':
      case 'cancellation_penalty':
        return <AlertTriangle size={16} />;
      default:
        return <Plus size={16} />;
    }
  };

  const getTransactionColor = (type: PointTransactionData['type']) => {
    switch (type) {
      case 'meeting_payment':
      case 'no_show_penalty':
      case 'cancellation_penalty':
        return 'negative';
      case 'meeting_reward':
      case 'meeting_refund':
        return 'positive';
      default:
        return 'neutral';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `오늘 ${date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (diffInDays === 1) {
      return `어제 ${date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatPoints = (amount: number) => {
    const abs = Math.abs(amount);
    const formatted = new Intl.NumberFormat('ko-KR').format(abs);
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <S.PageContainer $isMobile={isMobile}>
      {/* 현재 포인트 잔액 */}
      <S.BalanceSection $isMobile={isMobile}>
        <PointBalance size="lg" showLabel={false} />
      </S.BalanceSection>

      {/* 거래 내역 */}
      <S.TransactionList $isMobile={isMobile}>
        {transactions.length === 0 && !loading ? (
          <S.EmptyState $isMobile={isMobile}>
            <S.EmptyIcon>
              <TrendingDown size={48} />
            </S.EmptyIcon>
            <S.EmptyText $isMobile={isMobile}>
              아직 포인트 내역이 없습니다
            </S.EmptyText>
          </S.EmptyState>
        ) : (
          <>
            {transactions.map((transaction) => (
              <S.TransactionItem key={transaction.id} $isMobile={isMobile}>
                <S.TransactionIcon 
                  $color={getTransactionColor(transaction.type)}
                >
                  {getTransactionIcon(transaction.type)}
                </S.TransactionIcon>
                
                <S.TransactionContent>
                  <S.TransactionTitle $isMobile={isMobile}>
                    {transaction.description}
                  </S.TransactionTitle>
                  {transaction.meeting?.mission?.title && (
                    <S.TransactionSubtitle $isMobile={isMobile}>
                      {transaction.meeting.mission.title}
                    </S.TransactionSubtitle>
                  )}
                  <S.TransactionDate $isMobile={isMobile}>
                    {formatDate(transaction.createdAt)}
                  </S.TransactionDate>
                </S.TransactionContent>
                
                <S.TransactionAmount 
                  $color={getTransactionColor(transaction.type)}
                  $isMobile={isMobile}
                >
                  {formatPoints(transaction.amount)}P
                </S.TransactionAmount>
              </S.TransactionItem>
            ))}
            
            {/* 더보기 버튼 */}
            {hasMore && (
              <S.LoadMoreButton 
                $isMobile={isMobile}
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw size={16} className="spinning" />
                ) : (
                  '더보기'
                )}
              </S.LoadMoreButton>
            )}
          </>
        )}
      </S.TransactionList>
    </S.PageContainer>
  );
};