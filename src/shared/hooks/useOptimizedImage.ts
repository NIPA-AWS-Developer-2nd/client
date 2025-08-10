import { useMemo } from 'react';
import { getOptimizedImageUrl, getAppropriateImageSize } from '../utils/imageOptimization';
import { useDeviceDetection } from './useDeviceDetection';

interface UseOptimizedImageOptions {
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'optimized';
  format?: 'webp' | 'original';
  autoSize?: boolean; // 디바이스에 따라 자동으로 크기 결정
}

/**
 * 최적화된 이미지 URL을 반환하는 훅
 * @param originalUrl - 원본 이미지 URL
 * @param options - 최적화 옵션
 * @returns 최적화된 이미지 URL
 */
export const useOptimizedImage = (
  originalUrl: string | null | undefined,
  options: UseOptimizedImageOptions = {}
) => {
  const { isMobile, isTablet } = useDeviceDetection();
  
  const optimizedUrl = useMemo(() => {
    if (!originalUrl) return '';
    
    const { autoSize = true, size, format = 'original' } = options;
    
    // 디바이스에 따라 자동으로 크기 결정
    const imageSize = autoSize 
      ? getAppropriateImageSize(isMobile, isTablet)
      : size || 'optimized';
    
    return getOptimizedImageUrl(originalUrl, { 
      size: imageSize as 'thumbnail' | 'small' | 'medium' | 'large' | 'optimized', 
      format 
    });
  }, [originalUrl, isMobile, isTablet, options]);
  
  return optimizedUrl;
};

/**
 * 프로필 이미지용 최적화 훅
 * @param profileImageUrl - 프로필 이미지 URL
 * @returns 최적화된 프로필 이미지 URL
 */
export const useProfileImage = (profileImageUrl: string | null | undefined) => {
  return useOptimizedImage(profileImageUrl, {
    autoSize: true,
    format: 'original',
  });
};

/**
 * 썸네일 이미지용 최적화 훅
 * @param imageUrl - 이미지 URL
 * @returns 썸네일 이미지 URL
 */
export const useThumbnailImage = (imageUrl: string | null | undefined) => {
  return useOptimizedImage(imageUrl, {
    size: 'thumbnail',
    autoSize: false,
  });
};