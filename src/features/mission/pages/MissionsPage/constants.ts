export const MISSIONS_PER_PAGE = 5;

export const FILTER_OPTIONS = {
  difficulty: {
    all: "전체",
    very_easy: "매우 쉬움",
    easy: "쉬움",
    medium: "보통",
    hard: "어려움",
    very_hard: "매우 어려움",
  },
  participants: {
    all: "전체",
    medium: "4-6명",
    large: "7명 이상",
  },
  duration: {
    all: "전체",
    short: "90분 이하",
    medium: "90-180분",
    long: "180분 초과",
  },
  point: {
    all: "전체",
    low: "400P 미만",
    medium: "400-799P",
    high: "800P 이상",
  },
} as const;

export const DIFFICULTY_MAP = {
  very_easy: "매우 쉬움",
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
  very_hard: "매우 어려움",
} as const;