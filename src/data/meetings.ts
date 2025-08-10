// Meeting types
export interface Meeting {
  id: string;
  title: string;
  description: string;
  missionId: string;
  missionTitle: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  distance?: string;
  currentParticipants: number;
  maxParticipants: number;
  tags: string[];
  hostName: string;
  hostId: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  requirements: string[];
  isParticipating: boolean;
  canParticipate: boolean;
}

export interface MeetingDetail extends Meeting {
  host: {
    id: string;
    name: string;
    avatar?: string;
    trustScore: number;
  };
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

// Mock meetings data
export const mockMeetings: Meeting[] = [
  {
    id: "01K21PSVT485D6GG8SW8NDGFAB",
    title: "롯데월드 모험 함께하기",
    description: "롯데월드에서 즐거운 하루를 보내요!",
    missionId: "01JG9H7E2HQMC8GN1VKXR6W3TB", // CULTURE_LOTTE
    missionTitle: "송파구 롯데월드 어트랙션 체험",
    startTime: "2024-01-15T14:00:00",
    endTime: "2024-01-15T20:00:00",
    location: "롯데월드",
    address: "서울시 송파구 올림픽로 240",
    distance: "1.2km",
    currentParticipants: 3,
    maxParticipants: 6,
    tags: ["놀이공원", "즐거움"],
    hostName: "김모임장",
    hostId: "host1",
    difficulty: "MEDIUM",
    requirements: [
      "롯데월드 자유이용권 구매 필수",
      "편한 운동화 착용 권장",
      "충전기, 보조배터리 지참"
    ],
    isParticipating: false,
    canParticipate: true
  },
  {
    id: "01K21PV7RB552JB3RE6QFR763Q", 
    title: "롯데월드 어트랙션 정복",
    description: "무서운 놀이기구도 함께라면 괜찮아요!",
    missionId: "01JG9H7E2HQMC8GN1VKXR6W3TB", // CULTURE_LOTTE
    missionTitle: "송파구 롯데월드 어트랙션 체험",
    startTime: "2024-01-16T10:00:00",
    endTime: "2024-01-16T18:00:00",
    location: "롯데월드",
    address: "서울시 송파구 올림픽로 240",
    distance: "0.8km",
    currentParticipants: 2,
    maxParticipants: 4,
    tags: ["놀이공원", "스릴"],
    hostName: "박모험가",
    hostId: "host2",
    difficulty: "HARD",
    requirements: [
      "롯데월드 자유이용권 구매 필수",
      "심장이 약한 분은 참여 자제",
      "편한 복장 착용"
    ],
    isParticipating: false,
    canParticipate: true
  },
  {
    id: "01K21PV7XR44ZYDKQRR2JDS0X4",
    title: "한강공원 피크닉",
    description: "따뜻한 봄날, 한강에서 피크닉 어때요?",
    missionId: "01JG9H7E2PQMC8GN1VKXR6W3TH", // PHOTO_HANGANG
    missionTitle: "송파구 한강공원 사진 촬영",
    startTime: "2024-01-20T11:00:00",
    endTime: "2024-01-20T16:00:00",
    location: "한강공원 여의도지구",
    address: "서울시 영등포구 여의동로 330",
    distance: "2.1km",
    currentParticipants: 1,
    maxParticipants: 8,
    tags: ["피크닉", "자연", "휴식"],
    hostName: "이자연",
    hostId: "host3",
    difficulty: "EASY",
    requirements: [
      "돗자리 개인 지참",
      "간단한 간식 준비",
      "편한 복장"
    ],
    isParticipating: false,
    canParticipate: true
  }
];

// Mock meeting details data  
export const mockMeetingDetails: Record<string, MeetingDetail> = {
  "01K21PSVT485D6GG8SW8NDGFAB": {
    ...mockMeetings[0],
    description: "안녕하세요! 롯데월드에서 즐거운 하루를 보내고 싶어서 모임을 만들었습니다. 무서운 놀이기구부터 귀여운 퍼레이드까지 함께 즐겨요! 사진도 많이 찍고 맛있는 것도 먹으면서 추억을 만들어봐요. 처음 만나는 분들도 환영입니다 😊",
    host: {
      id: "host1",
      name: "김모임장",
      trustScore: 4.8
    },
    participants: [
      { id: "host1", name: "김모임장" },
      { id: "p2", name: "박참여자" },
      { id: "p3", name: "이동반" }
    ]
  },
  "01K21PV7RB552JB3RE6QFR763Q": {
    ...mockMeetings[1],
    description: "롯데월드의 모든 스릴 넘치는 어트랙션을 정복해봅시다! 아트란티스, 자이로드롭, 후렌치 레볼루션 등등... 무서워도 함께라면 할 수 있어요! 용기 있는 분들만 오세요 💪",
    host: {
      id: "host2", 
      name: "박모험가",
      trustScore: 4.9
    },
    participants: [
      { id: "host2", name: "박모험가" },
      { id: "p4", name: "최용감" }
    ]
  },
  "01K21PV7XR44ZYDKQRR2JDS0X4": {
    ...mockMeetings[2],
    description: "봄이 오고 있어요! 한강에서 여유로운 피크닉을 즐겨봐요. 맛있는 음식도 나눠 먹고, 게임도 하고, 사진도 찍으면서 힐링하는 시간을 가져봅시다. 혼자 오기 부담스러운 분들도 편하게 와주세요 🌸",
    host: {
      id: "host3",
      name: "이자연",
      trustScore: 4.7
    },
    participants: [
      { id: "host3", name: "이자연" }
    ]
  }
};

// Helper functions
export const getMeetingsByMissionId = (missionId: string): Meeting[] => {
  return mockMeetings.filter(meeting => meeting.missionId === missionId);
};

export const getMeetingById = (id: string): MeetingDetail | undefined => {
  return mockMeetingDetails[id];
};

export const getAllMeetings = (): Meeting[] => {
  return mockMeetings;
};