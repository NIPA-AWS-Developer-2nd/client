import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContainer = styled.div<{ $isMobile: boolean }>`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: ${({ $isMobile }) => ($isMobile ? '100%' : '500px')};
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const ModalHeader = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? '20px' : '24px')};
  border-bottom: 1px solid #f1f5f9;
`;

export const ModalTitle = styled.h2<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '18px' : '20px')};
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
`;

export const ModalContent = styled.div<{ $isMobile: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${({ $isMobile }) => ($isMobile ? '16px' : '20px')};
`;

export const LogItem = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  border-radius: 12px;
  background: #f8fafc;
  margin-bottom: 12px;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const LogIcon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const LogContent = styled.div`
  flex: 1;
`;

export const LogText = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1.4;
`;

export const LogTime = styled.div<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '11px' : '12px')};
  color: #64748b;
`;

export const EmptyMessage = styled.div<{ $isMobile: boolean }>`
  text-align: center;
  padding: ${({ $isMobile }) => ($isMobile ? '20px 20px 40px' : '40px 20px 60px')};
  color: #64748b;
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  line-height: 1.5;
`;