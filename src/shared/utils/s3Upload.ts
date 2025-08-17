import { authFetch, apiUrl } from "./api";

// CloudFront CDN 도메인
const CDN_URL = import.meta.env.VITE_CDN_URL || 'https://cdn.halsaram.site';

interface PresignedUrlResponse {
  status: number;
  message: string;
  result: boolean;
  data: {
    uploadUrl: string;
    key: string;
    publicUrl: string;
    expiresIn: number;
  };
}

interface MissionVerificationPresignedUrlResponse {
  status: number;
  message: string;
  result: boolean;
  data: {
    uploadUrl: string;
    key: string;
    publicUrl: string;
    expiresIn: number;
    metadata: {
      [key: string]: string;
    };
  };
}

/**
 * S3 URL을 CloudFront CDN URL로 변환
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
  
  // 키만 있는 경우 (예: "original/xxx.jpg")
  if (!s3Url.includes('://')) {
    return `${CDN_URL}/${s3Url}`;
  }
  
  // 이미 전체 URL인 경우 그대로 반환
  return s3Url;
};

export const uploadToS3 = async (
  file: File,
  folder: string
): Promise<string> => {
  let response: Response;

  // Content-Type 확인 및 설정
  const contentType = file.type || 'image/jpeg'; // 기본값 설정

  // 프로필 이미지인 경우 전용 엔드포인트 사용
  if (folder === 'profiles') {
    response = await authFetch(apiUrl("/s3/profile-image-presigned-url"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        contentType: contentType // Content-Type 전달
      }),
    });
  } else {
    // 다른 이미지는 기존 엔드포인트 사용
    response = await authFetch(apiUrl("/s3/presigned-url"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        folder,
        contentType: contentType // Content-Type 전달
      }),
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get presigned URL: ${response.status} ${errorText}`);
  }

  const result: PresignedUrlResponse = await response.json();

  if (!result.result) {
    throw new Error(result.message || "Failed to generate presigned URL");
  }

  const { uploadUrl, publicUrl } = result.data;

  // S3 업로드 (Content-Type 명시적으로 설정)
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": contentType, // 위에서 설정한 contentType 사용
    },
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image to S3");
  }

  // S3 URL을 CDN URL로 변환하여 반환
  return convertToCdnUrl(publicUrl);
};

export const uploadMissionVerificationToS3 = async (
  file: File,
  missionId: string,
  meetingId: string,
  stepIndex: number
): Promise<string> => {
  const contentType = file.type || 'image/jpeg';

  // 미션 인증 사진용 Presigned URL 요청
  const response = await authFetch(apiUrl("/s3/mission-verification-presigned-url"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      missionId,
      meetingId,
      stepIndex,
      contentType,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get mission verification presigned URL: ${response.status} ${errorText}`);
  }

  const result: MissionVerificationPresignedUrlResponse = await response.json();

  if (!result.result) {
    throw new Error(result.message || "Failed to generate mission verification presigned URL");
  }

  const { uploadUrl, publicUrl, metadata } = result.data;

  // S3 업로드 (메타데이터 헤더 포함)
  const headers: Record<string, string> = {
    "Content-Type": contentType,
  };

  // 메타데이터 헤더 추가
  Object.entries(metadata).forEach(([key, value]) => {
    headers[key] = value;
  });

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload mission verification image to S3");
  }

  // S3 URL을 CDN URL로 변환하여 반환
  return convertToCdnUrl(publicUrl);
};
