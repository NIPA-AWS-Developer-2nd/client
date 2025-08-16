/**
 * 모집마감일 계산 및 관련 유틸리티 함수들
 * 백엔드 로직과 동일하게 구현
 */

/**
 * 현재 시간을 기준으로 모집마감일을 계산합니다.
 * 백엔드 로직과 동일: 새벽 6시 기준으로 하루를 구분하여 다음날 23:59:59로 설정
 */
export const calculateRecruitmentDeadline = (): Date => {
  const now = new Date();
  const currentHour = now.getHours();

  // 기준 날짜 설정 (새벽 6시 기준으로 하루 구분)
  const baseDate = new Date(now);
  if (currentHour < 6) {
    baseDate.setDate(baseDate.getDate() - 1);
  }

  // 다음날 23:59:59으로 설정
  const recruitUntilDate = new Date(baseDate);
  recruitUntilDate.setDate(recruitUntilDate.getDate() + 1);
  recruitUntilDate.setHours(23, 59, 59, 999);

  return recruitUntilDate;
};

/**
 * 모집마감일을 사용자 친화적인 형태로 포맷합니다.
 */
export const formatRecruitmentDeadline = (deadline: Date): string => {
  const month = deadline.getMonth() + 1;
  const day = deadline.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[deadline.getDay()];

  return `${month}월 ${day}일 (${weekday}) 밤 11:59`;
};

/**
 * 주어진 날짜가 모집마감일 이후인지 확인합니다.
 */
export const isDateAfterRecruitmentDeadline = (selectedDate: Date): boolean => {
  const deadline = calculateRecruitmentDeadline();
  return selectedDate > deadline;
};

/**
 * 선택 가능한 최소 날짜를 반환합니다 (모집마감일 다음날)
 */
export const getMinSelectableDate = (): Date => {
  const deadline = calculateRecruitmentDeadline();
  const minDate = new Date(deadline);
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0, 0, 0, 0);
  return minDate;
};

/**
 * 모집마감일까지 남은 시간을 계산합니다.
 */
export const getTimeUntilDeadline = (): {
  hours: number;
  minutes: number;
  isUrgent: boolean;
} => {
  const now = new Date();
  const deadline = calculateRecruitmentDeadline();
  const diff = deadline.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    hours,
    minutes,
    isUrgent: hours < 6, // 6시간 미만이면 긴급
  };
};