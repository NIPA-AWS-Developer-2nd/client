import styled, { css } from 'styled-components';
import { responsive } from '../../../../shared/styles/mixins';

export const PageContainer = styled.div<{ $isMobile: boolean }>`
  height: 100%;
  background: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ContentContainer = styled.div<{ $isMobile: boolean; $noPadding?: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${({ $isMobile, $noPadding }) => 
    $noPadding ? '0' : $isMobile ? '16px' : '24px'};
  min-height: 0;

  ${responsive.mobile(css<{ $noPadding?: boolean }>`
    padding: ${({ $noPadding }) => $noPadding ? '0' : '16px'};
  `)}
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const InfoContent = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '20px' : '24px')};

  ${responsive.mobile(css`
    gap: 20px;
  `)}
`;

// 카운트다운 배너 스타일
export const CountdownBanner = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '12px')};
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}15 0%, ${({ theme }) => theme.colors.primary}10 100%);
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${responsive.mobile(css`
    padding: 16px;
    gap: 8px;
    margin-bottom: 16px;
  `)}
`;

export const CountdownText = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '15px' : '16px')};
  color: ${({ theme }) => theme.colors.text.primary};
  
  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  }

  ${responsive.mobile(css`
    font-size: 15px;
    
    strong {
      font-size: 16px;
    }
  `)}
`;

export const ChatContent = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
`;

export const VerificationContent = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ComingSoon = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;

  ${responsive.mobile(css`
    font-size: 16px;
  `)}
`;

export const Section = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const SectionTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  ${responsive.mobile(css`
    font-size: 16px;
  `)}
`;

export const MeetingTitle = styled.h1<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '20px' : '24px')};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
  line-height: 1.3;

  ${responsive.mobile(css`
    font-size: 20px;
  `)}
`;

export const MeetingDescription = styled.p<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 20px 0;
  line-height: 1.5;

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const InfoGrid = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  ${responsive.mobile(css`
    gap: 12px;
  `)}
`;

export const InfoItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const ParticipantList = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  ${responsive.mobile(css`
    gap: 12px;
  `)}
`;

export const ParticipantItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  ${responsive.mobile(css`
    gap: 12px;
    padding: 12px;
  `)}
`;

export const ParticipantAvatar = styled.img<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '40px' : '48px')};
  height: ${({ $isMobile }) => ($isMobile ? '40px' : '48px')};
  border-radius: 50%;
  object-fit: cover;

  ${responsive.mobile(css`
    width: 40px;
    height: 40px;
  `)}
`;

export const ParticipantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ParticipantName = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const ParticipantMeta = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '13px')};
  color: ${({ theme }) => theme.colors.text.secondary};

  ${responsive.mobile(css`
    font-size: 12px;
  `)}
`;

export const CurrentUserBadge = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '10px' : '11px')};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-left: 6px;
  background: ${({ theme }) => theme.colors.primary}10;
  padding: 2px 6px;
  border-radius: 4px;

  ${responsive.mobile(css`
    font-size: 10px;
  `)}
`;

export const LocationText = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  ${responsive.mobile(css`
    font-size: 14px;
    padding: 12px;
  `)}
`;

export const LocationCard = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? '12px 14px' : '12px 14px')};
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${responsive.mobile(css`
    padding: 12px 14px;
  `)}
`;

export const LocationCardMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const LocationCardTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

export const LocationCardContent = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2px;
`;

export const LocationCardSubtext = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const MapFrame = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  aspect-ratio: ${({ $isMobile }) => ($isMobile ? "16 / 10" : "16 / 7")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: 12px;
  background-color: ${({ theme }) => theme.colors.gray100};
  overflow: hidden;

  ${responsive.mobile(css`
    aspect-ratio: 16 / 10;
  `)}
`;

export const MapButton = styled.button<{ $isMobile: boolean }>`
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  ${responsive.mobile(css`
    font-size: 14px;
    padding: 12px;
  `)}
`;

export const PrecautionsList = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '10px')};

  ${responsive.mobile(css`
    gap: 8px;
  `)}
`;

export const PrecautionItem = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
  padding-left: 8px;

  ${responsive.mobile(css`
    font-size: 13px;
  `)}
`;

export const BottomTabBar = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: ${({ $isMobile }) => ($isMobile ? '6px 0 calc(6px + env(safe-area-inset-bottom))' : '8px 0')};
  z-index: 100;
  flex-shrink: 0;
  min-height: ${({ $isMobile }) => ($isMobile ? '56px' : '64px')};

  ${responsive.mobile(css`
    padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
    min-height: calc(56px + env(safe-area-inset-bottom));
  `)}
