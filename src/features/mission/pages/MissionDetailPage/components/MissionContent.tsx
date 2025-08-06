import React from "react";
import styled from "styled-components";
import { Camera, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageModal } from "../../../../../shared/components/common/ImageModal";
import { useImageModal } from "../../../../../shared/hooks/useImageModal";
import type { MissionContentProps } from "../types";

const SectionTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 16px 0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    margin-left: 16px;
    height: 1px;
    background: ${({ theme }) => theme.colors.gray200};
    opacity: 0.5;
    width: calc(100% - ${({ $isMobile }) => ($isMobile ? "120px" : "140px")});
  }
`;

const DescriptionText = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0 0 32px 0;
`;

const GuideSection = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: 32px;
`;

const GuideText = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const GalleryContainer = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  z-index: 1;
  overflow: hidden;
  
  ${({ $isMobile }) => !$isMobile && `
    /* 데스크톱에서 버튼 공간 확보 */
    padding: 0 70px;
  `}
  
  ${({ $isMobile }) => $isMobile && `
    /* 모바일에서 버튼 공간 확보 */
    padding: 0 50px;
  `}

  /* 좌우 페이드아웃 그라데이션 효과 */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: ${({ $isMobile }) => $isMobile ? '15px' : '20px'};
    z-index: 50;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, 
      ${({ theme }) => theme.colors.background || '#ffffff'} 0%, 
      ${({ theme }) => theme.colors.background || '#ffffff'}40 50%,
      ${({ theme }) => theme.colors.background || '#ffffff'}10 85%,
      transparent 100%
    );
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, 
      ${({ theme }) => theme.colors.background || '#ffffff'} 0%, 
      ${({ theme }) => theme.colors.background || '#ffffff'}40 50%,
      ${({ theme }) => theme.colors.background || '#ffffff'}10 85%,
      transparent 100%
    );
  }
`;

const GuideImages = styled.div<{ $isMobile?: boolean; $imageCount?: number }>`
  display: flex;
  position: relative;
  z-index: 1;
  
  /* 데스크톱: 슬라이드 애니메이션 */
  ${({ $isMobile }) => !$isMobile && `
    gap: 20px;
    transition: transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
    width: 100%;
  `}
  
  /* 모바일: 슬라이드 애니메이션 */
  ${({ $isMobile }) => $isMobile && `
    gap: 12px;
    transition: transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
    width: 100%;
  `}
`;


const GuideImageContainer = styled.div<{ $isMobile?: boolean; $hasImage?: boolean }>`
  /* 모바일: 전체 너비, 데스크톱: 50% 너비 - 크기 증가 */
  width: ${({ $isMobile }) => $isMobile ? 'calc(100% - 8px)' : 'calc(50% - 8px)'};
  min-width: ${({ $isMobile }) => $isMobile ? 'calc(100% - 8px)' : 'calc(50% - 8px)'};
  height: ${({ $isMobile }) => $isMobile ? '220px' : '200px'};
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $hasImage }) => $hasImage ? 'transparent' : theme.colors.gray200};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: ${({ $hasImage }) => $hasImage ? 'pointer' : 'default'};
  overflow: hidden;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  /* 스크롤 스냅 */
  scroll-snap-align: start;
  
  /* 데스크톱에서만 호버 효과 (터치 디바이스 제외) */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      ${({ $hasImage, theme, $isMobile }) => $hasImage && !$isMobile && `
        transform: scale(1.02);
        box-shadow: ${theme.shadows.md};
      `}
    }
  }
  
  /* 포커스 스타일 제거 */
  &:focus {
    outline: none;
    box-shadow: none;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
  
  /* 터치 디바이스에서 탭 하이라이트 제거 */
  -webkit-tap-highlight-color: transparent;
`;

const GuideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const PlaceholderText = styled.span<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '11px' : '12px')};
  font-weight: 500;
  text-align: center;
`;

const WarningSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.warning}10;
  border: 1px solid ${({ theme }) => theme.colors.warning}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: 32px;
`;

const WarningTitle = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.warning};
  margin-bottom: 12px;
`;

const WarningList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
`;

