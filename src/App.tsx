import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "./styles";
import { ResponsiveLayout } from "./components/layout/ResponsiveLayout";
import { SplashScreen } from "./components/common/SplashScreen";

import {
  HomePage,
  MarketPage,
  MeetingsPage,
  MissionsPage,
  MyPage,
} from "./pages";

function App() {
  const [showSplash, setShowSplash] = useState(false); // 스플래시 완전 비활성화

  const handleSplashComplete = () => {
    // 약간의 지연을 주어 부드러운 전환 효과 제공
    setTimeout(() => {
      setShowSplash(false);
      // 세션 중에는 다시 보여주지 않도록 마킹
      sessionStorage.setItem("hasShownSplash", "true");
    }, 100);
  };

  return (
    <ThemeProvider theme={theme}>
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
            </Routes>
          </ResponsiveLayout>
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;
