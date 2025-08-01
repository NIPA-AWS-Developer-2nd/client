import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
} from "./pages";

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("hasShownSplash");
  });

  const handleSplashComplete = () => {
    setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("hasShownSplash", "true");
    }, 100);
  };

  return (
    <ThemeProvider>
      <GlobalStyle />
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <Router>
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
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;
