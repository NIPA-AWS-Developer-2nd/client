import React, { useState, useRef, useCallback, useEffect } from "react";
import { StyledSlider, SliderTrack, SliderFill, SliderThumb, SliderLabel, ValueDisplay } from "./Slider.styles";

export interface SliderProps {
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  showLabels?: boolean;
  label?: string;
  unit?: string;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary";
  onChange?: (value: number) => void;
  onChangeCommitted?: (value: number) => void;
  className?: string;
  formatValue?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  value,
  defaultValue,
  step = 1,
  disabled = false,
  showValue = true,
  showLabels = false,
  label,
  unit = "",
  size = "medium",
  variant = "primary",
  onChange,
  onChangeCommitted,
  className,
  formatValue,
}) => {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? min);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const currentValue = value ?? internalValue;

  const getValueFromPosition = useCallback((clientX: number): number => {
    if (!sliderRef.current) return currentValue;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);
    
    return Math.round(newValue / step) * step;
  }, [min, max, step, currentValue]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    if (thumbRef.current) {
      thumbRef.current.setPointerCapture(e.pointerId);
    }
    
    const newValue = getValueFromPosition(e.clientX);
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [disabled, getValueFromPosition, onChange]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging || disabled) return;
    
    e.preventDefault();
    const newValue = getValueFromPosition(e.clientX);
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [isDragging, disabled, getValueFromPosition, onChange]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (thumbRef.current) {
      thumbRef.current.releasePointerCapture(e.pointerId);
    }
    
    onChangeCommitted?.(currentValue);
  }, [isDragging, onChangeCommitted, currentValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    
    let newValue = currentValue;
    
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        newValue = Math.max(min, currentValue - step);
        break;
      case "ArrowRight":
      case "ArrowUp":
        newValue = Math.min(max, currentValue + step);
        break;
      case "Home":
        newValue = min;
        break;
      case "End":
        newValue = max;
        break;
      case "PageDown":
        newValue = Math.max(min, currentValue - step * 10);
        break;
      case "PageUp":
        newValue = Math.min(max, currentValue + step * 10);
        break;
      default:
        return;
    }
    
    e.preventDefault();
    setInternalValue(newValue);
    onChange?.(newValue);
    onChangeCommitted?.(newValue);
  }, [disabled, currentValue, min, max, step, onChange, onChangeCommitted]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
      
      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const percentage = ((currentValue - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(currentValue) : `${currentValue}${unit}`;

  return (
    <StyledSlider className={className} $disabled={disabled}>
      {label && <SliderLabel>{label}</SliderLabel>}
      
      <SliderTrack
        ref={sliderRef}
        $size={size}
        $disabled={disabled}
        onPointerDown={handlePointerDown}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <SliderFill 
          $percentage={percentage}
          $variant={variant}
          $disabled={disabled}
        />
        <SliderThumb
          ref={thumbRef}
          $percentage={percentage}
          $size={size}
          $variant={variant}
          $disabled={disabled}
          $isDragging={isDragging}
        />
      </SliderTrack>
      
      {showLabels && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--color-text-secondary)" }}>
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      )}
      
      {showValue && (
        <ValueDisplay $size={size}>{displayValue}</ValueDisplay>
      )}
    </StyledSlider>
  );
};