`;

export const TabButton = styled.button<{ $active: boolean; $isMobile: boolean; $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  padding: ${({ $isMobile }) => ($isMobile ? '8px 16px' : '12px 20px')};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex: 1;
  max-width: 100px;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  color: ${({ $active, $disabled, theme }) =>
    $disabled 
      ? theme.colors.text.disabled 
      : $active 
        ? theme.colors.primary 
        : theme.colors.text.secondary};

  ${responsive.mobile(css`
    padding: 8px 16px;
  `)}
`;

export const TabLabel = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '11px' : '12px')};
  font-weight: 500;

  ${responsive.mobile(css`
    font-size: 11px;
  `)}
`;

// 출석체크 관련 스타일
export const AttendanceSection = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${responsive.mobile(css`
    padding: 16px;
    margin-bottom: 16px;
  `)}
`;

export const AttendanceButton = styled.button<{ 
  $isMobile: boolean; 
  $variant: 'host' | 'participant';
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? '14px 20px' : '16px 24px')};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  transition: all 0.2s ease;

  ${({ $variant, theme }) => {
    if ($variant === 'host') {
      return css`
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
      `;
    } else {
      return css`
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
      `;
    }
  }}

  ${responsive.mobile(css`
    padding: 14px 20px;
    font-size: 14px;
  `)}
`;

export const AttendanceStatus = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${({ $isMobile }) => ($isMobile ? '8px 12px' : '10px 16px')};
  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
  font-weight: 600;
  margin-top: 12px;

  ${responsive.mobile(css`
    padding: 8px 12px;
    font-size: 13px;
  `)}
`;

export const AttendanceTimer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '13px')};
  margin-top: 8px;

  ${responsive.mobile(css`
    font-size: 12px;
  `)}
`;

// QR 코드 모달 스타일
export const QRModal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
`;

export const QRModalContent = styled.div<{ $isMobile: boolean; $show?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ $isMobile }) => ($isMobile ? '24px' : '32px')};
  width: ${({ $isMobile }) => ($isMobile ? '90%' : '400px')};
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: ${({ $show }) => ($show ? 'scale(1)' : 'scale(0.9)')};
  transition: transform 0.3s ease;

  ${responsive.mobile(css`
    padding: 24px;
    width: 90%;
  `)}
`;

export const QRModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const QRModalTitle = styled.h3<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '18px' : '20px')};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;

  ${responsive.mobile(css`
    font-size: 18px;
  `)}
`;

export const QRModalCloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 400px; /* 버튼 영역 포함한 고정 높이 */
`;

export const QRCodeCanvas = styled.canvas`
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const QRCodeImage = styled.img`
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const QRCodeInfo = styled.div<{ $isMobile: boolean }>`
  text-align: center;
  padding: 16px;
  background: ${({ theme }) => theme.colors.primary}10;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  min-height: 80px; /* 고정 높이로 모달 크기 변동 방지 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  p {
    margin: 0 0 8px 0;
    font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.4;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }

  ${responsive.mobile(css`
    padding: 14px;
    min-height: 70px;
    
    p {
      font-size: 13px;
    }
  `)}
`;

export const QRButtonContainer = styled.div`
  width: 100%;
  height: 64px; /* 고정 높이로 버튼 영역 확보 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

export const QRRefreshButton = styled.button<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 48px; /* 고정 높이 */
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '14px')};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0; /* 버튼 크기 변경 방지 */

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  ${responsive.mobile(css`
    height: 44px;
    padding: 12px;
    font-size: 14px;
  `)}
