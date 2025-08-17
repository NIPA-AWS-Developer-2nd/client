import styled from 'styled-components';

export const ModalContent = styled.div`
  text-align: center;
  padding: 24px;
`;

export const NotificationIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin-bottom: 20px;
  
  svg {
    font-size: 32px;
    color: white;
  }
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 12px;
  line-height: 1.3;
`;

export const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 20px;
  line-height: 1.6;
  opacity: 0.9;
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 16px;
  margin: 0 0 24px 0;
  text-align: left;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 12px;
`;

export const FeatureItem = styled.li`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 10px;
  padding-left: 4px;
  line-height: 1.5;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  
  button {
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: none !important;
    
    &:first-child {
      flex: 0.8;
      background: transparent;
      color: ${({ theme }) => theme.colors.text.secondary};
      border: 1px solid ${({ theme }) => theme.colors.border.default};
      
      &:hover {
        background: transparent !important;
        transform: none !important;
        box-shadow: none !important;
      }
    }
    
    &:last-child {
      flex: 1.2;
      background: ${({ theme }) => theme.colors.primary};
      color: white;
      border: none;
      
      &:hover {
        background: ${({ theme }) => theme.colors.primary} !important;
        transform: none !important;
        box-shadow: none !important;
      }
    }
  }
`;