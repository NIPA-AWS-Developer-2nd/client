import styled, { css } from 'styled-components';
import { responsive } from '../../../../shared/styles/mixins';

export const ChatContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colors.background.primary};
  position: relative;
  margin: 0;
  padding: 0;
`;

export const ConnectionStatus = styled.div<{ $isConnected: boolean; $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? '8px 16px' : '10px 20px')};
  background: ${({ $isConnected, theme }) => 
    $isConnected ? theme.colors.success + '20' : theme.colors.error + '20'
  };
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '13px')};
  font-weight: 500;
  text-align: center;
  color: ${({ $isConnected, theme }) => 
    $isConnected ? theme.colors.success : theme.colors.error
  };

  ${responsive.mobile(css`
    padding: 8px 16px;
    font-size: 12px;
  `)}
`;

export const MessagesContainer = styled.div<{ $isMobile: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  display: flex;
  flex-direction: column;
  gap: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};

  ${responsive.mobile(css`
    padding: 12px;
    gap: 12px;
  `)}
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EmptyState = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '16px')};
  text-align: center;

  ${responsive.mobile(css`
    font-size: 14px;
  `)}
`;

export const MessageBubble = styled.div<{ $isMyMessage: boolean; $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isMyMessage }) => ($isMyMessage ? 'flex-end' : 'flex-start')};
  gap: ${({ $isMobile }) => ($isMobile ? '4px' : '6px')};
  max-width: 70%;
  align-self: ${({ $isMyMessage }) => ($isMyMessage ? 'flex-end' : 'flex-start')};

  ${responsive.mobile(css`
    gap: 4px;
    max-width: 80%;
  `)}
`;

export const MessageHeader = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '10px')};
  margin-bottom: 4px;

  ${responsive.mobile(css`
    gap: 8px;
  `)}
`;

export const UserAvatar = styled.img<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '24px' : '28px')};
  height: ${({ $isMobile }) => ($isMobile ? '24px' : '28px')};
  border-radius: 50%;
  object-fit: cover;

  ${responsive.mobile(css`
    width: 24px;
    height: 24px;
  `)}
`;

export const UserName = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '12px' : '13px')};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};

  ${responsive.mobile(css`
    font-size: 12px;
  `)}
`;

export const MessageContent = styled.div<{ $isMyMessage: boolean; $isMobile: boolean }>`
  display: flex;
  flex-direction: ${({ $isMyMessage }) => ($isMyMessage ? 'row-reverse' : 'row')};
  gap: ${({ $isMobile }) => ($isMobile ? '6px' : '8px')};
  align-items: flex-end;

  ${responsive.mobile(css`
    gap: 6px;
  `)}
`;

export const MessageText = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? '8px 12px' : '10px 14px')};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text.primary};
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  ${responsive.mobile(css`
    padding: 8px 12px;
    font-size: 14px;
  `)}
`;

export const MessageMeta = styled.div<{ $isMyMessage: boolean; $isMobile: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? '4px' : '6px')};
  font-size: ${({ $isMobile }) => ($isMobile ? '10px' : '11px')};
  color: ${({ theme }) => theme.colors.text.secondary};
  min-width: ${({ $isMobile }) => ($isMobile ? '40px' : '50px')};

  ${responsive.mobile(css`
    font-size: 10px;
    min-width: 40px;
    gap: 4px;
  `)}
`;

export const MessageTime = styled.span<{ $isMobile: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? '10px' : '11px')};

  ${responsive.mobile(css`
    font-size: 10px;
  `)}
`;

export const UnreadCount = styled.span<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? '9px' : '10px')};
  font-weight: 600;
  width: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  height: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};

  ${responsive.mobile(css`
    font-size: 9px;
    width: 16px;
    height: 16px;
    min-width: 16px;
  `)}
`;


export const InputContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isMobile }) => ($isMobile ? '8px' : '12px')};
  padding: ${({ $isMobile }) => ($isMobile ? '12px' : '16px')};
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};

  ${responsive.mobile(css`
    gap: 8px;
    padding: 12px;
  `)}
`;

export const MessageInput = styled.input<{ $isMobile: boolean }>`
  flex: 1;
  padding: ${({ $isMobile }) => ($isMobile ? '10px 12px' : '12px 16px')};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  ${responsive.mobile(css`
    padding: 10px 12px;
    font-size: 14px;
  `)}
`;

export const SendButton = styled.button<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isMobile }) => ($isMobile ? '40px' : '44px')};
  height: ${({ $isMobile }) => ($isMobile ? '40px' : '44px')};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray300};
    cursor: not-allowed;
    transform: none;
  }

  ${responsive.mobile(css`
    width: 40px;
    height: 40px;
  `)}
`;

export const DisabledOverlay = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

export const DisabledMessage = styled.div<{ $isMobile: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ $isMobile }) => ($isMobile ? '20px' : '24px')};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: ${({ $isMobile }) => ($isMobile ? '280px' : '320px')};
  
  h3 {
    margin: 0 0 8px 0;
    font-size: ${({ $isMobile }) => ($isMobile ? '16px' : '18px')};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  p {
    margin: 0;
    font-size: ${({ $isMobile }) => ($isMobile ? '14px' : '15px')};
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.4;
  }

  ${responsive.mobile(css`
    padding: 20px;
    max-width: 280px;
    
    h3 {
      font-size: 16px;
    }
    
    p {
      font-size: 14px;
    }
  `)}
`;