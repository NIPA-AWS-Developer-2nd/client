import { useCallback } from "react";
import { shareToKakao } from "../../../utils/kakaoShare";
import {
  copyToClipboard,
  shareViaMessage,
  shareViaNative,
  shareViaAndroidIntent,
  generateShareText,
  generateShareData,
  isMobileDevice,
  isAndroid,
  debugShareAPI,
} from "../../../utils/shareUtils";
import type { MissionWithDetails } from "../../../../types";
import type { ShareHandlers } from "./types";

interface AlertMethods {
  success: (message: string) => void;
  error: (message: string) => void;
}

export const useShareModal = (
  mission?: MissionWithDetails,
  onClose?: () => void,
  alertMethods?: AlertMethods
): ShareHandlers => {
  const handleCopyLink = useCallback(async () => {
    const success = await copyToClipboard(window.location.href);

    if (success) {
      if (alertMethods) {
        alertMethods.success("링크가 클립보드에 복사되었습니다.");
      } else {
        alert("링크가 클립보드에 복사되었습니다.");
      }
    } else {
      if (alertMethods) {
        alertMethods.error(
          "링크 복사에 실패했습니다. 링크를 수동으로 복사해주세요:\n" + window.location.href
        );
      } else {
        alert(
          "링크 복사에 실패했습니다. 링크를 수동으로 복사해주세요:\n" + window.location.href
        );
      }
    }

    onClose?.();
  }, [onClose, alertMethods]);

  const handleKakaoShare = useCallback(() => {
    shareToKakao(mission);
    onClose?.();
  }, [mission, onClose]);

  const handleMessageShare = useCallback(async () => {
    const text = generateShareText(mission);

    try {
      shareViaMessage(text);
      onClose?.();
    } catch (error) {
      console.error("Failed to open message app:", error);
      if (alertMethods) {
        alertMethods.error("메시지 앱을 열 수 없습니다. 링크를 복사합니다.");
      } else {
        alert("메시지 앱을 열 수 없습니다. 링크를 복사합니다.");
      }
      await handleCopyLink();
    }
  }, [mission, onClose, handleCopyLink, alertMethods]);

  const handleMoreShare = useCallback(async () => {
    debugShareAPI();

    // Web Share API 지원 여부 확인
    if (typeof navigator.share === "function") {
      try {
        const shareData = generateShareData(mission);
        await shareViaNative(shareData);
        onClose?.();
        return;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Share failed, trying fallback:", error);
      }
    }

    // Fallback: 모바일 디바이스별 처리
    if (isMobileDevice()) {
      if (isAndroid()) {
        try {
          const text = generateShareText(mission);
          shareViaAndroidIntent(text);
          onClose?.();
          return;
        } catch (_err) {
          console.log("Android intent failed, falling back to copy");
        }
      }
      
      // iOS나 다른 모바일은 링크 복사로 처리
      if (alertMethods) {
        alertMethods.success("링크를 클립보드에 복사합니다.");
      } else {
        alert("링크를 클립보드에 복사합니다.");
      }
      await handleCopyLink();
      return;
    }

    // 데스크톱은 링크 복사
    if (alertMethods) {
      alertMethods.success("링크를 클립보드에 복사합니다.");
    } else {
      alert("링크를 클립보드에 복사합니다.");
    }
    await handleCopyLink();
  }, [mission, onClose, handleCopyLink, alertMethods]);

  return {
    handleKakaoShare,
    handleMessageShare,
    handleMoreShare,
    handleCopyLink,
  };
};
