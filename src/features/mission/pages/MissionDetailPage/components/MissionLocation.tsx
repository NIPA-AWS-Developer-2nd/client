import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { MapPin, ChevronRight } from "lucide-react";
import type { MissionWithDetails } from "../../../../../shared/store/missionStore";

const LocationSection = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "20px 20px" : "24px 28px")};
  margin-bottom: 32px;
`;

const LocationTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 20px 0;
`;

const LocationInfo = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const LocationText = styled.div<{ $isMobile?: boolean }>`
  flex: 1;
`;

const LocationName = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const LocationDistrict = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "14px")};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MapFrame = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  height: ${({ $isMobile }) => ($isMobile ? "200px" : "250px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  overflow: hidden;
  margin-bottom: 12px;
  background: ${({ theme }) => theme.colors.gray100};
`;

const MapButton = styled.button`
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

interface MissionLocationProps {
  mission: MissionWithDetails;
  isMobile: boolean;
}

export const MissionLocation: React.FC<MissionLocationProps> = ({
  mission,
  isMobile,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 미션에 지역 정보가 있는지 확인
  const hasLocationInfo = mission.district?.districtId || mission.location;

  // 네이버 지도 API 로드
  useEffect(() => {
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
  }, []);

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
        const markerTitle = mission.location || 
          (mission.district ? 
            `${mission.district.city} ${mission.district.districtName}` : 
            "활동 지역");
        
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

  // 지역 정보가 없으면 컴포넌트를 렌더링하지 않음
  if (!hasLocationInfo) {
    return null;
  }

  const handleMapButtonClick = () => {
    const location = mission.location || 
      (mission.district ? 
        `${mission.district.city} ${mission.district.districtName}` : 
        "활동 지역");
    const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(location)}`;
    window.open(naverMapUrl, "_blank");
  };

  return (
    <LocationSection $isMobile={isMobile}>
      <LocationTitle $isMobile={isMobile}>활동 위치</LocationTitle>
      
      <LocationInfo $isMobile={isMobile}>
        <MapPin size={20} color="#6366F1" />
        <LocationText>
          <LocationName $isMobile={isMobile}>
            {mission.location || "상세 장소 미정"}
          </LocationName>
          <LocationDistrict $isMobile={isMobile}>
            {mission.district ? 
              `${mission.district.city} ${mission.district.districtName}` : 
              "지역 정보 없음"}
          </LocationDistrict>
        </LocationText>
      </LocationInfo>

      <MapFrame ref={mapRef} $isMobile={isMobile} />

      <MapButton onClick={handleMapButtonClick}>
        네이버 지도에서 보기 <ChevronRight size={16} />
      </MapButton>
    </LocationSection>
  );
};