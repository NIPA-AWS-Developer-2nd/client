import type { MissionWithDetails } from "../shared/store/missionStore";

export const MISSIONS_DATA: MissionWithDetails[] = [
  {
    id: "1",
    title: "송파구 맛집 방문하기",
    description: "송파구 내 인기 맛집을 방문하고 인증 사진을 업로드하세요.",
    point: 500,
    duration: 120,
    minParticipants: 4,
    maxParticipants: 6,
    minDuration: 90,
    minPhotoCount: 1,
    difficulty: "EASY",
    region_code: "11710",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: ["food"],
    createdBy: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ACTIVE",
    context: {
      id: "1-context",
      missionId: "1",
      photoGuide:
        "음식 사진, 메뉴판, 가게 외관, 함께 식사하는 모습을 촬영해주세요. 음식이 잘 보이도록 밝은 곳에서 촬영하면 좋습니다.",
    },
    samplePhotos: [
      {
        id: "1-sample-1",
        missionId: "1",
        photoUrl:
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
      },
      {
        id: "1-sample-2",
        missionId: "1",
        photoUrl:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      },
      {
        id: "1-sample-3",
        missionId: "1",
        photoUrl:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
      },
    ],
    warnings: [
      {
        id: "1-warn-1",
        missionId: "1",
        content: "예약이 필요한 맛집은 미리 확인하세요",
      },
      {
        id: "1-warn-2",
        missionId: "1",
        content: "식사 비용은 개인 부담입니다",
      },
      {
        id: "1-warn-3",
        missionId: "1",
        content: "알레르기가 있는 경우 미리 확인하세요",
      },
    ],
  },
  {
    id: "2",
    title: "송파구 한강공원 러닝 5km 완주",
    description: "송파구 한강공원에서 5km 러닝을 완주하고 기록을 인증하세요.",
    point: 800,
    duration: 90,
    minParticipants: 4,
    maxParticipants: 8,
    minDuration: 60,
    minPhotoCount: 2,
    difficulty: "MEDIUM",
    region_code: "11710",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1659242710553-3f8513f136b3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: ["sports"],
    createdBy: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ACTIVE",
    context: {
      id: "2-context",
      missionId: "2",
      photoGuide:
        "러닝 시작 전과 완주 후 사진을 촬영해주세요. 러닝 앱이나 스마트워치의 기록 화면도 함께 촬영하면 좋습니다. 5km 완주 인증을 위해 러닝 경로와 거리를 확인할 수 있는 사진이 필요합니다.",
    },
    samplePhotos: [
      {
        id: "2-sample-1",
        missionId: "2",
        photoUrl:
          "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400",
      },
      {
        id: "2-sample-2",
        missionId: "2",
        photoUrl:
          "https://images.unsplash.com/photo-1659242710553-3f8513f136b3?w=400",
      },
      {
        id: "2-sample-3",
        missionId: "2",
        photoUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      },
    ],
    warnings: [
      {
        id: "2-warn-1",
        missionId: "2",
        content: "준비운동을 충분히 하고 시작하세요",
      },
      {
        id: "2-warn-2",
        missionId: "2",
        content: "개인 체력에 맞춰 무리하지 마세요",
      },
      {
        id: "2-warn-3",
        missionId: "2",
        content: "수분 보충용 물을 꼭 준비하세요",
      },
    ],
  },
  {
    id: "3",
    title: "송파구 롯데월드 어트랙션 체험",
    description:
      "송파구 롯데월드에서 5개 이상의 어트랙션을 체험하고 사진을 공유하세요.",
    point: 1200,
    duration: 240,
    minParticipants: 4,
    maxParticipants: 10,
    minDuration: 180,
    minPhotoCount: 5,
    difficulty: "HARD",
    region_code: "11710",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1465996140498-df84be101126?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: ["culture"],
    createdBy: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ACTIVE",
    context: {
      id: "3-context",
      missionId: "3",
      photoGuide:
        "각 어트랙션에서 탑승 전후 사진을 촬영해주세요. 어트랙션 이름이 보이는 안내판과 함께 인증샷을 찍어주시면 됩니다. 최소 5개 어트랙션에서 각각 1장씩 사진이 필요합니다.",
    },
    samplePhotos: [
      {
        id: "3-sample-1",
        missionId: "3",
        photoUrl:
          "https://images.unsplash.com/photo-1465996140498-df84be101126?w=400",
      },
      {
        id: "3-sample-2",
        missionId: "3",
        photoUrl:
          "https://images.unsplash.com/photo-1586882829491-b81178aa622e?w=400",
      },
      {
        id: "3-sample-3",
        missionId: "3",
        photoUrl:
          "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400",
      },
    ],
    warnings: [
      {
        id: "3-warn-1",
        missionId: "3",
        content: "입장료 및 이용료는 개인 부담입니다",
      },
      {
        id: "3-warn-2",
        missionId: "3",
        content: "어트랙션 이용 제한이 있을 수 있으니 확인하세요",
      },
      {
        id: "3-warn-3",
        missionId: "3",
        content: "혼잡한 시간대를 피해 방문하는 것을 권장합니다",
      },
    ],
  },
  {
    id: "4",
    title: "송파구 카페 방문",
    description: "송파구의 특색있는 카페를 방문하고 음료와 함께 인증하세요.",
    point: 350,
    duration: 90,
    minParticipants: 4,
    maxParticipants: 6,
    minDuration: 60,
    minPhotoCount: 1,
    difficulty: "EASY",
    region_code: "11710",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    category: ["cafe"],
    createdBy: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ACTIVE",
    context: {
      id: "4-context",
      missionId: "4",
      photoGuide:
        "카페 외관, 내부 인테리어, 주문한 음료를 함께 촬영해주세요. 카페 이름이 보이는 메뉴판이나 로고도 함께 찍으면 좋습니다.",
    },
    samplePhotos: [
      {
        id: "4-sample-1",
        missionId: "4",
        photoUrl:
          "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
      },
      {
        id: "4-sample-2",
        missionId: "4",
        photoUrl:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
      },
      {
        id: "4-sample-3",
        missionId: "4",
        photoUrl:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
      },
    ],
    warnings: [
      {
        id: "4-warn-1",
        missionId: "4",
        content: "음료 비용은 개인 부담입니다",
      },
      {
        id: "4-warn-2",
        missionId: "4",
        content:
          "카페 내부 촬영 시 다른 손님에게 민폐가 되지 않도록 주의하세요",
      },
      {
        id: "4-warn-3",
        missionId: "4",
        content: "혼잡한 시간대는 피해서 방문하세요",
      },
    ],
  },
  {
    id: "5",
    title: "송파구 당구장 게임",
    description: "송파구 당구장에서 친구들과 함께 당구를 치며 즐기세요.",
    point: 400,
    duration: 120,
    minParticipants: 4,
    maxParticipants: 6,
    minDuration: 90,
    minPhotoCount: 2,
    difficulty: "EASY",
    region_code: "11710",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    category: ["gaming"],
    createdBy: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ACTIVE",
    context: {
      id: "5-context",
      missionId: "5",
      photoGuide:
        "당구대에서 게임하는 모습과 점수판을 촬영해주세요. 당구장 내부와 함께 게임을 즐기는 모습을 찍어주시면 됩니다.",
    },
    samplePhotos: [
      {
        id: "5-sample-1",
        missionId: "5",
        photoUrl:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      },
      {
        id: "5-sample-2",
        missionId: "5",
        photoUrl:
          "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400",
      },
      {
        id: "5-sample-3",
        missionId: "5",
        photoUrl:
          "https://images.unsplash.com/photo-1611432579402-7037e11aa813?w=400",
      },
    ],
    warnings: [
      {
        id: "5-warn-1",
        missionId: "5",
        content: "당구장 이용료는 개인 부담입니다",
      },
      {
        id: "5-warn-2",
        missionId: "5",
        content: "초보자도 참여 가능하니 부담갖지 마세요",
      },
      {
        id: "5-warn-3",
        missionId: "5",
        content: "당구큐 사용 시 안전에 주의하세요",
      },
    ],
  },
  {
    id: "6",
    title: "송파구 박물관 탐방",
    description: "송파구 내 박물관을 방문하고 전시품과 함께 사진을 촬영하세요.",
    point: 700,
    duration: 180,
    minParticipants: 4,
    maxParticipants: 6,
    minDuration: 120,
    minPhotoCount: 3,
    difficulty: "MEDIUM",
    region_code: "11710",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    category: ["culture"],
    createdBy: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ACTIVE",
    context: {
      id: "6-context",
      missionId: "6",
      photoGuide:
        "박물관 외관, 주요 전시품, 박물관 내부 모습을 촬영해주세요. 전시품과 함께 인증샷을 찍을 때는 플래시 촬영 금지 안내문을 확인해주세요.",
    },
    samplePhotos: [
      {
        id: "6-sample-1",
        missionId: "6",
        photoUrl:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      },
      {
        id: "6-sample-2",
        missionId: "6",
        photoUrl:
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400",
      },
      {
        id: "6-sample-3",
        missionId: "6",
        photoUrl:
          "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400",
      },
    ],
    warnings: [
      { id: "6-warn-1", missionId: "6", content: "입장료는 개인 부담입니다" },
      {
        id: "6-warn-2",
        missionId: "6",
        content: "전시품 촬영 시 플래시 사용 금지 여부를 확인하세요",
      },
      {
        id: "6-warn-3",
        missionId: "6",
        content: "박물관 내부에서는 조용히 관람해주세요",
      },
    ],
  },
  {
    id: "7",
    title: "송파구 쇼핑몰 방문",
    description: "송파구 지역 쇼핑몰을 방문하고 쇼핑을 즐기세요.",
    point: 400,
    duration: 120,
    minParticipants: 4,
    maxParticipants: 8,
    minDuration: 90,
    minPhotoCount: 1,
    difficulty: "EASY",
    region_code: "11710",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    category: ["shopping"],
    createdBy: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ACTIVE",
    context: {
      id: "7-context",
      missionId: "7",
      photoGuide:
        "쇼핑몰 외관, 내부 모습, 구매한 상품이나 쇼핑백을 촬영해주세요. 대형 쇼핑몰의 경우 랜드마크나 안내판과 함께 찍으면 좋습니다.",
    },
    samplePhotos: [
      {
        id: "7-sample-1",
        missionId: "7",
        photoUrl:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      },
      {
        id: "7-sample-2",
        missionId: "7",
        photoUrl:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      },
      {
        id: "7-sample-3",
        missionId: "7",
        photoUrl:
          "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400",
      },
    ],
    warnings: [
      {
        id: "7-warn-1",
        missionId: "7",
        content: "쇼핑 비용은 개인 부담입니다",
      },
      {
        id: "7-warn-2",
        missionId: "7",
        content: "주말이나 휰일에는 혹잡할 수 있습니다",
      },
      { id: "7-warn-3", missionId: "7", content: "개인 소지품을 잘 챙기세요" },
    ],
  },
  {
    id: "8",
    title: "송파구 쿠킹 클래스 체험",
    description:
      "송파구 요리 스튜디오에서 함께 요리를 배우고 완성품을 인증하세요.",
    point: 800,
    duration: 180,
    minParticipants: 4,
    maxParticipants: 8,
    minDuration: 120,
    minPhotoCount: 5,
    difficulty: "MEDIUM",
    region_code: "11710",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    category: ["food"],
    createdBy: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ACTIVE",
    context: {
      id: "8-context",
      missionId: "8",
      photoGuide:
        "요리 시작 전 준비된 재료, 요리 과정, 완성된 요리를 촬영해주세요. 함께 요리하는 모습과 완성핈을 때의 기념샷도 찍어주시면 좋습니다.",
    },
    samplePhotos: [
      {
        id: "8-sample-1",
        missionId: "8",
        photoUrl:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      },
      {
        id: "8-sample-2",
        missionId: "8",
        photoUrl:
          "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=400",
      },
      {
        id: "8-sample-3",
        missionId: "8",
        photoUrl:
          "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400",
      },
    ],
    warnings: [
      {
        id: "8-warn-1",
        missionId: "8",
        content: "쿠킹 클래스 비용은 개인 부담입니다",
      },
      {
        id: "8-warn-2",
        missionId: "8",
        content: "사전 예약이 필요한 경우가 많으니 미리 확인하세요",
      },
      {
        id: "8-warn-3",
        missionId: "8",
        content: "알레르기가 있는 경우 미리 알려주세요",
      },
    ],
  },
  {
    id: "9",
    title: "송파구 한강공원 사진 촬영",
    description:
      "송파구 한강공원에서 일몰과 야경을 배경으로 인생샷을 촬영하세요.",
    point: 650,
    duration: 120,
    minParticipants: 4,
    maxParticipants: 6,
    minDuration: 90,
    minPhotoCount: 10,
    difficulty: "EASY",
    region_code: "11710",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
    category: ["photo"],
    createdBy: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    status: "ACTIVE",
    context: {
      id: "9-context",
      missionId: "9",
      photoGuide:
        "일출이 잘 보이는 위치에서 촬영해주세요. 한강과 일출이 함께 나오도록 구도를 잡으시면 됩니다. 최소 3장 이상의 사진이 필요하며, 시간대는 일출 전후 30분 이내여야 합니다.",
    },
    samplePhotos: [
      {
        id: "9-sample-1",
        missionId: "9",
        photoUrl:
          "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400",
      },
      {
        id: "9-sample-2",
        missionId: "9",
        photoUrl:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
      },
      {
        id: "9-sample-3",
        missionId: "9",
        photoUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      },
    ],
    warnings: [
      {
        id: "9-warn-1",
        missionId: "9",
        content: "새벽 시간대이므로 안전에 주의하세요",
      },
      {
        id: "9-warn-2",
        missionId: "9",
        content: "일출 시간을 미리 확인하고 30분 전에 도착하세요",
      },
      {
        id: "9-warn-3",
        missionId: "9",
        content: "날씨가 좋지 않은 경우 연기될 수 있습니다",
      },
    ],
  },
];
