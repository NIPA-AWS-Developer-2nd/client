import type { MissionWithDetails, Difficulty } from "../../../../types";

export const filterMissions = (
  missions: MissionWithDetails[],
  filters: {
    category: string;
    difficulty: string;
    participants: string;
    duration: string;
    point: string;
  }
) => {
  return missions.filter((mission) => {
    // 카테고리 필터
    if (filters.category !== "all") {
      if (!mission.category.includes(filters.category)) {
        return false;
      }
    }

    // 난이도 필터
    if (filters.difficulty !== "all") {
      if (mission.difficulty !== filters.difficulty) {
        return false;
      }
    }

    // 참여인원 필터
    if (filters.participants !== "all") {
      const minParticipants = mission.minParticipants || 1;
      const maxParticipants = mission.maxParticipants || 99;

      if (filters.participants === "medium") {
        if (minParticipants > 6 || maxParticipants < 4) return false;
      } else if (filters.participants === "large") {
        if (maxParticipants < 7) return false;
      }
    }

    // 예상시간 필터
    if (filters.duration !== "all") {
      const duration = mission.duration;
      if (filters.duration === "short" && duration > 90) return false;
      if (filters.duration === "medium" && (duration <= 90 || duration > 180))
        return false;
      if (filters.duration === "long" && duration <= 180) return false;
    }

    // 포인트 필터
    if (filters.point !== "all") {
      const point = mission.point;
      if (filters.point === "low" && point >= 400) return false;
      if (filters.point === "medium" && (point < 400 || point >= 800))
        return false;
      if (filters.point === "high" && point < 800) return false;
    }

    return true;
  });
};

export const sortMissions = (missions: MissionWithDetails[]) => {
  return [...missions].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const paginateMissions = (
  missions: MissionWithDetails[],
  currentPage: number,
  missionsPerPage: number
) => {
  const startIndex = (currentPage - 1) * missionsPerPage;
  const endIndex = startIndex + missionsPerPage;
  return missions.slice(startIndex, endIndex);
};

export const getDifficultyLabel = (difficulty: Difficulty): string => {
  const labels: Record<Difficulty, string> = {
    EASY: "쉬움",
    MEDIUM: "보통",
    HARD: "어려움",
  };
  return labels[difficulty];
};
