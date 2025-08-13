import styled, { css } from 'styled-components';
import { responsive } from '../../../../shared/styles/mixins';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 16px;

  ${responsive.tablet(css`
    padding: 16px 24px;
  `)}
`;

export const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

export const HeaderTitle = styled.h1`
  flex: 1;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Content = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${responsive.tablet(css`
    padding: 24px;
    gap: 32px;
  `)}
`;

export const MeetingInfo = styled.section`
  text-align: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const MeetingTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

export const MeetingLocation = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const NoticeSection = styled.section`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.info}15;
  border: 1px solid ${({ theme }) => theme.colors.info}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const NoticeTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.info};
  margin-bottom: 12px;
`;

export const NoticeText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
`;

export const PrecautionsSection = styled.section`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 16px;
`;

export const PrecautionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const PrecautionItem = styled.li`
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.5;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }
`;

export const QRSection = styled.section`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;
`;

export const QRContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

export const QRImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const QRPlaceholder = styled.div`
  width: 200px;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

export const QRDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

export const ParticipantsSection = styled.section`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

export const ParticipantAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  object-fit: cover;
`;

export const ParticipantInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ParticipantName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ParticipantStatus = styled.span<{ $status: 'gray' | 'warning' | 'success' }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 12px;
  font-weight: 500;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'gray':
        return css`
          background-color: ${theme.colors.gray200};
          color: ${theme.colors.text.secondary};
        `;
      case 'warning':
        return css`
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case 'success':
        return css`
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
    }
  }}
`;

export const ActionSection = styled.section`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const StartButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.success};
    transform: translateY(-1px);
  }
`;

export const WaitingButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  background-color: ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 16px;
  font-weight: 500;
  cursor: not-allowed;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const LoadingText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const ErrorText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.danger};
`;