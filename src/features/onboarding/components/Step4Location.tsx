import React, { useEffect } from "react";
import styled from "styled-components";
import { MapPin } from "lucide-react";
import { useOnboardingStore } from "../../../shared/store";
import { Skeleton } from "../../../shared/components/ui";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: 32px;
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

const LocationButton = styled.button<{
  $selected: boolean;
  $disabled: boolean;
}>`
  padding: 12px 8px;
  border: 2px solid
    ${({ theme, $selected, $disabled }) =>
      $disabled
        ? theme.colors.gray300
        : $selected
        ? theme.colors.primary
        : theme.colors.border};
  border-radius: 8px;
  background: ${({ theme, $selected, $disabled }) =>
    $disabled
      ? theme.colors.gray100
      : $selected
      ? theme.colors.primary
      : theme.colors.background};
  color: ${({ theme, $selected, $disabled }) =>
    $disabled
      ? theme.colors.gray400
      : $selected
      ? theme.colors.white
      : theme.colors.text.primary};
  font-size: 13px;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  min-height: 60px;

  &:hover {
    transform: ${({ $disabled }) => ($disabled ? "none" : "translateY(-1px)")};
    box-shadow: ${({ $disabled }) =>
      $disabled ? "none" : "0 2px 8px rgba(0, 0, 0, 0.1)"};
  }

  &:active {
    transform: ${({ $disabled }) => ($disabled ? "none" : "translateY(0)")};
  }
`;

const LocationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LocationName = styled.div`
  font-weight: 600;
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

const FieldValidationMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.warning};
  margin-top: 16px;
  text-align: center;
`;

interface Props {
  showValidationErrors?: boolean;
}

export const Step4Location: React.FC<Props> = ({ showValidationErrors = false }) => {
  const { formData, districts, isLoading, updateFormData, loadStaticData } =
    useOnboardingStore();

  useEffect(() => {
    loadStaticData();
  }, [loadStaticData]);

  const handleLocationSelect = (districtId: string, isActive: boolean) => {
    if (!isActive) return;
    updateFormData({ districtId });
  };

  const getLocationValidation = () => {
    if (showValidationErrors && !formData.districtId) {
      return "활동 지역을 선택해주세요";
    }
    return null;
  };

  if (isLoading) {
    return (
      <Container>
        <Title>활동할 지역을 선택해주세요</Title>
        <Subtitle>선택 지역을 기반으로 맞춤 정보를 제공해드려요</Subtitle>

        <SkeletonGrid>
          {Array(25)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                width="100%"
                height="80px"
                borderRadius="12px"
              />
            ))}
        </SkeletonGrid>
      </Container>
    );
  }

  return (
    <Container>
      <Title>활동할 지역을 선택해주세요</Title>
      <Subtitle>선택한 지역을 기반으로 맞춤 정보를 제공해드려요</Subtitle>

      <LocationGrid>
        {districts.map((district) => (
          <LocationButton
            key={district.id}
            $selected={formData.districtId === district.id}
            $disabled={!district.isActive}
            onClick={() => handleLocationSelect(district.id, district.isActive)}
          >
            <LocationIcon>
              <MapPin size={20} />
            </LocationIcon>
            <div>
              <LocationName>{district.districtName}</LocationName>
            </div>
          </LocationButton>
        ))}
      </LocationGrid>

      {getLocationValidation() && (
        <FieldValidationMessage>{getLocationValidation()}</FieldValidationMessage>
      )}
    </Container>
  );
};
