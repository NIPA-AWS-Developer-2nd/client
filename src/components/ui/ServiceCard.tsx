import React from "react";
import styled from "styled-components";

const Card = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  transition: ${({ theme }) => theme.transitions.normal};
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray300};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CardIcon = styled.div<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "40px" : "48px")};
  height: ${({ $isMobile }) => ($isMobile ? "40px" : "48px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.gray100};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  margin-right: 12px;
  flex-shrink: 0;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 4px 0;
  line-height: 1.4;
`;

const CardDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "12px" : "13px")};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const ActionsContainer = styled.div<{ $isMobile?: boolean }>`
  margin-top: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  display: flex;
  gap: ${({ $isMobile }) => ($isMobile ? "6px" : "8px")};
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{
  $variant: "primary" | "secondary";
  $isMobile?: boolean;
  $disabled?: boolean;
}>`
  padding: ${({ $isMobile }) => ($isMobile ? "6px 12px" : "8px 16px")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  font-weight: 500;
  border: 1px solid;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: ${({ theme }) => theme.transitions.fast};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  flex: ${({ $isMobile }) => ($isMobile ? "1" : "none")};
  min-width: ${({ $isMobile }) => ($isMobile ? "auto" : "80px")};

  ${({ $variant, theme, $disabled }) => {
    if ($disabled) {
      return `
        background: ${theme.colors.gray100};
        border-color: ${theme.colors.gray200};
        color: ${theme.colors.gray400};
      `;
    }

    switch ($variant) {
      case "primary":
        return `
          background: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          
          &:hover {
            background: ${theme.colors.gray800};
            border-color: ${theme.colors.gray800};
          }
        `;
      case "secondary":
        return `
          background: ${theme.colors.white};
          border-color: ${theme.colors.border};
          color: ${theme.colors.text.primary};
          
          &:hover {
            border-color: ${theme.colors.gray300};
            background: ${theme.colors.gray50};
          }
        `;
    }
  }}
`;

interface ActionItem {
  label: string;
  onClick: () => void;
  variant: "primary" | "secondary";
  disabled?: boolean;
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actions?: ActionItem[];
  isMobile?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  actions = [],
  isMobile = false,
}) => {
  return (
    <Card $isMobile={isMobile}>
      <CardHeader>
        <CardIcon $isMobile={isMobile}>{icon}</CardIcon>
        <CardContent>
          <CardTitle $isMobile={isMobile}>{title}</CardTitle>
          <CardDescription $isMobile={isMobile}>{description}</CardDescription>
        </CardContent>
      </CardHeader>

      {actions.length > 0 && (
        <ActionsContainer $isMobile={isMobile}>
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              $variant={action.variant}
              $isMobile={isMobile}
              $disabled={action.disabled}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </ActionButton>
          ))}
        </ActionsContainer>
      )}
    </Card>
  );
};
