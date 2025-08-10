import React, { useState, useEffect } from "react";
import styled from "styled-components";
import type { LocationData } from "../../../types";
import { SEOUL_DISTRICTS } from "../../../data/districts";

const LocationSection = styled.div<{ $isMobile?: boolean }>`
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "8px" : "24px")};
`;

const LocationHeader = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
`;

const LocationTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 1180px) and (orientation: landscape) {
    margin: 0 0 8px 0;
  }
`;

const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.danger || "#ef4444"};
  font-size: 13px;
`;


const DistrictGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "12px" : "60px")};

  @media (max-width: 1180px) and (orientation: landscape) {
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  @media (max-width: 360px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const DistrictOption = styled.button<{
  $isMobile?: boolean;
  $selected?: boolean;
}>`
  outline: none;
  box-shadow: none;
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 14px")};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.gray100};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.white : theme.colors.text.primary};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: center;
  white-space: nowrap;
  min-height: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1180px) and (orientation: landscape) {
    padding: 6px 10px;
    min-height: 32px;
    font-size: 12px;
  }

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.primaryLight : theme.colors.gray200};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;


interface LocationSelectionProps {
  isMobile: boolean;
  onLocationSelected: (locationData: LocationData) => void;
  selectedLocation?: LocationData;
}

export const LocationSelection: React.FC<LocationSelectionProps> = ({
  isMobile,
  onLocationSelected,
  selectedLocation,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // 선택된 위치가 있으면 선택된 구 설정
  useEffect(() => {
    if (selectedLocation?.district) {
      const district = SEOUL_DISTRICTS.find(
        (d) => d.label === selectedLocation.district
      );
      if (district) {
        setSelectedDistrict(district.value);
      }
    }
  }, [selectedLocation]);

  const handleDistrictSelect = (value: string) => {
    setSelectedDistrict(value);
    
    // 구 선택 시 자동으로 위치 설정
    const district = SEOUL_DISTRICTS.find((d) => d.value === value);
    if (district) {
      const locationData: LocationData = {
        district: district.label,
        regionCode: district.value,
      };
      onLocationSelected(locationData);
    }
  };

  return (
    <LocationSection $isMobile={isMobile}>
      <LocationHeader $isMobile={isMobile}>
        <LocationTitle $isMobile={isMobile}>
          활동 지역 <RequiredAsterisk>*</RequiredAsterisk>
        </LocationTitle>
      </LocationHeader>

      <DistrictGrid $isMobile={isMobile}>
        {SEOUL_DISTRICTS.map((district) => (
          <DistrictOption
            key={district.value}
            $isMobile={isMobile}
            $selected={selectedDistrict === district.value}
            onClick={() => handleDistrictSelect(district.value)}
          >
            {district.label}
          </DistrictOption>
        ))}
      </DistrictGrid>

    </LocationSection>
  );
};
