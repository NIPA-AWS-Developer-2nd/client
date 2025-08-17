import { useState } from 'react';
import { uploadMissionVerificationToS3 } from '../utils/s3Upload';

interface UploadState {
  isUploading: boolean;
  error: string | null;
  uploadedUrl: string | null;
}

interface UploadParams {
  missionId: string;
  meetingId: string;
  stepIndex: number;
}

export const useMissionVerificationUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    error: null,
    uploadedUrl: null,
  });

  const uploadImage = async (file: File, params: UploadParams): Promise<string | null> => {
    setUploadState({
      isUploading: true,
      error: null,
      uploadedUrl: null,
    });

    try {
      const uploadedUrl = await uploadMissionVerificationToS3(
        file,
        params.missionId,
        params.meetingId,
        params.stepIndex
      );

      setUploadState({
        isUploading: false,
        error: null,
        uploadedUrl,
      });

      return uploadedUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.';
      
      setUploadState({
        isUploading: false,
        error: errorMessage,
        uploadedUrl: null,
      });

      return null;
    }
  };

  const resetState = () => {
    setUploadState({
      isUploading: false,
      error: null,
      uploadedUrl: null,
    });
  };

  return {
    ...uploadState,
    uploadImage,
    resetState,
  };
};