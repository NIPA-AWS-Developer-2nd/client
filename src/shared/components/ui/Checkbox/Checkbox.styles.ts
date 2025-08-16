import styled from "styled-components";

export const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

export const StyledCheckbox = styled.div<{ $checked: boolean; $disabled?: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme, $checked, $disabled }) => 
    $disabled ? theme.colors.gray300 :
    $checked ? theme.colors.primary : theme.colors.gray300};
  border-radius: 4px;
  background: ${({ theme, $checked, $disabled }) =>
    $disabled ? theme.colors.gray100 :
    $checked ? theme.colors.primary : theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
  
  &:hover {
    border-color: ${({ theme, $disabled }) => 
      $disabled ? theme.colors.gray300 : theme.colors.primary};
    background: ${({ theme, $checked, $disabled }) =>
      $disabled ? theme.colors.gray100 :
      $checked ? theme.colors.primary : theme.colors.primary + '10'};
  }
  
  svg {
    color: white;
    stroke-width: 3;
  }
`;

export const Label = styled.span<{ $disabled?: boolean }>`
  transition: color 0.2s ease;
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
`;