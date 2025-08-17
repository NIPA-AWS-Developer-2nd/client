import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Clock } from "lucide-react";

interface WheelTimePickerProps {
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
  disabled?: boolean;
  isMobile?: boolean;
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

const WheelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 200px;
  overflow: hidden;
`;

const WheelWrapper = styled.div<{ $width: number }>`
  position: relative;
  width: ${({ $width }) => $width}px;
  height: 200px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const Wheel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const WheelItem = styled.div<{ $isSelected: boolean; $isMobile?: boolean }>`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: ${({ $isSelected }) => ($isSelected ? "700" : "500")};
  color: ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary : theme.colors.text.secondary};
  scroll-snap-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
  }
`;

const WheelPadding = styled.div`
  height: 80px;
  flex-shrink: 0;
`;

const Selector = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 40px;
  transform: translateY(-50%);
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}10;
  pointer-events: none;
  z-index: 1;
`;

const Separator = styled.div<{ $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "20px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
`;

const WheelTimePicker: React.FC<WheelTimePickerProps> = ({
  onTimeSelect,
  selectedTime = "",
  disabled = false,
  isMobile = false,
}) => {
  const periodWheelRef = useRef<HTMLDivElement>(null);
  const hourWheelRef = useRef<HTMLDivElement>(null);
  const minuteWheelRef = useRef<HTMLDivElement>(null);

  // 초기값 파싱
  const parseTime = (timeString: string) => {
    if (!timeString) return { period: "오후", hour: 14, minute: 0 }; // 기본값: 오후 2시
    
    const [hourStr, minuteStr] = timeString.split(':');
    const hour24 = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    // 24시간 형식으로 그대로 사용
    const period = hour24 < 12 ? "오전" : "오후";
    
    return { period, hour: hour24, minute };
  };

  const [currentSelection, setCurrentSelection] = useState(parseTime(selectedTime));

  const periods = ["오전", "오후"];
  
  // 오전: 6-11시, 오후: 12-21시 (9시)
  const getAvailableHours = (period: string) => {
    if (period === "오전") {
      return [6, 7, 8, 9, 10, 11]; // 오전 6시-11시
    } else {
      return [12, 13, 14, 15, 16, 17, 18, 19, 20, 21]; // 오후 12시-9시 (21시)
    }
  };
  
  const minutes = [0, 30];

  const scrollToItem = (
    wheelRef: React.RefObject<HTMLDivElement | null>,
    index: number,
    itemHeight: number = 40
  ) => {
    if (wheelRef.current) {
      wheelRef.current.scrollTop = index * itemHeight;
    }
  };

  // 초기 스크롤 위치 설정
  useEffect(() => {
    const { period, hour, minute } = currentSelection;
    const availableHours = getAvailableHours(period);
    
    setTimeout(() => {
      scrollToItem(periodWheelRef, periods.indexOf(period));
      scrollToItem(hourWheelRef, availableHours.indexOf(hour));
      scrollToItem(minuteWheelRef, minutes.indexOf(minute));
    }, 100);
  }, [currentSelection, minutes, periods]);

  // period 변경 시 시간 휠 업데이트 (초기화 시에만)
  useEffect(() => {
    const availableHours = getAvailableHours(currentSelection.period);
    if (hourWheelRef.current && availableHours.includes(currentSelection.hour)) {
      scrollToItem(hourWheelRef, availableHours.indexOf(currentSelection.hour));
    }
  }, [currentSelection.period]);

  // 디바운스된 스크롤 핸들러
  const handleScroll = useCallback((
    wheelRef: React.RefObject<HTMLDivElement | null>,
    items: (string | number)[],
    type: 'period' | 'hour' | 'minute'
  ) => {
    if (!wheelRef.current) return;

    const scrollTop = wheelRef.current.scrollTop;
    const itemHeight = 40;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    
    const newValue = items[clampedIndex];
    const newSelection = { ...currentSelection };
    
    if (type === 'period') {
      const newPeriod = newValue as string;
      newSelection.period = newPeriod;
      
      // 현재 시간이 새로운 period에서 유효한지 확인
      const newAvailableHours = getAvailableHours(newPeriod);
      if (!newAvailableHours.includes(currentSelection.hour)) {
        // 유효하지 않은 경우에만 조정 (가장 가까운 시간으로)
        const closestHour = newAvailableHours.find(h => h >= currentSelection.hour) || newAvailableHours[0];
        newSelection.hour = closestHour;
      }
    } else if (type === 'hour') {
      newSelection.hour = newValue as number;
    } else if (type === 'minute') {
      newSelection.minute = newValue as number;
    }
    
    setCurrentSelection(newSelection);
    
    // 24시간 형식으로 콜백 호출 (이미 24시간 형식)
    const { hour, minute } = newSelection;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onTimeSelect(timeString);
  }, [currentSelection, onTimeSelect]);

  const renderWheel = (
    items: (string | number)[],
    selectedValue: string | number,
    wheelRef: React.RefObject<HTMLDivElement | null>,
    type: 'period' | 'hour' | 'minute',
    width: number
  ) => (
    <WheelWrapper $width={width}>
      <Selector />
      <Wheel
        ref={wheelRef}
        onScroll={() => handleScroll(wheelRef, items, type)}
      >
        <WheelPadding />
        {items.map((item) => (
          <WheelItem
            key={item}
            $isSelected={item === selectedValue}
            $isMobile={isMobile}
            onClick={() => {
              const index = items.indexOf(item);
              scrollToItem(wheelRef, index);
              handleScroll(wheelRef, items, type);
            }}
          >
            {type === 'minute' ? `${item}분` : item}
          </WheelItem>
        ))}
        <WheelPadding />
      </Wheel>
    </WheelWrapper>
  );

  if (disabled) {
    return null;
  }

  return (
    <Container $isMobile={isMobile}>
      <Header $isMobile={isMobile}>
        <Clock size={isMobile ? 14 : 16} />
        <span>시간 선택</span>
      </Header>

      <WheelContainer>
        {renderWheel(periods, currentSelection.period, periodWheelRef, 'period', 60)}
        {renderWheel(getAvailableHours(currentSelection.period), currentSelection.hour, hourWheelRef, 'hour', 60)}
        <Separator $isMobile={isMobile}>시</Separator>
        {renderWheel(minutes, currentSelection.minute, minuteWheelRef, 'minute', 80)}
      </WheelContainer>
    </Container>
  );
};

export default WheelTimePicker;