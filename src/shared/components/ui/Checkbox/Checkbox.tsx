import React from "react";
import styled from "styled-components";
import { Check } from "lucide-react";

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme, $checked }) => 
    $checked ? theme.colors.primary : theme.colors.gray300};
  border-radius: 4px;
  background: ${({ theme, $checked }) =>
    $checked ? theme.colors.primary : theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  svg {
    color: white;
    stroke-width: 3;
  }
`;

const Label = styled.span`
  transition: color 0.2s ease;
`;

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <CheckboxContainer className={className}>
      <HiddenCheckbox
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <StyledCheckbox $checked={checked}>
        {checked && <Check size={14} />}
      </StyledCheckbox>
      {label && <Label>{label}</Label>}
    </CheckboxContainer>
  );
};