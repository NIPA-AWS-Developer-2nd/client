import React from "react";
import styled from "styled-components";
import { MapPin, Search, Navigation, X } from "lucide-react";
import type { LocationPickerProps, KakaoPlace } from "../../../types";
import { deviceDetection } from "../../../shared/utils/deviceDetection";
import { mockKakaoPlaces } from "../../../data";

const Container = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const Label = styled.label<{ $isMobile?: boolean }>`
  display: block;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const SearchContainer = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  margin-bottom: 16px;
`;

const SearchInput = styled.input<{ $isMobile?: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 40px 12px 12px" : "14px 44px 14px 16px")};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const SearchButton = styled.button<{ $isMobile?: boolean }>`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  height: ${({ $isMobile }) => ($isMobile ? "32px" : "36px")};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}DD;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const CurrentLocationButton = styled.button<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${({ $isMobile }) => ($isMobile ? "10px 16px" : "12px 20px")};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  margin-bottom: 16px;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
    transform: none;
  }
`;

const SearchResults = styled.div<{ $isMobile?: boolean; $isVisible: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top: none;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg};
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;
  display: ${({ $isVisible }) => $isVisible ? "block" : "none"};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const SearchResultItem = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }

  &:active {
    background: ${({ theme }) => theme.colors.gray100};
  }
`;

const PlaceName = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const PlaceAddress = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.3;
`;

const SelectedLocation = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  background: ${({ theme }) => theme.colors.primary}10;
  border: 2px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-top: 16px;
`;

const LocationIcon = styled.div<{ $isMobile?: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const LocationInfo = styled.div`
  flex: 1;
`;

const LocationName = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const LocationAddress = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.3;
`;

const ClearButton = styled.button<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
  height: ${({ $isMobile }) => ($isMobile ? "24px" : "28px")};
  background: ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.gray400};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NoResults = styled.div<{ $isMobile?: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
`;

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onLocationChange,
}) => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<KakaoPlace[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isGettingLocation, setIsGettingLocation] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // TODO: 실제 카카오맵 API 연동 - window.kakao.maps.services 사용
      // 현재는 목 데이터 사용
      setSearchResults(mockKakaoPlaces);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude: lat, longitude: lng } = position.coords;
      
      // TODO: 좌표를 주소로 변환하는 역지오코딩 API 호출
      const address = `현재 위치 (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
      
      onLocationChange(address, lat, lng);
      setShowResults(false);
    } catch (error) {
      console.error("Failed to get current location:", error);
      alert("현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSelectPlace = (place: KakaoPlace) => {
    const lat = parseFloat(place.y);
    const lng = parseFloat(place.x);
    const address = place.road_address_name || place.address_name;
    
    onLocationChange(`${place.place_name} (${address})`, lat, lng);
    setShowResults(false);
    setSearchQuery("");
  };

  const handleClearLocation = () => {
    onLocationChange("", 0, 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Container $isMobile={isMobile}>
      <Label $isMobile={isMobile}>
        모임 장소를 선택해주세요
      </Label>

      <CurrentLocationButton
        $isMobile={isMobile}
        onClick={handleCurrentLocation}
        disabled={isGettingLocation}
      >
        <Navigation size={16} />
        {isGettingLocation ? "현재 위치 가져오는 중..." : "현재 위치 사용"}
      </CurrentLocationButton>

      <SearchContainer $isMobile={isMobile}>
        <SearchInput
          $isMobile={isMobile}
          type="text"
          placeholder="장소명이나 주소를 검색해보세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
        />
        <SearchButton
          $isMobile={isMobile}
          onClick={handleSearch}
          disabled={isSearching}
        >
          <Search size={isMobile ? 14 : 16} />
        </SearchButton>

        <SearchResults $isMobile={isMobile} $isVisible={showResults}>
          {isSearching ? (
            <NoResults $isMobile={isMobile}>검색 중...</NoResults>
          ) : searchResults.length > 0 ? (
            searchResults.map((place) => (
              <SearchResultItem
                key={place.id}
                $isMobile={isMobile}
                onClick={() => handleSelectPlace(place)}
              >
                <PlaceName $isMobile={isMobile}>
                  {place.place_name}
                </PlaceName>
                <PlaceAddress $isMobile={isMobile}>
                  {place.road_address_name || place.address_name}
                </PlaceAddress>
              </SearchResultItem>
            ))
          ) : searchQuery && !isSearching ? (
            <NoResults $isMobile={isMobile}>
              검색 결과가 없습니다.
            </NoResults>
          ) : null}
        </SearchResults>
      </SearchContainer>

      {location && (
        <SelectedLocation $isMobile={isMobile}>
          <LocationIcon $isMobile={isMobile}>
            <MapPin size={20} />
          </LocationIcon>
          <LocationInfo>
            <LocationName $isMobile={isMobile}>
              선택된 장소
            </LocationName>
            <LocationAddress $isMobile={isMobile}>
              {location}
            </LocationAddress>
          </LocationInfo>
          <ClearButton $isMobile={isMobile} onClick={handleClearLocation}>
            <X size={isMobile ? 12 : 14} />
          </ClearButton>
        </SelectedLocation>
      )}
    </Container>
  );
};