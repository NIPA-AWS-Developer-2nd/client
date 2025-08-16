import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { deviceDetection } from '../../../../shared/utils';
import { pointApi } from '../../api/pointApi';
import PointIcon from '../../../../assets/images/point.svg';
import * as S from './PointBalance.styles';

interface PointBalanceProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const PointBalance: React.FC<PointBalanceProps> = ({
  showLabel = true,
  size = 'md',
  onClick,
}) => {
  const [isMobile, setIsMobile] = useState(deviceDetection.isMobile());
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchPointBalance();
  }, []);

  const fetchPointBalance = async () => {
    try {
      setLoading(true);
      console.log('포인트 조회 시도...');
      const balance = await pointApi.getPointBalance();
      console.log('포인트 조회 성공:', balance);
      setPoints(balance.points);
    } catch (error) {
      console.error('포인트 조회 실패:', error);
      console.log('쿠키 확인:', document.cookie);
      setPoints(0);
    } finally {
      setLoading(false);
    }
  };

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat('ko-KR').format(points);
  };

  return (
    <S.Container 
      $isMobile={isMobile} 
      $size={size}
      $clickable={!!onClick}
      onClick={onClick}
    >
      <S.IconWrapper $size={size}>
        {loading ? (
          <RefreshCw size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="spinning" />
        ) : (
          <img 
            src={PointIcon} 
            alt="포인트" 
            width={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
            height={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
          />
        )}
      </S.IconWrapper>
      
      <S.Content $size={size}>
        {showLabel && (
          <S.Label $isMobile={isMobile} $size={size}>
            내 포인트
          </S.Label>
        )}
        <S.Points $isMobile={isMobile} $size={size}>
          {formatPoints(points)}P
        </S.Points>
      </S.Content>
    </S.Container>
  );
};