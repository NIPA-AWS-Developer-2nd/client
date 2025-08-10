import React from "react";
import styled from "styled-components";

interface TestLoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const Button = styled.button<{
  $disabled?: boolean;
}>`
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
  color: #ffffff;

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
    transform: translateY(-1px);
  }

  @media (hover: none) and (pointer: coarse) {
    &:hover:not(:active) {
      transform: none !important;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Icon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
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
    <Button $disabled={disabled} onClick={onClick} disabled={disabled}>
      <Icon>T</Icon>
      <ButtonText>테스트로 계속하기</ButtonText>
    </Button>
  );
};
