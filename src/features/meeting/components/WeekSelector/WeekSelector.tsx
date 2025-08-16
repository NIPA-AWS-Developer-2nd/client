import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";

interface WeekSelectorProps {
  onWeekChange: (startDate: Date, endDate: Date) => void;
  onDayChange?: (selectedDate: Date | null) => void;
  initialWeek?: Date;
  selectedDate?: Date | null;
}

const Container = styled.div<{ $isMobile?: boolean }>`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.white} 0%,
    ${({ theme }) => theme.colors.gray50} 100%
  );
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ $isMobile }) => ($isMobile ? "20px" : "28px")};
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;

`;

const Header = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "16px" : "20px")};
`;

const WeekNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavButton = styled.button<{ $isMobile?: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  height: ${({ $isMobile }) => ($isMobile ? "36px" : "40px")};
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
    height: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  }
`;

const WeekDisplay = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? "16px" : "18px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DaysGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "8px" : "10px")};
  margin-top: ${({ $isMobile }) => ($isMobile ? "20px" : "24px")};
`;

const DayCard = styled.button<{
  $isToday?: boolean;
  $isSelected?: boolean;
  $isPast?: boolean;
  $hasEvents?: boolean;
  $isMobile?: boolean;
}>`
  background: ${({ $isToday, $isSelected, theme }) => {
    if ($isSelected)
      return `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`;
    if ($isToday)
      return `linear-gradient(135deg, ${theme.colors.gray50} 0%, ${theme.colors.white} 100%)`;
    return theme.colors.white;
  }};
  border: ${({ $isToday, $isSelected, theme }) => {
    if ($isSelected) return "none";
    if ($isToday) return `2px solid ${theme.colors.primary}40`;
    return `1px solid ${theme.colors.border}`;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $isMobile }) => ($isMobile ? "16px 8px" : "20px 10px")};
  cursor: pointer;
  opacity: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-align: center;
  box-shadow: ${({ $isSelected, $isToday }) => {
    if ($isSelected) return "0 4px 16px rgba(0, 0, 0, 0.12)";
    if ($isToday) return "0 2px 8px rgba(0, 0, 0, 0.06)";
    return "0 1px 4px rgba(0, 0, 0, 0.04)";
  }};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DayWeekday = styled.div<{ $isSelected?: boolean; $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "11px" : "12px")};
  font-weight: 700;
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.white + "E6" : theme.colors.text.secondary};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DayDate = styled.div<{ $isSelected?: boolean; $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "18px" : "22px")};
  font-weight: 800;
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.white : theme.colors.text.primary};
  margin-bottom: 0;
  line-height: 1;
`;

const TodayIndicator = styled.div<{ $isSelected?: boolean }>`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.white : theme.colors.primary};
  border-radius: 50%;
`;

const WeekSelector: React.FC<WeekSelectorProps> = ({
  onWeekChange,
  onDayChange,
  initialWeek = new Date(),
  selectedDate,
}) => {
  const [isMobile] = useState(deviceDetection.isMobile());
  const [currentWeek, setCurrentWeek] = useState(() => {
    const date = new Date(initialWeek);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 월요일 시작
    return new Date(date.setDate(diff));
  });
  const [selectedDay, setSelectedDay] = useState<Date | null>(selectedDate || new Date());

  // selectedDate prop이 변경되면 selectedDay 상태도 업데이트
  useEffect(() => {
    if (selectedDate !== undefined) {
      setSelectedDay(selectedDate);
    }
  }, [selectedDate]);

  // Mock 데이터 - 실제로는 API에서 받아올 각 날짜별 모임 개수
  const mockEventCounts: Record<string, number> = {
    "2025-08-12": 3,
    "2025-08-14": 2,
    "2025-08-15": 5,
    "2025-08-17": 1,
  };

  const getWeekDays = (weekStart: Date): Date[] => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);
  const weekdayNames = ["월", "화", "수", "목", "금", "토", "일"];

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const year = startDate.getFullYear();
    const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
    const startDay = String(startDate.getDate()).padStart(2, "0");
    const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
    const endDay = String(endDate.getDate()).padStart(2, "0");

    return `${year}.${startMonth}.${startDay} ~ ${year}.${endMonth}.${endDay}`;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    onDayChange?.(day);
  };

  useEffect(() => {
    const endDate = new Date(currentWeek);
    endDate.setDate(currentWeek.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    onWeekChange(currentWeek, endDate);
  }, [currentWeek, onWeekChange]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getEventCount = (date: Date): number => {
    const dateStr = date.toISOString().split("T")[0];
    return mockEventCounts[dateStr] || 0;
  };

  return (
    <Container $isMobile={isMobile}>
      <Header $isMobile={isMobile}>
        <WeekNavigation>
          <NavButton $isMobile={isMobile} onClick={() => navigateWeek("prev")}>
            <ChevronLeft />
          </NavButton>
          <WeekDisplay $isMobile={isMobile}>
            <Calendar size={isMobile ? 16 : 18} />
            <span>{formatWeekRange(currentWeek)}</span>
          </WeekDisplay>
          <NavButton $isMobile={isMobile} onClick={() => navigateWeek("next")}>
            <ChevronRight />
          </NavButton>
        </WeekNavigation>
      </Header>

      <DaysGrid $isMobile={isMobile}>
        {weekDays.map((day, index) => {
          const eventCount = getEventCount(day);
          const isSelected = selectedDay?.toDateString() === day.toDateString();
          const today = isToday(day);
          const past = isPast(day);

          return (
            <DayCard
              key={day.toISOString()}
              $isToday={today}
              $isSelected={isSelected}
              $isPast={past}
              $hasEvents={eventCount > 0}
              $isMobile={isMobile}
              onClick={() => handleDayClick(day)}
            >
              {today && <TodayIndicator $isSelected={isSelected} />}
              <DayWeekday $isSelected={isSelected} $isMobile={isMobile}>
                {weekdayNames[index]}
              </DayWeekday>
              <DayDate $isSelected={isSelected} $isMobile={isMobile}>
                {day.getDate()}
              </DayDate>
            </DayCard>
          );
        })}
      </DaysGrid>
    </Container>
  );
};

export default WeekSelector;
