import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import jsQR from 'jsqr';
import { deviceDetection } from '../../utils/deviceDetection';

const ScannerContainer = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  width: 100%;
  max-width: 400px;
  background: #000;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const VideoElement = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;

const ScannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const ScannerFrame = styled.div`
  width: 200px;
  height: 200px;
  border: 2px solid #fff;
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const ErrorMessage = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
  text-align: center;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
`;

const LoadingMessage = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '40px 16px' : '50px 20px')};
  text-align: center;
  color: white;
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
`;

interface QRCodeScannerProps {
  onScan: (qrCodeToken: string) => void;
  onClose: () => void;
  isActive: boolean;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScan,
  onClose,
  isActive,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = deviceDetection.isMobile();

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 후면 카메라 사용
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
          startScanning();
        };
      }
    } catch (err) {
      console.error('카메라 접근 실패:', err);
      setError('카메라에 접근할 수 없습니다. 권한을 확인해주세요.');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startScanning = () => {
    if (!canvasRef.current || !videoRef.current) return;

    scanIntervalRef.current = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      // 비디오가 준비되지 않았으면 스킵
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // jsQR로 QR 코드 감지
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        onScan(code.data);
        stopCamera();
      }
    }, 100); // 더 빠른 스캔을 위해 100ms로 변경
  };

  return (
    <ScannerContainer $isMobile={isMobile}>
      <CloseButton onClick={onClose}>
        <X size={20} />
      </CloseButton>

      {isLoading && (
        <LoadingMessage $isMobile={isMobile}>
          카메라를 준비 중입니다...
        </LoadingMessage>
      )}

      {error && (
        <ErrorMessage $isMobile={isMobile}>
          {error}
        </ErrorMessage>
      )}

      {!error && (
        <>
          <VideoElement
            ref={videoRef}
            playsInline
            muted
            style={{ display: isLoading ? 'none' : 'block' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {!isLoading && (
            <ScannerOverlay>
              <ScannerFrame />
            </ScannerOverlay>
          )}
        </>
      )}
    </ScannerContainer>
  );
};