`;

export const LoadingSpinner = styled.div`
  width: 200px;
  height: 200px;
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gray50};
  
  &::after {
    content: '';
    width: 32px;
    height: 32px;
    border: 3px solid ${({ theme }) => theme.colors.primary}30;
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const QRCodeSkeleton = styled.div`
  width: 200px;
  height: 200px;
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: white;
  position: relative;
  overflow: hidden;
  
  /* 왼쪽 상단 finder 패턴 */
  &::before {
    content: '';
    position: absolute;
    top: 16px;
    left: 16px;
    width: 32px;
    height: 32px;
    border: 4px solid rgba(0, 171, 191, 0.4);
    border-radius: 2px;
    
    /* 내부 정사각형 */
    background: 
      radial-gradient(circle at 16px 16px, rgba(0, 171, 191, 0.6) 6px, transparent 6px);
  }
  
  /* 오른쪽 상단 finder 패턴 */
  &::after {
    content: '';
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border: 4px solid rgba(0, 171, 191, 0.4);
    border-radius: 2px;
    
    /* 내부 정사각형 */
    background: 
      radial-gradient(circle at 16px 16px, rgba(0, 171, 191, 0.6) 6px, transparent 6px);
  }
  
  /* QR 코드 패턴 시뮬레이션 */
  background-image: 
    /* 왼쪽 하단 finder 패턴 - 큰 테두리 */
    linear-gradient(rgba(0, 171, 191, 0.4) 0%, rgba(0, 171, 191, 0.4) 100%),
    /* 왼쪽 하단 finder 패턴 - 내부 */
    radial-gradient(circle at 32px 168px, rgba(0, 171, 191, 0.6) 6px, transparent 6px),
    
    /* 데이터 도트들 - 더 많고 작게 */
    radial-gradient(circle at 70px 40px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 80px 50px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 90px 60px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 100px 70px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 110px 80px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 120px 90px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 130px 100px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 140px 110px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 150px 120px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 160px 130px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    
    /* 추가 도트들 */
    radial-gradient(circle at 60px 90px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 75px 105px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 95px 125px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 115px 145px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 135px 165px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    
    /* 세로 패턴 */
    radial-gradient(circle at 70px 120px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 70px 140px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 70px 160px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    
    /* 가로 패턴 */
    radial-gradient(circle at 120px 70px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 140px 70px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    radial-gradient(circle at 160px 70px, rgba(0, 171, 191, 0.3) 2px, transparent 2px),
    
    /* shimmer 효과 */
    linear-gradient(45deg, 
      transparent 0%, 
      rgba(0, 171, 191, 0.05) 40%, 
      rgba(0, 171, 191, 0.15) 50%, 
      rgba(0, 171, 191, 0.05) 60%, 
      transparent 100%);
  
  background-size: 
    32px 32px, /* 왼쪽 하단 finder 테두리 */
    200px 200px, /* 왼쪽 하단 finder 내부 */
    200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px,
    200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px,
    200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px,
    200px 200px, 200px 200px, 200px 200px,
    200px 200px, 200px 200px, 200px 200px,
    400% 400%;
  
  background-position:
    16px 152px, /* 왼쪽 하단 finder 테두리 위치 */
    0 0, /* 왼쪽 하단 finder 내부 */
    0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0,
    0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0,
    -200% -200%;
  
  animation: qr-shimmer 3s ease-in-out infinite;
  
  @keyframes qr-shimmer {
    0% { 
      background-position:
        16px 152px, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0,
        0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0,
        -200% -200%;
    }
    100% { 
      background-position:
        16px 152px, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0,
        0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0,
        200% 200%;
    }
  }
`;

// 카메라 스캔 모달 스타일
export const CameraModal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

export const CameraContainer = styled.div<{ $isMobile: boolean }>`
  position: relative;
  width: ${({ $isMobile }) => ($isMobile ? '90%' : '60%')};
  max-width: 500px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

  ${responsive.mobile(css`
    width: 95%;
  `)}
`;

export const CameraHeader = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  h3 {
    margin: 0;
    font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
    font-weight: 700;
  }

  ${responsive.mobile(css`
    padding: 16px;
    
    h3 {
      font-size: 16px;
    }
  `)}
`;

export const CameraCloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const CameraViewContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.black};
`;

export const CameraVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CameraCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
`;

export const ScanningOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  pointer-events: none;
`;

export const ScanningFrame = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '200px' : '250px')};
  height: ${({ $isMobile }) => ($isMobile ? '200px' : '250px')};
  border: 3px dashed rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  position: relative;
  margin-bottom: 20px;

  ${responsive.mobile(css`
    width: 200px;
    height: 200px;
  `)}
`;

export const ScanningText = styled.p<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  font-weight: 600;
  text-align: center;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const CameraInstructions = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  background: ${({ theme }) => theme.colors.gray50};
  text-align: center;
  
  p {
    margin: 0 0 8px 0;
    font-size: ${({ $isMobile }) => ($isMobile ? '13px' : '14px')};
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.4;
  }
  
  strong {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${responsive.mobile(css`
    padding: 16px;
    
    p {
      font-size: 13px;
    }
  `)}
`;