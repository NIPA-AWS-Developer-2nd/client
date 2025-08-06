import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SplashScreen } from "../shared/components/common";
import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./routes";

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("hasShownSplash");
  });
  const location = useLocation();

  // 로그인 페이지나 콜백 페이지에서는 스플래시 안보이기
  useEffect(() => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/auth/callback" ||
      location.pathname === "/auth/success"
    ) {
      setShowSplash(false);
      sessionStorage.setItem("hasShownSplash", "true");
    }
  }, [location.pathname]);

  const handleSplashComplete = () => {
    setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("hasShownSplash", "true");
    }, 100);
  };

  if (
    showSplash &&
    location.pathname !== "/login" &&
    location.pathname !== "/auth/callback" &&
    location.pathname !== "/auth/success"
  ) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return <AppRoutes />;
};

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;