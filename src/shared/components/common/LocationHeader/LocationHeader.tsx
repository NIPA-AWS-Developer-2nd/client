import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { deviceDetection } from '../../../utils/deviceDetection';

interface LocationHeaderProps {
  pageName: string;
  onLocationClick?: () => void;
}

const HeaderContainer = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ $isMobile }) => ($isMobile ? '12px 16px' : '16px 24px')};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageName = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '18px' : '20px')};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Separator = styled.span<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  font-weight: 300;
`;

const LocationButton = styled.button<{ $hasError?: boolean; $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ $hasError, theme }) => 
    $hasError ? theme.colors.verificationPendingBg : 'transparent'};
  border: none;
  color: ${({ $hasError, theme }) => 
    $hasError ? theme.colors.verificationPending : theme.colors.locationVerified};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  font-weight: 600;
  cursor: pointer;
  padding: ${({ $isMobile }) => ($isMobile ? '4px 8px' : '6px 12px')};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $hasError, theme }) => 
      $hasError ? theme.colors.verificationPendingBg : theme.colors.locationVerifiedBg};
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: rotate(180deg);
  }
`;

const LocationText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const LocationHeader: React.FC<LocationHeaderProps> = ({ 
  pageName, 
  onLocationClick 
}) => {
  const [isMobile] = useState(deviceDetection.isMobile());
  
  // Mock 지역 인증 상태 - 실제로는 auth store나 context에서 가져와야 함
  const [isLocationVerified] = useState(true); // false로 변경하면 인증 안됨 상태
  const [userLocation] = useState('송파구'); // 사용자 지역 정보

  const handleLocationClick = () => {
    if (onLocationClick) {
      onLocationClick();
    } else {
      // 기본 동작: 지역 설정 페이지로 이동 또는 모달 열기
      console.log('Location setting clicked');
    }
  };

  return (
    <HeaderContainer $isMobile={isMobile}>
      <HeaderContent>
        <LeftSection>
          <PageName $isMobile={isMobile}>{pageName}</PageName>
          <Separator $isMobile={isMobile}>—</Separator>
          <LocationButton 
            $hasError={!isLocationVerified}
            $isMobile={isMobile}
            onClick={handleLocationClick}
          >
            {!isLocationVerified && <AlertCircle size={16} />}
            <LocationText>
              {isLocationVerified ? userLocation : '지역 인증 필요'}
            </LocationText>
            <ChevronDown size={16} />
          </LocationButton>
        </LeftSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default LocationHeader;