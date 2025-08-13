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

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 100px;

  ${responsive.desktop(css`
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;
    padding: 24px;
  `)}
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ImageSection = styled.section`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: ${({ theme }) => theme.colors.gray100};
  overflow: hidden;
  position: relative;

  ${responsive.desktop(css`
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  `)}
`;

export const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const StatusBadge = styled.div<{ $status: 'recruiting' | 'active' | 'completed' | 'cancelled' }>`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);

  ${({ $status, theme }) => {
    switch ($status) {
      case 'recruiting':
        return css`
          background-color: ${theme.colors.success}E6;
          color: ${theme.colors.white};
        `;
      case 'active':
        return css`
          background-color: ${theme.colors.primary}E6;
          color: ${theme.colors.white};
        `;
      case 'completed':
        return css`
          background-color: ${theme.colors.gray400}E6;
          color: ${theme.colors.white};
        `;
      case 'cancelled':
        return css`
          background-color: ${theme.colors.error}E6;
          color: ${theme.colors.white};
        `;
    }
  }}
`;

export const InfoSection = styled.section`
  padding: 20px;

  ${responsive.tablet(css`
    padding: 24px;
  `)}
`;

export const TitleSection = styled.div`
  margin-bottom: 24px;
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.3;
  margin-bottom: 12px;
`;

export const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const HostSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 24px;
`;

export const HostAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  object-fit: cover;
`;

export const HostInfo = styled.div`
  flex: 1;
`;

export const HostLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
`;

export const HostName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Section = styled.section`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 16px;
`;

export const Description = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.8;
  white-space: pre-wrap;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  ${responsive.tablet(css`
    grid-template-columns: repeat(3, 1fr);
  `)}
`;

export const InfoCard = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const InfoCardLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
`;

export const InfoCardValue = styled.div`
  font-size: ${({ theme }) => theme.typography.h4.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const HashtagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Hashtag = styled.span`
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 14px;
`;

export const PrecautionList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const PrecautionItem = styled.li`
  position: relative;
  padding-left: 24px;
  margin-bottom: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;

  &::before {
    content: '⚠️';
    position: absolute;
    left: 0;
    top: 0;
  }
`;

export const Sidebar = styled.aside`
  position: sticky;
  top: 80px;
  height: fit-content;

  ${responsive.mobile(css`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    background-color: ${({ theme }) => theme.colors.surface};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding: 16px 20px;
    z-index: 100;
  `)}

  ${responsive.tablet(css`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    background-color: ${({ theme }) => theme.colors.surface};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding: 16px 20px;
    z-index: 100;
  `)}

  ${responsive.desktop(css`
    position: sticky;
    bottom: auto;
    left: auto;
    right: auto;
    background-color: transparent;
    border: none;
    padding: 0;
  `)}
`;

export const ParticipantSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${responsive.mobile(css`
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    margin-bottom: 16px;
  `)}

  ${responsive.tablet(css`
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    margin-bottom: 16px;
  `)}
`;

export const ParticipantHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ParticipantTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ParticipantCount = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;

  ${responsive.mobile(css`
    flex-direction: row;
    overflow-x: auto;
    max-height: none;
    padding-bottom: 8px;
  `)}
`;

export const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ParticipantAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  object-fit: cover;
`;

export const ParticipantInfo = styled.div`
  flex: 1;

  ${responsive.mobile(css`
    display: none;
  `)}
`;

export const ParticipantName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ParticipantBadge = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${responsive.mobile(css`
    flex-direction: row;
  `)}

  ${responsive.tablet(css`
    flex-direction: row;
  `)}

  ${responsive.desktop(css`
    flex-direction: column;
  `)}
`;

export const PrimaryButton = styled.button`
  flex: 1;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  flex: 1;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

export const DeadlineWarning = styled.div`
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.warning}20;
  color: ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  text-align: center;
  font-weight: 500;
`;