const DesktopNavButton = styled.button<{ $position: 'left' | 'right'; $disabled?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $position }) => $position}: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: ${({ $disabled, theme }) => $disabled 
    ? theme.colors.gray100
    : theme.colors.white
  };
  color: ${({ $disabled, theme }) => $disabled 
    ? theme.colors.gray300 
    : theme.colors.text.primary
  };
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 999;
  border: 2px solid ${({ $disabled, theme }) => $disabled 
    ? theme.colors.gray200 
    : theme.colors.gray300
  };
  
  /* 그림자로 가시성 향상 */
  box-shadow: ${({ $disabled }) => $disabled 
    ? '0 2px 4px rgba(0, 0, 0, 0.08)'
    : '0 4px 12px rgba(0, 0, 0, 0.15)'
  };

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray50};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }

  /* 포커스 아웃라인 제거 */
  &:focus {
    outline: none;
    box-shadow: ${({ $disabled }) => $disabled 
      ? '0 2px 4px rgba(0, 0, 0, 0.08)'
      : '0 4px 12px rgba(0, 0, 0, 0.15)'
    };
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileNavButton = styled.button<{ $position: 'left' | 'right'; $disabled?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $position }) => $position}: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: ${({ $disabled, theme }) => $disabled 
    ? theme.colors.gray100
    : theme.colors.white
  };
  color: ${({ $disabled, theme }) => $disabled 
    ? theme.colors.gray300 
    : theme.colors.text.primary
  };
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 999;
  border: 2px solid ${({ $disabled, theme }) => $disabled 
    ? theme.colors.gray200 
    : theme.colors.gray300
  };
  
  box-shadow: ${({ $disabled }) => $disabled 
    ? '0 2px 4px rgba(0, 0, 0, 0.08)'
    : '0 2px 8px rgba(0, 0, 0, 0.15)'
  };

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.9);
  }

  &:focus {
    outline: none;
    box-shadow: ${({ $disabled }) => $disabled 
      ? '0 2px 4px rgba(0, 0, 0, 0.08)'
      : '0 2px 8px rgba(0, 0, 0, 0.15)'
    };
  }

  @media (min-width: 1025px) {
    display: none;
  }
`;

const IndicatorContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 1px 0 2px 0;
`;

const IndicatorDot = styled.div<{ $active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.gray300
  };
  transform: ${({ $active }) => $active ? 'scale(1.2)' : 'scale(1)'};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.2);
  }
