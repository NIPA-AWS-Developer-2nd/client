import type { MissionWithDetails } from "../../types";

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      return copyToClipboardFallback(text);
    }
  } catch (error) {
    console.error("Copy failed:", error);
    return false;
  }
};

const copyToClipboardFallback = (text: string): boolean => {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error("Fallback copy failed:", error);
    return false;
  }
};

export const shareViaMessage = (text: string) => {
  try {
    const encodedText = encodeURIComponent(text);
    let messageUrl = "";

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      messageUrl = `sms:&body=${encodedText}`;
    } else if (/Android/i.test(navigator.userAgent)) {
      messageUrl = `sms:?body=${encodedText}`;
    } else {
      messageUrl = `sms:?body=${encodedText}`;
    }

    const opened = window.open(messageUrl, "_blank");
    if (opened === null) {
      window.location.href = messageUrl;
    }
  } catch (error) {
    console.error("Failed to open message app:", error);
    throw error;
  }
};

export const shareViaNative = async (shareData: ShareData): Promise<void> => {
  if (typeof navigator.share !== "function" || !window.isSecureContext) {
    throw new Error("Web Share API not supported");
  }

  if (navigator.canShare && !navigator.canShare(shareData)) {
    throw new Error("Share data not supported");
  }

  try {
    await navigator.share(shareData);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    console.error("Share failed:", error);
    throw error;
  }
};

export const shareViaAndroidIntent = (text: string): void => {
  const intentUrl = `intent://send?text=${encodeURIComponent(
    text
  )}&type=text/plain#Intent;scheme=content;action=android.intent.action.SEND;category=android.intent.category.DEFAULT;end`;
  try {
    window.open(intentUrl, "_blank");
  } catch (error) {
    console.log("Android intent failed:", error);
    throw error;
  }
};

export const generateShareText = (mission?: MissionWithDetails): string => {
  if (mission) {
    return `🎯 ${mission.title}\n\n${mission.description}\n\n저랑 같이 참여해요! ${window.location.href}`;
  }
  return `함께할 미션이 기다리고 있어요!\n\n두근두근, 재미있는 미션에 같이 참여해보실래요? ${window.location.href}`;
};

export const generateShareData = (mission?: MissionWithDetails): ShareData => ({
  title: mission ? `🎯 ${mission.title}` : "함께할 미션이 기다리고 있어요!",
  text: mission
    ? `${mission.description}\n\n저랑 같이 참여해요!`
    : "두근두근, 재미있는 미션에 같이 참여해보실래요?",
  url: window.location.href,
});

export const isMobileDevice = (): boolean => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isAndroid = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

export const debugShareAPI = (): void => {
  if (process.env.NODE_ENV === "development") {
    console.log("Share API 지원:", typeof navigator.share === "function");
    console.log("보안 컨텍스트:", window.isSecureContext);
    console.log("User Agent:", navigator.userAgent);
    console.log("현재 프로토콜:", window.location.protocol);
  }
};
