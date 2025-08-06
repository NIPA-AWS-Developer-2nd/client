export const mockUserStats = {
  points: 1250,
  completedMissions: 8,
  activeMeetings: 3,
};

export const mockRecentActivities = [
  {
    text: "카페에서 새로운 친구 만나기 미션 완료",
    time: "2시간 전",
    type: "mission_complete" as const,
  },
  {
    text: "주말 등산 모임에 참여했습니다",
    time: "1일 전",
    type: "meeting_joined" as const,
  },
  {
    text: "포인트로 커피 쿠폰을 구매했습니다",
    time: "3일 전",
    type: "point_used" as const,
  },
];