import React, { useState } from "react";
import QRCode from "qrcode";
import styled from "styled-components";

const TestContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  max-width: 300px;
`;

const TestTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
`;

const TestInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 13px;
`;

const TestButton = styled.button`
  width: 100%;
  padding: 8px;
  background: #00abbf;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  margin-bottom: 12px;

  &:hover {
    background: #008a99;
  }
`;

const QRDisplay = styled.div`
  text-align: center;
  margin-top: 12px;

  img {
    width: 150px;
    height: 150px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #000;
  }
`;

interface QRTestHelperProps {
  onClose: () => void;
}

export const QRTestHelper: React.FC<QRTestHelperProps> = ({ onClose }) => {
  const [qrToken, setQrToken] = useState(
    "ATTENDANCE:01K2P1ZMAJYSY27PMEDBM4X7DS"
  );
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);

  const generateTestQR = async () => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrToken, {
        width: 150,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeImage(qrCodeDataUrl);
    } catch (error) {
      console.error("QR 코드 생성 실패:", error);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(qrToken);
    alert("토큰이 클립보드에 복사되었습니다!");
  };

  return (
    <TestContainer>
      <CloseButton onClick={onClose}>×</CloseButton>
      <TestTitle>🧪 QR 코드 테스트 도구</TestTitle>

      <TestInput
        type="text"
        value={qrToken}
        onChange={(e) => setQrToken(e.target.value)}
        placeholder="QR 토큰 입력"
      />

      <TestButton onClick={generateTestQR}>QR 코드 생성</TestButton>

      <TestButton onClick={copyToken}>토큰 복사</TestButton>

      {qrCodeImage && (
        <QRDisplay>
          <img src={qrCodeImage} alt="테스트 QR 코드" />
          <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            참가자용 카메라로 스캔해보세요!
          </div>
        </QRDisplay>
      )}
    </TestContainer>
  );
};
