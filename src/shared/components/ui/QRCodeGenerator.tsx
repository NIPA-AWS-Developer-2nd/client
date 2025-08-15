import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import styled from 'styled-components';

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const QRCanvas = styled.canvas`
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  max-width: 100%;
  height: auto;
`;

const QRInfo = styled.div`
  text-align: center;
  font-size: 12px;
  color: #6b7280;
`;

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  size = 200 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      },
      (error) => {
        if (error) {
          console.error('QR 코드 생성 실패:', error);
        }
      }
    );
  }, [value, size]);

  return (
    <QRContainer>
      <QRCanvas 
        ref={canvasRef} 
        width={size} 
        height={size}
      />
      <QRInfo>
        QR 코드를 스캔하여 출석체크하세요
      </QRInfo>
    </QRContainer>
  );
};