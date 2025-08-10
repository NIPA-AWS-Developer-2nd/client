import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SplashScreen } from "../shared/components/common";
import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./routes";
import { routeUtils } from "../shared/constants/routes";

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("hasShownSplash");
  });
  const location = useLocation();

  // 인증 관련 페이지에서는 스플래시 화면 표시하지 않음
  useEffect(() => {
    if (routeUtils.isLayoutExcluded(location.pathname)) {
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

  // 스플래시 화면 표시 조건: 스플래시가 켜져 있고, 레이아웃 제외 페이지가 아닌 경우
  if (showSplash && !routeUtils.isLayoutExcluded(location.pathname)) {
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
