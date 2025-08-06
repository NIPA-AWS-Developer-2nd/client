import React from "react";
import { StyledButton } from "./Button.styles";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dashed";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  className,
  type = "button",
}) => {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      className={className}
      type={type}
    >
      {children}
    </StyledButton>
  );
};