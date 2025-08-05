import React from "react";
import styled from "styled-components";
import { Settings } from "lucide-react";

interface TestLoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const Button = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  height: 56px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  background-color: #000000;
  color: #FFFFFF;

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    padding: 10px 6px;
  }

  &:hover:not(:disabled) {
    background-color: #333333;
    transform: translateY(-1px);
  }

  &:active {
    background-color: #1a1a1a;
    transform: translateY(0);
  }

  @media (hover: none) and (pointer: coarse) {
    &:hover:not(:active) {
      background-color: #000000 !important;
      transform: none !important;
    }
  }
`;

const ButtonText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;


export const TestLoginButton: React.FC<TestLoginButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <Button
      $disabled={disabled}
      onClick={onClick}
      disabled={disabled}
    >
      <Settings size={20} />
      <ButtonText>테스트 로그인</ButtonText>
    </Button>
  );
};