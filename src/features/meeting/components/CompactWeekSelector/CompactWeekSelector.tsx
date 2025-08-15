import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Calendar } from "lucide-react";
import { deviceDetection } from "../../../../shared/utils/deviceDetection";
import { isDateAfterRecruitmentDeadline } from "../../utils/recruitmentUtils";

interface CompactWeekSelectorProps {
  onDateSelect: (selectedDate: Date) => void;
  selectedDate?: Date | null;
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
  justify-content: center;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
`;

const WeekDisplay = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DaysGrid = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ $isMobile }) => ($isMobile ? "6px" : "8px")};
`;

const DayCard = styled.button.attrs({ type: 'button' })<{
  $isToday?: boolean;
  $isSelected?: boolean;
  $isPast?: boolean;
  $isFuture?: boolean;
  $isMobile?: boolean;
}>`
  background: ${({ $isToday, $isSelected, theme }) => {
    if ($isSelected) return theme.colors.primary;
    if ($isToday) return theme.colors.gray100;
    return theme.colors.white;
  }};
  border: ${({ $isToday, $isSelected, theme }) => {
    if ($isSelected) return "none";
    if ($isToday) return `2px solid ${theme.colors.primary}`;
    return `1px solid ${theme.colors.border}`;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ $isMobile }) => ($isMobile ? "12px 6px" : "14px 8px")};
  cursor: ${({ $isPast }) => ($isPast ? "not-allowed" : "pointer")};
  opacity: ${({ $isPast }) => ($isPast ? 0.4 : 1)};
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover:not(:disabled) {
    ${({ $isPast, theme }) => !$isPast && `
      background: ${theme.colors.primary}15;
      border-color: ${theme.colors.primary};
    `}
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const DayWeekday = styled.div<{ $isSelected?: boolean; $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "10px" : "11px")};
  font-weight: 600;
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.white : theme.colors.text.secondary};
  margin-bottom: 4px;
  text-transform: uppercase;
`;

const DayDate = styled.div<{ $isSelected?: boolean; $isMobile?: boolean }>`
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "16px")};
  font-weight: 700;
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.white : theme.colors.text.primary};
  line-height: 1;
`;

const CompactWeekSelector: React.FC<CompactWeekSelectorProps> = ({
  onDateSelect,
  selectedDate,
}) => {
  const [isMobile] = useState(deviceDetection.isMobile());
  const [selectedDay, setSelectedDay] = useState<Date | null>(selectedDate || null);

  // 이번주의 시작일 (월요일) 계산
  const getThisWeekStart = (): Date => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // 월요일 시작
    return new Date(today.getFullYear(), today.getMonth(), diff);
  };

  const [currentWeek] = useState(getThisWeekStart());

  useEffect(() => {
    if (selectedDate !== undefined) {
      setSelectedDay(selectedDate);
    }
  }, [selectedDate]);

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

  const handleDayClick = (day: Date) => {
    if (isPast(day) || isToday(day) || !isDateAfterRecruitmentDeadline(day)) return; // 과거 날짜, 오늘, 모집마감일 이전 선택 불가
    
    setSelectedDay(day);
    onDateSelect(day);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isFuture = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date >= today;
  };

  const isSelectable = (date: Date) => {
    return !isPast(date) && !isToday(date) && isDateAfterRecruitmentDeadline(date);
  };

  return (
    <Container $isMobile={isMobile}>
      <Header $isMobile={isMobile}>
        <WeekDisplay $isMobile={isMobile}>
          <Calendar size={isMobile ? 14 : 16} />
          <span>{formatWeekRange(currentWeek)}</span>
        </WeekDisplay>
      </Header>

      <DaysGrid $isMobile={isMobile}>
        {weekDays.map((day, index) => {
          const isSelected = selectedDay?.toDateString() === day.toDateString();
          const today = isToday(day);
          const past = isPast(day);
          const future = isFuture(day);
          const selectable = isSelectable(day);

          return (
            <DayCard
              key={day.toISOString()}
              $isToday={today}
              $isSelected={isSelected}
              $isPast={past || !selectable}
              $isFuture={future && selectable}
              $isMobile={isMobile}
              onClick={() => handleDayClick(day)}
              disabled={past || !selectable}
            >
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

export default CompactWeekSelector;