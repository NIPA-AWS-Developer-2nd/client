import React, { useState } from "react";
import styled from "styled-components";
import { Clock } from "lucide-react";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";

interface TimeSelectorProps {
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
  disabled?: boolean;
}

const Container = styled.div<{ $isMobile?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
  margin-bottom: 16px;
`;

const Header = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TimeSlotsGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $isMobile }) => ($isMobile ? '4' : '6')}, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "10px")};
`;

const TimeSlot = styled.button<{
  $isSelected?: boolean;
  $disabled?: boolean;
  $isMobile?: boolean;
}>`
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.primary : theme.colors.white};
  border: ${({ $isSelected, theme }) =>
    $isSelected ? "none" : `1px solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "12px 8px" : "14px 10px")};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  transition: all 0.2s ease;
  text-align: center;
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  font-weight: 600;
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.white : theme.colors.text.primary};

  &:hover:not(:disabled) {
    ${({ $isSelected, theme }) => !$isSelected && `
      background: ${theme.colors.primary}15;
      border-color: ${theme.colors.primary};
    `}
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const TimeSelector: React.FC<TimeSelectorProps> = ({
  onTimeSelect,
  selectedTime,
  disabled = false,
}) => {
  const [isMobile] = useState(deviceDetection.isMobile());
  
  // 30분 간격으로 시간 슬롯 생성 (9:00 ~ 22:00)
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeClick = (time: string) => {
    if (disabled) return;
    onTimeSelect(time);
  };

  const formatDisplayTime = (time: string): string => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const period = hourNum < 12 ? 'AM' : 'PM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute}${period}`;
  };

  return (
    <Container $isMobile={isMobile}>
      <Header $isMobile={isMobile}>
        <Clock size={isMobile ? 14 : 16} />
        <span>시간 선택</span>
      </Header>

      <TimeSlotsGrid $isMobile={isMobile}>
        {timeSlots.map((time) => {
          const isSelected = selectedTime === time;

          return (
            <TimeSlot
              key={time}
              $isSelected={isSelected}
              $disabled={disabled}
              $isMobile={isMobile}
              onClick={() => handleTimeClick(time)}
              disabled={disabled}
            >
              {formatDisplayTime(time)}
            </TimeSlot>
          );
        })}
      </TimeSlotsGrid>
    </Container>
  );
};

export default TimeSelector;