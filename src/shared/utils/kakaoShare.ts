import type { MissionWithDetails } from "../../types";

export const shareToKakao = (mission?: MissionWithDetails) => {
  if (!window.Kakao || !window.Kakao.isInitialized()) {
    console.error("Kakao SDK is not initialized");
    return;
  }

  // 미션 정보가 있는 경우
  if (mission) {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: mission.title,
        description: mission.description,
        imageUrl: mission.thumbnailUrl || `${window.location.origin}/icons/icon-512x512.png`,
        link: {
          mobileWebUrl: `${window.location.origin}/missions/${mission.id}`,
          webUrl: `${window.location.origin}/missions/${mission.id}`,
        },
      },
      buttons: [
        {
          title: "미션 보러가기",
          link: {
            mobileWebUrl: `${window.location.origin}/missions/${mission.id}`,
            webUrl: `${window.location.origin}/missions/${mission.id}`,
          },
        },
      ],
    });
  } else {
    // 일반 페이지 공유
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "나랑 미션 같이 할 사람?",
        description: "두근두근, 재미있는 미션이 도착 했어요!",
        imageUrl: `${window.location.origin}/icons/icon-512x512.png`,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "미션 보러가기",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  }
};
