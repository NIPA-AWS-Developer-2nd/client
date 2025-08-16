import React from 'react';
import { useHomeStore } from '../../store';
import { deviceDetection } from '../../../../shared/utils';
import {
  ToggleContainer,
  ToggleButton,
  ToggleSlider,
  ModeLabel,
} from './ModeToggle.styles';

export interface ModeToggleProps {
  className?: string;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ className }) => {
  const { userMode, toggleUserMode } = useHomeStore();
  const [isMobile] = React.useState(deviceDetection.isMobile());

  const isHostMode = userMode === 'host';

  return (
    <ToggleContainer className={className} $isMobile={isMobile}>
      <ModeLabel $active={!isHostMode} $isMobile={isMobile}>
        참여자
      </ModeLabel>
      <ToggleButton onClick={toggleUserMode} $isMobile={isMobile}>
        <ToggleSlider $active={isHostMode} $isMobile={isMobile} />
      </ToggleButton>
      <ModeLabel $active={isHostMode} $isMobile={isMobile}>
        호스트
      </ModeLabel>
    </ToggleContainer>
  );
};