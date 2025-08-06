import styled, { css } from "styled-components";
import { responsive } from "../../../styles/mixins";

interface StyledButtonProps {
  $variant: "primary" | "secondary" | "outline" | "ghost" | "dashed";
  $size: "small" | "medium" | "large";
  $fullWidth: boolean;
}

const sizeStyles = {
  small: css`
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    
    ${responsive.mobile(css`
      padding: 6px 12px;
      font-size: 12px;
    `)}
  `,
  medium: css`
    padding: 12px 20px;
    font-size: 15px;
    font-weight: 500;
    
    ${responsive.mobile(css`
      padding: 10px 16px;
      font-size: 14px;
    `)}
  `,
  large: css`
    padding: 16px 28px;
    font-size: 16px;
    font-weight: 600;
    
    ${responsive.mobile(css`
      padding: 14px 24px;
      font-size: 15px;
    `)}
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border: none;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.primary};
        opacity: 0.9;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        transform: translateY(-1px);
      }
    }

  `,
  
  secondary: css`
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.gray200};
      }
    }
  `,
  
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.primary}05;
      }
    }
  `,
  
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.secondary};
    border: none;

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.gray50};
        color: ${({ theme }) => theme.colors.text.primary};
      }
    }
  `,
  
  dashed: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: none;
    margin-top: 12px;

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.gray50};
        color: ${({ theme }) => theme.colors.gray700};
      }
    }
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  
  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  /* 포커스 아웃라인 제거 */
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;