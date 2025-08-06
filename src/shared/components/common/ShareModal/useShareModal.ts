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

export const useShareModal = (
  mission?: MissionWithDetails,
  onClose?: () => void
): ShareHandlers => {
  const handleCopyLink = useCallback(async () => {
    const success = await copyToClipboard(window.location.href);

    if (success) {
      alert("링크가 클립보드에 복사되었습니다.");
    } else {
      alert(
        "링크 복사에 실패했습니다. 링크를 수동으로 복사해주세요:\n" +
          window.location.href
      );
    }

    onClose?.();
  }, [onClose]);

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
      alert("메시지 앱을 열 수 없습니다. 링크를 복사합니다.");
      await handleCopyLink();
    }
  }, [mission, onClose, handleCopyLink]);

  const handleMoreShare = useCallback(async () => {
    debugShareAPI();

    if (typeof navigator.share === "function" && window.isSecureContext) {
      try {
        const shareData = generateShareData(mission);
        await shareViaNative(shareData);
        onClose?.();
        return;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Share failed, falling back to copy link:", error);
      }
    } else {
      console.log("Web Share API not supported, using fallback");

      if (isMobileDevice() && isAndroid()) {
        try {
          const text = generateShareText(mission);
          shareViaAndroidIntent(text);
          onClose?.();
          return;
        } catch (_err) {
          console.log("Android intent failed, falling back to copy");
        }
      }

      alert("공유 기능을 사용할 수 없습니다. 링크를 복사합니다.");
    }

    await handleCopyLink();
  }, [mission, onClose, handleCopyLink]);

  return {
    handleKakaoShare,
    handleMessageShare,
    handleMoreShare,
    handleCopyLink,
  };
};