`;

const WarningItem = styled.li<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MissionContent: React.FC<MissionContentProps> = ({
  mission,
  isMobile,
}) => {
  // 샘플 이미지 데이터 (실제로는 mission.context.sampleImages에서 가져올 예정)
  // TODO: mission.context.sampleImages || [] 로 교체 필요
  const sampleImages = [
    "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg",
    "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg", 
    "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg",
    "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg",
    "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg",
    "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8df5d33d88aa9f5794fcbd4d67f57c8.jpeg"
  ];

  const { isOpen, currentIndex, openModal, closeModal, goToPrevious, goToNext } = 
    useImageModal(sampleImages.length);

  // 갤러리 네비게이션을 위한 상태
  const [desktopStartIndex, setDesktopStartIndex] = React.useState(0);
  const [mobileStartIndex, setMobileStartIndex] = React.useState(0);
  const imagesPerPage = 2; // 데스크톱에서 한 번에 보여줄 이미지 수
  const mobileImagesPerPage = 1; // 모바일에서 한 번에 보여줄 이미지 수
  const desktopMaxStartIndex = Math.max(0, sampleImages.length - imagesPerPage);
  const mobileMaxStartIndex = Math.max(0, sampleImages.length - mobileImagesPerPage);

  const handleDesktopPrevious = () => {
    setDesktopStartIndex(prev => Math.max(0, prev - imagesPerPage));
  };

  const handleDesktopNext = () => {
    setDesktopStartIndex(prev => Math.min(desktopMaxStartIndex, prev + imagesPerPage));
  };

  const handleMobilePrevious = () => {
    setMobileStartIndex(prev => Math.max(0, prev - mobileImagesPerPage));
  };

  const handleMobileNext = () => {
    setMobileStartIndex(prev => Math.min(mobileMaxStartIndex, prev + mobileImagesPerPage));
  };

  // 모바일에서만 보여줄 이미지들 (데스크톱은 모든 이미지를 렌더링하고 transform으로 제어)
  const displayImages = isMobile ? sampleImages : sampleImages;

  // 인디케이터를 위한 총 페이지 수 계산
  const totalPages = isMobile 
    ? Math.ceil(sampleImages.length / mobileImagesPerPage)
    : Math.ceil(sampleImages.length / imagesPerPage);

  // 현재 페이지 계산 (0부터 시작)
  const currentPage = isMobile 
    ? Math.floor(mobileStartIndex / mobileImagesPerPage)
    : Math.floor(desktopStartIndex / imagesPerPage);

  // 인디케이터 클릭 핸들러
  const handleIndicatorClick = (pageIndex: number) => {
    if (isMobile) {
      setMobileStartIndex(pageIndex * mobileImagesPerPage);
    } else {
      setDesktopStartIndex(pageIndex * imagesPerPage);
    }
  };


  return (
    <>
      <SectionTitle $isMobile={isMobile}>미션 소개</SectionTitle>
      <DescriptionText $isMobile={isMobile}>
        {mission.description}
      </DescriptionText>

      {mission.context && (
        <GuideSection $isMobile={isMobile}>
          <SectionTitle $isMobile={isMobile}>인증 가이드</SectionTitle>
          <GuideText $isMobile={isMobile}>
            {mission.context.photoGuide}
          </GuideText>

          <GalleryContainer $isMobile={isMobile}>
            {/* 데스크톱 네비게이션 버튼 - 이전 */}
            {!isMobile && sampleImages.length > imagesPerPage && (
              <DesktopNavButton 
                $position="left"
                $disabled={desktopStartIndex === 0}
                disabled={desktopStartIndex === 0}
                onClick={handleDesktopPrevious}
                aria-label="이전 이미지들 보기"
              >
                <ChevronLeft size={22} />
              </DesktopNavButton>
            )}

            {/* 모바일 네비게이션 버튼 - 이전 */}
            {isMobile && sampleImages.length > mobileImagesPerPage && (
              <MobileNavButton 
                $position="left"
                $disabled={mobileStartIndex === 0}
                disabled={mobileStartIndex === 0}
                onClick={handleMobilePrevious}
                aria-label="이전 이미지 보기"
              >
                <ChevronLeft size={18} />
              </MobileNavButton>
            )}
            
            <GuideImages 
              $isMobile={isMobile} 
              $imageCount={displayImages.length}
              style={isMobile ? {
                transform: `translateX(-${mobileStartIndex * 100}%)`
              } : {
                transform: `translateX(-${desktopStartIndex * (100 / imagesPerPage)}%)`
              }}
            >
              {displayImages.map((image, index) => {
                // 전체 인덱스 계산 (모달에서 사용)
                const globalIndex = index;
                
                return (
                  <GuideImageContainer 
                    key={globalIndex}
                    $isMobile={isMobile}
                    $hasImage={!!image}
                    onClick={() => image && openModal(globalIndex)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && image) {
                        e.preventDefault();
                        openModal(globalIndex);
                      }
                    }}
                    tabIndex={image ? 0 : -1}
                    role={image ? 'button' : 'img'}
                    aria-label={image ? `샘플 이미지 ${globalIndex + 1} 확대보기` : `샘플 이미지 ${globalIndex + 1} 비어있음`}
                  >
                    {image ? (
                      <GuideImage 
                        src={image} 
                        alt={`샘플 이미지 ${globalIndex + 1}`}
                        loading="lazy"
                        draggable="false"
                      />
                    ) : (
                      <>
                        <Camera size={isMobile ? 24 : 28} />
                        <PlaceholderText $isMobile={isMobile}>
                          샘플 이미지 {globalIndex + 1}
                        </PlaceholderText>
                      </>
                    )}
                  </GuideImageContainer>
                );
              })}
            </GuideImages>
            
            {/* 데스크톱 네비게이션 버튼 - 다음 */}
            {!isMobile && sampleImages.length > imagesPerPage && (
              <DesktopNavButton 
                $position="right"
                $disabled={desktopStartIndex >= desktopMaxStartIndex}
                disabled={desktopStartIndex >= desktopMaxStartIndex}
                onClick={handleDesktopNext}
                aria-label="다음 이미지들 보기"
              >
                <ChevronRight size={22} />
              </DesktopNavButton>
            )}

            {/* 모바일 네비게이션 버튼 - 다음 */}
            {isMobile && sampleImages.length > mobileImagesPerPage && (
              <MobileNavButton 
                $position="right"
                $disabled={mobileStartIndex >= mobileMaxStartIndex}
                disabled={mobileStartIndex >= mobileMaxStartIndex}
                onClick={handleMobileNext}
                aria-label="다음 이미지 보기"
              >
                <ChevronRight size={18} />
              </MobileNavButton>
            )}
            
            {/* 인디케이터 */}
            {sampleImages.length > (isMobile ? mobileImagesPerPage : imagesPerPage) && (
              <IndicatorContainer $isMobile={isMobile}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <IndicatorDot
                    key={index}
                    $active={index === currentPage}
                    onClick={() => handleIndicatorClick(index)}
                    aria-label={`${index + 1}페이지로 이동`}
                  />
                ))}
              </IndicatorContainer>
            )}
          </GalleryContainer>
        </GuideSection>
      )}

      {mission.warnings && mission.warnings.length > 0 && (
        <WarningSection $isMobile={isMobile}>
          <WarningTitle $isMobile={isMobile}>
            <AlertTriangle size={18} />
            주의사항
          </WarningTitle>
          <WarningList>
            {mission.warnings.map((warning) => (
              <WarningItem key={warning.id} $isMobile={isMobile}>
                {warning.content}
              </WarningItem>
            ))}
          </WarningList>
        </WarningSection>
      )}

      <ImageModal
        isOpen={isOpen}
        onClose={closeModal}
        images={sampleImages}
        currentIndex={currentIndex}
        showNavigation={false}
      />
    </>
  );
};