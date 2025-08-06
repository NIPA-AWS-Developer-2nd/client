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
        title: `🎯 ${mission.title}`,
        description: `${mission.description}\n\n저랑 같이 참여해요!`,
        imageUrl:
          mission.thumbnailUrl ||
          `${window.location.origin}/icons/icon-512x512.png`,
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
        title: "🎯 함께할 미션이 기다리고 있어요!",
        description: "두근두근, 재미있는 미션에 같이 참여해보실래요?",
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
