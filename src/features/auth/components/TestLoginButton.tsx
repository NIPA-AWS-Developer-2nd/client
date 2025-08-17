import React from "react";
import styled from "styled-components";

interface TestLoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  icon?: string;
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

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ButtonText = styled.span`
  font-size: 16px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 9px;
    line-height: 1.2;
  }
`;

const Description = styled.span`
  font-size: 10px;
  font-weight: 400;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 7px;
    line-height: 1.1;
    text-align: center;
  }
`;

export const TestLoginButton: React.FC<TestLoginButtonProps> = ({
  onClick,
  disabled = false,
  label = "테스트로 계속하기",
  description,
  icon = "T",
}) => {
  return (
    <Button $disabled={disabled} onClick={onClick} disabled={disabled}>
      <Icon>{icon}</Icon>
      <TextContainer>
        <ButtonText>{label}</ButtonText>
        {description && <Description>{description}</Description>}
      </TextContainer>
    </Button>
  );
};
