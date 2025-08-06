import React from "react";
import styled from "styled-components";
import { Check } from "lucide-react";
import type { TraitSelectorProps } from "../../../types";
import { deviceDetection } from "../../../shared/utils/deviceDetection";

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

const TraitGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? "1fr" : "repeat(2, 1fr)")};
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "12px")};
`;

const TraitItem = styled.div<{ 
  $isSelected: boolean; 
  $isMobile?: boolean;
  $isDisabled?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  border: 2px solid ${({ $isSelected, theme, $isDisabled }) => 
    $isDisabled 
      ? theme.colors.gray200 
      : $isSelected 
        ? theme.colors.primary 
        : theme.colors.border
  };
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $isSelected, theme, $isDisabled }) => 
    $isDisabled
      ? theme.colors.gray50
      : $isSelected 
        ? `${theme.colors.primary}10` 
        : theme.colors.white
  };
  cursor: ${({ $isDisabled }) => $isDisabled ? "not-allowed" : "pointer"};
  transition: ${({ theme }) => theme.transitions.fast};
  opacity: ${({ $isDisabled }) => $isDisabled ? 0.5 : 1};

  &:hover {
    ${({ $isDisabled, $isSelected, theme }) => !$isDisabled && `
      background: ${$isSelected ? `${theme.colors.primary}15` : theme.colors.gray50};
    `}
  }

  &:active {
    ${({ $isDisabled }) => !$isDisabled && `
      transform: scale(0.98);
    `}
  }
`;

const Checkbox = styled.div<{ 
  $isSelected: boolean;
  $isMobile?: boolean;
}>`
  width: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  height: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  border: 2px solid ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary : theme.colors.gray300
  };
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary : theme.colors.white
  };
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  svg {
    color: ${({ theme }) => theme.colors.white};
    opacity: ${({ $isSelected }) => $isSelected ? 1 : 0};
    transition: ${({ theme }) => theme.transitions.fast};
  }
`;

const TraitContent = styled.div`
  flex: 1;
`;

const TraitLabel = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
  margin-bottom: 4px;
`;

const TraitDescription = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.3;
`;

const HelperText = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 8px;
  text-align: right;
`;

export const TraitSelector: React.FC<TraitSelectorProps> = ({
  traits,
  selectedTraitIds,
  onSelectionChange,
  maxSelection = 3,
}) => {
  const [isMobile, setIsMobile] = React.useState(deviceDetection.isMobile());

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(deviceDetection.isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTraitToggle = (traitId: string) => {
    const isSelected = selectedTraitIds.includes(traitId);
    
    if (isSelected) {
      // 선택 해제
      onSelectionChange(selectedTraitIds.filter(id => id !== traitId));
    } else {
      // 선택 (최대 개수 확인)
      if (selectedTraitIds.length < maxSelection) {
        onSelectionChange([...selectedTraitIds, traitId]);
      }
    }
  };

  const sortedTraits = traits
    .filter(trait => trait.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <Container $isMobile={isMobile}>
      <Label $isMobile={isMobile}>
        원하는 참여자 성향을 선택해주세요
      </Label>
      
      <TraitGrid $isMobile={isMobile}>
        {sortedTraits.map((trait) => {
          const isSelected = selectedTraitIds.includes(trait.id);
          const isDisabled = !isSelected && selectedTraitIds.length >= maxSelection;
          
          return (
            <TraitItem
              key={trait.id}
              $isSelected={isSelected}
              $isMobile={isMobile}
              $isDisabled={isDisabled}
              onClick={() => !isDisabled && handleTraitToggle(trait.id)}
            >
              <Checkbox $isSelected={isSelected} $isMobile={isMobile}>
                <Check size={isMobile ? 12 : 14} />
              </Checkbox>
              <TraitContent>
                <TraitLabel $isMobile={isMobile}>
                  {trait.label}
                </TraitLabel>
                {trait.description && (
                  <TraitDescription $isMobile={isMobile}>
                    {trait.description}
                  </TraitDescription>
                )}
              </TraitContent>
            </TraitItem>
          );
        })}
      </TraitGrid>
      
      <HelperText $isMobile={isMobile}>
        {selectedTraitIds.length}/{maxSelection}개 선택됨
      </HelperText>
    </Container>
  );
};