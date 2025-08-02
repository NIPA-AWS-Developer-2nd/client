import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import "./index.css";
import App from "./App.tsx";
import { viewportManager } from "./utils/viewportHeight";

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

// Cognito 설정
const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY ||
    "https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_8yY8P3DYd",
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID ||
    "3d6t7ibdbq7729akn6c95vao0",
  redirect_uri: window.location.origin + "/auth/callback",
  post_logout_redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid email profile",
  loadUserInfo: true,
  automaticSilentRenew: false,
  onSigninCallback: () => {
    console.log("Sign-in callback completed");
  },
  onSignoutCallback: () => {
    console.log("Sign-out callback completed");
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);
