import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import {
  Award,
  Clock,
  Timer,
  Image,
  UserCheck,
  // MapPin,
  // ChevronRight,
} from "lucide-react";
import type { MissionInfoProps } from "../types";

const InfoSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 20px" : "24px 28px")};
  margin-bottom: 32px;
`;

const InfoTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 20px 0;
`;

const InfoGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  padding: 0 ${({ $isMobile }) => ($isMobile ? "12px" : "12px")};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  position: relative;
`;

const InfoLabel = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  z-index: 1;
  background: ${({ theme }) => theme.colors.gray50};
  padding-right: 8px;
`;

const InfoValue = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  z-index: 1;
  background: ${({ theme }) => theme.colors.gray50};
  padding-left: 8px;
`;

const DottedLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-image: radial-gradient(
    circle,
    ${({ theme }) => theme.colors.gray400} 1px,
    transparent 1px
  );
  background-size: 8px 1px;
  background-repeat: repeat-x;
  z-index: 0;
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const _LocationSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 20px" : "24px 28px")};
  margin-bottom: 32px;
`;

const _LocationTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 20px 0;
`;

const _LocationInfo = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const _LocationText = styled.div<{ $isMobile?: boolean }>`
  flex: 1;
`;

const _LocationName = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const _LocationDistrict = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const _MapFrame = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  height: ${({ $isMobile }) => ($isMobile ? "200px" : "250px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  overflow: hidden;
  margin-bottom: 12px;
  background: ${({ theme }) => theme.colors.gray100};
`;

const _MapButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: object) => object;
        LatLng: new (lat: number, lng: number) => object;
        Marker: new (options: object) => object;
        Position: { TOP_RIGHT: string };
      };
    };
  }
}

export const MissionInfo: React.FC<MissionInfoProps> = ({
  mission,
  isMobile,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 미션에 지역 정보가 있는지 확인
  const hasLocationInfo = mission.district?.districtId || mission.location;

  // 네이버 지도 API 로드
  useEffect(() => {
    if (!hasLocationInfo) return;

    if (window.naver && window.naver.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${
      import.meta.env.VITE_NAVER_MAP_CLIENT_ID || "YOUR_CLIENT_ID"
    }`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      console.error("네이버 지도 API 로드 실패");
      setMapLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [hasLocationInfo]);

  // 지도 초기화
  useEffect(() => {
    if (
      mapLoaded &&
      mapRef.current &&
      window.naver &&
      window.naver.maps &&
      hasLocationInfo
    ) {
      try {
        // 기본 좌표 (송파구)
        const defaultLat = 37.5145;
        const defaultLng = 127.1056;

        const mapOptions = {
          center: new window.naver.maps.LatLng(defaultLat, defaultLng),
          zoom: mission.location ? 16 : 14,
          minZoom: 7,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);

        // 마커 추가
        const markerTitle =
          mission.location ||
          (mission.district
            ? `${mission.district.city} ${mission.district.districtName}`
            : "활동 지역");

        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(defaultLat, defaultLng),
          map: map,
          title: markerTitle,
        });
      } catch (error) {
        console.error("네이버 지도 초기화 실패:", error);
      }
    }
  }, [mapLoaded, mission, hasLocationInfo]);

  const _handleMapButtonClick = () => {
    const location =
      mission.location ||
      (mission.district
        ? `${mission.district.city} ${mission.district.districtName}`
        : "활동 지역");
    const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(
      location
    )}`;
    window.open(naverMapUrl, "_blank");
  };

  return (
    <>
      <InfoSection $isMobile={isMobile}>
        <InfoTitle $isMobile={isMobile}>미션 요약</InfoTitle>
        <InfoGrid $isMobile={isMobile}>
          <InfoRow>
            <DottedLine />
            <InfoLabel $isMobile={isMobile}>
              <InfoIcon>
                <Award size={16} />
              </InfoIcon>
              획득 포인트
            </InfoLabel>
            <InfoValue $isMobile={isMobile}>{mission.point}P</InfoValue>
          </InfoRow>
          <InfoRow>
            <DottedLine />
            <InfoLabel $isMobile={isMobile}>
              <InfoIcon>
                <Clock size={16} />
              </InfoIcon>
              예상 소요시간
            </InfoLabel>
            <InfoValue $isMobile={isMobile}>{mission.duration}분</InfoValue>
          </InfoRow>
          <InfoRow>
            <DottedLine />
            <InfoLabel $isMobile={isMobile}>
              <InfoIcon>
                <Timer size={16} />
              </InfoIcon>
              최소 참여시간
            </InfoLabel>
            <InfoValue $isMobile={isMobile}>{mission.minDuration}분</InfoValue>
          </InfoRow>
          <InfoRow>
            <DottedLine />
            <InfoLabel $isMobile={isMobile}>
              <InfoIcon>
                <Image size={16} />
              </InfoIcon>
              업로드 사진 수
            </InfoLabel>
            <InfoValue $isMobile={isMobile}>
              {mission.minPhotoCount}장 이상
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <DottedLine />
            <InfoLabel $isMobile={isMobile}>
              <InfoIcon>
                <UserCheck size={16} />
              </InfoIcon>
              참여 인원
            </InfoLabel>
            <InfoValue $isMobile={isMobile}>{mission.participants}명</InfoValue>
          </InfoRow>
        </InfoGrid>
      </InfoSection>
    </>
  );
};
