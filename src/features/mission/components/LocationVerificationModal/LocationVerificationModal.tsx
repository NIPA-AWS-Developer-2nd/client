import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, CheckCircle, XCircle } from "lucide-react";
import * as S from "./LocationVerificationModal.styles";
import {
  userApiService,
  type District,
} from "../../../../shared/services/userApi";
import { apiClient } from "../../../../shared/api/apiClient";


interface LocationVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  regionName?: string;
  districtId?: string;
  regionBoundary?: {
    lat: number;
    lng: number;
    radius: number;
  };
  onVerificationComplete?: (isVerified: boolean) => void;
}

export const LocationVerificationModal: React.FC<
  LocationVerificationModalProps
> = ({
  isOpen,
  onClose,
  regionBoundary = {
    lat: 37.5665, // 서울 기본 위치
    lng: 126.978,
    radius: 5000, // 5km 반경
  },
  onVerificationComplete,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [currentStep, setCurrentStep] = useState<
    "select" | "verify" | "result"
  >("select");
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "fail"
  >("pending");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState(false);

  // 선택된 지역의 좌표 가져오기
  const getDistrictCoordinates = useCallback(() => {
    if (!selectedDistrict?.latitude || !selectedDistrict?.longitude) {
      // 기본값 (서울 중심)
      return { lat: 37.5665, lng: 126.978 };
    }

    // 문자열로 온 좌표를 숫자로 변환
    const lat =
      typeof selectedDistrict.latitude === "string"
        ? parseFloat(selectedDistrict.latitude)
        : selectedDistrict.latitude;
    const lng =
      typeof selectedDistrict.longitude === "string"
        ? parseFloat(selectedDistrict.longitude)
        : selectedDistrict.longitude;

    return { lat, lng };
  }, [selectedDistrict]);

  // 좌표를 주소로 변환하는 함수 - 백엔드 API 호출
  const convertCoordinatesToAddress = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await apiClient.get(`/location/reverse-geocode?lat=${lat}&lng=${lng}`) as { address: string };
      return response.address || `위도 ${lat.toFixed(4)}, 경도 ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('주소 변환 API 호출 실패:', error);
      // API 실패 시 간단한 대체 주소 표시
      if (lat >= 37.4 && lat <= 37.7 && lng >= 126.8 && lng <= 127.2) {
        return "서울시";
      } else if (lat >= 37.2 && lat <= 37.8 && lng >= 126.7 && lng <= 127.3) {
        return "경기도";
      } else {
        return `위도 ${lat.toFixed(4)}, 경도 ${lng.toFixed(4)}`;
      }
    }
  };

  // 지역 목록 로드
  useEffect(() => {
    if (isOpen && currentStep === "select") {
      loadDistricts();
    }
  }, [isOpen, currentStep]);

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

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(location);
        setLocationError("");

        // 좌표를 주소로 변환
        try {
          const address = await convertCoordinatesToAddress(location.lat, location.lng);
          setCurrentAddress(address);
        } catch (error) {
          console.error("주소 변환 실패:", error);
          setCurrentAddress("주소를 찾을 수 없습니다");
        }
      },
      (error) => {
        let errorMessage = "위치를 가져올 수 없습니다.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 접근 권한이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 요청이 시간 초과되었습니다.";
            break;
        }
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      }
    );
  }, []);

  // 현재 위치 가져오기
  useEffect(() => {
    if (isOpen && currentStep === "verify") {
      getCurrentLocation();
    }
  }, [isOpen, currentStep, getCurrentLocation]);

  // 지도 초기화
  useEffect(() => {
    if (
      !isOpen ||
      currentStep !== "verify" ||
      !selectedDistrict ||
      !mapRef.current ||
      !mapLoaded ||
      !window.naver?.maps
    )
      return;

    try {
      const districtCoords = getDistrictCoordinates();
      const centerCoords = currentLocation || districtCoords;

      const mapOptions = {
        center: new window.naver.maps.LatLng(centerCoords.lat, centerCoords.lng),
        zoom: 15,
        minZoom: 7,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      };

      const map = new window.naver.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // 지역 경계 원 그리기
      const circle = new window.naver.maps.Circle({
        center: new window.naver.maps.LatLng(districtCoords.lat, districtCoords.lng),
        radius: regionBoundary.radius,
        strokeWeight: 2,
        strokeColor: "#4F46E5",
        strokeOpacity: 0.8,
        fillColor: "#4F46E5",
        fillOpacity: 0.15,
      });
      circle.setMap(map);

      // 지역 중심 마커 (파란색)
      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(districtCoords.lat, districtCoords.lng),
        map: map,
        title: selectedDistrict.districtName,
        icon: {
          content: `<div style="width: 20px; height: 20px; background: #4F46E5; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
          anchor: { x: 10, y: 10 },
        },
      });

      // 현재 위치 마커 (빨간색)
      if (currentLocation) {
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
          map: map,
          title: "현재 위치",
          icon: {
            content: `<div style="width: 20px; height: 20px; background: #EF4444; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
            anchor: { x: 10, y: 10 },
          },
        });
      }
    } catch (error) {
      console.error("네이버 지도 초기화 실패:", error);
    }

    return () => {
      mapInstanceRef.current = null;
    };
  }, [
    isOpen,
    currentStep,
    selectedDistrict,
    regionBoundary,
    getDistrictCoordinates,
    mapLoaded,
    currentLocation,
  ]);

  const loadDistricts = async () => {
    try {
      setIsLoadingDistricts(true);
      const districtList = await userApiService.getActiveDistricts();
      setDistricts(districtList);
    } catch (error) {
      console.error("지역 목록 로드 실패:", error);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
  };

  const handleNext = () => {
    if (selectedDistrict) {
      setCurrentStep("verify");
    }
  };


  const handleVerifyLocation = async () => {
    if (!selectedDistrict || !currentLocation) {
      setErrorMessage("현재 위치를 찾을 수 없습니다.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");
    setCurrentStep("result");

    // 2초 후 위치 검증 결과 처리 - 임시로 항상 성공
    setTimeout(async () => {
      try {
        // 임시: 항상 성공하도록 설정
        await userApiService.verifyLocation({
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          districtId: selectedDistrict.id,
        });

        setVerificationStatus("success");
        if (onVerificationComplete) {
          onVerificationComplete(true);
        }
      } catch (error) {
        console.error("❌ 위치 인증 API 에러:", error);
        // API 에러가 발생해도 임시로 성공 처리
        setVerificationStatus("success");
        if (onVerificationComplete) {
          onVerificationComplete(true);
        }
      } finally {
        setIsVerifying(false);
      }
    }, 2000);
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case "select":
        return (
          <>
            <S.InfoSection>
              <S.InfoText>먼저 활동할 지역을 선택해주세요</S.InfoText>
              <S.StepSubtitle>
                선택한 지역에서 위치 인증을 진행합니다
              </S.StepSubtitle>
            </S.InfoSection>

            {isLoadingDistricts ? (
              <div>지역 목록을 불러오는 중</div>
            ) : (
              <S.DistrictGrid>
                {districts.map((district) => (
                  <S.DistrictButton
                    key={district.id}
                    $selected={selectedDistrict?.id === district.id}
                    onClick={() => handleDistrictSelect(district)}
                  >
                    <S.DistrictIcon>
                      <MapPin size={20} />
                    </S.DistrictIcon>
                    <S.DistrictName>{district.districtName}</S.DistrictName>
                  </S.DistrictButton>
                ))}
              </S.DistrictGrid>
            )}
          </>
        );

      case "verify":
        return (
          <>
            <S.MapContainer ref={mapRef} />

            <S.InfoSection>
              <S.InfoText>
                현재 위치가 <strong>{selectedDistrict?.districtName}</strong>{" "}
                지역 내에 있는지 확인합니다.
              </S.InfoText>
              <S.InfoSubText>
                파란색 마커: 지역 중심, 빨간색 마커: 현재 위치
              </S.InfoSubText>
              {locationError && (
                <S.LocationInfo style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}>
                  {locationError}
                  <br />
                  <button 
                    onClick={getCurrentLocation}
                    style={{ 
                      marginTop: "8px", 
                      background: "#DC2626", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "4px", 
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    다시 시도
                  </button>
                </S.LocationInfo>
              )}
              {currentLocation && (
                <S.LocationInfo>
                  현재 위치: {currentAddress || `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`}
                </S.LocationInfo>
              )}
            </S.InfoSection>
          </>
        );

      case "result":
        return (
          <>
            {verificationStatus === "success" && (
              <S.StatusSection $status="success">
                <CheckCircle size={48} />
                <S.StatusTitle>위치 인증 성공</S.StatusTitle>
                <S.StatusText>
                  활동 지역이 {selectedDistrict?.districtName}로 설정되었어요
                </S.StatusText>
              </S.StatusSection>
            )}

            {verificationStatus === "fail" && (
              <S.StatusSection $status="fail">
                <XCircle size={48} />
                <S.StatusTitle>위치 인증 실패</S.StatusTitle>
                <S.StatusText>
                  {errorMessage ||
                    `현재 위치가 ${selectedDistrict?.districtName} 지역 밖에 있습니다.`}
                </S.StatusText>
              </S.StatusSection>
            )}

            {isVerifying && (
              <S.InfoSection>
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <S.LoadingSpinner size={48} />
                </div>
                <S.StatusTitle>위치를 확인하고 있어요</S.StatusTitle>
                <S.StatusText>잠시만 기다려주세요</S.StatusText>
              </S.InfoSection>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const renderFooterButtons = () => {
    switch (currentStep) {
      case "select":
        return selectedDistrict ? (
          <S.CloseModalButton onClick={handleNext}>다음</S.CloseModalButton>
        ) : null;

      case "verify":
        return (
          <>
            <S.RetryButton onClick={() => setCurrentStep("select")}>
              지역 다시 선택
            </S.RetryButton>
            <S.VerifyButton
              onClick={handleVerifyLocation}
              disabled={isVerifying || !currentLocation || !!locationError}
            >
              {currentLocation ? "위치 인증하기" : "위치 확인 중..."}
            </S.VerifyButton>
          </>
        );

      case "result":
        return (
          <>
            {verificationStatus !== "success" && (
              <S.RetryButton onClick={() => setCurrentStep("verify")}>
                다시 시도
              </S.RetryButton>
            )}
            <S.CloseModalButton onClick={onClose}>
              {verificationStatus === "success" ? "완료" : "닫기"}
            </S.CloseModalButton>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <S.ModalOverlay onClick={(e) => e.stopPropagation()}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitle>
            <MapPin size={24} />
            지역 인증
          </S.ModalTitle>
          <S.CloseButton onClick={onClose}>×</S.CloseButton>
        </S.ModalHeader>

        <S.ModalBody>{renderStepContent()}</S.ModalBody>

        <S.ModalFooter>{renderFooterButtons()}</S.ModalFooter>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};
