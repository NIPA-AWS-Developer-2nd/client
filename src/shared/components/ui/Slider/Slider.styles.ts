import styled, { css } from "styled-components";
import { responsive, mobileUtils } from "../../../styles/mixins/responsive";

export const StyledSlider = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  pointer-events: ${({ $disabled }) => $disabled ? "none" : "auto"};
`;

export const SliderLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const SliderTrack = styled.div<{ 
  $size: "small" | "medium" | "large";
  $disabled: boolean;
}>`
  position: relative;
  width: 100%;
  height: ${({ $size }) => {
    switch ($size) {
      case "small": return "6px";
      case "large": return "8px";
      default: return "6px";
    }
  }};
  background-color: ${({ theme }) => theme.colors.gray200};
  border-radius: 3px;
  cursor: ${({ $disabled }) => $disabled ? "not-allowed" : "pointer"};
  outline: none;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
  }
  
  ${responsive.mobile(css`
    height: 8px;
  `)}
`;

export const SliderFill = styled.div<{ 
  $percentage: number;
  $variant: "primary" | "secondary";
  $disabled: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background: ${({ theme, $variant, $disabled }) => {
    if ($disabled) return theme.colors.gray300;
    return $variant === "primary" ? theme.colors.primary : theme.colors.secondary;
  }};
  border-radius: inherit;
  transition: ${({ theme }) => theme.transitions.fast};
`;

export const SliderThumb = styled.div<{
  $percentage: number;
  $size: "small" | "medium" | "large";
  $variant: "primary" | "secondary";
  $disabled: boolean;
  $isDragging: boolean;
}>`
  position: absolute;
  top: 50%;
  left: ${({ $percentage }) => $percentage}%;
  transform: translate(-50%, -50%);
  width: ${({ $size }) => {
    switch ($size) {
      case "small": return "10px";
      case "large": return "12px";
      default: return "10px";
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case "small": return "10px";
      case "large": return "12px";
      default: return "10px";
    }
  }};
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid ${({ theme, $variant, $disabled }) => {
    if ($disabled) return theme.colors.gray300;
    return $variant === "primary" ? theme.colors.primary : theme.colors.secondary;
  }};
  border-radius: 50%;
  cursor: ${({ $disabled }) => $disabled ? "not-allowed" : "grab"};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 1;
  
  ${mobileUtils.touchTarget}
  
  &:active {
    cursor: ${({ $disabled }) => $disabled ? "not-allowed" : "grabbing"};
  }
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 0 0 2px ${({ theme, $variant }) => 
        $variant === "primary" ? theme.colors.primary : theme.colors.secondary
      }40;
  }
  
  ${({ $isDragging }) => $isDragging && css`
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  `}
  
  ${responsive.mobile(css`
    width: 18px;
    height: 18px;
  `)}
`;

export const ValueDisplay = styled.div<{ $size: "small" | "medium" | "large" }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ $size }) => {
    switch ($size) {
      case "small": return "12px";
      case "large": return "14px";
      default: return "13px";
    }
  }};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`;