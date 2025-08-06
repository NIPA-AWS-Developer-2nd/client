import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "./App.tsx";
import { viewportManager } from "../shared/utils/viewportHeight";

// 서비스 워커 등록
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// 모바일 지원을 위한 viewport 매니저 초기화
viewportManager.getCurrentHeight();

// Kakao SDK 초기화
if (window.Kakao) {
  const appKey = import.meta.env.VITE_KAKAO_APP_KEY;
  if (appKey) {
    window.Kakao.init(appKey);
    console.log("Kakao SDK initialized:", window.Kakao.isInitialized());
  } else {
    console.error("Kakao app key not found in environment variables");
  }
} else {
  console.error("Kakao SDK not loaded");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
