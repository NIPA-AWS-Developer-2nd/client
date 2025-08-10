/**
 * S3 이미지 URL을 최적화된 버전으로 변환하는 유틸리티
 */

// CloudFront CDN 도메인
const CDN_URL = import.meta.env.VITE_CDN_URL || 'https://cdn.halsaram.site';

interface ImageOptimizationOptions {
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'optimized';
  format?: 'webp' | 'original';
}

/**
 * S3 URL을 CloudFront CDN URL로 변환
 * @param s3Url - S3 URL 또는 상대 경로
 * @returns CloudFront CDN URL
 */
const convertToCdnUrl = (s3Url: string): string => {
  if (!s3Url) return '';
  
  // 이미 CDN URL인 경우
  if (s3Url.includes('cdn.halsaram.site')) {
    return s3Url;
  }
  
  // S3 URL에서 path 추출
  const s3Pattern = /https?:\/\/[^/]+\.s3[^/]*\.amazonaws\.com\/(.*)/;
  const match = s3Url.match(s3Pattern);
  
  if (match) {
    // S3 URL -> CDN URL
    return `${CDN_URL}/${match[1]}`;
  }
  
  // 상대 경로인 경우
  if (s3Url.startsWith('/')) {
    return `${CDN_URL}${s3Url}`;
  }
  
  // 이미 전체 URL인 경우 그대로 반환
  return s3Url;
};

/**
 * S3 original 이미지 URL을 최적화된 버전으로 변환
 * @param originalUrl - S3 original 폴더의 이미지 URL
 * @param options - 최적화 옵션
 * @returns 최적화된 이미지 URL (CloudFront CDN)
 */
export const getOptimizedImageUrl = (
  originalUrl: string | null | undefined,
  _options: ImageOptimizationOptions = {}
): string => {
  if (!originalUrl) return '';
  
  // 먼저 CDN URL로 변환
  const cdnUrl = convertToCdnUrl(originalUrl);
  
  // 임시로 original 버전만 사용 (sizes, optimized 폴더 미사용)
  return cdnUrl;
  
  /*
  // 이미 최적화된 URL인지 확인
  if (cdnUrl.includes('/optimized/') || 
      cdnUrl.includes('/thumbnails/') || 
      cdnUrl.includes('/sizes/') ||
      cdnUrl.includes('/webp/')) {
    return cdnUrl;
  }
  
  const { size = 'optimized', format = 'original' } = options;
  
  // original/ 경로를 최적화된 경로로 변경
  let optimizedUrl = cdnUrl;
  
  if (format === 'webp') {
    // WebP 형식으로 변환
    optimizedUrl = cdnUrl
      .replace('/original/', '/webp/')
      .replace(/\.(jpg|jpeg|png)$/i, '.webp');
  } else {
    // 크기별 최적화
    switch (size) {
      case 'thumbnail':
        optimizedUrl = cdnUrl.replace('/original/', '/thumbnails/');
        break;
      case 'small':
        optimizedUrl = cdnUrl
          .replace('/original/', '/sizes/')
          .replace(/\.([^.]+)$/, '-small.$1');
        break;
      case 'medium':
        optimizedUrl = cdnUrl
          .replace('/original/', '/sizes/')
          .replace(/\.([^.]+)$/, '-medium.$1');
        break;
      case 'large':
        optimizedUrl = cdnUrl
          .replace('/original/', '/sizes/')
          .replace(/\.([^.]+)$/, '-large.$1');
        break;
      case 'optimized':
      default:
        optimizedUrl = cdnUrl.replace('/original/', '/optimized/');
        break;
    }
  }
  
  return optimizedUrl;
  */
};

/**
 * 디바이스에 따라 적절한 이미지 크기 결정
 * @param isMobile - 모바일 여부
 * @param isTablet - 태블릿 여부
 * @returns 적절한 이미지 크기
 */
export const getAppropriateImageSize = (
  isMobile: boolean,
  isTablet: boolean = false
): 'small' | 'medium' | 'large' => {
  if (isMobile) return 'small';
  if (isTablet) return 'medium';
  return 'large';
};

/**
 * Picture 엘리먼트용 srcset 생성
 * @param originalUrl - 원본 이미지 URL
 * @returns srcset 문자열
 */
export const generateSrcSet = (originalUrl: string): string => {
  if (!originalUrl) return '';
  
  const sizes = [
    { size: 'small', width: '320w' },
    { size: 'medium', width: '640w' },
    { size: 'large', width: '1024w' },
  ];
  
  return sizes
    .map(({ size, width }) => {
      const url = getOptimizedImageUrl(originalUrl, { size: size as ImageOptimizationOptions['size'] });
      return `${url} ${width}`;
    })
    .join(', ');
};

/**
 * 이미지 로딩 전략에 따른 placeholder 생성
 * @param originalUrl - 원본 이미지 URL
 * @returns placeholder URL (썸네일 사용)
 */
export const getImagePlaceholder = (originalUrl: string): string => {
  return getOptimizedImageUrl(originalUrl, { size: 'thumbnail' });
};