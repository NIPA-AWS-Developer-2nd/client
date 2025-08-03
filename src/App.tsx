import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { GlobalStyle } from "./styles";
import { ResponsiveLayout } from "./components/layout/ResponsiveLayout";
import { SplashScreen, ThemeProvider } from "./components/common";

import {
  HomePage,
  MarketPage,
  MeetingsPage,
  MissionsPage,
  MyPage,
  AppSettingsPage,
  AuthCallbackPage,
  LoginPage,
} from "./pages";

import MissionDetailPage from "./pages/MissionDetailPage";
import AuthSuccessPage from "./pages/AuthSuccessPage";

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("hasShownSplash");
  });
  const location = useLocation();

  // 로그인 페이지나 콜백 페이지에서는 스플래시 안보이기
  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/auth/callback" || location.pathname === "/auth/success") {
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

  if (showSplash && location.pathname !== "/login" && location.pathname !== "/auth/callback" && location.pathname !== "/auth/success") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/auth/success" element={<AuthSuccessPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Main app routes */}
      <Route path="/*" element={
        <ResponsiveLayout
          title="Halsaram — 번개모임 커뮤니티"
          showBanner={true}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/my/settings" element={<AppSettingsPage />} />
          </Routes>
        </ResponsiveLayout>
      } />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
